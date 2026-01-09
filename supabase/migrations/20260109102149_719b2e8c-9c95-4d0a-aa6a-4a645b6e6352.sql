-- Create a trigger function to automatically create logopedist profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_logopedist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile if user has is_logopedist metadata
  IF (NEW.raw_user_meta_data->>'is_logopedist')::boolean = true THEN
    INSERT INTO public.logopedist_profiles (
      user_id,
      organization_id,
      first_name,
      last_name
    ) VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'organization_id')::uuid,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    
    -- Also add logopedist role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'logopedist')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new logopedist users
DROP TRIGGER IF EXISTS on_auth_user_created_logopedist ON auth.users;
CREATE TRIGGER on_auth_user_created_logopedist
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_logopedist();