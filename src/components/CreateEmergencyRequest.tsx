import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreateEmergencyRequestProps {
  onRequestCreated?: () => void;
}

export const CreateEmergencyRequest: React.FC<CreateEmergencyRequestProps> = ({ onRequestCreated }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    blood_type: '',
    units: '',
    location: '',
    contact: '',
    urgency: '',
    notes: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Critical', 'High', 'Medium', 'Low'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name || !formData.blood_type || !formData.units || !formData.location || !formData.contact || !formData.urgency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('emergency_requests')
        .insert({
          name: formData.name,
          blood_type: formData.blood_type,
          units: parseInt(formData.units),
          location: formData.location,
          contact: formData.contact,
          urgency: formData.urgency,
          notes: formData.notes || null
        });

      if (error) throw error;

      toast({
        title: "Emergency Request Submitted",
        description: "Your emergency blood request has been submitted and broadcasted to all users.",
      });

      // Reset form
      setFormData({
        name: '',
        blood_type: '',
        units: '',
        location: '',
        contact: '',
        urgency: '',
        notes: ''
      });

      setIsOpen(false);
      onRequestCreated?.();

    } catch (error: any) {
      console.error('Error creating emergency request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit emergency request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-destructive hover:bg-destructive/90"
        size="sm"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Create Emergency Request
      </Button>
    );
  }

  return (
    <Card className="border-l-4 border-l-destructive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Emergency Blood Request
            </CardTitle>
            <CardDescription>
              Submit an urgent blood request that will be immediately broadcasted to all users
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Patient Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter patient name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_type">Blood Type *</Label>
              <Select value={formData.blood_type} onValueChange={(value) => handleInputChange('blood_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="units">Units Needed *</Label>
              <Input
                id="units"
                type="number"
                min="1"
                value={formData.units}
                onChange={(e) => handleInputChange('units', e.target.value)}
                placeholder="Number of units"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Hospital/Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Hospital name or address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Emergency Contact *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder="Phone number or email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information about the emergency..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Emergency Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};