import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { User, Settings, Heart, FileText, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProfileDropdownProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
}

export const ProfileDropdown = ({ children, userName, userRole }: ProfileDropdownProps) => {
  const { signOut } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-gradient-primary';
      case 'hospital': return 'text-medical-info';
      case 'donor': return 'text-medical-success';
      case 'patient': return 'text-medical-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className={`text-xs ${getRoleColor(userRole)}`}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/my-requests" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>My Requests</span>
          </Link>
        </DropdownMenuItem>
        
        {userRole === 'donor' && (
          <DropdownMenuItem asChild>
            <Link to="/schedule-donation" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              <span>Schedule Donation</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {userRole === 'admin' && (
          <DropdownMenuItem asChild>
            <Link to="/admin-dashboard" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/reports" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Reports</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={signOut} className="text-medical-emergency focus:text-medical-emergency">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};