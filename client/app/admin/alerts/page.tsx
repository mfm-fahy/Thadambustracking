'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { AlertsList } from '@/components/admin/AlertsList';
import { mockData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Filter } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    const mockAlerts = mockData.generateAlerts(15);
    const formattedAlerts = mockAlerts.map((alert, idx) => ({
      ...alert,
      vehicle_name: `Bus Route ${idx % 5 + 1}`,
    }));
    setAlerts(formattedAlerts);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (statusFilter === 'active' && alert.is_resolved) return false;
    if (statusFilter === 'resolved' && !alert.is_resolved) return false;
    return true;
  });

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(a =>
      a.id === alertId ? { ...a, is_resolved: true } : a
    ));
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.is_resolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.is_resolved).length,
    resolved: alerts.filter(a => a.is_resolved).length,
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <AlertCircle className="w-8 h-8" />
                  Alerts
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor and manage system alerts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.critical}</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{stats.high}</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.resolved}</p>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'resolved' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('resolved')}
            >
              Resolved
            </Button>
            <div className="border-l border-border" />
            <Button
              variant={severityFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSeverityFilter('all')}
            >
              All Severity
            </Button>
            <Button
              variant={severityFilter === 'critical' ? 'default' : 'outline'}
              onClick={() => setSeverityFilter('critical')}
            >
              Critical
            </Button>
            <Button
              variant={severityFilter === 'high' ? 'default' : 'outline'}
              onClick={() => setSeverityFilter('high')}
            >
              High
            </Button>
          </div>

          {/* Alerts List */}
          <AlertsList 
            alerts={filteredAlerts}
            onResolve={handleResolveAlert}
          />
        </div>
      </main>
    </div>
  );
}
