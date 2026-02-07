-- Add start_date and end_date columns to child_monthly_plans
ALTER TABLE public.child_monthly_plans 
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;