import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Heart, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationsDropdownProps {
  children: React.ReactNode;
}

export const NotificationsDropdown = ({ children }: NotificationsDropdownProps) => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'emergency',
      title: 'Emergency Blood Request',
      message: 'O- blood urgently needed at City Hospital',
      time: '2 minutes ago',
      icon: AlertTriangle,
      unread: true,
      link: '/emergency-requests'
    },
    {
      id: 2,
      type: 'donation',
      title: 'Donation Scheduled',
      message: 'Your appointment is confirmed for tomorrow at 10 AM',
      time: '1 hour ago',
      icon: Heart,
      unread: true,
      link: '/schedule-donation'
    },
    {
      id: 3,
      type: 'success',
      title: 'Request Fulfilled',
      message: 'Your blood request has been processed successfully',
      time: '3 hours ago',
      icon: CheckCircle,
      unread: false,
      link: '/my-requests'
    },
    {
      id: 4,
      type: 'pending',
      title: 'Pending Approval',
      message: 'Your donation request is awaiting approval',
      time: '1 day ago',
      icon: Clock,
      unread: false,
      link: '/my-requests'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'text-medical-emergency';
      case 'donation': return 'text-medical-success';
      case 'success': return 'text-medical-success';
      case 'pending': return 'text-medical-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-medical-emergency text-white border-0">
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-0">
                <Link 
                  to={notification.link} 
                  className="w-full p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <notification.icon 
                      className={`h-4 w-4 mt-1 ${getNotificationColor(notification.type)}`} 
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-medical-emergency rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/notifications" className="w-full text-center text-sm">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};