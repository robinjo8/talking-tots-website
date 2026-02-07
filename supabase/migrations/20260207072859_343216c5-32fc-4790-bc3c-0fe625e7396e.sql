-- Add play_number column to support multiple completions per activity
ALTER TABLE public.plan_activity_completions 
ADD COLUMN play_number INTEGER NOT NULL DEFAULT 1;

-- Drop old unique constraint that only allows 1 completion per activity
ALTER TABLE public.plan_activity_completions 
DROP CONSTRAINT plan_activity_completions_plan_id_child_id_day_date_activit_key;

-- Add new unique constraint that allows multiple plays (up to play_number)
ALTER TABLE public.plan_activity_completions 
ADD CONSTRAINT plan_activity_completions_unique_play 
UNIQUE (plan_id, child_id, day_date, activity_index, play_number);

-- Update activity_index check to allow up to index 4 (5 activities: 0-4)
-- Already exists: CHECK (activity_index >= 0 AND activity_index <= 4)