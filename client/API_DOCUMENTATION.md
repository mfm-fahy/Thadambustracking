# Thadam API Documentation

## Overview

Thadam API provides comprehensive endpoints for real-time vehicle tracking, trip management, passenger handling, and emergency response. This document describes all available endpoints and their usage.

**Base URL:** `https://api.thadam.com/v1`

**Authentication:** Bearer token in `Authorization` header

---

## Table of Contents

1. [Authentication](#authentication)
2. [Vehicles](#vehicles)
3. [Locations](#locations)
4. [Routes](#routes)
5. [Trips](#trips)
6. [Boarding & Passengers](#boarding--passengers)
7. [Alerts](#alerts)
8. [SOS Requests](#sos-requests)
9. [Parent Portal](#parent-portal)
10. [Analytics](#analytics)
11. [Webhooks](#webhooks)

---

## Authentication

All API requests require authentication using JWT tokens.

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  },
  "expires_in": 3600
}
```

### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Vehicles

### List All Vehicles

```http
GET /vehicles
Authorization: Bearer {token}
```

**Query Parameters:**
- `status`: Filter by status (active, inactive, maintenance)
- `limit`: Number of results (default: 50, max: 100)
- `offset`: Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "vehicle-1",
      "registration_number": "TM-1001",
      "name": "Bus Route 5",
      "type": "bus",
      "capacity": 50,
      "current_occupancy": 28,
      "occupancy_status": "moderate",
      "driver_id": "driver-1",
      "organization_id": "org-1",
      "status": "active",
      "last_location": {
        "latitude": 40.7128,
        "longitude": -74.006,
        "timestamp": "2026-04-06T10:30:00Z"
      },
      "created_at": "2025-12-01T00:00:00Z",
      "updated_at": "2026-04-06T10:30:00Z"
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

### Get Vehicle Details

```http
GET /vehicles/{vehicleId}
Authorization: Bearer {token}
```

**Response:** Single vehicle object with full details

### Create Vehicle

```http
POST /vehicles
Authorization: Bearer {token}
Content-Type: application/json

{
  "registration_number": "TM-1002",
  "name": "Bus Route 6",
  "type": "bus",
  "capacity": 50,
  "driver_id": "driver-2"
}
```

### Update Vehicle

```http
PUT /vehicles/{vehicleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Bus Route 5 (Updated)",
  "status": "maintenance"
}
```

### Update Occupancy Status

```http
PATCH /vehicles/{vehicleId}/occupancy
Authorization: Bearer {token}
Content-Type: application/json

{
  "occupancy_status": "full",
  "current_occupancy": 50
}
```

---

## Locations

### Get Current Location

```http
GET /vehicles/{vehicleId}/location
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "loc-123",
  "vehicle_id": "vehicle-1",
  "latitude": 40.7128,
  "longitude": -74.006,
  "accuracy": 5.2,
  "speed": 35.4,
  "heading": 180,
  "timestamp": "2026-04-06T10:30:45Z",
  "created_at": "2026-04-06T10:30:45Z"
}
```

### Get Location History

```http
GET /vehicles/{vehicleId}/locations
Authorization: Bearer {token}
```

**Query Parameters:**
- `hours`: Historical data (default: 24, max: 720)
- `limit`: Number of records
- `format`: `raw` or `aggregated` (default: raw)

### Update Location

```http
POST /vehicles/{vehicleId}/location
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 40.7150,
  "longitude": -74.0100,
  "accuracy": 5.2,
  "speed": 35.4,
  "heading": 180
}
```

**Used by:** Driver apps, GPS tracking devices

---

## Routes

### List Routes

```http
GET /routes
Authorization: Bearer {token}
```

**Query Parameters:**
- `active_only`: Boolean
- `organization_id`: Filter by organization

### Get Route Details

```http
GET /routes/{routeId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "route-1",
  "name": "Downtown Route A",
  "organization_id": "org-1",
  "start_point": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "Central Station, NYC"
  },
  "end_point": {
    "latitude": 40.7489,
    "longitude": -73.9680,
    "address": "Tech Park, NYC"
  },
  "waypoints": [
    {
      "latitude": 40.7200,
      "longitude": -74.0000,
      "address": "Main St & 5th Ave"
    }
  ],
  "estimated_duration": 45,
  "distance": 15.5,
  "schedule": [
    {
      "day_of_week": 1,
      "start_time": "08:00",
      "end_time": "17:00",
      "is_active": true
    }
  ]
}
```

### Create Route

```http
POST /routes
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Evening Route B",
  "start_point": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "Central Station"
  },
  "end_point": {
    "latitude": 40.7489,
    "longitude": -73.9680,
    "address": "Tech Park"
  },
  "waypoints": [],
  "estimated_duration": 45,
  "distance": 15.5
}
```

### Update Route

```http
PUT /routes/{routeId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Downtown Route A (Updated)",
  "waypoints": [...]
}
```

---

## Trips

### Get Current Trips

```http
GET /trips/current
Authorization: Bearer {token}
```

**Response:** Array of active trips

### Get Trip Details

```http
GET /trips/{tripId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "trip-1",
  "vehicle_id": "vehicle-1",
  "route_id": "route-1",
  "driver_id": "driver-1",
  "start_time": "2026-04-06T08:15:00Z",
  "estimated_end_time": "2026-04-06T09:00:00Z",
  "actual_end_time": null,
  "status": "in_progress",
  "current_waypoint_index": 2,
  "passengers": 28,
  "created_at": "2026-04-06T08:00:00Z",
  "updated_at": "2026-04-06T10:30:00Z"
}
```

### Create Trip

```http
POST /trips
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicle_id": "vehicle-1",
  "route_id": "route-1",
  "driver_id": "driver-1",
  "start_time": "2026-04-06T08:15:00Z"
}
```

### Update Trip Status

```http
PATCH /trips/{tripId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed",
  "actual_end_time": "2026-04-06T09:05:00Z"
}
```

### Get ETA

```http
GET /trips/{tripId}/eta
Authorization: Bearer {token}
```

**Response:**
```json
{
  "trip_id": "trip-1",
  "current_waypoint_index": 2,
  "remaining_distance": 5.2,
  "estimated_arrival_time": "2026-04-06T08:45:00Z",
  "updated_at": "2026-04-06T10:30:00Z"
}
```

---

## Boarding & Passengers

### Scan QR Code

```http
POST /boarding/scan-qr
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "STUDENT-12345-QR-CODE",
  "trip_id": "trip-1"
}
```

**Response:**
```json
{
  "student_id": "student-123",
  "name": "John Doe",
  "status": "confirmed",
  "boarding_time": "2026-04-06T08:15:30Z"
}
```

### Confirm Boarding

```http
POST /boarding/{confirmationId}/confirm
Authorization: Bearer {token}
Content-Type: application/json

{
  "parent_id": "parent-1",
  "student_id": "student-123"
}
```

### Get Boarding Status

```http
GET /trips/{tripId}/boarding-status
Authorization: Bearer {token}
```

**Response:** Array of boarding confirmations with statuses

### Get Student QR Code

```http
GET /students/{studentId}/qr-code
Authorization: Bearer {token}
```

**Response:**
```json
{
  "student_id": "student-123",
  "qr_code": "https://api.thadam.com/qr/student-123.png",
  "code_value": "STUDENT-12345-QR-CODE"
}
```

---

## Alerts

### List Active Alerts

```http
GET /alerts/active
Authorization: Bearer {token}
```

**Query Parameters:**
- `severity`: Filter (critical, high, medium, low)
- `vehicle_id`: Filter by vehicle

### Get Alert Details

```http
GET /alerts/{alertId}
Authorization: Bearer {token}
```

### Create Alert

```http
POST /alerts
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicle_id": "vehicle-1",
  "alert_type": "route_deviation",
  "severity": "high",
  "message": "Vehicle deviated from planned route"
}
```

### Resolve Alert

```http
PATCH /alerts/{alertId}/resolve
Authorization: Bearer {token}
Content-Type: application/json

{
  "resolved_by": "operator-1",
  "notes": "Driver confirmed and adjusted route"
}
```

### Get Vehicle Alerts

```http
GET /vehicles/{vehicleId}/alerts
Authorization: Bearer {token}
```

---

## SOS Requests

### Send SOS

```http
POST /sos
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicle_id": "vehicle-1",
  "trip_id": "trip-1",
  "initiator_type": "student",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006
  }
}
```

**Response:**
```json
{
  "id": "sos-123",
  "vehicle_id": "vehicle-1",
  "status": "pending",
  "location": {...},
  "created_at": "2026-04-06T10:35:00Z"
}
```

### Get Active SOS Requests

```http
GET /sos/active
Authorization: Bearer {token}
```

### Acknowledge SOS

```http
PATCH /sos/{sosId}/acknowledge
Authorization: Bearer {token}
Content-Type: application/json

