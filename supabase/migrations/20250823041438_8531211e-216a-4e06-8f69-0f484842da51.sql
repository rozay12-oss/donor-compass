-- Fix security warnings by updating function search paths
CREATE OR REPLACE FUNCTION public.validate_user_role()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role NOT IN ('donor', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Only "donor" and "admin" are allowed.';
  END IF;
  RETURN NEW;
END;
$$;

-- Update the handle_new_user function to fix search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'donor'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;