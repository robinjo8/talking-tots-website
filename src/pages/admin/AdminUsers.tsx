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
import { Search, Users, Eye, FolderOpen, Loader2 } from 'lucide-react';

interface FlatChildRow {
  parent: ParentWithChildren;
  child: ChildData;
}

export default function AdminUsers() {
  const { data: users, isLoading, error } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten the data to have one row per child
  const flatRows = useMemo(() => {
    if (!users) return [];
    const rows: FlatChildRow[] = [];
    for (const parent of users) {
      for (const child of parent.children) {
        rows.push({ parent, child });
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
      const childMatch = row.child.name.toLowerCase().includes(searchLower);
      return emailMatch || nameMatch || childMatch;
    });
  }, [flatRows, searchQuery]);

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
            Vsi starši z registriranimi otroki na portalu TomiTalk
          </p>
        </div>

        {/* Stats Card */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj staršev</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj otrok</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.reduce((acc, user) => acc + user.children.length, 0) || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Povprečno otrok/starš</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.length 
                  ? (users.reduce((acc, user) => acc + user.children.length, 0) / users.length).toFixed(1)
                  : '0'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Seznam uporabnikov</CardTitle>
            <CardDescription>
              Vsi starši z registriranimi otroki na portalu TomiTalk
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
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

            {/* Table */}
            {!isLoading && !error && (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ime in priimek starša</TableHead>
                      <TableHead>Email</TableHead>
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
                        const gender = formatGender(row.child.gender);
                        
                        return (
                          <TableRow key={row.child.id}>
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
                            <TableCell className="font-medium">
                              {row.child.name}
                            </TableCell>
                            <TableCell>
                              {row.child.age !== null ? `${row.child.age} let` : '-'}
                            </TableCell>
                            <TableCell>
                              {gender ? (
                                <span>{gender}</span>
                              ) : (
                                <span className="text-muted-foreground italic">Ni določen</span>
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
                                <Button variant="ghost" size="sm" title="Dokumenti">
                                  <FolderOpen className="h-4 w-4" />
                                </Button>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
