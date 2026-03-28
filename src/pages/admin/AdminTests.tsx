import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTests, TestSessionData, calculateTestStats, groupSessionsByChild, ChildGroup } from '@/hooks/useAdminTests';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
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
import { Search, ClipboardList, Clock, UserCheck, CheckCircle, Eye, Loader2, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';

interface SourceDisplay {
  line1: string;
  line2: string | null;
}

function formatSource(session: TestSessionData | ChildGroup): SourceDisplay {
  if (session.source_type === 'logopedist') {
    const logopedistName = [session.logopedist_first_name, session.logopedist_last_name]
      .filter(Boolean).join(' ') || null;
    return {
      line1: session.organization_name || 'Organizacija',
      line2: logopedistName,
    };
  }
  const parentName = [session.parent_first_name, session.parent_last_name]
    .filter(Boolean).join(' ');
  return {
    line1: parentName || '',
    line2: null,
  };
}

// Status badge component
const StatusBadge = ({ 
  status, 
  reviewedAt, 
  completedAt,
  isCompleted 
}: { 
  status: TestSessionData['status'];
  reviewedAt?: string | null;
  completedAt?: string | null;
  isCompleted: boolean;
}) => {
  if (!isCompleted) {
    return (
      <Badge variant="outline" className="border-gray-400 text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
        Ni opravljeno
      </Badge>
    );
  }

  if (status === 'pending') {
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300">
        V čakanju
      </Badge>
    );
  }
  
  if (completedAt) {
    return (
      <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300">
        Zaključeno
      </Badge>
    );
  }
  
  if (reviewedAt || status === 'completed') {
    return (
      <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300">
        Pregledano
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300">
      V obdelavi
    </Badge>
  );
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

// Mobile card for grouped view
const GroupedTestCard = ({ 
  group, 
  isExpanded,
  onToggle,
  onNavigate,
  canViewSession,
}: { 
  group: ChildGroup; 
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (sessionId: string) => void;
  canViewSession: (session: TestSessionData) => boolean;
}) => {
  const source = formatSource(group);
  const gender = formatGender(group.child_gender);
  const latest = group.latestSession;
  
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{group.child_name}</span>
            {group.sessions.length > 1 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {group.sessions.length} sej
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {source.line1 ? (
              <span>{source.line1}</span>
            ) : (
              <span className="italic">Ni podatka</span>
            )}
            {source.line2 && (
              <span className="block text-xs">{source.line2}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={latest.status} reviewedAt={latest.reviewed_at} completedAt={latest.completed_at} isCompleted={latest.is_completed} />
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t">
          <div className="pt-3 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Starost</span>
              <p>{group.child_age !== null ? `${group.child_age} let` : <span className="text-muted-foreground">-</span>}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Spol</span>
              <p>{gender || <span className="text-muted-foreground italic">Ni določen</span>}</p>
            </div>
          </div>
          
          {/* Session list */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Seje</span>
            {group.sessions.map((session, idx) => (
              <div key={session.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Seja {group.sessions.length - idx}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{session.is_completed ? formatDate(session.submitted_at) : '-'}</span>
                    <span>·</span>
                    <span>{session.word_count} besed</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={session.status} reviewedAt={session.reviewed_at} completedAt={session.completed_at} isCompleted={session.is_completed} />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => onNavigate(session.id)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
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
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  
  // Filter states
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleGroup = (groupId: string) => {
    setExpandedGroupId(prev => prev === groupId ? null : groupId);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ageFilter, genderFilter, statusFilter, dateFilter]);

  // Filter sessions first, then group
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
        const orgNameMatch = session.organization_name?.toLowerCase().includes(searchLower);
        const logopedistNameMatch = 
          session.logopedist_first_name?.toLowerCase().includes(searchLower) ||
          session.logopedist_last_name?.toLowerCase().includes(searchLower);
        if (!parentNameMatch && !childNameMatch && !orgNameMatch && !logopedistNameMatch) return false;
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
        if (statusFilter === 'not_completed') {
          if (session.is_completed) return false;
        } else if (statusFilter === 'pending') {
          if (!session.is_completed || session.status !== 'pending') return false;
        } else if (statusFilter === 'in_review') {
          if (!session.is_completed || !['assigned', 'in_review'].includes(session.status)) return false;
        } else if (statusFilter === 'reviewed') {
          if (!session.is_completed || session.status !== 'completed' || session.completed_at) return false;
        } else if (statusFilter === 'completed') {
          if (!session.completed_at) return false;
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
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (submittedDate < weekAgo) return false;
            break;
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (submittedDate < monthAgo) return false;
            break;
          }
          case 'year': {
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (submittedDate < yearAgo) return false;
            break;
          }
        }
      }
      
      return true;
    });
  }, [sessions, searchQuery, ageFilter, genderFilter, statusFilter, dateFilter]);

  // Group filtered sessions by child
  const groupedSessions = useMemo(() => {
    return groupSessionsByChild(filteredSessions);
  }, [filteredSessions]);

  // Pagination on groups
  const totalPages = Math.max(1, Math.ceil(groupedSessions.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = groupedSessions.slice(startIndex, endIndex);

  // Stats calculations (on all sessions, not filtered)
  const stats = useMemo(() => {
    if (!sessions) return { total: 0, pending: 0, inReview: 0, completed: 0, reviewed: 0, notCompleted: 0 };
    return calculateTestStats(sessions);
  }, [sessions]);

  const hasActiveFilters = searchQuery || ageFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all';

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
            Preverjanja so grupirana po otroku — kliknite na vrstico za prikaz posameznih sej
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Išči po imenu, organizaciji..."
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
                <SelectItem value="not_completed">Ni opravljeno</SelectItem>
                <SelectItem value="pending">V čakanju</SelectItem>
                <SelectItem value="in_review">V obdelavi</SelectItem>
                <SelectItem value="reviewed">Pregledano</SelectItem>
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

          {/* Desktop: Table with expandable rows */}
          {!isLoading && !error && (
            <div className="hidden md:block rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Uporabnik</TableHead>
                    <TableHead>Ime otroka</TableHead>
                    <TableHead>Starost</TableHead>
                    <TableHead>Spol</TableHead>
                    <TableHead>Seje</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Oddano</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedGroups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        {hasActiveFilters
                          ? 'Ni rezultatov za izbrane filtre' 
                          : 'Ni opravljenih preverjanj'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedGroups.map((group) => {
                      const source = formatSource(group);
                      const gender = formatGender(group.child_gender);
                      const latest = group.latestSession;
                      const isExpanded = expandedGroupId === group.childKey;
                      const hasMutipleSessions = group.sessions.length > 1;
                      
                      return (
                        <React.Fragment key={group.childKey}>
                          {/* Main row */}
                          <TableRow 
                            className={`cursor-pointer ${isExpanded ? 'bg-muted/30' : ''}`}
                            onClick={() => {
                               toggleGroup(group.childKey);
                             }}
                          >
                            <TableCell className="w-8 px-2">
                              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                            </TableCell>
                            <TableCell>
                              {source.line1 ? (
                                <div className="flex flex-col">
                                  <span className="font-medium">{source.line1}</span>
                                  {source.line2 && (
                                    <span className="text-sm text-muted-foreground">{source.line2}</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">Ni podatka</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{group.child_name}</span>
                            </TableCell>
                            <TableCell>
                              {group.child_age !== null ? (
                                `${group.child_age} let`
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
                              <Badge variant="secondary" className="text-xs">
                                {group.sessions.length}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={latest.status} reviewedAt={latest.reviewed_at} completedAt={latest.completed_at} isCompleted={latest.is_completed} />
                            </TableCell>
                            <TableCell>
                              {latest.is_completed ? formatDate(latest.submitted_at) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded sub-rows */}
                          {isExpanded && group.sessions.map((session, idx) => (
                            <TableRow 
                              key={session.id} 
                              className="bg-muted/20 hover:bg-muted/40"
                            >
                              <TableCell className="w-8 px-2"></TableCell>
                              <TableCell colSpan={2}>
                                <div className="flex items-center gap-2 pl-4">
                                  <span className="text-muted-foreground">└</span>
                                  <span className="text-sm font-medium">Seja {group.sessions.length - idx}</span>
                                </div>
                              </TableCell>
                              <TableCell colSpan={2}>
                                <span className="text-sm text-muted-foreground">
                                  {session.word_count} besed
                                </span>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell>
                                <StatusBadge status={session.status} reviewedAt={session.reviewed_at} completedAt={session.completed_at} isCompleted={session.is_completed} />
                              </TableCell>
                              <TableCell>
                                {session.is_completed ? formatDate(session.submitted_at) : '-'}
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
                          ))}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && groupedSessions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Prikazujem {startIndex + 1}-{Math.min(endIndex, groupedSessions.length)} od {groupedSessions.length} otrok ({filteredSessions.length} sej)
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
              {paginatedGroups.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {hasActiveFilters
                    ? 'Ni rezultatov za izbrane filtre' 
                    : 'Ni opravljenih preverjanj'}
                </div>
              ) : (
                paginatedGroups.map((group) => (
                  <GroupedTestCard 
                    key={group.childKey} 
                    group={group}
                    isExpanded={expandedGroupId === group.childKey}
                    onToggle={() => toggleGroup(group.childKey)}
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
