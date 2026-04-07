'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Alert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  vehicle_name: string;
  created_at: string;
  is_resolved: boolean;
}

interface AlertsListProps {
  alerts: Alert[];
  onResolve?: (alertId: string) => void;
}

export function AlertsList({ alerts, onResolve }: AlertsListProps) {
  const severityColors = {
    low: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    high: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
    critical: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  const severityIcons = {
    low: AlertTriangle,
    medium: AlertTriangle,
    high: AlertTriangle,
    critical: AlertTriangle,
  };

  const unresolved = alerts.filter((a) => !a.is_resolved);
  const resolved = alerts.filter((a) => a.is_resolved);

  const renderAlertGroup = (groupAlerts: Alert[], isResolved: boolean) => (
    <div className="space-y-3">
      {groupAlerts.map((alert) => {
        const SeverityIcon = severityIcons[alert.severity];
        return (
          <div
            key={alert.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <SeverityIcon
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                alert.severity === 'critical'
                  ? 'text-red-500'
                  : alert.severity === 'high'
                    ? 'text-orange-500'
                    : 'text-yellow-500'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.vehicle_name} •{' '}
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge
                  className={`${severityColors[alert.severity]} border-0 capitalize flex-shrink-0`}
                >
                  {alert.severity}
                </Badge>
              </div>
            </div>
            {!isResolved && (
              <Button
                size="sm"
                onClick={() => onResolve?.(alert.id)}
                className="gap-1 text-xs"
              >
                <CheckCircle2 className="w-3 h-3" />
                Resolve
              </Button>
            )}
            {isResolved && (
              <Badge variant="outline" className="gap-1 text-xs flex-shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Resolved
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {unresolved.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-foreground">Active Alerts</h3>
            <Badge variant="secondary" className="ml-auto">
              {unresolved.length}
            </Badge>
          </div>
          {renderAlertGroup(unresolved, false)}
        </Card>
      )}

      {resolved.length > 0 && (
        <Card className="p-6 bg-card border-border opacity-75">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-foreground text-sm">Resolved Alerts</h3>
            <Badge variant="outline" className="ml-auto text-xs">
              {resolved.length}
            </Badge>
          </div>
          {renderAlertGroup(resolved, true)}
        </Card>
      )}

      {alerts.length === 0 && (
        <Card className="p-12 text-center bg-card border-border">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
          <p className="text-foreground font-medium">No alerts</p>
          <p className="text-sm text-muted-foreground">All systems operating normally</p>
        </Card>
      )}
    </div>
  );
}
