import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Download, Eye, Trash2, Loader2, FileWarning } from 'lucide-react';
import { useLogopedistReports, useDeleteLogopedistReport, getReportFileUrl, LogopedistReport } from '@/hooks/useLogopedistReports';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { toast } from 'sonner';
import { TestFilters } from '@/components/admin/TestFilters';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminReports() {
  const { data: reports = [], isLoading, error } = useLogopedistReports();
  const deleteReport = useDeleteLogopedistReport();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<LogopedistReport | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const reportStatusOptions = [
    { value: 'all', label: 'Vsi statusi' },
    { value: 'submitted', label: 'Oddano' },
    { value: 'revised', label: 'Popravljena' },
  ];

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const childMatch = report.child_name?.toLowerCase().includes(query);
        const parentMatch = report.parent_name?.toLowerCase().includes(query);
        const summaryMatch = report.summary?.toLowerCase().includes(query);
        if (!childMatch && !parentMatch && !summaryMatch) return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        if (report.status !== statusFilter) return false;
      }
      
      // Date filter
      if (dateFilter !== 'all' && report.created_at) {
        const createdDate = new Date(report.created_at);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            if (createdDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (createdDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (createdDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (createdDate < yearAgo) return false;
            break;
        }
      }
      
      return true;
    });
  }, [reports, searchQuery, statusFilter, dateFilter]);

  const handleView = async (report: LogopedistReport) => {
    if (!report.pdf_url) {
      toast.error('Poročilo nima priloženega PDF-ja');
      return;
    }
    const url = await getReportFileUrl(report.pdf_url);
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Napaka pri odpiranju poročila');
    }
  };

  const handleDownload = async (report: LogopedistReport) => {
    if (!report.pdf_url) {
      toast.error('Poročilo nima priloženega PDF-ja');
      return;
    }
    setIsDownloading(report.id);
    try {
      const url = await getReportFileUrl(report.pdf_url);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `porocilo-${report.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error('Napaka pri prenosu poročila');
      }
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDeleteClick = (report: LogopedistReport) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reportToDelete) return;
    
    try {
      await deleteReport.mutateAsync(reportToDelete.id);
      toast.success('Poročilo izbrisano');
    } catch (err) {
      console.error('Error deleting report:', err);
      toast.error('Napaka pri brisanju poročila');
    } finally {
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd. M. yyyy HH:mm', { locale: sl });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'revised':
        return <Badge variant="outline" className="text-orange-600 border-orange-300">Popravljena</Badge>;
      case 'submitted':
        return <Badge className="bg-green-600">Oddano</Badge>;
      default:
        // Za morebitne stare 'draft' zapise prikaži kot "Oddano"
        return <Badge className="bg-green-600">Oddano</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileWarning className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">Napaka pri nalaganju poročil</p>
          <p className="text-muted-foreground text-sm mt-2">{(error as Error).message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Poročila</h1>
        <p className="text-muted-foreground">
          Vsa poročila, ki ste jih ustvarili
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skupaj poročil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Oddana poročila
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'submitted').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ta mesec
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => {
                const date = new Date(r.created_at);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Seznam poročil</CardTitle>
          </div>
          <CardDescription>
            Iskanje in upravljanje vaših poročil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Išči po imenu otroka, starša ali povzetku..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <TestFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showStatusFilter={true}
              statusOptions={reportStatusOptions}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              showDateFilter={true}
            />
          </div>

          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {reports.length === 0 ? (
                <>
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Še nimate ustvarjenih poročil.</p>
                  <p className="text-sm mt-2">
                    Poročila ustvarite na strani podrobnosti uporabnika.
                  </p>
                </>
              ) : (
                <p>Ni rezultatov za iskalni niz "{searchQuery}"</p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Otrok</TableHead>
                      <TableHead>Starš</TableHead>
                      <TableHead>Logoped</TableHead>
                      <TableHead>Povzetek</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ustvarjeno</TableHead>
                      <TableHead className="text-right">Dejanja</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map(report => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.child_name}</TableCell>
                        <TableCell>{report.parent_name}</TableCell>
                        <TableCell>{report.logopedist_name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {report.summary || <span className="text-muted-foreground italic">Ni povzetka</span>}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{formatDate(report.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(report)}
                              disabled={!report.pdf_url}
                              title="Odpri PDF"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(report)}
                              disabled={isDownloading === report.id || !report.pdf_url}
                              title="Prenesi PDF"
                            >
                              {isDownloading === report.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(report)}
                              className="text-destructive hover:text-destructive"
                              title="Izbriši"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredReports.map(report => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{report.child_name}</p>
                        <p className="text-sm text-muted-foreground">{report.parent_name}</p>
                        <p className="text-xs text-muted-foreground">Logoped: {report.logopedist_name}</p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    {report.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.summary}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Ustvarjeno: {formatDate(report.created_at)}
                    </p>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(report)}
                        disabled={!report.pdf_url}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Odpri
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report)}
                        disabled={isDownloading === report.id || !report.pdf_url}
                      >
                        {isDownloading === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(report)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Izbriši poročilo?</AlertDialogTitle>
            <AlertDialogDescription>
              Ali ste prepričani, da želite izbrisati to poročilo za otroka "{reportToDelete?.child_name}"?
              To dejanje ni mogoče razveljaviti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Prekliči</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Izbriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
