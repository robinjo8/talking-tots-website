import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { Clock, User, Baby, Calendar, ArrowRight, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TestFilters } from '@/components/admin/TestFilters';
import { usePendingTests, PendingTestSession } from '@/hooks/usePendingTests';
import { useClaimTestSession } from '@/hooks/useClaimTestSession';
import { toast } from 'sonner';

interface SourceDisplay {
  line1: string;
  line2: string | null;
  isOrganization: boolean;
}

function formatSource(session: PendingTestSession): SourceDisplay {
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

// Mobile card component
function PendingCard({ 
  session, 
  isExpanded, 
  onToggle,
  onClaim,
  isClaimLoading,
}: { 
  session: PendingTestSession; 
  isExpanded: boolean; 
  onToggle: () => void;
  onClaim: (sessionId: string) => void;
  isClaimLoading: boolean;
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
              {session.child_age && (
                <Badge variant="secondary" className="text-xs">
                  {session.child_age} let
                </Badge>
              )}
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
              <span>Oddano: {formatDate(session.submitted_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Spol: {formatGender(session.child_gender)}</span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" disabled={isClaimLoading}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Prevzemi
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Prevzemi primer</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ali želite prevzeti preverjanje za otroka <strong>{session.child_name}</strong>? 
                    Po prevzemu bo primer viden v zavihku "Moji pregledi".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Prekliči</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onClaim(session.id)}>
                    Prevzemi
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminPending() {
  const navigate = useNavigate();
  const { data: sessions, isLoading, error } = usePendingTests();
  const { claimSession, isLoading: isClaimLoading } = useClaimTestSession();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Filter states
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const pendingSessions = useMemo(() => {
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
  }, [sessions, ageFilter, genderFilter, dateFilter]);

  const handleClaim = async (sessionId: string) => {
    const result = await claimSession(sessionId);
    if (result.success) {
      toast.success('Primer uspešno prevzet');
      navigate('/admin/my-reviews');
    } else {
      toast.error(result.error || 'Napaka pri prevzemu primera');
    }
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
        <h1 className="text-2xl font-bold text-foreground">V čakanju</h1>
        <p className="text-muted-foreground">
          Preverjanja, ki čakajo na pregled logopeda
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Neprevzeti primeri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">
            {pendingSessions.length}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <TestFilters
        ageFilter={ageFilter}
        setAgeFilter={setAgeFilter}
        showAgeFilter={true}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        showGenderFilter={true}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        showDateFilter={true}
      />

      {pendingSessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Ni čakajočih preverjanj
            </h3>
            <p className="text-muted-foreground">
              Trenutno ni nobenih neprevzetih preverjanj.
            </p>
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
                      <TableHead>Izvor</TableHead>
                      <TableHead>Otrok</TableHead>
                      <TableHead>Starost</TableHead>
                      <TableHead>Spol</TableHead>
                      <TableHead>Datum oddaje</TableHead>
                      <TableHead className="text-right">Dejanje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSessions.map((session) => {
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
                          <TableCell>{formatDate(session.submitted_at)}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" disabled={isClaimLoading}>
                                  <ArrowRight className="h-4 w-4 mr-1" />
                                  Prevzemi
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Prevzemi primer</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Ali želite prevzeti preverjanje za otroka <strong>{session.child_name}</strong>? 
                                    Po prevzemu bo primer viden v zavihku "Moji pregledi".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Prekliči</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleClaim(session.id)}>
                                    Prevzemi
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
            {pendingSessions.map((session) => (
              <PendingCard
                key={session.id}
                session={session}
                isExpanded={expandedId === session.id}
                onToggle={() => setExpandedId(expandedId === session.id ? null : session.id)}
                onClaim={handleClaim}
                isClaimLoading={isClaimLoading}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
