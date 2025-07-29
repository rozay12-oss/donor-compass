-- Enable RLS on all public tables that don't have it
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

-- Add missing RLS policies for profiles table (UPDATE policy)
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Basic RLS policies for other tables
-- Alerts - only authenticated users can view
CREATE POLICY "Authenticated users can view alerts" 
ON public.alerts 
FOR SELECT 
TO authenticated
USING (true);

-- Blood inventory - only authenticated users can view
CREATE POLICY "Authenticated users can view blood inventory" 
ON public.blood_inventory 
FOR SELECT 
TO authenticated
USING (true);

-- Donors - only authenticated users can view
CREATE POLICY "Authenticated users can view donors" 
ON public.donors 
FOR SELECT 
TO authenticated
USING (true);

-- Emergency requests - only authenticated users can view
CREATE POLICY "Authenticated users can view emergency requests" 
ON public.emergency_requests 
FOR SELECT 
TO authenticated
USING (true);