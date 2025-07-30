import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, Clock, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const ScheduleDonation = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !time) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          donor_id: user.id,
          appointment_date: format(date, 'yyyy-MM-dd'),
          appointment_time: time,
          notes: notes || null
        });

      if (error) throw error;

      toast({
        title: "Appointment Scheduled",
        description: `Your donation appointment is scheduled for ${format(date, 'PPP')} at ${time}`,
      });

      // Reset form
      setDate(undefined);
      setTime('');
      setNotes('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Schedule Donation</h1>
          <p className="text-muted-foreground">Book your next blood donation appointment</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-medical-info" />
              <span>Donation Appointment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select a time slot" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>

              <div className="bg-medical-success/10 p-4 rounded-lg">
                <h3 className="font-semibold text-medical-success mb-2">Before Your Donation:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Eat a healthy meal and stay hydrated</li>
                  <li>• Get a good night's sleep</li>
                  <li>• Bring a valid ID</li>
                  <li>• Avoid alcohol 24 hours before donation</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-medical-success hover:bg-medical-success/90"
                disabled={!date || !time || isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};