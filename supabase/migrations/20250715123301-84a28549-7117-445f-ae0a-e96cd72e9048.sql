-- Add missing fields to children table for complete registration data
ALTER TABLE public.children 
ADD COLUMN birth_date DATE,
ADD COLUMN speech_difficulties TEXT[],
ADD COLUMN speech_difficulties_description TEXT,
ADD COLUMN speech_development JSONB;

-- Add trigger for automatic updated_at timestamp
ALTER TABLE public.children 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_children_updated_at
    BEFORE UPDATE ON public.children
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();