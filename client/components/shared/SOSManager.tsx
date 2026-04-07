'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SOSRequest {
  id: string;
  vehicleId: string;
  tripId: string;
  initiatorType: 'student' | 'driver';
  status: 'pending' | 'acknowledged' | 'responded' | 'resolved';
  location?: { latitude: number; longitude: number };
  createdAt: string;
  respondedAt?: string;
  notes?: string;
}

interface SOSManagerProps {
  vehicleId: string;
  tripId: string;
  onSendSOS?: (initiatorType: 'student' | 'driver') => Promise<void>;
  activeSOSRequests?: SOSRequest[];
  onAcknowledge?: (sosId: string) => void;
  onResolve?: (sosId: string, notes?: string) => void;
}

export function SOSManager({
  vehicleId,
  tripId,
  onSendSOS,
  activeSOSRequests = [],
  onAcknowledge,
  onResolve,
}: SOSManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedInitiator, setSelectedInitiator] = useState<'student' | 'driver'>('student');

  const handleSendSOS = async (initiatorType: 'student' | 'driver') => {
    setIsLoading(true);
    try {
      await onSendSOS?.(initiatorType);
      setShowConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    acknowledged: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    responded: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
    resolved: 'bg-green-500/20 text-green-700 dark:text-green-400',
  };

  const statusIcons = {
    pending: AlertCircle,
    acknowledged: AlertCircle,
    responded: AlertCircle,
    resolved: CheckCircle2,
  };

  return (
    <div className="space-y-4">
      {/* SOS Button */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-600 dark:text-red-400" />
              Emergency SOS
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Trigger emergency alert for immediate assistance
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 h-12"
              disabled={isLoading || activeSOSRequests.some(r => r.status !== 'resolved')}
            >
              <Phone className="w-5 h-5" />
              Activate SOS
            </Button>
          </div>

          {activeSOSRequests.some(r => r.status !== 'resolved') && (
            <p className="text-xs text-red-600 dark:text-red-400">
              An SOS request is already active
            </p>
          )}
        </div>
      </Card>

      {/* Active SOS Requests */}
      {activeSOSRequests.length > 0 && (
        <Card className="p-6 bg-red-500/10 border border-red-500/30">
          <div className="space-y-4">
            <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Active SOS Requests
            </h3>

            {activeSOSRequests.map((sos) => {
              const StatusIcon = statusIcons[sos.status];
              return (
                <div
                  key={sos.id}
                  className="p-4 rounded-lg bg-card border border-red-500/30 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {sos.initiatorType} {sos.status === 'resolved' ? 'SOS' : 'SOS Alert'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(sos.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[sos.status]} border-0 capitalize`}>
                      {sos.status}
                    </Badge>
                  </div>

                  {sos.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {sos.location.latitude.toFixed(4)}, {sos.location.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {sos.respondedAt && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>
                        Responded:{' '}
                        {new Date(sos.respondedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  )}

                  {sos.notes && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <p className="font-medium mb-1">Notes:</p>
                      <p>{sos.notes}</p>
                    </div>
                  )}

                  {sos.status !== 'resolved' && (
                    <div className="flex gap-2">
                      {sos.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAcknowledge?.(sos.id)}
                          className="flex-1 gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Acknowledge
                        </Button>
                      )}
                      {sos.status !== 'pending' && (
                        <Button
                          size="sm"
                          className="flex-1 gap-1 bg-green-600 hover:bg-green-700"
                          onClick={() => onResolve?.(sos.id)}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Resolve SOS
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* SOS Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-sm w-full p-6 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Activate Emergency SOS?</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Emergency services and all vehicle operators will be notified immediately.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Who is requesting help?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedInitiator === 'student' ? 'default' : 'outline'}
                    onClick={() => setSelectedInitiator('student')}
                    className="flex-1"
                  >
                    Student
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedInitiator === 'driver' ? 'default' : 'outline'}
                    onClick={() => setSelectedInitiator('driver')}
                    className="flex-1"
                  >
                    Driver
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => handleSendSOS(selectedInitiator)}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 h-10"
              >
                {isLoading ? 'Sending...' : 'Confirm & Send SOS'}
              </Button>
              <Button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
