import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, MapPin, Phone, AlertTriangle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const BloodRequest = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    unitsNeeded: "",
    hospitalName: "",
    doctorName: "",
    contactNumber: "",
    emergencyContact: "",
    medicalCondition: "",
    urgencyLevel: "",
    expectedDate: "",
    additionalNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a blood request",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create blood request in database
      const { error: requestError } = await supabase
        .from('blood_requests')
        .insert({
          user_id: user.id,
          blood_type: formData.bloodType,
          quantity: parseInt(formData.unitsNeeded),
          status: isEmergency ? 'urgent' : 'pending'
        });

      if (requestError) throw requestError;

      // If emergency, also create emergency request
      if (isEmergency) {
        const { error: emergencyError } = await supabase
          .from('emergency_requests')
          .insert({
            name: formData.patientName,
            blood_type: formData.bloodType,
            units: parseInt(formData.unitsNeeded),
            location: formData.hospitalName,
            contact: formData.contactNumber,
            urgency: formData.urgencyLevel,
            notes: `Medical Condition: ${formData.medicalCondition}. Doctor: ${formData.doctorName}. Emergency Contact: ${formData.emergencyContact}. ${formData.additionalNotes ? 'Additional Notes: ' + formData.additionalNotes : ''}`
          });

        if (emergencyError) throw emergencyError;
      }

      toast({
        title: isEmergency ? "Emergency Request Submitted" : "Blood Request Submitted",
        description: isEmergency 
          ? "Emergency alert sent to all nearby donors and blood banks" 
          : "Your request has been forwarded to available blood banks",
        variant: isEmergency ? "destructive" : "default",
      });

      // Reset form
      setFormData({
        patientName: "",
        bloodType: "",
        unitsNeeded: "",
        hospitalName: "",
        doctorName: "",
        contactNumber: "",
        emergencyContact: "",
        medicalCondition: "",
        urgencyLevel: "",
        expectedDate: "",
        additionalNotes: "",
      });
      setIsEmergency(false);
    } catch (error) {
      console.error('Error submitting blood request:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header 
        userRole="hospital" 
        userName="Dr. Smith" 
        onRoleChange={() => {}} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${
                isEmergency ? 'bg-destructive/10' : 'bg-primary/10'
              }`}>
                {isEmergency ? (
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                ) : (
                  <Clock className="h-8 w-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {isEmergency ? "Emergency Blood Request" : "Blood Request"}
              </CardTitle>
              <p className="text-muted-foreground">
                {isEmergency 
                  ? "Urgent request will be prioritized and sent immediately" 
                  : "Submit a request for blood units"}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  type="button"
                  variant={!isEmergency ? "default" : "outline"}
                  onClick={() => setIsEmergency(false)}
                  className="flex-1"
                >
                  Regular Request
                </Button>
                <Button
                  type="button"
                  variant={isEmergency ? "destructive" : "outline"}
                  onClick={() => setIsEmergency(true)}
                  className="flex-1"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency
                </Button>
              </div>

              {isEmergency && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    Emergency Priority
                  </div>
                  <p className="text-sm text-destructive/80">
                    This request will be marked as urgent and sent to all available donors and blood banks immediately.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type Required</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitsNeeded">Units Needed</Label>
                    <Input
                      id="unitsNeeded"
                      type="number"
                      min="1"
                      value={formData.unitsNeeded}
                      onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Urgency Level</Label>
                    <Select
                      value={formData.urgencyLevel}
                      onValueChange={(value) => setFormData({ ...formData, urgencyLevel: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within 1 week</SelectItem>
                        <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
                        <SelectItem value="high">High - Within 24 hours</SelectItem>
                        <SelectItem value="critical">Critical - Immediate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Hospital Name
                    </Label>
                    <Input
                      id="hospitalName"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Doctor in Charge</Label>
                    <Input
                      id="doctorName"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Number
                    </Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDate">Expected Date</Label>
                    <Input
                      id="expectedDate"
                      type="datetime-local"
                      value={formData.expectedDate}
                      onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    required
                    className="bg-background/50"
                    placeholder="Name and phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalCondition">Medical Condition</Label>
                  <Textarea
                    id="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })}
                    required
                    className="bg-background/50 min-h-[80px]"
                    placeholder="Brief description of the medical condition requiring blood transfusion"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    className="bg-background/50 min-h-[100px]"
                    placeholder="Any additional information or special requirements"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full text-white hover:opacity-90 transition-opacity ${
                    isEmergency 
                      ? 'bg-gradient-to-r from-destructive to-destructive/80' 
                      : 'bg-gradient-primary'
                  }`}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    isEmergency ? "Submit Emergency Request" : "Submit Blood Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BloodRequest;