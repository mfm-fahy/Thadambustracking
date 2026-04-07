'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, CheckCircle2, Clock } from 'lucide-react';

interface BoardingConfirmationProps {
  studentName: string;
  status: 'pending' | 'confirmed' | 'boarding' | 'onboard' | 'dropped_off';
  confirmationTime?: string;
  onConfirmBoarding?: () => void;
  onScanQR?: () => void;
}

export function BoardingConfirmation({
  studentName,
  status,
  confirmationTime,
  onConfirmBoarding,
  onScanQR,
}: BoardingConfirmationProps) {
  const [isScanning, setIsScanning] = useState(false);

  const statusConfig = {
    pending: {
      badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
      icon: Clock,
      label: 'Pending Confirmation',
      description: 'Waiting for boarding confirmation',
    },
    confirmed: {
      badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
      icon: CheckCircle2,
      label: 'Confirmed',
      description: 'Boarding confirmed by parent',
    },
    boarding: {
      badge: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
      icon: CheckCircle2,
      label: 'Boarding',
      description: 'Currently boarding the vehicle',
    },
    onboard: {
      badge: 'bg-green-500/20 text-green-700 dark:text-green-400',
      icon: CheckCircle2,
      label: 'On Board',
      description: 'Student is on the vehicle',
    },
    dropped_off: {
      badge: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
      icon: CheckCircle2,
      label: 'Dropped Off',
      description: 'Safely dropped at destination',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Student Status</h3>
            <p className="text-sm text-muted-foreground mt-1">{studentName}</p>
          </div>
          <Badge className={`${config.badge} border-0`}>{config.label}</Badge>
        </div>

        {/* Status Display */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <StatusIcon className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
            {confirmationTime && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(confirmationTime).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {status === 'pending' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Parent confirmation required before boarding
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onScanQR}
                disabled={isScanning}
                variant="outline"
                className="gap-2"
              >
                <QrCode className="w-4 h-4" />
                Scan QR Code
              </Button>
              <Button
                onClick={onConfirmBoarding}
                className="gap-2 bg-accent hover:bg-accent/90"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm
              </Button>
            </div>
          </div>
        )}

        {status === 'confirmed' && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-green-700 dark:text-green-400">
              Your boarding is confirmed. Please board the vehicle when it arrives.
            </p>
          </div>
        )}

        {status === 'onboard' && (
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              You are safely on board. The vehicle is heading to the destination.
            </p>
          </div>
        )}

        {status === 'dropped_off' && (
          <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/30">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              You have been safely dropped at your destination.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
