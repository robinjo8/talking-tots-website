import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UploadStatus = 'idle' | 'uploading' | 'scanning' | 'success' | 'error';

interface ChildDocument {
  id: string;
  child_id: string;
  uploaded_by: string;
  document_type: string;
  original_filename: string | null;
  storage_path: string;
  file_size: number | null;
  virus_scan_status: string;
  virus_scan_result: Record<string, any> | null;
  created_at: string;
}

interface UseChildDocumentsResult {
  uploadDocument: (
    file: File,
    childId: string,
    documentType: 'pdf_attachment' | 'speech_description' | 'questionnaire'
  ) => Promise<ChildDocument | null>;
  uploadStatus: UploadStatus;
  errorMessage: string | null;
  resetStatus: () => void;
  fetchDocuments: (childId: string) => Promise<ChildDocument[]>;
  deleteDocument: (documentId: string, storagePath: string) => Promise<boolean>;
  getDocumentUrl: (storagePath: string) => Promise<string | null>;
}

export function useChildDocuments(): UseChildDocumentsResult {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const uploadDocument = useCallback(async (
    file: File,
    childId: string,
    documentType: 'pdf_attachment' | 'speech_description' | 'questionnaire'
  ): Promise<ChildDocument | null> => {
    try {
      setUploadStatus('uploading');
      setErrorMessage(null);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Niste prijavljeni. Prosimo, prijavite se znova.');
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('childId', childId);
      formData.append('documentType', documentType);
      formData.append('originalFilename', file.name);

      // Call edge function
      const response = await fetch(
        `https://ecmtctwovkheohqwahvt.supabase.co/functions/v1/upload-child-document`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Napaka pri nalaganju dokumenta');
      }

      setUploadStatus('success');
      toast.success('Dokument uspešno naložen');
      
      return result.document as ChildDocument;

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Napaka pri nalaganju');
      toast.error(error.message || 'Napaka pri nalaganju dokumenta');
      return null;
    }
  }, []);

  const resetStatus = useCallback(() => {
    setUploadStatus('idle');
    setErrorMessage(null);
  }, []);

  const fetchDocuments = useCallback(async (childId: string): Promise<ChildDocument[]> => {
    try {
      const { data, error } = await supabase
        .from('child_documents')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []) as ChildDocument[];
    } catch (error: any) {
      console.error('Fetch documents error:', error);
      toast.error('Napaka pri pridobivanju dokumentov');
      return [];
    }
  }, []);

  const deleteDocument = useCallback(async (
    documentId: string, 
    storagePath: string
  ): Promise<boolean> => {
    try {
      // Delete from storage first - using unified bucket
      const { error: storageError } = await supabase.storage
        .from('uporabniski-profili')
        .remove([storagePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Continue to delete database record even if storage fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('child_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast.success('Dokument uspešno izbrisan');
      return true;
    } catch (error: any) {
      console.error('Delete document error:', error);
      toast.error('Napaka pri brisanju dokumenta');
      return false;
    }
  }, []);

  const getDocumentUrl = useCallback(async (storagePath: string): Promise<string | null> => {
    try {
      // Using unified bucket for signed URLs
      const { data, error } = await supabase.storage
        .from('uporabniski-profili')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      if (error) throw error;
      
      return data.signedUrl;
    } catch (error: any) {
      console.error('Get document URL error:', error);
      toast.error('Napaka pri pridobivanju povezave do dokumenta');
      return null;
    }
  }, []);

  return {
    uploadDocument,
    uploadStatus,
    errorMessage,
    resetStatus,
    fetchDocuments,
    deleteDocument,
    getDocumentUrl,
  };
}
