'use client';

import { Sidebar } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Settings, Key, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Settings
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Organization Settings */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Organization Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Organization Name</label>
                <Input
                  placeholder="Enter organization name"
                  defaultValue="Thadam Transport Co."
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="admin@company.com"
                  defaultValue="admin@thadam.com"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  defaultValue="+1 (555) 123-4567"
                  className="mt-2"
                />
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                Save Changes
              </Button>
            </div>
          </Card>

          {/* API Settings */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Key className="w-5 h-5" />
              API & Integrations
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Configure external service integrations
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Google Maps API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your Google Maps API key"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required for map features in vehicle tracking
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Supabase URL</label>
                <Input
                  placeholder="https://your-project.supabase.co"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Supabase API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your Supabase API key"
                  className="mt-2"
                />
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                Test Connection
              </Button>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="font-medium text-foreground">Critical Alerts</p>
                  <p className="text-xs text-muted-foreground">Receive notifications for critical system alerts</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="font-medium text-foreground">Trip Delays</p>
                  <p className="text-xs text-muted-foreground">Notify when vehicles are delayed</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="font-medium text-foreground">Vehicle Maintenance</p>
                  <p className="text-xs text-muted-foreground">Remind about scheduled maintenance</p>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                Save Preferences
              </Button>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-2"
                />
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                Update Password
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 bg-red-500/10 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    Clear Cache
                  </Button>
                  <Button variant="destructive" size="sm">
                    Export Data
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete Organization
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
