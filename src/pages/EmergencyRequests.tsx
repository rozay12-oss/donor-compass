import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, MapPin, Phone, Clock, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { CreateEmergencyRequest } from '@/components/CreateEmergencyRequest';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface EmergencyRequest {
  id: string;
  name: string;
  blood_type: string;
  units: number;
  location: string;
  contact: string;
  urgency: string;
  notes?: string;
  created_at: string;
}

const EmergencyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'hospital' | 'donor' | 'patient'>('hospital');

  const fetchEmergencyRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergency_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('emergency-requests-page')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_requests'
        },
        (payload) => {
          console.log('Emergency requests updated:', payload);
          fetchEmergencyRequests(); // Refresh the list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          userRole={userRole} 
          userName={user?.email || 'Emergency User'} 
          onRoleChange={setUserRole} 
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading emergency requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole} 
        userName={user?.email || 'Emergency User'} 
        onRoleChange={setUserRole} 
      />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Emergency Blood Requests</h1>
              <p className="text-muted-foreground">
                Urgent blood requests requiring immediate attention
              </p>
            </div>
            <CreateEmergencyRequest onRequestCreated={fetchEmergencyRequests} />
          </div>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Emergency Requests</h3>
              <p className="text-muted-foreground">
                There are currently no active emergency blood requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-destructive">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                      <div>
                        <CardTitle className="text-destructive">
                          Emergency Request - {request.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {formatTimeAgo(request.created_at)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-sm">
                          {request.blood_type}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-semibold">{request.blood_type}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Units Needed</p>
                      <p className="font-semibold text-destructive">{request.units}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{request.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-semibold">{request.contact}</p>
                      </div>
                    </div>
                  </div>
                  
                  {request.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Additional Notes</p>
                      <p className="text-sm bg-muted p-3 rounded-md">{request.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-destructive hover:bg-destructive/90">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Responded
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyRequests;