'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OccupancyManagerProps {
  vehicleId: string;
  currentOccupancy: number;
  capacity: number;
  onUpdate?: (occupancy: number, status: 'empty' | 'moderate' | 'full') => void;
}

export function OccupancyManager({
  vehicleId,
  currentOccupancy,
  capacity,
  onUpdate,
}: OccupancyManagerProps) {
  const [occupancy, setOccupancy] = useState(currentOccupancy);
  const percentage = (occupancy / capacity) * 100;

  const status: 'empty' | 'moderate' | 'full' =
    percentage < 33 ? 'empty' : percentage < 66 ? 'moderate' : 'full';

  const statusColors = {
    empty: {
      bg: 'bg-green-500/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-500/30',
    },
    moderate: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-500/30',
    },
    full: {
      bg: 'bg-red-500/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-500/30',
    },
  };

  const colors = statusColors[status];

  const handleUpdate = (newOccupancy: number) => {
    if (newOccupancy >= 0 && newOccupancy <= capacity) {
      setOccupancy(newOccupancy);
      const newStatus: 'empty' | 'moderate' | 'full' =
        (newOccupancy / capacity) * 100 < 33
          ? 'empty'
          : (newOccupancy / capacity) * 100 < 66
            ? 'moderate'
            : 'full';
      onUpdate?.(newOccupancy, newStatus);
    }
  };

  return (
    <Card className={`p-6 bg-card border ${colors.border}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Users className={`w-5 h-5 ${colors.text}`} />
            <h3 className="font-semibold text-foreground">Vehicle Occupancy</h3>
          </div>
          <Badge className={`${colors.bg} ${colors.text} border-0 capitalize`}>
            {status}
          </Badge>
        </div>

        {/* Occupancy Display */}
        <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
          <div className="flex items-baseline gap-2 mb-2">
            <p className={`text-3xl font-bold ${colors.text}`}>{occupancy}</p>
            <p className={`text-sm ${colors.text}`}>/ {capacity}</p>
          </div>
          <p className={`text-xs ${colors.text} opacity-75`}>
            {percentage.toFixed(1)}% capacity
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                status === 'empty'
                  ? 'bg-green-500'
                  : status === 'moderate'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Alert for Full Vehicle */}
        {status === 'full' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">
              Vehicle is at full capacity. No more passengers can board.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdate(occupancy - 1)}
            disabled={occupancy === 0}
            className="flex-1"
          >
            - Passenger
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdate(occupancy + 1)}
            disabled={occupancy === capacity}
            className="flex-1"
          >
            + Passenger
          </Button>
        </div>

        {/* Quick Set */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick set:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdate(0)}
              className="text-xs"
            >
              Empty
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdate(Math.floor(capacity / 2))}
              className="text-xs"
            >
              Half
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdate(capacity)}
              className="text-xs"
            >
              Full
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
