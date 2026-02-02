-- Add session progress tracking columns to articulation_test_sessions
ALTER TABLE public.articulation_test_sessions 
ADD COLUMN IF NOT EXISTS current_word_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_words integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS is_completed boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.articulation_test_sessions.current_word_index IS 'Tracks progress within the session (0-59 for 60 words)';
COMMENT ON COLUMN public.articulation_test_sessions.total_words IS 'Total number of words in the test (default 60)';
COMMENT ON COLUMN public.articulation_test_sessions.is_completed IS 'Whether all words have been recorded and session is locked';