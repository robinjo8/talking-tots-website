-- Create storage bucket for child documents
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('child-documents', 'child-documents', false, 5242880)
ON CONFLICT (id) DO NOTHING;

-- RLS: Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'child-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS: Users can read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'child-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS: Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'child-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create child_documents table for tracking uploaded files
CREATE TABLE IF NOT EXISTS public.child_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID NOT NULL,
  document_type TEXT NOT NULL,
  original_filename TEXT,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  virus_scan_status TEXT DEFAULT 'pending',
  virus_scan_result JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_document_type CHECK (document_type IN ('pdf_attachment', 'speech_description')),
  CONSTRAINT valid_virus_scan_status CHECK (virus_scan_status IN ('pending', 'scanning', 'clean', 'infected', 'error'))
);

-- Enable RLS on child_documents
ALTER TABLE public.child_documents ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view documents of their own children
CREATE POLICY "Users can view own child documents"
ON public.child_documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.children
    WHERE id = child_documents.child_id
    AND parent_id = auth.uid()
  )
);

-- RLS: Users can insert documents for their own children
CREATE POLICY "Users can insert own child documents"
ON public.child_documents
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.children
    WHERE id = child_documents.child_id
    AND parent_id = auth.uid()
  )
);

-- RLS: Users can delete documents of their own children
CREATE POLICY "Users can delete own child documents"
ON public.child_documents
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.children
    WHERE id = child_documents.child_id
    AND parent_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_child_documents_child_id ON public.child_documents(child_id);
CREATE INDEX IF NOT EXISTS idx_child_documents_uploaded_by ON public.child_documents(uploaded_by);