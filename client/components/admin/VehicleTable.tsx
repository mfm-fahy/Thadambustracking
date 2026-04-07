'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Edit2, MoreHorizontal } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  registration_number: string;
  status: 'active' | 'inactive' | 'maintenance';
  current_occupancy: number;
  capacity: number;
  last_location?: { latitude: number; longitude: number };
  occupancy_status: 'empty' | 'moderate' | 'full';
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit?: (vehicle: Vehicle) => void;
}

export function VehicleTable({ vehicles, onEdit }: VehicleTableProps) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-700 dark:text-green-400',
    inactive: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
    maintenance: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  };

  const occupancyColors = {
    empty: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    moderate: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    full: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Vehicle
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Occupancy
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-foreground">{vehicle.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.registration_number}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={`${statusColors[vehicle.status]} border-0 capitalize`}
                  >
                    {vehicle.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${occupancyColors[vehicle.occupancy_status]} border-0 capitalize text-xs`}
                      >
                        {vehicle.occupancy_status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {vehicle.current_occupancy}/{vehicle.capacity}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {vehicle.last_location ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {vehicle.last_location.latitude.toFixed(4)},
                        {vehicle.last_location.longitude.toFixed(4)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No location</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit?.(vehicle)}
                      className="gap-1 text-xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1 text-xs">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
