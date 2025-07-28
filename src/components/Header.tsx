import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Menu, Bell, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  userRole: 'admin' | 'hospital' | 'donor' | 'patient';
  userName: string;
  onRoleChange: (role: 'admin' | 'hospital' | 'donor' | 'patient') => void;
}

export const Header = ({ userRole, userName, onRoleChange }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const roleColors = {
    admin: 'bg-gradient-primary',
    hospital: 'bg-medical-info',
    donor: 'bg-medical-success',
    patient: 'bg-medical-warning'
  };

  const roleLabels = {
    admin: 'Blood Bank Admin',
    hospital: 'Hospital Staff',
    donor: 'Blood Donor',
    patient: 'Patient'
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
            {userRole === 'donor' && (
              <Link to="/donor-registration">
                <Button variant="ghost" size="sm">Register</Button>
              </Link>
            )}
            {(userRole === 'hospital' || userRole === 'patient') && (
              <Link to="/blood-request">
                <Button variant="ghost" size="sm">Request Blood</Button>
              </Link>
            )}
            {userRole === 'patient' && (
              <Link to="/patient-portal">
                <Button variant="ghost" size="sm">My Portal</Button>
              </Link>
            )}
            {userRole === 'admin' && (
              <Link to="/admin-dashboard">
                <Button variant="ghost" size="sm">Admin Panel</Button>
              </Link>
            )}
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-medical-emergency text-white border-0">
                3
              </Badge>
            </Button>

            {/* Role Switcher */}
            <div className="hidden sm:block">
              <select 
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as any)}
                className="text-sm border border-border rounded-md px-3 py-1 bg-background"
              >
                <option value="admin">Admin</option>
                <option value="hospital">Hospital</option>
                <option value="donor">Donor</option>
                <option value="patient">Patient</option>
              </select>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{roleLabels[userRole]}</p>
              </div>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
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
            {userRole === 'donor' && (
              <Link to="/donor-registration">
                <Button variant="ghost" size="sm" className="w-full justify-start">Register</Button>
              </Link>
            )}
            {(userRole === 'hospital' || userRole === 'patient') && (
              <Link to="/blood-request">
                <Button variant="ghost" size="sm" className="w-full justify-start">Request Blood</Button>
              </Link>
            )}
            {userRole === 'patient' && (
              <Link to="/patient-portal">
                <Button variant="ghost" size="sm" className="w-full justify-start">My Portal</Button>
              </Link>
            )}
            {userRole === 'admin' && (
              <Link to="/admin-dashboard">
                <Button variant="ghost" size="sm" className="w-full justify-start">Admin Panel</Button>
              </Link>
            )}
            <Link to="/login">
              <Button variant="ghost" size="sm" className="w-full justify-start">Login</Button>
            </Link>
            <div className="pt-2 border-t border-border">
              <select 
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as any)}
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
              >
                <option value="admin">Blood Bank Admin</option>
                <option value="hospital">Hospital Staff</option>
                <option value="donor">Blood Donor</option>
                <option value="patient">Patient</option>
              </select>
            </div>
          </Card>
        )}
      </div>
    </header>
  );
};