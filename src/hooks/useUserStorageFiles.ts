import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StorageFile {
  name: string;
  path: string;
  size?: number;
  createdAt?: string;
}

export interface SessionRecordings {
  sessionName: string;
  sessionPath: string;
  recordings: StorageFile[];
}

interface UseUserStorageFilesResult {
  documents: StorageFile[];
  recordings: SessionRecordings[];
  reports: StorageFile[];
  generatedReports: StorageFile[];
  isLoading: boolean;
  error: string | null;
  getFileUrl: (path: string) => Promise<string | null>;
  refetchReports: () => Promise<void>;
  refetchGeneratedReports: () => Promise<void>;
}

export function useUserStorageFiles(parentId: string, childId: string): UseUserStorageFilesResult {
  const [documents, setDocuments] = useState<StorageFile[]>([]);
  const [recordings, setRecordings] = useState<SessionRecordings[]>([]);
  const [reports, setReports] = useState<StorageFile[]>([]);
  const [generatedReports, setGeneratedReports] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const basePath = `${parentId}/${childId}`;

  const fetchDocuments = useCallback(async () => {
    try {
      const { data, error: listError } = await supabase.storage
        .from('uporabniski-profili')
        .list(`${basePath}/Dokumenti`);

      if (listError) {
        console.error('Error fetching documents:', listError);
        return [];
      }

      return (data || [])
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => ({
          name: file.name,
          path: `${basePath}/Dokumenti/${file.name}`,
          size: file.metadata?.size,
          createdAt: file.created_at,
        }));
    } catch (err) {
      console.error('Error in fetchDocuments:', err);
      return [];
    }
  }, [basePath]);

  const fetchRecordings = useCallback(async () => {
    try {
      // First, list all sessions in the Preverjanje-izgovorjave folder
      const { data: sessions, error: sessionsError } = await supabase.storage
        .from('uporabniski-profili')
        .list(`${basePath}/Preverjanje-izgovorjave`);

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return [];
      }

      const sessionRecordings: SessionRecordings[] = [];

      // For each session folder, fetch the recordings
      for (const session of sessions || []) {
        if (session.name === '.emptyFolderPlaceholder') continue;

        const { data: files, error: filesError } = await supabase.storage
          .from('uporabniski-profili')
          .list(`${basePath}/Preverjanje-izgovorjave/${session.name}`);

        if (filesError) {
          console.error(`Error fetching recordings for session ${session.name}:`, filesError);
          continue;
        }

        const recs = (files || [])
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map(file => ({
            name: file.name,
            path: `${basePath}/Preverjanje-izgovorjave/${session.name}/${file.name}`,
            size: file.metadata?.size,
            createdAt: file.created_at,
          }));

        if (recs.length > 0) {
          sessionRecordings.push({
            sessionName: session.name,
            sessionPath: `${basePath}/Preverjanje-izgovorjave/${session.name}`,
            recordings: recs,
          });
        }
      }

      return sessionRecordings;
    } catch (err) {
      console.error('Error in fetchRecordings:', err);
      return [];
    }
  }, [basePath]);

  const fetchReports = useCallback(async () => {
    try {
      const { data, error: listError } = await supabase.storage
        .from('uporabniski-profili')
        .list(`${basePath}/Porocila`);

      if (listError) {
        console.error('Error fetching reports:', listError);
        return [];
      }

      return (data || [])
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => ({
          name: file.name,
          path: `${basePath}/Porocila/${file.name}`,
          size: file.metadata?.size,
          createdAt: file.created_at,
        }));
    } catch (err) {
      console.error('Error in fetchReports:', err);
      return [];
    }
  }, [basePath]);

  const fetchGeneratedReports = useCallback(async () => {
    try {
      const { data, error: listError } = await supabase.storage
        .from('uporabniski-profili')
        .list(`${basePath}/Generirana-porocila`);

      if (listError) {
        console.error('Error fetching generated reports:', listError);
        return [];
      }

      return (data || [])
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => ({
          name: file.name,
          path: `${basePath}/Generirana-porocila/${file.name}`,
          size: file.metadata?.size,
          createdAt: file.created_at,
        }));
    } catch (err) {
      console.error('Error in fetchGeneratedReports:', err);
      return [];
    }
  }, [basePath]);

  const refetchReports = useCallback(async () => {
    const reps = await fetchReports();
    setReports(reps);
  }, [fetchReports]);

  const refetchGeneratedReports = useCallback(async () => {
    const genReps = await fetchGeneratedReports();
    setGeneratedReports(genReps);
  }, [fetchGeneratedReports]);

  useEffect(() => {
    async function fetchAllFiles() {
      setIsLoading(true);
      setError(null);

      try {
        const [docs, recs, reps, genReps] = await Promise.all([
          fetchDocuments(),
          fetchRecordings(),
          fetchReports(),
          fetchGeneratedReports(),
        ]);

        setDocuments(docs);
        setRecordings(recs);
        setReports(reps);
        setGeneratedReports(genReps);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Napaka pri nalaganju datotek');
      } finally {
        setIsLoading(false);
      }
    }

    if (parentId && childId) {
      fetchAllFiles();
    }
  }, [parentId, childId, fetchDocuments, fetchRecordings, fetchReports, fetchGeneratedReports]);

  const getFileUrl = useCallback(async (path: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('uporabniski-profili')
        .createSignedUrl(path, 3600, { download: false }); // 1 hour expiry, inline display

      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }

      return data?.signedUrl || null;
    } catch (err) {
      console.error('Error in getFileUrl:', err);
      return null;
    }
  }, []);

  return {
    documents,
    recordings,
    reports,
    generatedReports,
    isLoading,
    error,
    getFileUrl,
    refetchReports,
    refetchGeneratedReports,
  };
}
