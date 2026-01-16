import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Download, FileWarning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentPreviewProps {
  fileName: string;
  getSignedUrl: () => Promise<string | null>;
  onDownload: () => void;
}

export function DocumentPreview({ fileName, getSignedUrl, onDownload }: DocumentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ext = fileName.split('.').pop()?.toLowerCase();
  const isPdf = ext === 'pdf';
  const isTxt = ext === 'txt';
  const isDocx = ['doc', 'docx'].includes(ext || '');

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      setError(null);

      try {
        const url = await getSignedUrl();
        if (!url) {
          setError('Napaka pri pridobivanju URL-ja dokumenta');
          setIsLoading(false);
          return;
        }

        setSignedUrl(url);

        // For TXT files, fetch the content
        if (isTxt) {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Napaka pri nalaganju vsebine');
            const text = await response.text();
            setTextContent(text);
          } catch (err) {
            console.error('Error fetching text content:', err);
            setError('Napaka pri nalaganju besedila');
          }
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Napaka pri nalaganju dokumenta');
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [getSignedUrl, isTxt]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Nalaganje predogleda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-destructive">
        <FileWarning className="h-8 w-8 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // PDF preview
  if (isPdf && signedUrl) {
    return (
      <div className="w-full">
        <iframe
          src={signedUrl}
          className="w-full h-[500px] rounded-lg border bg-white"
          title={`Predogled: ${fileName}`}
        />
      </div>
    );
  }

  // TXT preview
  if (isTxt && textContent !== null) {
    return (
      <div className="w-full max-h-[400px] overflow-auto rounded-lg border bg-muted/20 p-4">
        <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
          {textContent}
        </pre>
      </div>
    );
  }

  // DOC/DOCX - cannot preview directly
  if (isDocx) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <FileWarning className="h-8 w-8 mb-2" />
        <p className="text-sm mb-3">
          Neposredni predogled Word dokumentov ni mogoč.
        </p>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4 mr-1" />
          Prenesi dokument
        </Button>
      </div>
    );
  }

  // Fallback for unknown types
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <FileWarning className="h-8 w-8 mb-2" />
      <p className="text-sm mb-3">
        Predogled za to vrsto datoteke ni na voljo.
      </p>
      <Button variant="outline" size="sm" onClick={onDownload}>
        <Download className="h-4 w-4 mr-1" />
        Prenesi dokument
      </Button>
    </div>
  );
}
