'use client';

import { Sidebar } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Plus } from 'lucide-react';
import { RouteOverviewMap } from '@/components/admin/RouteOverviewMap';

export default function RoutesPage() {
  const mockRoutes = [
    {
      id: '1',
      name: 'Downtown Route A',
      startPoint: 'Central Station',
      endPoint: 'Tech Park',
      distance: 15.5,
      estimatedTime: 45,
      activeTrips: 3,
    },
    {
      id: '2',
      name: 'Uptown Express',
      startPoint: 'Tech Park',
      endPoint: 'University Campus',
      distance: 8.2,
      estimatedTime: 25,
      activeTrips: 2,
    },
    {
      id: '3',
      name: 'Suburban Loop',
      startPoint: 'Central Station',
      endPoint: 'Residential Zone',
      distance: 22.1,
      estimatedTime: 65,
      activeTrips: 1,
    },
    {
      id: '4',
      name: 'Airport Shuttle',
      startPoint: 'Central Station',
      endPoint: 'Airport Terminal',
      distance: 25.0,
      estimatedTime: 50,
      activeTrips: 4,
    },
  ];

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
                  <MapPin className="w-8 h-8" />
                  Routes
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and monitor vehicle routes
                </p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                New Route
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Routes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockRoutes.map((route) => (
              <Card key={route.id} className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{route.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {route.activeTrips} active trip{route.activeTrips !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-accent/20 text-accent text-xs font-medium">
                      {route.activeTrips > 0 ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{route.startPoint}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{route.endPoint}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-lg font-semibold text-foreground">{route.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Est. Time</p>
                      <p className="text-lg font-semibold text-foreground">{route.estimatedTime} min</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View on Map
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Route Map */}
          <Card className="p-2 border border-border rounded-lg shadow-sm">
            <RouteOverviewMap routes={mockRoutes} />
          </Card>
        </div>
      </main>
    </div>
  );
}
