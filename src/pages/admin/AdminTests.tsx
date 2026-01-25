import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTests, TestSessionData, calculateTestStats } from '@/hooks/useAdminTests';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ClipboardList, Clock, UserCheck, CheckCircle, Eye, Loader2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';

// Status badge component
const StatusBadge = ({ status }: { status: TestSessionData['status'] }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300">
          V čakanju
        </Badge>
      );
    case 'assigned':
    case 'in_review':
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300">
          V obdelavi
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300">
          Zaključeno
        </Badge>
      );
    default:
      return <Badge variant="secondary">Neznano</Badge>;
  }
};

// Mobile card component for test display with accordion behavior
const TestCard = ({ 
  session, 
  formatParentName, 
  formatGender,
  formatDate,
  isExpanded,
  onToggle,
  onNavigate
}: { 
  session: TestSessionData; 
  formatParentName: (session: TestSessionData) => string;
  formatGender: (gender: string | null) => string;
  formatDate: (date: string | null) => string;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (sessionId: string) => void;
}) => {
  const parentName = formatParentName(session);
  const gender = formatGender(session.child_gender);
  
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header - always visible, clickable */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex flex-col gap-1">
          <span className="font-medium">{session.child_name}</span>
          <span className="text-sm text-muted-foreground">
            {parentName || <span className="italic">Ni podatka o staršu</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={session.status} />
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>
      
      {/* Content - shown only when expanded */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t">
          {/* Age & Gender */}
          <div className="pt-3 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Starost</span>
              <p>
                {session.child_age !== null ? (
                  `${session.child_age} let`
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Spol</span>
              <p>
                {gender || <span className="text-muted-foreground italic">Ni določen</span>}
              </p>
            </div>
          </div>
          
          {/* Submitted date */}
          <div>
            <span className="text-xs text-muted-foreground">Oddano</span>
            <p>{formatDate(session.submitted_at)}</p>
          </div>
          
          {/* Actions - read only */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate(session.id)}
            >
              <Eye className="h-4 w-4 mr-1" /> Ogled
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminTests() {
  const navigate = useNavigate();
  const { data: sessions, isLoading, error } = useAdminTests();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Filter states
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleCard = (cardId: string) => {
    setExpandedCardId(prev => prev === cardId ? null : cardId);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ageFilter, genderFilter, statusFilter, dateFilter]);

  // Filter based on search and filters
  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    
    return sessions.filter(session => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const parentNameMatch = 
          session.parent_first_name?.toLowerCase().includes(searchLower) || 
          session.parent_last_name?.toLowerCase().includes(searchLower);
        const childNameMatch = session.child_name.toLowerCase().includes(searchLower);
        if (!parentNameMatch && !childNameMatch) return false;
      }
      
      // Age filter
      if (ageFilter !== 'all') {
        if (ageFilter === '7+') {
          if (!session.child_age || session.child_age < 7) return false;
        } else {
          if (session.child_age !== Number(ageFilter)) return false;
        }
      }
      
      // Gender filter
      if (genderFilter !== 'all') {
        const gender = session.child_gender?.toLowerCase();
        if (genderFilter === 'm' && !['m', 'male', 'moški'].includes(gender || '')) return false;
        if (genderFilter === 'f' && !['f', 'female', 'ženski', 'ž', 'z'].includes(gender || '')) return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'in_review') {
          if (!['assigned', 'in_review'].includes(session.status)) return false;
        } else {
          if (session.status !== statusFilter) return false;
        }
      }
      
      // Date filter
      if (dateFilter !== 'all' && session.submitted_at) {
        const submittedDate = new Date(session.submitted_at);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            if (submittedDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (submittedDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (submittedDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (submittedDate < yearAgo) return false;
            break;
        }
      }
      
      return true;
    });
  }, [sessions, searchQuery, ageFilter, genderFilter, statusFilter, dateFilter]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

  // Stats calculations
  const stats = useMemo(() => {
    if (!sessions) return { total: 0, pending: 0, inReview: 0, completed: 0 };
    return calculateTestStats(sessions);
  }, [sessions]);

  // Helper function to format parent name
  const formatParentName = (session: TestSessionData): string => {
    if (session.parent_first_name || session.parent_last_name) {
      return [session.parent_first_name, session.parent_last_name].filter(Boolean).join(' ');
    }
    return '';
  };

  // Helper to format gender
  const formatGender = (gender: string | null): string => {
    if (!gender) return '';
    const genderLower = gender.toLowerCase();
    if (genderLower === 'm' || genderLower === 'male' || genderLower === 'moški') return 'M';
    if (genderLower === 'f' || genderLower === 'female' || genderLower === 'ženski' || genderLower === 'z' || genderLower === 'ž') return 'Ž';
    return gender;
  };

  // Helper to format date
  const formatDate = (date: string | null): string => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'd. M. yyyy', { locale: sl });
    } catch {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vsa preverjanja</h1>
        <p className="text-muted-foreground">
          Vsa opravljena preverjanja izgovorjave na portalu TomiTalk
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vsa preverjanja</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Skupaj opravljenih</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">V čakanju</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Čakajo na prevzem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">V obdelavi</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inReview}</div>
            <p className="text-xs text-muted-foreground">Trenutno v pregledu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zaključeni</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Z oddanim poročilom</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seznam preverjanj</CardTitle>
          <CardDescription>
            Vsa opravljena preverjanja izgovorjave na portalu TomiTalk
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Išči po imenu starša ali otroka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Starost" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vse starosti</SelectItem>
                <SelectItem value="3">3 leta</SelectItem>
                <SelectItem value="4">4 leta</SelectItem>
                <SelectItem value="5">5 let</SelectItem>
                <SelectItem value="6">6 let</SelectItem>
                <SelectItem value="7+">7+ let</SelectItem>
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Spol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vsi</SelectItem>
                <SelectItem value="m">Moški</SelectItem>
                <SelectItem value="f">Ženski</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vsi statusi</SelectItem>
                <SelectItem value="pending">V čakanju</SelectItem>
                <SelectItem value="in_review">V obdelavi</SelectItem>
                <SelectItem value="completed">Zaključeno</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Oddano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vsi datumi</SelectItem>
                <SelectItem value="today">Danes</SelectItem>
                <SelectItem value="week">Zadnji teden</SelectItem>
                <SelectItem value="month">Zadnji mesec</SelectItem>
                <SelectItem value="year">Zadnje leto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-app-blue" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 text-destructive">
              Napaka pri nalaganju podatkov. Prosimo, poskusite znova.
            </div>
          )}

          {/* Desktop: Table */}
          {!isLoading && !error && (
            <div className="hidden md:block rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ime in priimek starša</TableHead>
                    <TableHead>Ime otroka</TableHead>
                    <TableHead>Starost</TableHead>
                    <TableHead>Spol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Oddano</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        {searchQuery || ageFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all' 
                          ? 'Ni rezultatov za izbrane filtre' 
                          : 'Ni opravljenih preverjanj'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSessions.map((session) => {
                      const parentName = formatParentName(session);
                      const gender = formatGender(session.child_gender);
                      
                      return (
                        <TableRow key={session.id}>
                          <TableCell>
                            {parentName ? (
                              <span className="font-medium">{parentName}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Ni podatka</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{session.child_name}</span>
                          </TableCell>
                          <TableCell>
                            {session.child_age !== null ? (
                              `${session.child_age} let`
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {gender ? (
                              <span>{gender}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Ni določen</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={session.status} />
                          </TableCell>
                          <TableCell>
                            {formatDate(session.submitted_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Ogled podrobnosti"
                              onClick={() => navigate(`/admin/tests/${session.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ogled
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && filteredSessions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Prikazujem {startIndex + 1}-{Math.min(endIndex, filteredSessions.length)} od {filteredSessions.length}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Na stran:</span>
                  <Select 
                    value={String(itemsPerPage)} 
                    onValueChange={(v) => {
                      setItemsPerPage(Number(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2 min-w-[60px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: Cards */}
          {!isLoading && !error && (
            <div className="md:hidden space-y-3">
              {paginatedSessions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchQuery || ageFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Ni rezultatov za izbrane filtre' 
                    : 'Ni opravljenih preverjanj'}
                </div>
              ) : (
                paginatedSessions.map((session) => (
                  <TestCard 
                    key={session.id} 
                    session={session} 
                    formatParentName={formatParentName}
                    formatGender={formatGender}
                    formatDate={formatDate}
                    isExpanded={expandedCardId === session.id}
                    onToggle={() => toggleCard(session.id)}
                    onNavigate={(sessionId) => navigate(`/admin/tests/${sessionId}`)}
                  />
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
