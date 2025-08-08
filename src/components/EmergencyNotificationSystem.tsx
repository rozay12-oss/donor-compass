import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, MapPin, Phone, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface EmergencyNotificationSystemProps {
  className?: string;
}

export const EmergencyNotificationSystem: React.FC<EmergencyNotificationSystemProps> = ({ className }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<EmergencyRequest[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time emergency requests
    const channel = supabase
      .channel('emergency-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emergency_requests'
        },
        (payload) => {
          console.log('New emergency request received:', payload);
          const newRequest = payload.new as EmergencyRequest;
          
          // Add to notifications
          setNotifications(prev => [newRequest, ...prev.slice(0, 4)]); // Keep max 5 notifications
          setIsVisible(true);
          
          // Show toast notification
          toast({
            title: "🚨 Emergency Blood Request",
            description: `${newRequest.blood_type} blood needed for ${newRequest.name} at ${newRequest.location}`,
            variant: "destructive",
          });

          // Play notification sound (optional)
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBqWO2/Pk');
            audio.play().catch(() => {}); // Ignore audio errors
          } catch (error) {
            console.log('Audio notification not available');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
  };

  const dismissAll = () => {
    setNotifications([]);
    setIsVisible(false);
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

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-3 max-w-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-destructive">Emergency Alerts</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={dismissAll}
          className="h-6 px-2 text-xs"
        >
          Dismiss All
        </Button>
      </div>
      
      {notifications.map((request) => (
        <Card key={request.id} className="border-l-4 border-l-destructive shadow-lg animate-in slide-in-from-right">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <CardTitle className="text-sm">Emergency Request</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(request.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{request.name}</span>
                <Badge className={getUrgencyColor(request.urgency)}>
                  {request.urgency}
                </Badge>
              </div>
              
              <Alert className="py-2">
                <AlertDescription className="text-xs">
                  <strong>{request.blood_type}</strong> blood needed - {request.units} units
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{request.location}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{request.contact}</span>
              </div>
              
              {request.notes && (
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  {request.notes}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>{formatTimeAgo(request.created_at)}</span>
                <Button
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => {
                    // Navigate to emergency requests page or show details
                    window.location.href = '/emergency-requests';
                  }}
                >
                  Respond
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};