import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { User, Baby, Calendar, Eye, ChevronDown, ChevronUp, ClipboardList, Pencil, Clock, CheckCircle, FileCheck, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import { StatCard } from '@/components/admin/StatCard';
import { TestFilters } from '@/components/admin/TestFilters';
import { useMyReviews, MyReviewSession } from '@/hooks/useMyReviews';

interface SourceDisplay {
  line1: string;
  line2: string | null;
  isOrganization: boolean;
}

function formatSource(session: MyReviewSession): SourceDisplay {
  if (session.source_type === 'logopedist') {
    const logopedistName = [session.logopedist_first_name, session.logopedist_last_name]
      .filter(Boolean).join(' ') || null;
    return {
      line1: session.organization_name || 'Organizacija',
      line2: logopedistName,
      isOrganization: true,
    };
  }
  // Parent
  const parentName = [session.parent_first_name, session.parent_last_name]
    .filter(Boolean).join(' ');
  return {
    line1: parentName || 'Neznano',
    line2: null,
    isOrganization: false,
  };
}

function formatGender(gender: string | null): string {
  if (!gender) return '-';
  switch (gender.toLowerCase()) {
    case 'male':
    case 'm':
      return 'M';
    case 'female':
    case 'f':
      return 'Ž';
    default:
      return gender;
  }
}

function formatDate(date: string | null): string {
  if (!date) return '-';
  return format(new Date(date), 'd. MMM yyyy', { locale: sl });
}

function StatusBadge({ 
  status, 
  reviewedAt, 
  completedAt 
}: { 
  status: MyReviewSession['status'];
  reviewedAt?: string | null;
  completedAt?: string | null;
}) {
  // Zaključeno = poročilo generirano (completed_at nastavljen)
  if (completedAt) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        Zaključeno
      </Badge>
    );
  }
  
  // Pregledano = ocene oddane, brez poročila (reviewed_at nastavljen ALI status = completed)
  if (reviewedAt || status === 'completed') {
    return (
      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
        Pregledano
      </Badge>
    );
  }
  
  // V obdelavi = assigned ali in_review
  return (
    <Badge className="bg-app-blue/10 text-app-blue border-app-blue/20">
      V obdelavi
    </Badge>
  );
}

// Mobile card component
function ReviewCard({ 
  session, 
  isExpanded, 
  onToggle,
  onNavigate,
}: { 
  session: MyReviewSession; 
  isExpanded: boolean; 
  onToggle: () => void;
  onNavigate: (sessionId: string) => void;
}) {
  const source = formatSource(session);
  
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Baby className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{session.child_name}</span>
              <StatusBadge 
                status={session.status} 
                reviewedAt={session.reviewed_at}
                completedAt={session.completed_at}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {source.isOrganization ? (
                <Building2 className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
              <div className="flex flex-col">
                <span>{source.line1}</span>
                {source.line2 && (
                  <span className="text-xs">{source.line2}</span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Prevzeto: {formatDate(session.assigned_at)}</span>
            </div>
            {session.child_age && (
              <div className="text-sm">
                Starost: {session.child_age} let
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => onNavigate(session.id + '?edit=true')}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Popravi
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => onNavigate(session.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ogled
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminMyReviews() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: sessions, isLoading, error } = useMyReviews();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Filter states - initialize from URL params
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get('status') || 'all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Update status filter when URL changes
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus) {
      setStatusFilter(urlStatus);
    }
  }, [searchParams]);

  const myReviews = useMemo(() => {
    if (!sessions) return [];
    
    return sessions.filter(session => {
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
          if (session.reviewed_at || session.completed_at || session.status === 'completed') return false;
        } else if (statusFilter === 'reviewed') {
          if ((!session.reviewed_at && session.status !== 'completed') || session.completed_at) return false;
        } else if (statusFilter === 'completed') {
          if (!session.completed_at) return false;
        }
      }
      
      // Date filter
      if (dateFilter !== 'all' && session.assigned_at) {
        const assignedDate = new Date(session.assigned_at);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            if (assignedDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (assignedDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (assignedDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (assignedDate < yearAgo) return false;
            break;
        }
      }
      
      return true;
    });
  }, [sessions, ageFilter, genderFilter, statusFilter, dateFilter]);
  
  // Calculate stats from unfiltered sessions
  const totalMyReviews = sessions?.length || 0;
  const inReviewCount = sessions?.filter(s => 
    !s.reviewed_at && s.status !== 'completed' && !s.completed_at
  ).length || 0;
  const reviewedCount = sessions?.filter(s => 
    (s.reviewed_at || s.status === 'completed') && !s.completed_at
  ).length || 0;
  const completedCount = sessions?.filter(s => !!s.completed_at).length || 0;
  
  const myReviewsStatusOptions = [
    { value: 'all', label: 'Vsi statusi' },
    { value: 'in_review', label: 'V obdelavi' },
    { value: 'reviewed', label: 'Pregledano' },
    { value: 'completed', label: 'Zaključeno' },
  ];

  const handleNavigate = (sessionId: string) => {
    navigate(`/admin/tests/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center text-destructive">
            Napaka pri nalaganju podatkov
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Moji pregledi</h1>
        <p className="text-muted-foreground">
          Preverjanja, ki ste jih prevzeli v obdelavo
        </p>
      </div>

      {/* Stats Cards - 4 in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Moji pregledi"
          value={totalMyReviews}
          description="Vsi primeri, ki ste jih prevzeli"
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="V pregledu"
          value={inReviewCount}
          description="Primeri, ki jih aktivno pregledujete"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Pregledano"
          value={reviewedCount}
          description="Primeri z oddanimi ocenami"
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Zaključeno"
          value={completedCount}
          description="Primeri z generiranim poročilom"
          icon={FileCheck}
          color="green"
        />
      </div>

      {/* Filters */}
      <TestFilters
        ageFilter={ageFilter}
        setAgeFilter={setAgeFilter}
        showAgeFilter={true}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        showGenderFilter={true}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showStatusFilter={true}
        statusOptions={myReviewsStatusOptions}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        showDateFilter={true}
      />

      {myReviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nimate aktivnih pregledov
            </h3>
            <p className="text-muted-foreground mb-4">
              Prevzemite primere iz zavihka "V čakanju" za začetek dela.
            </p>
            <Button onClick={() => navigate('/admin/pending')}>
              Pojdi na V čakanju
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Uporabnik</TableHead>
                      <TableHead>Otrok</TableHead>
                      <TableHead>Starost</TableHead>
                      <TableHead>Spol</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prevzeto</TableHead>
                      <TableHead className="text-right">Dejanje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myReviews.map((session) => {
                      const source = formatSource(session);
                      return (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{source.line1}</span>
                              {source.line2 && (
                                <span className="text-sm text-muted-foreground">{source.line2}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{session.child_name}</TableCell>
                          <TableCell>
                            {session.child_age ? `${session.child_age} let` : '-'}
                          </TableCell>
                          <TableCell>{formatGender(session.child_gender)}</TableCell>
                          <TableCell>
                          <StatusBadge 
                            status={session.status} 
                            reviewedAt={session.reviewed_at}
                            completedAt={session.completed_at}
                          />
                          </TableCell>
                          <TableCell>{formatDate(session.assigned_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleNavigate(session.id + '?edit=true')}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Popravi
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleNavigate(session.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ogled
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {myReviews.map((session) => (
              <ReviewCard
                key={session.id}
                session={session}
                isExpanded={expandedId === session.id}
                onToggle={() => setExpandedId(expandedId === session.id ? null : session.id)}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
