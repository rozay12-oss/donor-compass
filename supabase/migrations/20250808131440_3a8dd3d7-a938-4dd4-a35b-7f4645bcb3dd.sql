-- Add RLS policies for emergency requests
CREATE POLICY "Authenticated users can create emergency requests" 
ON public.emergency_requests 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update emergency requests" 
ON public.emergency_requests 
FOR UPDATE 
TO authenticated
USING (true);

-- Enable realtime for emergency requests
ALTER TABLE public.emergency_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_requests;