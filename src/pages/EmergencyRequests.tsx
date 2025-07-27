import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, AlertTriangle, Clock, Phone, Siren } from "lucide-react";
import { Link } from "react-router-dom";

const EmergencyRequests = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    hospitalName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    patientName: "",
    bloodType: "",
    unitsNeeded: "",
    urgencyLevel: "",
    medicalCondition: "",
    notes: "",
  });

  const activeEmergencies = [
    {
      id: "ER-001",
      hospitalName: "City General Hospital",
      bloodType: "O-",
      units: 8,
      timeRequested: "2024-01-15T14:30:00Z",
      urgencyLevel: "critical",
      contact: "+1-555-0123",
      status: "active",
    },
    {
      id: "ER-002",
      hospitalName: "Metro Medical Center",
      bloodType: "AB+",
      units: 3,
      timeRequested: "2024-01-15T13:45:00Z",
      urgencyLevel: "high",
      contact: "+1-555-0456",
      status: "active",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Emergency Request Submitted",
      description: "Your emergency blood request has been submitted and prioritized for immediate processing.",
      variant: "default",
    });

    // Reset form
    setFormData({
      hospitalName: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      patientName: "",
      bloodType: "",
      unitsNeeded: "",
      urgencyLevel: "",
      medicalCondition: "",
      notes: "",
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-600/10 text-red-800 border-red-300 animate-pulse";
      case "high":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getTimeElapsed = (timeRequested: string) => {
    const now = new Date();
    const requested = new Date(timeRequested);
    const diffInMinutes = Math.floor((now.getTime() - requested.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header 
        userRole="hospital" 
        userName="Emergency Department" 
        onRoleChange={() => {}} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid gap-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Siren className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              Emergency Blood Requests
            </h1>
            <p className="text-muted-foreground text-lg">
              Submit and track critical blood requests with highest priority
            </p>
          </div>

          {/* Active Emergency Alerts */}
          <Card className="shadow-lg border-red-200 bg-red-50/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Active Emergency Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeEmergencies.length > 0 ? (
                <div className="space-y-4">
                  {activeEmergencies.map((emergency) => (
                    <div
                      key={emergency.id}
                      className="border border-red-200 rounded-lg p-4 bg-white/80"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-red-600">{emergency.id}</span>
                          <Badge 
                            variant="outline" 
                            className={`${getUrgencyColor(emergency.urgencyLevel)}`}
                          >
                            {emergency.urgencyLevel.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeElapsed(emergency.timeRequested)}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600">
                          <Phone className="h-4 w-4 mr-1" />
                          Call {emergency.contact}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Hospital:</span> {emergency.hospitalName}
                        </div>
                        <div>
                          <span className="font-medium">Blood Type:</span> 
                          <span className="ml-1 font-bold text-red-600">{emergency.bloodType}</span>
                        </div>
                        <div>
                          <span className="font-medium">Units Needed:</span> 
                          <span className="ml-1 font-bold text-red-600">{emergency.units}</span>
                        </div>
                        <div>
                          <span className="font-medium">Contact:</span> {emergency.contact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active emergency requests at this time.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Request Form */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Submit Emergency Blood Request
              </CardTitle>
              <p className="text-muted-foreground">
                Emergency requests are processed immediately and have the highest priority in our system.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Hospital Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name *</Label>
                    <Input
                      id="hospitalName"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Emergency Contact Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name/ID *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type Required *</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="unitsNeeded">Units Needed *</Label>
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
                    <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                    <Select
                      value={formData.urgencyLevel}
                      onValueChange={(value) => setFormData({ ...formData, urgencyLevel: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical (Life-threatening)</SelectItem>
                        <SelectItem value="high">High (Urgent surgery)</SelectItem>
                        <SelectItem value="medium">Medium (Planned procedure)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalCondition">Medical Condition/Procedure *</Label>
                  <Input
                    id="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })}
                    placeholder="e.g., Emergency surgery, trauma, etc."
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information that might be helpful..."
                    className="bg-background/50"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Submit Emergency Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmergencyRequests;