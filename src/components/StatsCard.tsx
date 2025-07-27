import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'emergency' | 'warning' | 'success' | 'info';
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  status = 'info',
  className = '' 
}: StatsCardProps) => {
  const statusColors = {
    emergency: 'text-medical-emergency',
    warning: 'text-medical-warning',
    success: 'text-medical-success',
    info: 'text-medical-info'
  };

  const statusBadgeColors = {
    emergency: 'bg-medical-emergency text-white',
    warning: 'bg-medical-warning text-white',
    success: 'bg-medical-success text-white',
    info: 'bg-medical-info text-white'
  };

  return (
    <Card className={`shadow-card hover:shadow-medical transition-shadow duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {trend && (
                <Badge 
                  variant="secondary"
                  className={`text-xs ${trend.isPositive ? 'text-medical-success' : 'text-medical-emergency'}`}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-secondary/50 ${statusColors[status]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        
        {status === 'emergency' && (
          <div className="mt-4">
            <Badge className={statusBadgeColors[status]}>
              Critical Level
            </Badge>
          </div>
        )}
        
        {status === 'warning' && (
          <div className="mt-4">
            <Badge className={statusBadgeColors[status]}>
              Low Stock
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};