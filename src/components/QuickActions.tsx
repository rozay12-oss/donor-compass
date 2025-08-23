import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
// EligibilityChecker removed in simplified version
import { 
  UserPlus, 
  Heart, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  BarChart3,
  Users,
  Truck,
  UserCheck,
  Database,
  Settings,
  Shield,
  Activity,
  Package,
  Clipboard,
  Bell,
  MapPin
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
  userRole: 'admin' | 'donor';
}

export const QuickActions = ({ userRole }: QuickActionsProps) => {
  const getActionsForRole = (): QuickAction[] => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'View All Requests',
            description: 'Review and manage blood requests',
            icon: <FileText className="h-5 w-5" />,
            color: 'bg-medical-info text-white',
            action: 'view-requests',
            link: '/admin-dashboard'
          },
          {
            title: 'Manage Inventory',
            description: 'Update blood stock levels',
            icon: <Database className="h-5 w-5" />,
            color: 'bg-medical-primary text-white',
            action: 'manage-inventory'
          },
          {
            title: 'System Monitor',
            description: 'Monitor system activity',
            icon: <Activity className="h-5 w-5" />,
            color: 'bg-medical-secondary text-white',
            action: 'system-monitor'
          },
          {
            title: 'User Management',
            description: 'Manage user accounts',
            icon: <Users className="h-5 w-5" />,
            color: 'bg-gradient-primary text-white',
            action: 'user-management'
          }
        ];
        
      case 'donor':
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
            title: 'My Requests',
            description: 'Track your blood requests',
            icon: <FileText className="h-5 w-5" />,
            color: 'bg-medical-success text-white',
            action: 'my-requests',
            link: '/my-requests'
          },
          {
            title: 'Update Profile',
            description: 'Modify your information',
            icon: <Users className="h-5 w-5" />,
            color: 'bg-gradient-primary text-white',
            action: 'update-profile',
            link: '/profile'
          },
          {
            title: 'Emergency Request',
            description: 'Submit urgent blood need',
            icon: <AlertTriangle className="h-5 w-5" />,
            color: 'bg-medical-emergency text-white',
            action: 'emergency-request',
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

            // Eligibility checker removed in simplified version
            
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