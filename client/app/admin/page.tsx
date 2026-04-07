'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { FleetOverview } from '@/components/admin/FleetOverview';
import { VehicleTable } from '@/components/admin/VehicleTable';
import { AlertsList } from '@/components/admin/AlertsList';
import { mockData } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    const mockVehicles = mockData.generateVehicles(5);
    const mockAlerts = mockData.generateAlerts(5);

    setVehicles(mockVehicles);
    
    // Format alerts with vehicle names
    const formattedAlerts = mockAlerts.map((alert: any, idx: number) => ({
      ...alert,
      vehicle_name: mockVehicles[idx]?.name || 'Unknown Vehicle',
    }));
    setAlerts(formattedAlerts);
    
    setIsLoading(false);
  }, []);

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, is_resolved: true } : a
    ));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-sidebar" />
        <div className="flex-1 bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeTrips = vehicles.filter(v => v.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.is_resolved).length;
  const avgOccupancy = Math.round(
    vehicles.reduce((sum, v) => sum + (v.current_occupancy / v.capacity) * 100, 0) / vehicles.length
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <BarChart3 className="w-8 h-8" />
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome back! Here&apos;s your fleet overview.
                </p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                New Vehicle
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Fleet Overview */}
          <FleetOverview
            totalVehicles={vehicles.length}
            activeTrips={activeTrips}
            alerts={criticalAlerts}
            averageOccupancy={avgOccupancy}
          />

          {/* Alerts Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              System Alerts
            </h2>
            <AlertsList 
              alerts={alerts} 
              onResolve={handleResolveAlert}
            />
          </div>

          {/* Vehicles Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Fleet Vehicles</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <VehicleTable vehicles={vehicles} />
          </div>

          {/* Quick Stats */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Distance Today</p>
                <p className="text-3xl font-bold text-foreground">245.6 km</p>
                <p className="text-xs text-muted-foreground mt-2">+12% from yesterday</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">On-Time Performance</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">94.2%</p>
                <p className="text-xs text-muted-foreground mt-2">18 of 19 trips on time</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Safety Score</p>
                <p className="text-3xl font-bold text-accent">9.8/10</p>
                <p className="text-xs text-muted-foreground mt-2">No critical incidents</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t border-border py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground text-center">
              Data refreshes every 30 seconds. Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
