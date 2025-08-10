import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBloodInventory, BloodAvailability } from '@/hooks/useBloodInventory';
import { Search, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodAvailabilityChecker = () => {
  const { checkAvailability, checkCompatibleBloodTypes } = useBloodInventory();
  const [selectedBloodType, setSelectedBloodType] = useState<string>('');
  const [requiredUnits, setRequiredUnits] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<BloodAvailability | null>(null);
  const [compatibleTypes, setCompatibleTypes] = useState<BloodAvailability[]>([]);
  const [checkType, setCheckType] = useState<'specific' | 'compatible'>('specific');

  const handleCheckAvailability = async () => {
    if (!selectedBloodType) {
      toast.error('Please select a blood type');
      return;
    }

    setLoading(true);
    try {
      if (checkType === 'specific') {
        const result = await checkAvailability(selectedBloodType, requiredUnits);
        setAvailability(result);
        setCompatibleTypes([]);
      } else {
        const results = await checkCompatibleBloodTypes(selectedBloodType);
        setCompatibleTypes(results);
        setAvailability(null);
      }
    } catch (error) {
      toast.error('Failed to check blood availability');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (stockLevel: string) => {
    switch (stockLevel) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-medical-emergency" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-medical-warning" />;
      default:
        return <CheckCircle className="h-4 w-4 text-medical-success" />;
    }
  };

  const getStatusColor = (stockLevel: string) => {
    switch (stockLevel) {
      case 'critical':
        return 'bg-medical-emergency text-white';
      case 'low':
        return 'bg-medical-warning text-white';
      default:
        return 'bg-medical-success text-white';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Blood Availability Checker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check Type</Label>
            <Select value={checkType} onValueChange={(value: 'specific' | 'compatible') => setCheckType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="specific">Specific Blood Type</SelectItem>
                <SelectItem value="compatible">Compatible Types (Patient)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Blood Type</Label>
            <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
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

          {checkType === 'specific' && (
            <div className="space-y-2">
              <Label>Required Units</Label>
              <Input
                type="number"
                min="1"
                value={requiredUnits}
                onChange={(e) => setRequiredUnits(parseInt(e.target.value) || 1)}
                placeholder="Enter required units"
              />
            </div>
          )}

          <div className="flex items-end">
            <Button 
              onClick={handleCheckAvailability}
              disabled={loading || !selectedBloodType}
              className="w-full"
            >
              {loading ? 'Checking...' : 'Check Availability'}
            </Button>
          </div>
        </div>

        {/* Single Blood Type Result */}
        {availability && (
          <div className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Blood Type {availability.bloodType} Availability
              </h3>
              <Badge className={getStatusColor(availability.stockLevel)}>
                {availability.stockLevel.charAt(0).toUpperCase() + availability.stockLevel.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Available Units</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(availability.stockLevel)}
                  <span className="text-lg font-bold">
                    {availability.availableUnits}/{availability.capacity}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-lg font-bold text-medical-warning">
                  {availability.pendingRequests} units
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Stock Level</p>
                <Progress 
                  value={(availability.availableUnits / availability.capacity) * 100} 
                  className="h-2" 
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg bg-secondary/30">
              {availability.isAvailable ? (
                <>
                  <CheckCircle className="h-5 w-5 text-medical-success" />
                  <span className="font-medium text-medical-success">
                    ✓ Available ({availability.availableUnits} units in stock)
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-medical-emergency" />
                  <span className="font-medium text-medical-emergency">
                    ✗ Insufficient stock (need {requiredUnits}, have {availability.availableUnits})
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Compatible Blood Types Results */}
        {compatibleTypes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Compatible Blood Types for {selectedBloodType} Patient
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compatibleTypes.map((type) => (
                <div 
                  key={type.bloodType} 
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {type.bloodType}
                      </div>
                      <span className="font-medium">Type {type.bloodType}</span>
                    </div>
                    <Badge className={getStatusColor(type.stockLevel)}>
                      {type.stockLevel}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-medium">{type.availableUnits} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium">{type.pendingRequests} units</span>
                    </div>
                    <Progress 
                      value={(type.availableUnits / type.capacity) * 100} 
                      className="h-1" 
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    {type.isAvailable ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-medical-success" />
                        <span className="text-sm text-medical-success">Available</span>
                      </>
                    ) : (
                      <>
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Not available</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};