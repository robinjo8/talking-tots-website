import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { User, Baby, Calendar, Eye, ChevronDown, ChevronUp, ClipboardList, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useMyReviews, MyReviewSession } from '@/hooks/useMyReviews';

function formatParentName(session: MyReviewSession): string {
  if (session.parent_first_name || session.parent_last_name) {
    return `${session.parent_first_name || ''} ${session.parent_last_name || ''}`.trim();
  }
  return 'Neznano';
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
              <User className="h-3 w-3" />
              <span>{formatParentName(session)}</span>
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
  const { data: sessions, isLoading, error } = useMyReviews();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const myReviews = sessions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Moji pregledi</h1>
        <p className="text-muted-foreground">
          Preverjanja, ki ste jih prevzeli v obdelavo
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-app-blue" />
            Aktivni pregledi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-app-blue">
            {myReviews.length}
          </div>
        </CardContent>
      </Card>

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
                      <TableHead>Starš</TableHead>
                      <TableHead>Otrok</TableHead>
                      <TableHead>Starost</TableHead>
                      <TableHead>Spol</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prevzeto</TableHead>
                      <TableHead className="text-right">Dejanje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myReviews.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          {formatParentName(session)}
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
                    ))}
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
