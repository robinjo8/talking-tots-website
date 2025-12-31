-- Create table for storing articulation test results
CREATE TABLE public.articulation_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.articulation_test_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their children's test results
CREATE POLICY "Users can view their children's test results"
  ON public.articulation_test_results
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = articulation_test_results.child_id 
      AND children.parent_id = auth.uid()
    )
  );

-- Policy: Users can insert test results for their children
CREATE POLICY "Users can insert test results for their children"
  ON public.articulation_test_results
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = articulation_test_results.child_id 
      AND children.parent_id = auth.uid()
    )
  );

-- Policy: Users can delete test results for their children (for reset functionality)
CREATE POLICY "Users can delete test results for their children"
  ON public.articulation_test_results
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = articulation_test_results.child_id 
      AND children.parent_id = auth.uid()
    )
  );