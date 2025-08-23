import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Menu, Bell, User, Search, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SearchDialog } from './SearchDialog';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  userRole: 'admin' | 'donor';
  userName: string;
  onRoleChange: (role: 'admin' | 'donor') => void;
}

export const Header = ({ userRole, userName, onRoleChange }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();

  const roleColors = {
    admin: 'bg-gradient-primary',
    donor: 'bg-medical-success'
  };

  const roleLabels = {
    admin: 'Blood Bank Admin',
    donor: 'Blood Donor'
  };

  return (
    <header className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${roleColors[userRole]} text-white`}>
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DonorCompass</h1>
              <p className="text-xs text-muted-foreground">Blood Bank Management System</p>
            </div>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/blood-request">
              <Button variant="ghost" size="sm">Request Blood</Button>
            </Link>
            <Link to="/my-requests">
              <Button variant="ghost" size="sm">My Requests</Button>
            </Link>
            {userRole === 'admin' && (
              <Link to="/admin-dashboard">
                <Button variant="ghost" size="sm">Admin Panel</Button>
              </Link>
            )}
            {user && (
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <NotificationsDropdown>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </NotificationsDropdown>

            {/* Role Switcher */}
            <div className="hidden sm:block">
              <select 
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as any)}
                className="text-sm border border-border rounded-md px-3 py-1 bg-background"
              >
                <option value="admin">Admin</option>
                <option value="donor">Donor</option>
              </select>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{roleLabels[userRole]}</p>
              </div>
              <ProfileDropdown userName={userName} userRole={userRole}>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </ProfileDropdown>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Card className="md:hidden mt-2 p-4 space-y-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
            </Link>
            <Link to="/blood-request">
              <Button variant="ghost" size="sm" className="w-full justify-start">Request Blood</Button>
            </Link>
            <Link to="/my-requests">
              <Button variant="ghost" size="sm" className="w-full justify-start">My Requests</Button>
            </Link>
            {userRole === 'admin' && (
              <Link to="/admin-dashboard">
                <Button variant="ghost" size="sm" className="w-full justify-start">Admin Panel</Button>
              </Link>
            )}
            {user && (
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
            <div className="pt-2 border-t border-border">
              <select 
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as any)}
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
              >
                <option value="admin">Blood Bank Admin</option>
                <option value="donor">Blood Donor</option>
              </select>
            </div>
          </Card>
        )}
      </div>
      
      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};