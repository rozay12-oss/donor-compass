import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEligibilityChecker } from '@/hooks/useEligibilityChecker';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Calendar,
  FileText,
  Heart
} from 'lucide-react';

interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  nextEligibleDate?: Date;
  requiredDocuments?: string[];
}

export const EligibilityChecker = () => {
  const [activeTab, setActiveTab] = useState<'donation' | 'request' | 'appointment'>('donation');
  const [healthData, setHealthData] = useState({
    age: '',
    weight: '',
    lastDonationDate: '',
    medicalConditions: [] as string[],
    medications: [] as string[],
    recentSurgery: false,
    recentTattoo: false,
    recentTravel: false
  });
  const [urgencyLevel, setUrgencyLevel] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [result, setResult] = useState<EligibilityResult | null>(null);
  
  const { checkDonationEligibility, checkRequestEligibility, checkAppointmentEligibility, loading } = useEligibilityChecker();
  const { toast } = useToast();

  const handleDonationCheck = async () => {
    try {
      const eligibility = await checkDonationEligibility({
        age: healthData.age ? parseInt(healthData.age) : undefined,
        weight: healthData.weight ? parseFloat(healthData.weight) : undefined,
        lastDonationDate: healthData.lastDonationDate ? new Date(healthData.lastDonationDate) : undefined,
        medicalConditions: healthData.medicalConditions,
        medications: healthData.medications,
        recentSurgery: healthData.recentSurgery,
        recentTattoo: healthData.recentTattoo,
        recentTravel: healthData.recentTravel
      });
      
      setResult(eligibility);
      
      if (eligibility.isEligible) {
        toast({
          title: "Eligible to Donate!",
          description: "You meet all the requirements for blood donation.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check eligibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRequestCheck = async () => {
    try {
      const eligibility = await checkRequestEligibility(urgencyLevel);
      setResult(eligibility);
      
      if (eligibility.isEligible) {
        toast({
          title: "Eligible to Request!",
          description: "You can proceed with your blood request.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check eligibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAppointmentCheck = async () => {
    try {
      const eligibility = await checkAppointmentEligibility();
      setResult(eligibility);
      
      if (eligibility.isEligible) {
        toast({
          title: "Eligible to Schedule!",
          description: "You can schedule a donation appointment.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check eligibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addMedicalCondition = (condition: string) => {
    if (condition && !healthData.medicalConditions.includes(condition)) {
      setHealthData(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, condition]
      }));
    }
  };

  const addMedication = (medication: string) => {
    if (medication && !healthData.medications.includes(medication)) {
      setHealthData(prev => ({
        ...prev,
        medications: [...prev.medications, medication]
      }));
    }
  };

  const removeMedicalCondition = (condition: string) => {
    setHealthData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter(c => c !== condition)
    }));
  };

  const removeMedication = (medication: string) => {
    setHealthData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m !== medication)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-border">
        <button
          onClick={() => setActiveTab('donation')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === 'donation'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className="inline h-4 w-4 mr-2" />
          Donation Eligibility
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === 'request'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="inline h-4 w-4 mr-2" />
          Request Eligibility
        </button>
        <button
          onClick={() => setActiveTab('appointment')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === 'appointment'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="inline h-4 w-4 mr-2" />
          Appointment Eligibility
        </button>
      </div>

      {/* Donation Eligibility */}
      {activeTab === 'donation' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-medical-primary" />
              <span>Blood Donation Eligibility Check</span>
            </CardTitle>
            <CardDescription>
              Complete the health screening to check your eligibility for blood donation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={healthData.age}
                  onChange={(e) => setHealthData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={healthData.weight}
                  onChange={(e) => setHealthData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lastDonation">Last Donation Date (if any)</Label>
              <Input
                id="lastDonation"
                type="date"
                value={healthData.lastDonationDate}
                onChange={(e) => setHealthData(prev => ({ ...prev, lastDonationDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Medical Conditions</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {healthData.medicalConditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeMedicalCondition(condition)}>
                    {condition} ×
                  </Badge>
                ))}
              </div>
              <Select onValueChange={addMedicalCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Add medical condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diabetes">Diabetes</SelectItem>
                  <SelectItem value="Hypertension">Hypertension</SelectItem>
                  <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                  <SelectItem value="Cancer">Cancer</SelectItem>
                  <SelectItem value="HIV">HIV</SelectItem>
                  <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                  <SelectItem value="Hepatitis C">Hepatitis C</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Medications</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {healthData.medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeMedication(medication)}>
                    {medication} ×
                  </Badge>
                ))}
              </div>
              <Select onValueChange={addMedication}>
                <SelectTrigger>
                  <SelectValue placeholder="Add medication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aspirin">Aspirin</SelectItem>
                  <SelectItem value="Warfarin">Warfarin</SelectItem>
                  <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="Isotretinoin">Isotretinoin</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recent History (within last 4 months)</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="surgery"
                    checked={healthData.recentSurgery}
                    onCheckedChange={(checked) => setHealthData(prev => ({ ...prev, recentSurgery: checked as boolean }))}
                  />
                  <Label htmlFor="surgery">Recent surgery or major medical procedure</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tattoo"
                    checked={healthData.recentTattoo}
                    onCheckedChange={(checked) => setHealthData(prev => ({ ...prev, recentTattoo: checked as boolean }))}
                  />
                  <Label htmlFor="tattoo">Recent tattoo or piercing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="travel"
                    checked={healthData.recentTravel}
                    onCheckedChange={(checked) => setHealthData(prev => ({ ...prev, recentTravel: checked as boolean }))}
                  />
                  <Label htmlFor="travel">Travel to malaria-endemic areas</Label>
                </div>
              </div>
            </div>

            <Button onClick={handleDonationCheck} disabled={loading} className="w-full">
              {loading ? 'Checking...' : 'Check Eligibility'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Request Eligibility */}
      {activeTab === 'request' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-medical-info" />
              <span>Blood Request Eligibility Check</span>
            </CardTitle>
            <CardDescription>
              Check your eligibility to request blood based on urgency level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="urgency">Request Urgency Level</Label>
              <Select value={urgencyLevel} onValueChange={(value: 'routine' | 'urgent' | 'emergency') => setUrgencyLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine (Planned procedure)</SelectItem>
                  <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                  <SelectItem value="emergency">Emergency (Immediate need)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleRequestCheck} disabled={loading} className="w-full">
              {loading ? 'Checking...' : 'Check Request Eligibility'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Appointment Eligibility */}
      {activeTab === 'appointment' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-medical-success" />
              <span>Appointment Scheduling Eligibility</span>
            </CardTitle>
            <CardDescription>
              Check if you can schedule a donation appointment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleAppointmentCheck} disabled={loading} className="w-full">
              {loading ? 'Checking...' : 'Check Appointment Eligibility'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {result.isEligible ? (
                <CheckCircle className="h-5 w-5 text-medical-success" />
              ) : (
                <XCircle className="h-5 w-5 text-medical-emergency" />
              )}
              <span>Eligibility Result</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {result.isEligible ? (
                  <span className="text-medical-success font-medium">
                    ✓ You are eligible! You can proceed with your request.
                  </span>
                ) : (
                  <span className="text-medical-emergency font-medium">
                    ✗ You are not currently eligible. Please review the requirements below.
                  </span>
                )}
              </AlertDescription>
            </Alert>

            {result.reasons.length > 0 && (
              <div>
                <Label className="text-sm font-medium">
                  {result.isEligible ? 'Requirements Met:' : 'Requirements Not Met:'}
                </Label>
                <ul className="mt-2 space-y-1">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <span className="text-medical-emergency">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.nextEligibleDate && (
              <div>
                <Label className="text-sm font-medium">Next Eligible Date:</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.nextEligibleDate.toLocaleDateString()}
                </p>
              </div>
            )}

            {result.requiredDocuments && result.requiredDocuments.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Required Documents:</Label>
                <ul className="mt-2 space-y-1">
                  {result.requiredDocuments.map((doc, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <span className="text-medical-info">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};