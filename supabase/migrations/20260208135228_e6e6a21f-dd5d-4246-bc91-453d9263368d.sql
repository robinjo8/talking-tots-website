
-- Create mfa_codes table for 2FA verification codes
CREATE TABLE public.mfa_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups by user_id
CREATE INDEX idx_mfa_codes_user_id ON public.mfa_codes (user_id);

-- Create index for cleanup of expired codes
CREATE INDEX idx_mfa_codes_expires_at ON public.mfa_codes (expires_at);

-- Enable Row Level Security
ALTER TABLE public.mfa_codes ENABLE ROW LEVEL SECURITY;

-- No RLS policies for regular users - table is only accessed via service_role from Edge Functions
-- This means anon/authenticated users cannot read/write this table at all
