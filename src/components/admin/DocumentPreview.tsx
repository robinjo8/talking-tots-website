import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Loader2, Download, FileWarning, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
  
  // PDF.js state
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfError, setPdfError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const ext = fileName.split('.').pop()?.toLowerCase();
  const isPdf = ext === 'pdf';
  const isTxt = ext === 'txt';
  const isDocx = ['doc', 'docx'].includes(ext || '');

  // Measure container width for responsive PDF rendering
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 32); // Subtract padding
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      setError(null);
      setPdfError(false);

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setPdfError(true);
  };

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

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

  // PDF preview with PDF.js
  if (isPdf && signedUrl) {
    if (pdfError) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <FileWarning className="h-8 w-8 mb-2" />
          <p className="text-sm mb-3">Napaka pri nalaganju PDF dokumenta.</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(signedUrl, '_blank')}>
              Odpri v novem zavihku
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-1" />
              Prenesi
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div ref={containerRef} className="w-full">
        {/* PDF Controls */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[80px] text-center">
              {pageNumber} / {numPages || '...'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 2.0}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" />
            Prenesi
          </Button>
        </div>

        {/* PDF Viewer */}
        <div className="border rounded-lg bg-muted/20 overflow-auto max-h-[500px] flex justify-center p-4">
          <Document
            file={signedUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Nalaganje PDF...</span>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={containerWidth * scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
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
