-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the check-old-pending-tests function to run daily at 9:00 AM
SELECT cron.schedule(
  'check-old-pending-tests-daily',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://ecmtctwovkheohqwahvt.supabase.co/functions/v1/check-old-pending-tests',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbXRjdHdvdmtoZW9ocXdhaHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzMyMjMsImV4cCI6MjA2MDIwOTIyM30.Re8dNeVSGlD461sR19MnNEKQr65euPUsNATJVg9UgZI"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);