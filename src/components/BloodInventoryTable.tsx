import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useBloodInventory } from '@/hooks/useBloodInventory';
import { format } from 'date-fns';

interface BloodInventoryItem {
  id: number;
  blood_type: string;
  quantity: number;
  capacity: number;
  updated_at: string;
  pendingRequests: number;
  requestCount: number;
}

export const BloodInventoryTable = () => {
  const { loading, getBloodInventoryWithRequests } = useBloodInventory();
  const [inventoryData, setInventoryData] = useState<BloodInventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBloodInventoryWithRequests();
      setInventoryData(data);
    };
    fetchData();
  }, []);
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

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading inventory...</span>
        </CardContent>
      </Card>
    );
  }

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
          {inventoryData.map((blood) => {
            const percentage = (blood.quantity / blood.capacity) * 100;
            const status = getStatusBadge(blood.quantity, blood.capacity);
            
            return (
              <div key={blood.id} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {blood.blood_type}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Blood Type {blood.blood_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {format(new Date(blood.updated_at), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  <Badge className={status.color}>
                    {status.text}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Available Units</p>
                    <p className={`text-lg font-bold ${getStatusColor(blood.quantity, blood.capacity)}`}>
                      {blood.quantity}/{blood.capacity}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Pending Requests</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-medical-warning" />
                      <p className="text-sm font-medium">{blood.pendingRequests} units ({blood.requestCount} requests)</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Available After Requests</p>
                    <div className="flex items-center space-x-1">
                      {(blood.quantity - blood.pendingRequests) > 0 ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-medical-success" />
                          <p className="text-sm font-medium text-medical-success">{blood.quantity - blood.pendingRequests} units</p>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 text-medical-emergency" />
                          <p className="text-sm font-medium text-medical-emergency">Insufficient stock</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Stock Level</p>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>

                {(percentage < 20 || blood.requestCount > 2) && (
                  <div className="flex space-x-2">
                    {percentage < 20 && (
                      <Button size="sm" variant="outline" className="text-medical-emergency border-medical-emergency">
                        Urgent Request
                      </Button>
                    )}
                    {blood.requestCount > 2 && (
                      <Button size="sm" variant="outline" className="text-medical-info border-medical-info">
                        Process Requests ({blood.requestCount})
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