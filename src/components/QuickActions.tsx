import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Heart, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  BarChart3,
  Users,
  Truck
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: string;
  link?: string;
}

interface QuickActionsProps {
  userRole: 'admin' | 'hospital' | 'donor' | 'patient';
}

export const QuickActions = ({ userRole }: QuickActionsProps) => {
  const getActionsForRole = (): QuickAction[] => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Register New Donor',
            description: 'Add a new blood donor to the system',
            icon: <UserPlus className="h-5 w-5" />,
            color: 'bg-medical-success text-white',
            action: 'register-donor'
          },
          {
            title: 'Process Blood Request',
            description: 'Handle incoming blood requests',
            icon: <Heart className="h-5 w-5" />,
            color: 'bg-medical-info text-white',
            action: 'process-request'
          },
          {
            title: 'Generate Report',
            description: 'Create inventory and activity reports',
            icon: <BarChart3 className="h-5 w-5" />,
            color: 'bg-gradient-primary text-white',
            action: 'generate-report'
          },
          {
            title: 'Emergency Alert',
            description: 'Send urgent blood requests to donors',
            icon: <AlertTriangle className="h-5 w-5" />,
            color: 'bg-medical-emergency text-white',
            action: 'emergency-alert'
          }
        ];
        
      case 'hospital':
        return [
          {
            title: 'Request Blood',
            description: 'Submit a new blood request',
            icon: <Heart className="h-5 w-5" />,
            color: 'bg-medical-info text-white',
            action: 'request-blood',
            link: '/blood-request'
          },
          {
            title: 'Check Availability',
            description: 'View current blood inventory',
            icon: <FileText className="h-5 w-5" />,
            color: 'bg-gradient-primary text-white',
            action: 'check-inventory'
          },
          {
            title: 'Emergency Request',
            description: 'Submit urgent blood requirement',
            icon: <AlertTriangle className="h-5 w-5" />,
            color: 'bg-medical-emergency text-white',
            action: 'emergency-request',
            link: '/blood-request'
          },
          {
            title: 'Track Requests',
            description: 'Monitor your blood requests',
            icon: <Truck className="h-5 w-5" />,
            color: 'bg-medical-success text-white',
            action: 'track-requests',
            link: '/my-requests'
          }
        ];
        
      case 'donor':
        return [
          {
            title: 'Schedule Donation',
            description: 'Book your next donation appointment',
            icon: <Calendar className="h-5 w-5" />,
            color: 'bg-medical-success text-white',
            action: 'schedule-donation',
            link: '/schedule-donation'
          },
          {
            title: 'Update Profile',
            description: 'Modify your donor information',
            icon: <Users className="h-5 w-5" />,
            color: 'bg-gradient-primary text-white',
            action: 'update-profile'
          },
          {
            title: 'Donation History',
            description: 'View your past donations',
            icon: <FileText className="h-5 w-5" />,
            color: 'bg-medical-info text-white',
            action: 'donation-history'
          },
          {
            title: 'Eligibility Check',
            description: 'Check if you can donate today',
            icon: <Heart className="h-5 w-5" />,
            color: 'bg-medical-warning text-white',
            action: 'eligibility-check'
          }
        ];
        
      case 'patient':
        return [
          {
            title: 'Find Blood',
            description: 'Search for available blood types',
            icon: <Heart className="h-5 w-5" />,
            color: 'bg-medical-info text-white',
            action: 'find-blood'
          },
          {
            title: 'Request Blood',
            description: 'Submit a blood requirement request',
            icon: <FileText className="h-5 w-5" />,
            color: 'bg-gradient-primary text-white',
            action: 'request-donation',
            link: '/blood-request'
          },
          {
            title: 'My Requests',
            description: 'Track your blood requests',
            icon: <Truck className="h-5 w-5" />,
            color: 'bg-medical-success text-white',
            action: 'my-requests',
            link: '/my-requests'
          },
          {
            title: 'Emergency Help',
            description: 'Get immediate assistance',
            icon: <AlertTriangle className="h-5 w-5" />,
            color: 'bg-medical-emergency text-white',
            action: 'emergency-help',
            link: '/blood-request'
          }
        ];
        
      default:
        return [];
    }
  };

  const actions = getActionsForRole();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            if (action.link) {
              return (
                <Link key={index} to={action.link}>
                  <Button
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-start space-y-2 hover:scale-105 transition-transform ${action.color} border-0 hover:opacity-90 w-full`}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      {action.icon}
                      <h3 className="font-medium text-left">{action.title}</h3>
                    </div>
                    <p className="text-sm opacity-90 text-left">{action.description}</p>
                  </Button>
                </Link>
              );
            }
            
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-start space-y-2 hover:scale-105 transition-transform ${action.color} border-0 hover:opacity-90`}
                onClick={() => console.log(`Action: ${action.action}`)}
              >
                <div className="flex items-center space-x-2 w-full">
                  {action.icon}
                  <h3 className="font-medium text-left">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90 text-left">{action.description}</p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};