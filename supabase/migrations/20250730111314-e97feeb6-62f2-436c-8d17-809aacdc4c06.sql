-- Create appointments table for donation scheduling
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for donor access
CREATE POLICY "Donors can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = donor_id);

CREATE POLICY "Donors can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = donor_id);

CREATE POLICY "Donors can delete their own appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() = donor_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();