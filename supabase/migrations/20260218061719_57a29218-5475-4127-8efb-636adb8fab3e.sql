CREATE POLICY "Parents can update their children sessions"
  ON articulation_test_sessions
  FOR UPDATE
  USING (parent_id = auth.uid())
  WITH CHECK (parent_id = auth.uid());