{
  "responder_id": "operator-1"
}
```

### Resolve SOS

```http
PATCH /sos/{sosId}/resolve
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Emergency resolved. Medical assistance provided."
}
```

---

## Parent Portal

### Get Student Status

```http
GET /parent-portal/students/{studentId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "student_id": "student-123",
  "name": "John Doe",
  "current_trip": {
    "vehicle_id": "vehicle-1",
    "vehicle_name": "Bus Route 5",
    "status": "in_progress",
    "driver_name": "Mike Smith",
    "eta": "2026-04-06T08:45:00Z",
    "current_location": {...},
    "occupancy": "moderate"
  },
  "boarding_status": "confirmed",
  "alerts": [],
  "last_drop_off": "2026-04-05T17:30:00Z"
}
```

### Get Student Trips

```http
GET /parent-portal/students/{studentId}/trips
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit`: Number of trips (default: 10)
- `days`: Historical days (default: 7)

### Get Parent Notifications

```http
GET /parent-portal/notifications
Authorization: Bearer {token}
```

**Query Parameters:**
- `unread_only`: Boolean
- `limit`: Number of notifications

---

## Analytics

### Get Daily Analytics

```http
GET /analytics/daily
Authorization: Bearer {token}
```

**Query Parameters:**
- `date`: YYYY-MM-DD format
- `organization_id`: Optional filter

**Response:**
```json
{
  "date": "2026-04-06",
  "total_trips": 24,
  "total_distance": 245.6,
  "total_time": 1440,
  "average_occupancy": 42.5,
  "on_time_trips": 23,
  "delayed_trips": 1,
  "cancelled_trips": 0,
  "safety_score": 9.8
}
```

### Get Vehicle Analytics

```http
GET /analytics/vehicles/{vehicleId}
Authorization: Bearer {token}
```

**Query Parameters:**
- `days`: Historical period (default: 30)

### Get Reports

```http
GET /analytics/reports
Authorization: Bearer {token}
```

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD
- `report_type`: performance, safety, efficiency, occupancy

---

## Webhooks

### Register Webhook

```http
POST /webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://yourserver.com/webhooks/thadam",
  "events": [
    "trip.started",
    "trip.completed",
    "alert.created",
    "sos.received",
    "location.updated"
  ]
}
```

### Webhook Events

#### Trip Started
```json
{
  "event": "trip.started",
  "timestamp": "2026-04-06T08:15:00Z",
  "data": {
    "trip_id": "trip-1",
    "vehicle_id": "vehicle-1",
    "route_id": "route-1",
    "driver_id": "driver-1"
  }
}
```

#### Alert Created
```json
{
  "event": "alert.created",
  "timestamp": "2026-04-06T10:30:00Z",
  "data": {
    "alert_id": "alert-1",
    "vehicle_id": "vehicle-1",
    "alert_type": "route_deviation",
    "severity": "high"
  }
}
```

#### SOS Received
```json
{
  "event": "sos.received",
  "timestamp": "2026-04-06T10:35:00Z",
  "data": {
    "sos_id": "sos-123",
    "vehicle_id": "vehicle-1",
    "trip_id": "trip-1",
    "initiator_type": "student",
    "location": {...}
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "ROUTE_NOT_FOUND",
    "message": "The specified route does not exist",
    "status": 404,
    "details": {
      "route_id": "route-999"
    }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `SERVER_ERROR` (500): Internal server error

---

## Rate Limiting

- **Requests per minute:** 100 (standard users), 1000 (premium)
- **Batch endpoints:** 10 requests per minute
- **File uploads:** 50 MB per request, 1 GB per day

---

## Pagination

Standard pagination format:
```json
{
  "data": [...],
  "total": 100,
  "limit": 50,
  "offset": 0,
  "has_more": true
}
```

---

## SDKs

### JavaScript/TypeScript

```bash
npm install @thadam/sdk
```

```typescript
import Thadam from '@thadam/sdk';

const client = new Thadam({
  apiKey: 'your-api-key',
  baseURL: 'https://api.thadam.com/v1'
});

// Get vehicle
const vehicle = await client.vehicles.get('vehicle-1');

// Update location
await client.locations.update('vehicle-1', {
  latitude: 40.7128,
  longitude: -74.006
});
```

---

## Support

- **Documentation:** https://docs.thadam.com
- **Status Page:** https://status.thadam.com
- **Support Email:** api-support@thadam.com
- **Discord Community:** https://discord.gg/thadam
