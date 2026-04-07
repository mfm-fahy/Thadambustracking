'use client';

import { Card } from '@/components/ui/card';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

interface ETACardProps {
  destination: string;
  estimatedArrivalTime: string;
  remainingDistance: number;
  remainingTime: number; // in minutes
  isDelayed?: boolean;
}

export function ETACard({
  destination,
  estimatedArrivalTime,
  remainingDistance,
  remainingTime,
  isDelayed = false,
}: ETACardProps) {
  const arrivalTime = new Date(estimatedArrivalTime);
  const hours = arrivalTime.getHours().toString().padStart(2, '0');
  const minutes = arrivalTime.getMinutes().toString().padStart(2, '0');

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        {/* Destination */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-accent" />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Destination</p>
          </div>
          <p className="text-lg font-semibold text-foreground">{destination}</p>
        </div>

        {/* ETA */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated Arrival</p>
              <p className="text-2xl font-bold text-accent">
                {hours}:{minutes}
              </p>
            </div>
          </div>
          {isDelayed && (
            <div className="flex items-center gap-2 mt-3 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>Running behind schedule</span>
            </div>
          )}
        </div>

        {/* Remaining Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
            <p className="text-xl font-bold text-foreground">{remainingTime} min</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Distance</p>
            <p className="text-xl font-bold text-foreground">{remainingDistance.toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
