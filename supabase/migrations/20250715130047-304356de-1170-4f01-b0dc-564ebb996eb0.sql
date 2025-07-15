-- First, let's update the existing child (Tian) with complete data
UPDATE public.children 
SET 
    gender = 'other',
    speech_difficulties = ARRAY['vocabulary', 'structure', 'articulation']
WHERE 
    name = 'Tian' 
    AND parent_id = 'f3be4369-c486-4030-9dbf-39b51b0107a2';

-- Insert the second child (Žak) that exists in metadata but not in database
INSERT INTO public.children (parent_id, name, age, avatar_url, gender, speech_difficulties)
VALUES (
    'f3be4369-c486-4030-9dbf-39b51b0107a2',
    'Žak',
    6,
    '15',
    'M',
    ARRAY['structure', 'word_usage', 'phonological']
);