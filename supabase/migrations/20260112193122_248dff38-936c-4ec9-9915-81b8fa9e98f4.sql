-- Update the valid_document_type constraint to include 'questionnaire'
ALTER TABLE public.child_documents DROP CONSTRAINT IF EXISTS valid_document_type;

ALTER TABLE public.child_documents ADD CONSTRAINT valid_document_type 
CHECK (document_type = ANY (ARRAY['pdf_attachment', 'speech_description', 'questionnaire']));