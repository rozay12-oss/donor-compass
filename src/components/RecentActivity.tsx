import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Hospital, User, AlertCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Activity {
  id: string;
  type: 'donation' | 'request' | 'emergency' | 'appointment';
  title: string;
  description: string;
  time: string;
  location?: string;
  bloodType?: string;
  priority?: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'completed' | 'urgent';
}

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'emergency',
    title: 'Emergency Blood Request',
    description: 'City General Hospital requires O- blood immediately',
    time: '5 minutes ago',
    location: 'City General Hospital',
    bloodType: 'O-',
    priority: 'emergency',
    status: 'urgent'
  },
  {
    id: '2',
    type: 'donation',
    title: 'Blood Donation Completed',
    description: 'John Doe donated A+ blood',
    time: '30 minutes ago',
    bloodType: 'A+',
    status: 'completed'
  },
  {
    id: '3',
    type: 'request',
    title: 'Routine Blood Request',
    description: 'Memorial Hospital requested 3 units of B+',
    time: '2 hours ago',
    location: 'Memorial Hospital',
    bloodType: 'B+',
    priority: 'medium',
    status: 'pending'
  },
  {
    id: '4',
    type: 'appointment',
    title: 'Donor Appointment Scheduled',
    description: 'Sarah Wilson scheduled for tomorrow 2:00 PM',
    time: '3 hours ago',
    status: 'pending'
  },
  {
    id: '5',
    type: 'donation',
    title: 'Blood Donation Completed',
    description: 'Michael Chen donated O+ blood',
    time: '4 hours ago',
    bloodType: 'O+',
    status: 'completed'
  }
];

export const RecentActivity = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <Heart className="h-4 w-4" />;
      case 'request':
        return <Hospital className="h-4 w-4" />;
      case 'appointment':
        return <Clock className="h-4 w-4" />;
      case 'emergency':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, priority?: string) => {
    if (priority === 'emergency') return 'text-medical-emergency bg-medical-emergency/10';
    switch (type) {
      case 'donation':
        return 'text-medical-success bg-medical-success/10';
      case 'request':
        return 'text-medical-info bg-medical-info/10';
      case 'appointment':
        return 'text-medical-warning bg-medical-warning/10';
      case 'emergency':
        return 'text-medical-emergency bg-medical-emergency/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusBadge = (status: string, priority?: string) => {
    if (priority === 'emergency') {
      return <Badge className="bg-medical-emergency text-white animate-pulse">EMERGENCY</Badge>;
    }
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-medical-success text-white">Completed</Badge>;
      case 'urgent':
        return <Badge className="bg-medical-emergency text-white">Urgent</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          View All
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type, activity.priority)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </h4>
                  {getStatusBadge(activity.status, activity.priority)}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>{activity.time}</span>
                    {activity.location && (
                      <span className="flex items-center">
                        <Hospital className="h-3 w-3 mr-1" />
                        {activity.location}
                      </span>
                    )}
                    {activity.bloodType && (
                      <Badge variant="outline" className="text-xs">
                        {activity.bloodType}
                      </Badge>
                    )}
                  </div>
                  
                  {activity.priority === 'emergency' && (
                    <Button size="sm" className="bg-medical-emergency text-white h-6 text-xs">
                      Respond Now
                    </Button>
                  )}
                </div>
              </div>
              
              {activity.status === 'completed' && (
                <CheckCircle className="h-4 w-4 text-medical-success mt-1" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};