-- Make child_id nullable for logopedist sessions
-- This allows articulation_test_sessions to be created for logopedist-managed children
-- without requiring a reference to the 'children' table (parent-managed children)

ALTER TABLE articulation_test_sessions 
ALTER COLUMN child_id DROP NOT NULL;