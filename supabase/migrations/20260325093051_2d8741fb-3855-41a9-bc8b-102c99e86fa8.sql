SELECT cron.schedule(
  'check-test-reminders-daily',
  '0 8 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://ecmtctwovkheohqwahvt.supabase.co/functions/v1/check-test-reminders',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbXRjdHdvdmtoZW9ocXdhaHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzMyMjMsImV4cCI6MjA2MDIwOTIyM30.Re8dNeVSGlD461sR19MnNEKQr65euPUsNATJVg9UgZI"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);