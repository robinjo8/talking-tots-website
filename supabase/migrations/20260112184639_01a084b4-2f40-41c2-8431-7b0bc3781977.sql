-- Posodobi funkcijo audit_children_changes, da ne logira DELETE operacij
CREATE OR REPLACE FUNCTION public.audit_children_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ne logiraj DELETE operacij - otrok se tako ali tako briše
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  -- Log all non-parent modifications for INSERT/UPDATE
  IF auth.uid() IS DISTINCT FROM (SELECT parent_id FROM public.children WHERE id = NEW.id) THEN
    PERFORM public.log_child_access(
      NEW.id,
      TG_OP,
      'Admin modification'
    );
  END IF;
  
  RETURN NEW;
END;
$$;