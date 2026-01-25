import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, CheckCircle2, Loader2, FileCheck, AlertCircle, ChevronDown, Eye, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChildDocuments } from "@/hooks/useChildDocuments";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { DocumentPreview } from "@/components/admin/DocumentPreview";
type DocumentItem = {
  id: string;
  child_id: string;
  original_filename: string;
  storage_path: string;
  document_type: string;
  virus_scan_status: string;
  created_at: string;
};
type GroupedDocuments = {
  childId: string;
  childName: string;
  documents: DocumentItem[];
};

type ReportFile = {
  name: string;
  path: string;
  childName: string;
};

export function MyDocumentsSection() {
  const { user, profile } = useAuth();
  const {
    fetchDocuments,
    deleteDocument,
    getDocumentUrl
  } = useChildDocuments();
  const { markAllAsRead } = useUserNotifications();
  const [groupedDocuments, setGroupedDocuments] = useState<GroupedDocuments[]>([]);
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedDocsOpen, setUploadedDocsOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(true);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const hasMarkedAsRead = useRef(false);

  const toggleDocumentPreview = useCallback((docPath: string) => {
    setExpandedDocId(prev => prev === docPath ? null : docPath);
  }, []);

  // Označi vsa obvestila kot prebrana ob prikazu komponente
  useEffect(() => {
    if (!hasMarkedAsRead.current) {
      markAllAsRead();
      hasMarkedAsRead.current = true;
    }
  }, [markAllAsRead]);

  useEffect(() => {
    const loadAllDocuments = async () => {
      if (!profile?.children || !user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const grouped: GroupedDocuments[] = [];
      const allReports: ReportFile[] = [];
      
      for (const child of profile.children) {
        if (child.id) {
          // Fetch uploaded documents
          const docs = await fetchDocuments(child.id);
          if (docs.length > 0) {
            grouped.push({
              childId: child.id,
              childName: child.name,
              documents: docs
            });
          }
          
          // Fetch generated PDF reports from storage
          const { data: reportFiles } = await supabase.storage
            .from('uporabniski-profili')
            .list(`${user.id}/${child.id}/Generirana-porocila`);
          
          if (reportFiles) {
            const childReports = reportFiles
              .filter(f => f.name !== '.emptyFolderPlaceholder')
              .map(f => ({
                name: f.name,
                path: `${user.id}/${child.id}/Generirana-porocila/${f.name}`,
                childName: child.name,
              }));
            allReports.push(...childReports);
          }
        }
      }
      setGroupedDocuments(grouped);
      setReports(allReports);
      setLoading(false);
    };
    loadAllDocuments();
  }, [profile?.children, user?.id, fetchDocuments]);

  const handleDownloadReport = useCallback(async (path: string) => {
    const { data } = await supabase.storage
      .from('uporabniski-profili')
      .createSignedUrl(path, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  }, []);
  const handleDownload = async (storagePath: string) => {
    const url = await getDocumentUrl(storagePath);
    if (url) window.open(url, '_blank');
  };
  const handleDelete = async (docId: string, storagePath: string, childId: string) => {
    if (await deleteDocument(docId, storagePath)) {
      setGroupedDocuments(prev => prev.map(group => {
        if (group.childId === childId) {
          return {
            ...group,
            documents: group.documents.filter(d => d.id !== docId)
          };
        }
        return group;
      }).filter(group => group.documents.length > 0));
    }
  };
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf_attachment':
        return 'PDF priponka';
      case 'speech_description':
        return 'Opis govornih težav';
      case 'questionnaire':
        return 'Osnovni vprašalnik';
      default:
        return type;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clean':
        return <Badge variant="outline" className="text-dragon-green border-dragon-green/30 bg-dragon-green/10">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Preverjeno
          </Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> V pregledu
          </Badge>;
      case 'error':
        return <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
            <AlertCircle className="h-3 w-3 mr-1" /> Napaka
          </Badge>;
      default:
        return null;
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-dragon-green" />
      </div>;
  }
  return <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header - matching Otroci style */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Moji dokumenti
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Uploaded Documents Section - collapsible like Govorne težave */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Collapsible open={uploadedDocsOpen} onOpenChange={setUploadedDocsOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors relative">
                <h5 className="font-medium text-foreground">Naloženi dokumenti</h5>
                <div className="absolute right-4 flex items-center gap-2">
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", uploadedDocsOpen && "rotate-180")} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                {groupedDocuments.length === 0 ? <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Ni naloženih dokumentov</p>
                    <p className="text-xs mt-1">
                      Dokumente lahko naložite pri profilu otroka
                    </p>
                  </div> : <div className="space-y-4 pt-4">
                    {groupedDocuments.map(group => (
                      <div key={group.childId} className="space-y-3">
                        <div className="space-y-2 pl-4">
                          {group.documents.map(doc => {
                            const isExpanded = expandedDocId === doc.storage_path;
                            return (
                              <div key={doc.id} className="border border-gray-100 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between p-3 bg-gray-50">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <FileText className="h-4 w-4 text-gray-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium truncate">
                                        {doc.original_filename}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-xs text-muted-foreground">
                                          {getDocumentTypeLabel(doc.document_type)}
                                        </span>
                                        {getStatusBadge(doc.virus_scan_status)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => toggleDocumentPreview(doc.storage_path)} 
                                      className="h-8 w-8 p-0" 
                                      title={isExpanded ? "Zapri predogled" : "Ogled"}
                                    >
                                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDownload(doc.storage_path)} className="h-8 w-8 p-0" title="Prenesi">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(doc.id, doc.storage_path, group.childId)} title="Izbriši">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-4 border-t bg-background">
                                        <DocumentPreview 
                                          fileName={doc.original_filename}
                                          getSignedUrl={() => getDocumentUrl(doc.storage_path)}
                                          onDownload={() => handleDownload(doc.storage_path)}
                                        />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Reports Section - collapsible like Osnovni vprašalnik */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors relative">
                <h5 className="font-medium text-foreground">Poročila</h5>
                <div className="absolute right-4 flex items-center gap-2">
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", reportsOpen && "rotate-180")} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                {reports.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Poročil še ni</p>
                    <p className="text-xs mt-1">
                      Tukaj bodo prikazana poročila logopedov
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4">
                    {reports.map((report, idx) => {
                      const isExpanded = expandedDocId === report.path;
                      return (
                        <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-gray-50">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <FileText className="h-4 w-4 text-red-500 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{report.name}</p>
                                <p className="text-xs text-muted-foreground">za {report.childName}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => toggleDocumentPreview(report.path)}
                                title={isExpanded ? "Zapri predogled" : "Ogled"}
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDownloadReport(report.path)}
                                title="Prenesi"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 border-t bg-background">
                                  <DocumentPreview 
                                    fileName={report.name}
                                    getSignedUrl={async () => {
                                      const { data } = await supabase.storage
                                        .from('uporabniski-profili')
                                        .createSignedUrl(report.path, 3600);
                                      return data?.signedUrl || null;
                                    }}
                                    onDownload={() => handleDownloadReport(report.path)}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>;
}