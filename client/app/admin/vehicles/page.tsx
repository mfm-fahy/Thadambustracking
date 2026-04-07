'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { VehicleTable } from '@/components/admin/VehicleTable';
import { mockData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Truck, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'maintenance'>('all');

  useEffect(() => {
    const mockVehicles = mockData.generateVehicles(10);
    setVehicles(mockVehicles);
    setFilteredVehicles(mockVehicles);
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.registration_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, statusFilter, vehicles]);

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
                  <Truck className="w-8 h-8" />
                  Vehicles
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your fleet of vehicles
                </p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Filters */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle name or registration..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                All ({vehicles.length})
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
              >
                Active ({vehicles.filter(v => v.status === 'active').length})
              </Button>
              <Button
                variant={statusFilter === 'maintenance' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('maintenance')}
              >
                Maintenance ({vehicles.filter(v => v.status === 'maintenance').length})
              </Button>
            </div>
          </div>

          {/* Table */}
          <VehicleTable vehicles={filteredVehicles} />

          {filteredVehicles.length === 0 && (
            <Card className="p-12 text-center bg-card border-border">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-foreground font-medium">No vehicles found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
