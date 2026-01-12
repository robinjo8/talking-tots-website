import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, CheckCircle2, Loader2, FileCheck, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChildDocuments } from "@/hooks/useChildDocuments";
import { Badge } from "@/components/ui/badge";

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

export function MyDocumentsSection() {
  const { profile } = useAuth();
  const { fetchDocuments, deleteDocument, getDocumentUrl } = useChildDocuments();
  const [groupedDocuments, setGroupedDocuments] = useState<GroupedDocuments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllDocuments = async () => {
      if (!profile?.children) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const grouped: GroupedDocuments[] = [];

      for (const child of profile.children) {
        if (child.id) {
          const docs = await fetchDocuments(child.id);
          if (docs.length > 0) {
            grouped.push({
              childId: child.id,
              childName: child.name,
              documents: docs,
            });
          }
        }
      }

      setGroupedDocuments(grouped);
      setLoading(false);
    };

    loadAllDocuments();
  }, [profile?.children, fetchDocuments]);

  const handleDownload = async (storagePath: string) => {
    const url = await getDocumentUrl(storagePath);
    if (url) window.open(url, '_blank');
  };

  const handleDelete = async (docId: string, storagePath: string, childId: string) => {
    if (await deleteDocument(docId, storagePath)) {
      setGroupedDocuments(prev => 
        prev.map(group => {
          if (group.childId === childId) {
            return {
              ...group,
              documents: group.documents.filter(d => d.id !== docId),
            };
          }
          return group;
        }).filter(group => group.documents.length > 0)
      );
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf_attachment': return 'PDF priponka';
      case 'speech_description': return 'Opis govornih težav';
      case 'questionnaire': return 'Osnovni vprašalnik';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clean':
        return (
          <Badge variant="outline" className="text-dragon-green border-dragon-green/30 bg-dragon-green/10">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Preverjeno
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> V pregledu
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
            <AlertCircle className="h-3 w-3 mr-1" /> Napaka
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-dragon-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Moji dokumenti</h2>
        <p className="text-muted-foreground mt-1">
          Vsi naloženi dokumenti in poročila na enem mestu
        </p>
      </div>

      {/* Uploaded Documents Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5 text-dragon-green" />
            Naloženi dokumenti
          </CardTitle>
        </CardHeader>
        <CardContent>
          {groupedDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Ni naloženih dokumentov</p>
              <p className="text-sm mt-1">
                Dokumente lahko naložite pri profilu otroka
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedDocuments.map((group) => (
                <div key={group.childId} className="space-y-3">
                  <h4 className="font-medium text-dragon-green flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-dragon-green" />
                    {group.childName}
                  </h4>
                  <div className="space-y-2 pl-4">
                    {group.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
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
                            onClick={() => handleDownload(doc.storage_path)}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(doc.id, doc.storage_path, group.childId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileCheck className="h-5 w-5 text-dragon-green" />
            Poročila
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Poročil še ni</p>
            <p className="text-sm mt-1">
              Tukaj bodo prikazana poročila logopedov
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
