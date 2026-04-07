'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Fuel } from 'lucide-react';

interface VehicleInfoProps {
  vehicleName: string;
  registrationNumber: string;
  driverName: string;
  capacity: number;
  currentOccupancy: number;
  occupancyStatus: 'empty' | 'moderate' | 'full';
  lastUpdated: string;
}

export function VehicleInfo({
  vehicleName,
  registrationNumber,
  driverName,
  capacity,
  currentOccupancy,
  occupancyStatus,
  lastUpdated,
}: VehicleInfoProps) {
  const occupancyPercentage = (currentOccupancy / capacity) * 100;

  const occupancyColors = {
    empty: 'bg-green-500/20 text-green-700 dark:text-green-400',
    moderate: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    full: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{vehicleName}</h3>
            <p className="text-sm text-muted-foreground mt-1">{registrationNumber}</p>
          </div>
          <Badge className={`${occupancyColors[occupancyStatus]} border-0 capitalize`}>
            {occupancyStatus}
          </Badge>
        </div>

        {/* Driver Info */}
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {driverName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Driver</p>
            <p className="font-medium text-foreground">{driverName}</p>
          </div>
        </div>

        {/* Occupancy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">Occupancy</span>
            </div>
            <span className="font-semibold text-foreground">
              {currentOccupancy}/{capacity}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {occupancyPercentage.toFixed(0)}% capacity
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground border-t border-border pt-4">
          <p>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
        </div>
      </div>
    </Card>
  );
}
