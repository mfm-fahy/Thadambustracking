/**
 * Real-time client for managing live updates
 * Supports WebSocket connections and polling fallback
 */

export type RealtimeEventType =
  | 'LOCATION_UPDATE'
  | 'ALERT_CREATED'
  | 'ALERT_RESOLVED'
  | 'SOS_REQUEST'
  | 'SOS_RESOLVED'
  | 'BOARDING_CONFIRMED'
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'TRIP_DELAYED'
  | 'VEHICLE_STATUS_CHANGED'
  | 'OCCUPANCY_CHANGED';

export interface RealtimeEvent<T = any> {
  type: RealtimeEventType;
  timestamp: string;
  data: T;
  source?: string;
}

export interface RealtimeSubscription {
  id: string;
  channel: string;
  callback: (event: RealtimeEvent) => void;
  unsubscribe: () => void;
}

class RealtimeClient {
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private eventQueue: RealtimeEvent[] = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    // In production, establish WebSocket connection here
    // For now, simulate connection
    this.isConnected = true;
    this.startPolling();
  }

  private startPolling() {
    // Simulate polling for real-time updates
    setInterval(() => {
      // Process event queue and notify subscribers
      this.processEventQueue();
    }, 2000);
  }

  private processEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.notifySubscribers(event);
      }
    }
  }

  private notifySubscribers(event: RealtimeEvent) {
    this.subscriptions.forEach((subscription) => {
      if (this.matchesChannel(event.type, subscription.channel)) {
        subscription.callback(event);
      }
    });
  }

  private matchesChannel(eventType: string, channel: string): boolean {
    if (channel === '*') return true;
    return eventType.toLowerCase().includes(channel.toLowerCase());
  }

  /**
   * Subscribe to real-time events on a channel
   */
  subscribe(
    channel: string,
    callback: (event: RealtimeEvent) => void
  ): RealtimeSubscription {
    const subscriptionId = `${channel}-${Date.now()}-${Math.random()}`;

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      callback,
      unsubscribe: () => {
        this.subscriptions.delete(subscriptionId);
      },
    };

    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  /**
   * Emit an event to all subscribers
   */
  emit(event: RealtimeEvent) {
    this.eventQueue.push(event);
  }

  /**
   * Broadcast location update
   */
  broadcastLocation(
    vehicleId: string,
    latitude: number,
    longitude: number,
    accuracy?: number
  ) {
    this.emit({
      type: 'LOCATION_UPDATE',
      timestamp: new Date().toISOString(),
      data: {
        vehicleId,
        latitude,
        longitude,
        accuracy,
      },
    });
  }

  /**
   * Broadcast alert
   */
  broadcastAlert(
    vehicleId: string,
    alertType: string,
    severity: string,
    message: string
  ) {
    this.emit({
      type: 'ALERT_CREATED',
      timestamp: new Date().toISOString(),
      data: {
        vehicleId,
        alertType,
        severity,
        message,
      },
    });
  }

  /**
   * Broadcast SOS request
   */
  broadcastSOS(vehicleId: string, tripId: string, initiatorType: string) {
    this.emit({
      type: 'SOS_REQUEST',
      timestamp: new Date().toISOString(),
      data: {
        vehicleId,
        tripId,
        initiatorType,
        location: null, // Would include actual location
      },
    });
  }

  /**
   * Broadcast boarding confirmation
   */
  broadcastBoarding(
    tripId: string,
    studentId: string,
    status: 'confirmed' | 'boarding' | 'onboard'
  ) {
    this.emit({
      type: 'BOARDING_CONFIRMED',
      timestamp: new Date().toISOString(),
      data: {
        tripId,
        studentId,
        status,
      },
    });
  }

  /**
   * Broadcast occupancy change
   */
  broadcastOccupancyChange(
    vehicleId: string,
    occupancy: number,
    capacity: number
  ) {
    this.emit({
      type: 'OCCUPANCY_CHANGED',
      timestamp: new Date().toISOString(),
      data: {
        vehicleId,
        occupancy,
        capacity,
        percentage: (occupancy / capacity) * 100,
      },
    });
  }

  /**
   * Unsubscribe from all channels
   */
  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.isConnected = false;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      subscriptionCount: this.subscriptions.size,
      eventQueueSize: this.eventQueue.length,
    };
  }
}

// Export singleton instance
export const realtimeClient = new RealtimeClient();

export default realtimeClient;
