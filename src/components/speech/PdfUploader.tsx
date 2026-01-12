import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, X, FileText, CheckCircle2, AlertCircle, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PdfUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  uploadStatus?: 'idle' | 'uploading' | 'scanning' | 'success' | 'error';
  errorMessage?: string;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]; // %PDF

async function validatePdfFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file extension
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Datoteka mora biti v PDF formatu (.pdf)' };
  }

  // Check MIME type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Neveljavna vrsta datoteke. Prosimo, izberite PDF datoteko.' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Datoteka je prevelika. Največja dovoljena velikost je 5MB.' };
  }

  // Check magic bytes
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const hasValidMagicBytes = 
    bytes[0] === PDF_MAGIC_BYTES[0] &&
    bytes[1] === PDF_MAGIC_BYTES[1] &&
    bytes[2] === PDF_MAGIC_BYTES[2] &&
    bytes[3] === PDF_MAGIC_BYTES[3];

  if (!hasValidMagicBytes) {
    return { valid: false, error: 'Datoteka ni veljavna PDF datoteka.' };
  }

  return { valid: true };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function PdfUploader({ 
  onFileSelect, 
  selectedFile, 
  uploadStatus = 'idle',
  errorMessage,
  disabled = false
}: PdfUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      onFileSelect(null);
      return;
    }

    const validation = await validatePdfFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-app-blue" />;
      case 'scanning':
        return <Shield className="h-4 w-4 animate-pulse text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-dragon-green" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-app-purple" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Nalaganje...';
      case 'scanning':
        return 'Varnostno preverjanje...';
      case 'success':
        return 'Naloženo in preverjeno';
      case 'error':
        return errorMessage || 'Napaka pri nalaganju';
      default:
        return formatFileSize(selectedFile?.size || 0);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {!selectedFile ? (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
            isDragOver 
              ? "border-app-purple bg-app-purple/5" 
              : "border-gray-300 hover:border-app-purple/50 hover:bg-gray-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-gray-100">
              <FileUp className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Dodajte priponko (neobvezno)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Samo PDF, največ 5MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(
          "border rounded-lg p-3 flex items-center gap-3",
          uploadStatus === 'error' 
            ? "border-destructive/50 bg-destructive/5" 
            : uploadStatus === 'success'
            ? "border-dragon-green/50 bg-dragon-green/5"
            : "border-gray-200 bg-gray-50"
        )}>
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {selectedFile.name}
            </p>
            <p className={cn(
              "text-xs",
              uploadStatus === 'error' ? "text-destructive" : "text-gray-500"
            )}>
              {getStatusText()}
            </p>
          </div>
          
          {uploadStatus !== 'uploading' && uploadStatus !== 'scanning' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Vse naložene datoteke so varnostno pregledane
      </p>
    </div>
  );
}
