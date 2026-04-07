'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Truck, AlertTriangle } from 'lucide-react';

interface FleetOverviewProps {
  totalVehicles: number;
  activeTrips: number;
  alerts: number;
  averageOccupancy: number;
}

export function FleetOverview({
  totalVehicles,
  activeTrips,
  alerts,
  averageOccupancy,
}: FleetOverviewProps) {
  const stats = [
    {
      label: 'Total Vehicles',
      value: totalVehicles,
      icon: Truck,
      color: 'text-accent',
    },
    {
      label: 'Active Trips',
      value: activeTrips,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Critical Alerts',
      value: alerts,
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      label: 'Avg Occupancy',
      value: `${averageOccupancy}%`,
      icon: Card,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-6 bg-card border-border hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
