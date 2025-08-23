-- Simplify database: Remove unnecessary tables for streamlined version
DROP TABLE IF EXISTS emergency_requests CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;

-- Update profiles table to only support 'donor' and 'admin' roles
CREATE OR REPLACE FUNCTION validate_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role NOT IN ('donor', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Only "donor" and "admin" are allowed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate roles
DROP TRIGGER IF EXISTS validate_role_trigger ON profiles;
CREATE TRIGGER validate_role_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_role();