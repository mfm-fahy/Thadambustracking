'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export interface AlertNotification {
  id: string;
  type: 'route_deviation' | 'speed_violation' | 'occupancy_full' | 'delayed_arrival' | 'vehicle_breakdown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  vehicleId?: string;
  vehicleName?: string;
  createdAt: string;
  isRead?: boolean;
}

interface AlertsCenterProps {
  alerts: AlertNotification[];
  onDismiss?: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  maxVisible?: number;
}

export function AlertsCenter({
  alerts,
  onDismiss,
  onMarkAsRead,
  maxVisible = 3,
}: AlertsCenterProps) {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const visibleAlerts = alerts.slice(0, maxVisible);
  const hiddenCount = Math.max(0, alerts.length - maxVisible);

  const severityColors = {
    low: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    high: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
    critical: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  const severityBorders = {
    low: 'border-blue-500/30',
    medium: 'border-yellow-500/30',
    high: 'border-orange-500/30',
    critical: 'border-red-500/30',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    route_deviation: '🛣️',
    speed_violation: '⚡',
    occupancy_full: '👥',
    delayed_arrival: '⏱️',
    vehicle_breakdown: '🔧',
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md space-y-3 z-40 pointer-events-auto">
      {visibleAlerts.map((alert) => {
        const isExpanded = expandedAlerts.has(alert.id);
        return (
          <Card
            key={alert.id}
            className={`p-4 border ${severityBorders[alert.severity]} bg-card transition-all`}
          >
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-lg">{typeIcons[alert.type] || '⚠️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {alert.message}
                    </p>
                    {alert.vehicleName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.vehicleName}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={`${severityColors[alert.severity]} border-0 capitalize flex-shrink-0`}>
                  {alert.severity}
                </Badge>
              </div>

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground">
                {new Date(alert.createdAt).toLocaleTimeString()}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                {!alert.isRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsRead?.(alert.id)}
                    className="flex-1 gap-1 text-xs h-7"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss?.(alert.id)}
                  className="gap-1 text-xs h-7 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}

      {hiddenCount > 0 && (
        <Card className="p-3 bg-card border border-border text-center">
          <p className="text-xs text-muted-foreground">
            +{hiddenCount} more alert{hiddenCount !== 1 ? 's' : ''}
          </p>
        </Card>
      )}

      {unreadCount > 0 && (
        <div className="flex items-center justify-center">
          <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-0 gap-1">
            <Bell className="w-3 h-3" />
            {unreadCount} unread
          </Badge>
        </div>
      )}
    </div>
  );
}
