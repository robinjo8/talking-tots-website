import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  FileText, 
  Mic, 
  ClipboardList, 
  Eye, 
  Download, 
  Upload, 
  Save, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Play,
  File,
  Pencil,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useUserStorageFiles, StorageFile, SessionRecordings } from '@/hooks/useUserStorageFiles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DocumentPreview } from '@/components/admin/DocumentPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { ReportTemplateEditor, generateReportText, ReportData } from '@/components/admin/ReportTemplateEditor';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { generateReportPdf } from '@/utils/generateReportPdf';

export default function AdminUserDetail() {
  const { parentId, childId } = useParams<{ parentId: string; childId: string }>();
  const navigate = useNavigate();
  const { profile: logopedistProfile } = useAdminAuth();
  
  const [childData, setChildData] = useState<{ name: string; age: number; gender: string | null } | null>(null);
  const [parentData, setParentData] = useState<{ name: string; email: string } | null>(null);
  const [testSessions, setTestSessions] = useState<{ id: string; date: string; formattedDate: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Report template state
  const [reportData, setReportData] = useState<ReportData>({
    parentName: '',
    parentEmail: '',
    childName: '',
    childAge: null,
    childGender: null,
    testDate: null,
    selectedSessionId: null,
    reportDate: format(new Date(), 'd. M. yyyy', { locale: sl }),
    logopedistName: '',
    anamneza: '',
    ugotovitve: '',
    predlogVaj: '',
    opombe: '',
  });

  const { 
    documents, 
    recordings, 
    reports,
    generatedReports,
    isLoading, 
    error, 
    getFileUrl,
    refetchReports,
    refetchGeneratedReports,
  } = useUserStorageFiles(parentId || '', childId || '');
  
  const toggleDocumentPreview = useCallback((docPath: string) => {
    setExpandedDocId(prev => prev === docPath ? null : docPath);
  }, []);

  // Fetch child and parent data
  useEffect(() => {
    async function fetchUserData() {
      if (!childId || !parentId) return;

      // Fetch child data with gender
      const { data: child, error: childError } = await supabase
        .from('children')
        .select('name, age, gender')
        .eq('id', childId)
        .single();

      if (childError) {
        console.error('Error fetching child:', childError);
      } else {
        setChildData(child);
      }

      // Fetch parent data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', parentId)
        .single();

      // Fetch parent email using RPC function
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_parent_emails', { parent_ids: [parentId] });

      let parentEmail = '';
      if (!emailError && emailData && emailData.length > 0) {
        parentEmail = emailData[0].email || '';
      }

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setParentData({
          name: [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Neznano',
          email: parentEmail,
        });
      }

      // Sessions will be extracted from storage recordings in a separate effect
    }

    fetchUserData();
  }, [childId, parentId]);

  // Extract test sessions from storage recordings
  useEffect(() => {
    if (recordings.length === 0) return;

    const sessionsMap: { [key: string]: { id: string; date: string; formattedDate: string } } = {};

    recordings.forEach(session => {
      // session.sessionName is like "Seja-1", "Seja-2", etc.
      const sessionName = session.sessionName;
      
      // Get the earliest date from recordings in this session
      if (session.recordings.length > 0) {
        // Try to extract date from file names (format: Z-57-ZOGA-2026-01-15T17-32-57-092Z.webm)
        let earliestDate: Date | null = null;
        
        session.recordings.forEach(file => {
          const dateMatch = file.name.match(/(\d{4}-\d{2}-\d{2})T/);
          if (dateMatch) {
            const fileDate = new Date(dateMatch[1]);
            if (!earliestDate || fileDate < earliestDate) {
              earliestDate = fileDate;
            }
          }
        });

        if (earliestDate) {
          sessionsMap[sessionName] = {
            id: sessionName,
            date: earliestDate.toISOString(),
            formattedDate: format(earliestDate, 'd. M. yyyy', { locale: sl }),
          };
        }
      }
    });

    // Sort sessions by number (Seja-1, Seja-2, etc.)
    const sortedSessions = Object.values(sessionsMap).sort((a, b) => {
      const numA = parseInt(a.id.replace('Seja-', ''));
      const numB = parseInt(b.id.replace('Seja-', ''));
      return numB - numA; // Descending (newest first)
    });

    setTestSessions(sortedSessions);
  }, [recordings]);

  // Update reportData when fetched data changes
  useEffect(() => {
    const logopedistName = logopedistProfile 
      ? [logopedistProfile.first_name, logopedistProfile.last_name].filter(Boolean).join(' ')
      : '';

    setReportData(prev => ({
      ...prev,
      parentName: parentData?.name || '',
      parentEmail: parentData?.email || '',
      childName: childData?.name || '',
      childAge: childData?.age || null,
      childGender: childData?.gender || null,
      logopedistName: logopedistName,
    }));
  }, [childData, parentData, logopedistProfile]);

  // Handle session selection
  const handleSessionChange = (sessionId: string) => {
    const selectedSession = testSessions.find(s => s.id === sessionId);
    setReportData(prev => ({
      ...prev,
      selectedSessionId: sessionId,
      testDate: selectedSession?.formattedDate || null,
    }));
  };

  const handleReportFieldChange = (field: 'anamneza' | 'ugotovitve' | 'predlogVaj' | 'opombe', value: string) => {
    setReportData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // Browser close/refresh warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const hasReportContent = () => {
    return reportData.anamneza.trim() || reportData.ugotovitve.trim() || 
           reportData.predlogVaj.trim() || reportData.opombe.trim();
  };

  const handleViewDocument = async (file: StorageFile) => {
    const url = await getFileUrl(file.path);
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Napaka pri odpiranju dokumenta');
    }
  };

  const handleDownloadDocument = async (file: StorageFile) => {
    const url = await getFileUrl(file.path);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('Napaka pri prenosu dokumenta');
    }
  };

  const handleSaveReport = async () => {
    if (!hasReportContent()) {
      toast.error('Vnesite vsebino poročila');
      return;
    }

    setIsSaving(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `porocilo-${timestamp}.txt`;
      const filePath = `${parentId}/${childId}/Porocila/${fileName}`;

      const fullReportText = generateReportText(reportData);
      const blob = new Blob([fullReportText], { type: 'text/plain' });
      const { error: uploadError } = await supabase.storage
        .from('uporabniski-profili')
        .upload(filePath, blob, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      toast.success('Poročilo shranjeno');
      setHasUnsavedChanges(false);
      // Clear only editable fields
      setReportData(prev => ({
        ...prev,
        anamneza: '',
        ugotovitve: '',
        predlogVaj: '',
        opombe: '',
      }));
      await refetchReports();
    } catch (err) {
      console.error('Error saving report:', err);
      toast.error('Napaka pri shranjevanju poročila');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!hasReportContent()) {
      toast.error('Vnesite vsebino poročila pred generiranjem PDF');
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const pdfBlob = await generateReportPdf(reportData);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeChildName = (childData?.name || 'otrok').replace(/\s+/g, '-');
      const fileName = `porocilo-${safeChildName}-${timestamp}.pdf`;
      const filePath = `${parentId}/${childId}/Generirana-porocila/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uporabniski-profili')
        .upload(filePath, pdfBlob, { contentType: 'application/pdf', upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      toast.success('PDF poročilo generirano in shranjeno');
      setHasUnsavedChanges(false);
      // Clear editable fields
      setReportData(prev => ({
        ...prev,
        anamneza: '',
        ugotovitve: '',
        predlogVaj: '',
        opombe: '',
      }));
      await refetchGeneratedReports();
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Napaka pri generiranju PDF poročila');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDeleteGeneratedReport = async (file: StorageFile) => {
    try {
      const { error } = await supabase.storage
        .from('uporabniski-profili')
        .remove([file.path]);
      
      if (error) throw error;
      
      toast.success('Poročilo izbrisano');
      await refetchGeneratedReports();
    } catch (err) {
      console.error('Error deleting report:', err);
      toast.error('Napaka pri brisanju poročila');
    }
  };

  const handleUploadReport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${parentId}/${childId}/Porocila/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uporabniski-profili')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      toast.success('Dokument naložen');
      await refetchReports();
    } catch (err) {
      console.error('Error uploading report:', err);
      toast.error('Napaka pri nalaganju dokumenta');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditReport = async (file: StorageFile) => {
    const url = await getFileUrl(file.path);
    if (!url) {
      toast.error('Napaka pri nalaganju poročila');
      return;
    }
    
    try {
      const response = await fetch(url);
      const text = await response.text();
      
      // Parse the saved report and extract editable fields
      const anamenzaMatch = text.match(/ANAMNEZA:\s*([\s\S]*?)(?=═{5,}|UGOTOVITVE:|$)/);
      const ugotovitveMatch = text.match(/UGOTOVITVE:\s*([\s\S]*?)(?=═{5,}|PREDLOG ZA VAJE:|$)/);
      const predlogMatch = text.match(/PREDLOG ZA VAJE:\s*([\s\S]*?)(?=═{5,}|OPOMBE:|$)/);
      const opombeMatch = text.match(/OPOMBE:\s*([\s\S]*?)(?=═{5,}|Poročilo izdelal|$)/);

      setReportData(prev => ({
        ...prev,
        anamneza: anamenzaMatch?.[1]?.trim().replace('(ni vnosa)', '') || '',
        ugotovitve: ugotovitveMatch?.[1]?.trim().replace('(ni vnosa)', '') || '',
        predlogVaj: predlogMatch?.[1]?.trim().replace('(ni vnosa)', '') || '',
        opombe: opombeMatch?.[1]?.trim().replace('(ni vnosa)', '') || '',
      }));
      
      toast.success('Poročilo naloženo za urejanje');
    } catch (err) {
      console.error('Error loading report:', err);
      toast.error('Napaka pri branju poročila');
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-4 w-4 text-red-500" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="h-4 w-4 text-blue-500" />;
    if (['txt'].includes(ext || '')) return <File className="h-4 w-4 text-muted-foreground" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  if (!parentId || !childId) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-destructive">
          Manjkajoči parametri URL-ja
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with back navigation */}
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/admin/users')}
            className="mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Podrobnosti uporabnika</h1>
            <p className="text-muted-foreground">
              {childData ? (
                <>
                  Otrok: <span className="font-medium">{childData.name}</span>
                  {childData.age && <> • {childData.age} let</>}
                  {parentData?.name && <> • Starš: {parentData.name}</>}
                </>
              ) : (
                'Nalaganje...'
              )}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          <>
            {/* Two column layout: Left (Dokumenti + Preverjanje) | Right (Poročila aligned) */}
            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
              {/* Left Column: Dokumenti + Preverjanje izgovorjave */}
              <div className="flex flex-col gap-6">
                {/* Documents Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle>Dokumenti</CardTitle>
                    </div>
                    <CardDescription>
                      Naloženi dokumenti starša
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {documents.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4">
                        Ni naloženih dokumentov
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {documents.map((doc, index) => {
                          const isExpanded = expandedDocId === doc.path;
                          return (
                            <div 
                              key={index}
                              className="border rounded-lg overflow-hidden"
                            >
                              <div 
                                className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {getFileIcon(doc.name)}
                                  <span className="text-sm font-medium truncate">{doc.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => toggleDocumentPreview(doc.path)}
                                    title={isExpanded ? "Zapri predogled" : "Odpri predogled"}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDownloadDocument(doc)}
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
                                        fileName={doc.name}
                                        getSignedUrl={() => getFileUrl(doc.path)}
                                        onDownload={() => handleDownloadDocument(doc)}
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
                  </CardContent>
                </Card>

                {/* Speech Recordings Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Mic className="h-5 w-5 text-primary" />
                      <CardTitle>Preverjanje izgovorjave</CardTitle>
                    </div>
                    <CardDescription>
                      Posnetki artikulacijskega testa po sejah
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recordings.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4">
                        Ni posnetkov preverjanja izgovorjave
                      </p>
                    ) : (
                      <Accordion type="single" collapsible className="w-full">
                        {recordings.map((session, sessionIndex) => (
                          <AccordionItem key={sessionIndex} value={session.sessionName}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Play className="h-4 w-4 text-muted-foreground" />
                                <span>{session.sessionName}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({session.recordings.length} posnetkov)
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {session.recordings.map((recording, recIndex) => (
                                  <AudioPlayer 
                                    key={recIndex}
                                    recording={recording}
                                    getFileUrl={getFileUrl}
                                  />
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Reports Section - height aligned with left column */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <CardTitle>Poročila</CardTitle>
                  </div>
                  <CardDescription>
                    Poročilo za otroka <span className="font-semibold">{childData?.name || 'Neznano'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  {/* Structured report template editor */}
                  <ReportTemplateEditor
                    data={reportData}
                    testSessions={testSessions}
                    onFieldChange={handleReportFieldChange}
                    onSessionChange={handleSessionChange}
                  />
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={handleSaveReport}
                      disabled={isSaving || !hasReportContent()}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-1" />
                      )}
                      Shrani
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-1" />
                      )}
                      Naloži dokument
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-dragon-green hover:bg-dragon-green/90"
                      onClick={handleGeneratePdf}
                      disabled={isGeneratingPdf || !hasReportContent()}
                    >
                      {isGeneratingPdf ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1" />
                      )}
                      Generiraj
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleUploadReport}
                    />
                  </div>

                  {/* List of saved draft reports */}
                  {reports.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Shranjena poročila
                      </p>
                      <div className="space-y-2">
                        {reports.map((report, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {getFileIcon(report.name)}
                              <span className="text-sm truncate">{report.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {report.name.endsWith('.txt') && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditReport(report)}
                                  title="Uredi poročilo"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewDocument(report)}
                                title="Odpri v novem oknu"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadDocument(report)}
                                title="Prenesi"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* List of generated PDF reports */}
                  {generatedReports.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Generirana poročila
                      </p>
                      <div className="space-y-2">
                        {generatedReports.map((report, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-lg bg-dragon-green/5"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-red-500" />
                              <span className="text-sm truncate">{report.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewDocument(report)}
                                title="Odpri v novem oknu"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadDocument(report)}
                                title="Prenesi"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteGeneratedReport(report)}
                                title="Izbriši"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// Audio player component for recordings
function AudioPlayer({ 
  recording, 
  getFileUrl 
}: { 
  recording: StorageFile; 
  getFileUrl: (path: string) => Promise<string | null>;
}) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadAudio = async () => {
    if (audioUrl) return; // Already loaded
    
    setIsLoading(true);
    const url = await getFileUrl(recording.path);
    setAudioUrl(url);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{recording.name}</p>
      </div>
      {!audioUrl ? (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLoadAudio}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" /> Predvajaj
            </>
          )}
        </Button>
      ) : (
        <audio controls className="h-8 max-w-[200px]">
          <source src={audioUrl} type="audio/webm" />
          Vaš brskalnik ne podpira predvajanja zvoka.
        </audio>
      )}
    </div>
  );
}
