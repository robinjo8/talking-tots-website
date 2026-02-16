-- Drop old constraint and add updated one with 'super_admin'
ALTER TABLE public.audit_logs DROP CONSTRAINT audit_logs_actor_type_check;

ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_actor_type_check 
  CHECK (actor_type = ANY (ARRAY['parent'::text, 'logopedist'::text, 'admin'::text, 'super_admin'::text]));
