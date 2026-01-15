import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminUsers } from '@/hooks/useAdminUsers';
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
import { Badge } from '@/components/ui/badge';
import { Search, Users, Eye, FolderOpen, Loader2 } from 'lucide-react';

export default function AdminUsers() {
  const { data: users, isLoading, error } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users?.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const emailMatch = user.email?.toLowerCase().includes(searchLower);
    const childMatch = user.children.some(child => 
      child.name.toLowerCase().includes(searchLower)
    );
    return emailMatch || childMatch;
  }) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Uporabniki</h1>
          <p className="text-muted-foreground">
            Pregled vseh registriranih staršev in njihovih otrok
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
              Vsi starši z registriranimi otroki na portalu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Išči po emailu ali imenu otroka..."
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email starša</TableHead>
                      <TableHead>Otroci</TableHead>
                      <TableHead>Število otrok</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                          {searchQuery ? 'Ni rezultatov za iskalni niz' : 'Ni registriranih uporabnikov'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.parent_id}>
                          <TableCell className="font-medium">
                            {user.email || 'Ni emaila'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.children.map((child) => (
                                <Badge key={child.id} variant="secondary" className="text-xs">
                                  {child.name} {child.age ? `(${child.age} let)` : ''}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.children.length}</Badge>
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
                      ))
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
