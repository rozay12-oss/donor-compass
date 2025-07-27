import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface BloodType {
  type: string;
  units: number;
  capacity: number;
  expiringUnits: number;
  requests: number;
  lastDonation: string;
}

const bloodInventory: BloodType[] = [
  { type: 'A+', units: 45, capacity: 100, expiringUnits: 3, requests: 2, lastDonation: '2 hours ago' },
  { type: 'A-', units: 12, capacity: 50, expiringUnits: 1, requests: 1, lastDonation: '5 hours ago' },
  { type: 'B+', units: 67, capacity: 80, expiringUnits: 0, requests: 0, lastDonation: '1 hour ago' },
  { type: 'B-', units: 8, capacity: 40, expiringUnits: 2, requests: 3, lastDonation: '8 hours ago' },
  { type: 'AB+', units: 23, capacity: 60, expiringUnits: 1, requests: 1, lastDonation: '3 hours ago' },
  { type: 'AB-', units: 5, capacity: 30, expiringUnits: 0, requests: 2, lastDonation: '12 hours ago' },
  { type: 'O+', units: 89, capacity: 120, expiringUnits: 4, requests: 5, lastDonation: '30 min ago' },
  { type: 'O-', units: 15, capacity: 70, expiringUnits: 1, requests: 4, lastDonation: '2 hours ago' },
];

export const BloodInventoryTable = () => {
  const getStatusColor = (units: number, capacity: number) => {
    const percentage = (units / capacity) * 100;
    if (percentage < 20) return 'text-medical-emergency';
    if (percentage < 40) return 'text-medical-warning';
    return 'text-medical-success';
  };

  const getStatusBadge = (units: number, capacity: number) => {
    const percentage = (units / capacity) * 100;
    if (percentage < 20) return { text: 'Critical', color: 'bg-medical-emergency text-white' };
    if (percentage < 40) return { text: 'Low', color: 'bg-medical-warning text-white' };
    return { text: 'Good', color: 'bg-medical-success text-white' };
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Blood Inventory Status</CardTitle>
        <Button size="sm" className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bloodInventory.map((blood) => {
            const percentage = (blood.units / blood.capacity) * 100;
            const status = getStatusBadge(blood.units, blood.capacity);
            
            return (
              <div key={blood.type} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {blood.type}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Blood Type {blood.type}</h3>
                      <p className="text-sm text-muted-foreground">Last donation: {blood.lastDonation}</p>
                    </div>
                  </div>
                  <Badge className={status.color}>
                    {status.text}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Available Units</p>
                    <p className={`text-lg font-bold ${getStatusColor(blood.units, blood.capacity)}`}>
                      {blood.units}/{blood.capacity}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Pending Requests</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-medical-warning" />
                      <p className="text-sm font-medium">{blood.requests}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Expiring Soon</p>
                    <div className="flex items-center space-x-1">
                      {blood.expiringUnits > 0 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 text-medical-warning" />
                          <p className="text-sm font-medium text-medical-warning">{blood.expiringUnits} units</p>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 text-medical-success" />
                          <p className="text-sm font-medium text-medical-success">None</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Stock Level</p>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>

                {(percentage < 20 || blood.requests > 2) && (
                  <div className="flex space-x-2">
                    {percentage < 20 && (
                      <Button size="sm" variant="outline" className="text-medical-emergency border-medical-emergency">
                        Urgent Request
                      </Button>
                    )}
                    {blood.requests > 2 && (
                      <Button size="sm" variant="outline" className="text-medical-info border-medical-info">
                        Process Requests ({blood.requests})
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};