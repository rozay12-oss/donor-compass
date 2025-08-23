import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { StatsCard } from '@/components/StatsCard';
import { BloodInventoryTable } from '@/components/BloodInventoryTable';
import { BloodAvailabilityChecker } from '@/components/BloodAvailabilityChecker';
import { RecentActivity } from '@/components/RecentActivity';
import { QuickActions } from '@/components/QuickActions';
import { 
  Heart, 
  Users, 
  Calendar, 
  AlertTriangle,
  Droplets,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<'admin' | 'donor'>('donor');
  const [userName, setUserName] = useState('Guest User');
  const [profile, setProfile] = useState<any>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setProfile(data);
          setUserName(data.full_name || user.email || 'User');
          if (data.role && ['admin', 'donor'].includes(data.role)) {
            setUserRole(data.role as 'admin' | 'donor');
          }
        } else if (!error) {
          // No profile found but no error - profile might not exist yet
          setUserName(user.email || 'User');
          setUserRole('donor'); // Default role
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Mock data for different roles
  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Total Blood Units',
            value: '1,247',
            subtitle: 'Available in inventory',
            icon: Droplets,
            trend: { value: 12, isPositive: true },
            status: 'success' as const
          },
          {
            title: 'Active Donors',
            value: '3,456',
            subtitle: 'Registered donors',
            icon: Users,
            trend: { value: 8, isPositive: true },
            status: 'info' as const
          },
          {
            title: 'Pending Requests',
            value: '23',
            subtitle: 'Awaiting processing',
            icon: Clock,
            status: 'warning' as const
          },
          {
            title: 'Emergency Alerts',
            value: '3',
            subtitle: 'Critical blood needs',
            icon: AlertTriangle,
            status: 'emergency' as const
          }
        ];
      case 'donor':
        return [
          {
            title: 'My Requests',
            value: '2',
            subtitle: 'Blood requests made',
            icon: Heart,
            trend: { value: 1, isPositive: true },
            status: 'success' as const
          },
          {
            title: 'Available Units',
            value: '127',
            subtitle: 'Total blood units in stock',
            icon: Droplets,
            status: 'success' as const
          },
          {
            title: 'Next Eligible',
            value: '45',
            subtitle: 'Days until next request',
            icon: Calendar,
            status: 'info' as const
          },
          {
            title: 'Blood Type',
            value: profile?.blood_type || 'Unknown',
            subtitle: 'Your blood type',
            icon: Droplets,
            status: 'info' as const
          }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole} 
        userName={userName}
        onRoleChange={setUserRole}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-hero rounded-xl p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
                <p className="text-white/90">
                  {userRole === 'admin' && 'Managing blood bank operations efficiently'}
                  {userRole === 'donor' && 'Access blood inventory and submit requests when needed'}
                </p>
              </div>
            </div>
            {userRole === 'admin' && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12% donations this month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>98% request fulfillment rate</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blood Inventory Table - Full width for admin, 2/3 for others */}
          <div className={userRole === 'admin' ? 'lg:col-span-2' : 'lg:col-span-2'}>
            {userRole === 'admin' && <BloodInventoryTable />}
            {userRole !== 'admin' && <BloodAvailabilityChecker />}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <QuickActions userRole={userRole} />
            {userRole === 'admin' && <RecentActivity />}
          </div>
        </div>

        {/* Admin-specific full-width content */}
        {userRole === 'admin' && (
          <div className="mt-8 space-y-8">
            <BloodAvailabilityChecker />
            <RecentActivity />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
