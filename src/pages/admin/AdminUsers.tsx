import React, { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminUsers, ParentWithChildren, ChildData } from '@/hooks/useAdminUsers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, Baby, Eye, FolderOpen, Loader2, ChevronDown } from 'lucide-react';

interface DisplayRow {
  parent: ParentWithChildren;
  child: ChildData | null;
  isFirstChild: boolean;
  childCount: number;
}

// Mobile card component for user display with accordion behavior
const UserCard = ({ 
  row, 
  formatParentName, 
  formatGender,
  isExpanded,
  onToggle
}: { 
  row: DisplayRow; 
  formatParentName: (parent: ParentWithChildren) => string;
  formatGender: (gender: string | null) => string;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const parentName = formatParentName(row.parent);
  const gender = row.child ? formatGender(row.child.gender) : '';
  
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header - always visible, clickable */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium">
          {parentName || <span className="italic text-muted-foreground">Ni dodano v profilu</span>}
        </span>
        <ChevronDown 
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {/* Content - shown only when expanded */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t">
          {/* Email */}
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Elektronski naslov</span>
            <p className="break-all">
              {row.parent.email || <span className="italic text-muted-foreground">Ni emaila</span>}
            </p>
          </div>
          
          {/* Child Info */}
          <div>
            <span className="text-xs text-muted-foreground">Otrok</span>
            <p>
              {row.child ? (
                <>
                  <span className="font-medium">{row.child.name}</span>
                  {row.child.age !== null && <span className="text-muted-foreground"> • {row.child.age} let</span>}
                  {gender && <span className="text-muted-foreground"> • {gender}</span>}
                </>
              ) : (
                <span className="italic text-muted-foreground">Ni otroka</span>
              )}
            </p>
          </div>
          
          {/* Status */}
          <div>
            <span className="text-xs text-muted-foreground">Status</span>
            <p className="text-muted-foreground">-</p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" /> Ogled
            </Button>
            {row.child && (
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4 mr-1" /> Dokumenti
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminUsers() {
  const { data: users, isLoading, error } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setExpandedCardId(prev => prev === cardId ? null : cardId);
  };

  // Flatten the data to have one row per child, or one row for users without children
  const flatRows = useMemo(() => {
    if (!users) return [];
    const rows: DisplayRow[] = [];
    
    for (const parent of users) {
      if (parent.children.length === 0) {
        // User without children - single row
        rows.push({ 
          parent, 
          child: null, 
          isFirstChild: true,
          childCount: 0
        });
      } else {
        // User with children - one row per child
        parent.children.forEach((child, index) => {
          rows.push({ 
            parent, 
            child, 
            isFirstChild: index === 0,
            childCount: parent.children.length
          });
        });
      }
    }
    return rows;
  }, [users]);

  // Filter based on search
  const filteredRows = useMemo(() => {
    if (!searchQuery) return flatRows;
    const searchLower = searchQuery.toLowerCase();
    return flatRows.filter(row => {
      const emailMatch = row.parent.email?.toLowerCase().includes(searchLower);
      const nameMatch = row.parent.first_name?.toLowerCase().includes(searchLower) || 
                        row.parent.last_name?.toLowerCase().includes(searchLower);
      const childMatch = row.child?.name.toLowerCase().includes(searchLower);
      return emailMatch || nameMatch || childMatch;
    });
  }, [flatRows, searchQuery]);

  // Stats calculations
  const stats = useMemo(() => {
    if (!users) return { totalUsers: 0, usersWithChildren: 0, totalChildren: 0 };
    const totalUsers = users.length;
    const usersWithChildren = users.filter(u => u.children.length > 0).length;
    const totalChildren = users.reduce((acc, user) => acc + user.children.length, 0);
    return { totalUsers, usersWithChildren, totalChildren };
  }, [users]);

  // Helper function to format parent name
  const formatParentName = (parent: ParentWithChildren): string => {
    if (parent.first_name || parent.last_name) {
      return [parent.first_name, parent.last_name].filter(Boolean).join(' ');
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Uporabniki</h1>
          <p className="text-muted-foreground">
            Vsi registrirani uporabniki na portalu TomiTalk
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj uporabnikov</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Vseh registriranih</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uporabniki z otroki</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usersWithChildren}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 
                  ? `${((stats.usersWithChildren / stats.totalUsers) * 100).toFixed(0)}% uporabnikov`
                  : '0% uporabnikov'
                }
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj otrok</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChildren}</div>
              <p className="text-xs text-muted-foreground">Registriranih otrok</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Seznam uporabnikov</CardTitle>
            <CardDescription>
              Vsi registrirani uporabniki na portalu TomiTalk
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Išči po emailu, imenu starša ali otroka..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                      <TableHead>Elektronski naslov</TableHead>
                      <TableHead>Ime otroka</TableHead>
                      <TableHead>Starost</TableHead>
                      <TableHead>Spol</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          {searchQuery ? 'Ni rezultatov za iskalni niz' : 'Ni registriranih uporabnikov'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row) => {
                        const parentName = formatParentName(row.parent);
                        const gender = row.child ? formatGender(row.child.gender) : '';
                        const rowKey = row.child ? row.child.id : `${row.parent.parent_id}-no-child`;
                        
                        return (
                          <TableRow key={rowKey}>
                            <TableCell>
                              {parentName ? (
                                <span className="font-medium">{parentName}</span>
                              ) : (
                                <span className="text-muted-foreground italic">Ni dodano v profilu</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {row.parent.email ? (
                                <span>{row.parent.email}</span>
                              ) : (
                                <span className="text-muted-foreground italic">Ni emaila</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {row.child ? (
                                <span className="font-medium">{row.child.name}</span>
                              ) : (
                                <span className="text-muted-foreground italic">Ni otroka</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {row.child && row.child.age !== null ? (
                                `${row.child.age} let`
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {gender ? (
                                <span>{gender}</span>
                              ) : (
                                <span className="text-muted-foreground italic">
                                  {row.child ? 'Ni določen' : '-'}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-muted-foreground text-sm">-</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" title="Ogled podrobnosti">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {row.child && (
                                  <Button variant="ghost" size="sm" title="Dokumenti">
                                    <FolderOpen className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Mobile: Cards */}
            {!isLoading && !error && (
              <div className="md:hidden space-y-3">
                {filteredRows.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchQuery ? 'Ni rezultatov za iskalni niz' : 'Ni registriranih uporabnikov'}
                  </div>
                ) : (
                  filteredRows.map((row) => {
                    const rowKey = row.child ? row.child.id : `${row.parent.parent_id}-no-child`;
                    return (
                      <UserCard 
                        key={rowKey} 
                        row={row} 
                        formatParentName={formatParentName}
                        formatGender={formatGender}
                        isExpanded={expandedCardId === rowKey}
                        onToggle={() => toggleCard(rowKey)}
                      />
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
