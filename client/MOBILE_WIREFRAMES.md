# Thadam Mobile Wireframes

## Overview

Thadam requires mobile applications for both passengers (students/parents) and drivers. This document provides detailed wireframes and specifications for implementing native iOS and Android apps using React Native.

---

## Passenger Mobile App (Student/Parent)

### 1. **Home Screen / Trip Dashboard**

**Description:** First screen when user launches the app. Shows active trip status and quick actions.

**Layout:**
```
┌─────────────────────────────┐
│ ← Thadam                 │  Header
├─────────────────────────────┤
│  Active Trip                │
│  ┌─────────────────────────┐│
│  │ Bus Route 5             ││  Trip Card
│  │ ▶ Depart: 8:15 AM      ││
│  │ ● Arrive: 8:45 AM (18m)││
│  │ Status: In Transit      ││
│  └─────────────────────────┘│
│                             │
│ ┌─────────────────────────┐│
│ │ 🗺 Live Tracking       ││  Quick Actions
│ │ 📱 Boarding Status     ││
│ │ 🆘 Emergency SOS       ││
│ │ 📲 Notifications       ││
│ └─────────────────────────┘│
└─────────────────────────────┘
```

**Components:**
- Header with navigation
- Active trip card with status
- ETA countdown
- Quick action buttons
- Occupancy indicator badge

**Navigation:** Tap trip card to view full tracking

---

### 2. **Live Tracking Screen**

**Description:** Real-time vehicle location on map with route visualization.

**Layout:**
```
┌─────────────────────────────┐
│ ← Vehicle Tracking          │  Header
├─────────────────────────────┤
│                             │
│        🗺 MAP VIEW          │  Google Maps
│    ⊕ Current Location      │  • Vehicle marker (blue)
│    ⊕ Next Stop             │  • Route (gray line)
│                             │  • Destination (red pin)
│                             │
│ ┌─────────────────────────┐│
│ │ 📍 2.5 km away          ││  Distance Card
│ │ ⏱ Arriving in 12 min    ││
│ │ 👥 28/50 passengers     ││
│ └─────────────────────────┘│
│                             │
│ [Contact Driver] [🆘 SOS]   │  Actions
└─────────────────────────────┘
```

**Components:**
- Full-screen map with Google Maps
- Vehicle real-time position
- Route and destination markers
- Distance and ETA card
- Action buttons

**Tech:** React Native Google Maps, React Native Geolocation

---

### 3. **Boarding Confirmation Screen**

**Description:** QR code scanning and boarding confirmation flow.

**Layout:**
```
┌─────────────────────────────┐
│ ← Boarding                  │  Header
├─────────────────────────────┤
│                             │
│  Your Status: Pending       │  Status Section
│  Waiting for confirmation   │
│                             │
│ ┌─────────────────────────┐│
│ │                         ││  QR Scanner Box
│ │   [📷 Scan QR Code]    ││
│ │                         ││
│ │  OR                     ││
│ │                         ││
│ │ [Student ID: S12345]    ││
│ └─────────────────────────┘│
│                             │
│  Student Details:           │
│  John Doe                   │
│  Class 10-A                 │
│                             │
│ [Confirm Boarding]          │  Action
└─────────────────────────────┘
```

**Components:**
- QR scanner integration
- Student ID display
- Boarding status badge
- Manual ID fallback

**Tech:** React Native Camera, react-native-qrcode-scanner

---

### 4. **Parent Portal Screen**

**Description:** Parent view to monitor assigned students.

**Layout:**
```
┌─────────────────────────────┐
│ Parent Portal               │  Header
├─────────────────────────────┤
│                             │
│ Students Tracked:           │
│ ┌─────────────────────────┐│
│ │ John Doe                ││  Student Card
│ │ 🚌 Route 5 → School     ││
│ │ ⏱ ETA: 8:45 AM         ││
│ │ 👥 Moderate (25/50)     ││
│ │ ✓ Boarding confirmed    ││
│ └─────────────────────────┘│
│                             │
│ ┌─────────────────────────┐│
│ │ Jane Doe                ││
│ │ 🚌 Route 7 → Station    ││
│ │ ⏱ ETA: 9:15 AM         ││
│ │ 👥 Full (50/50)         ││
│ │ ⏳ Awaiting confirmation ││
│ └─────────────────────────┘│
│                             │
│ [View Full Details]         │
└─────────────────────────────┘
```

**Components:**
- Student list cards
- Real-time ETA
- Occupancy status
- Boarding confirmation
- Contact driver button

---

### 5. **Emergency SOS Screen**

**Description:** Quick access to emergency alert system.

**Layout:**
```
┌─────────────────────────────┐
│ ← Emergency                 │  Header
├─────────────────────────────┤
│                             │
│  🆘 EMERGENCY SOS           │  Alert Section
│                             │
│  Status: Ready              │
│  Response Time: <2 min      │
│                             │
│ ┌─────────────────────────┐│
│ │ [🆘 ACTIVATE SOS]       ││  Large Button
│ │ Hold for 3 seconds      ││
│ └─────────────────────────┘│
│                             │
│  Your Location:             │  Location
│  📍 40.7128°N, 74.0060°W   │
│  Accuracy: ±5 meters       │
│                             │
│  Recent History:            │  History
│  No active SOS requests    │
│                             │
└─────────────────────────────┘
```

**Components:**
- Large SOS button with hold-to-activate
- Current location display
- GPS accuracy indicator
- SOS request history
- Contact emergency button

---

### 6. **Notifications Screen**

**Description:** View all alerts and notifications.

**Layout:**
```
┌─────────────────────────────┐
│ Notifications               │  Header
├─────────────────────────────┤
│                             │
│ 🔴 Critical Alerts (2)      │  Section Header
│ ┌─────────────────────────┐│
│ │ ⚠️ SOS Request Active   ││  Notification
│ │ Vehicle approaching     ││
│ │ 2 minutes ago           ││
│ └─────────────────────────┘│
│ ┌─────────────────────────┐│
│ │ 🚨 Route Deviation     ││
│ │ Vehicle off planned    ││
│ │ route, investigating   ││
│ │ 5 minutes ago           ││
│ └─────────────────────────┘│
│                             │
│ 🟡 Warnings (3)             │
│ ┌─────────────────────────┐│
│ │ ⏱️ Delayed Arrival      ││
│ │ Running 8 min late     ││
│ │ 15 minutes ago          ││
│ └─────────────────────────┘│
│                             │
│ [Clear All] [Settings]      │
└─────────────────────────────┘
```

**Components:**
- Notification list grouped by severity
- Timestamp and summary
- Swipe to dismiss
- Notification settings

---

## Driver Mobile App

### 1. **Driver Dashboard**

**Description:** Active trip management and passenger overview.

**Layout:**
```
┌─────────────────────────────┐
│ Driver Dashboard            │  Header
├─────────────────────────────┤
│                             │
│ Current Trip: Route 5       │  Trip Info
│ ⏱ Started: 8:15 AM         │
│ Duration: 18 minutes left   │
│                             │
│ 👥 Occupancy: 28/50 ████░  │  Occupancy
│ Status: MODERATE            │
│                             │
│ Next Stop: Central Plaza    │
│ Distance: 2.5 km            │
│ ETA: 8:35 AM                │
│                             │
│ ┌────────────┬────────────┐│
│ │ [Start] │ [Complete]   ││  Actions
│ │ [🆘 SOS] │ [Passengers] ││
│ └────────────┴────────────┘│
└─────────────────────────────┘
```

**Components:**
- Active trip summary
- Occupancy gauge
- Next stop information
- Route navigation
- Trip controls

---

### 2. **Passenger Check-In List**

**Description:** Manage boarding and drop-off confirmations.

**Layout:**
```
┌─────────────────────────────┐
│ ← Passengers                │  Header
├─────────────────────────────┤
│                             │
│ Awaiting Boarding (5)       │  Section
│ ┌─────────────────────────┐│
│ │ John Doe                ││  Passenger
│ │ ID: S12345              ││
│ │ [✓ Confirm]             ││
│ └─────────────────────────┘│
│ ┌─────────────────────────┐│
│ │ Jane Smith              ││
│ │ ID: S12346              ││
│ │ [✓ Confirm]             ││
│ └─────────────────────────┘│
│                             │
│ On Board (23)               │
│ ┌─────────────────────────┐│
│ │ ✓ Michael Johnson       ││
│ │ ✓ Sarah Williams        ││
│ │ ✓ [+20 more]            ││
│ └─────────────────────────┘│
│                             │
│ [Scan QR Code]              │
└─────────────────────────────┘
```

**Components:**
- Boarding status groups
- Quick confirm buttons
- Passenger list
- QR scanner
- Collapse/expand sections

---

### 3. **Route Navigation**

**Description:** Turn-by-turn navigation with real-time updates.

**Layout:**
```
┌─────────────────────────────┐
│ ← Route Navigation          │  Header
├─────────────────────────────┤
│                             │
│      🗺 MAP VIEW            │  Map Display
│                             │
│                             │
│ ┌─────────────────────────┐│
│ │ ➡️ Turn right on        ││  Next Turn
│ │ Main Street              ││
│ │ In 500m                  ││
│ │                          ││
│ │ Destination ahead on    ││
│ │ the right                ││
│ └─────────────────────────┘│
│                             │
│ Current: Main Street        │  Status
│ Speed: 35 km/h             │
│ Traffic: Light             │
│                             │
│ [← Go Back] [Skip] [Stop]  │
└─────────────────────────────┘
```

**Components:**
- Map with route overlay
- Next turn preview
- Distance and time
- Current street info
- Speed and traffic

---

### 4. **Vehicle Status & Settings**

**Description:** Vehicle diagnostics and settings.

**Layout:**
```
┌─────────────────────────────┐
│ Vehicle Status              │  Header
├─────────────────────────────┤
│                             │
│ Vehicle: Bus-005            │  Info
│ Registration: TM-1005       │
│ Status: ✓ Active            │
│                             │
│ Diagnostics:                │
│ • GPS: ✓ Connected          │
│ • Fuel: 65% (Good)          │
│ • Tire Pressure: ✓ Normal   │
│ • Engine: ✓ OK              │
│ • Battery: 92%              │
│                             │
│ Recent Maintenance:         │
│ • Oil change: 250 km ago   │
│ • Last inspection: 5 days   │
│                             │
│ [Report Issue] [Settings]   │
└─────────────────────────────┘
```

**Components:**
- Vehicle info display
- System health status
- Maintenance history
- Settings access
- Issue reporting

---

## Mobile App Features Summary

### Common Features (Both Apps)

1. **Real-time Location Tracking**
   - Live GPS updates
   - Background location services
   - Power-efficient polling

2. **Push Notifications**
   - ETA updates
   - Alert notifications
   - SOS alerts
   - System messages

3. **Offline Support**
   - Cache last known location
   - Queue actions for sync
   - Offline maps download

4. **Authentication**
   - Biometric login (Face ID / Fingerprint)
   - Session persistence
   - Secure token storage

5. **Emergency Features**
   - Quick SOS activation
   - Location sharing
   - Emergency contact alerts
   - Response tracking

### Performance Considerations

- Use native modules for GPS and maps
- Implement efficient location polling
- Cache API responses
- Use service workers for background tasks
- Optimize battery usage

### Testing Checklist

- [ ] Offline functionality
- [ ] GPS accuracy and updates
- [ ] Push notification delivery
- [ ] Map rendering performance
- [ ] Emergency SOS activation
- [ ] QR code scanning (passengers)
- [ ] Battery consumption

---

## API Endpoints Required for Mobile

```typescript
// Location
POST /api/vehicles/{id}/location
GET /api/vehicles/{id}/location
GET /api/vehicles/{id}/locations?hours=24

// Trips
GET /api/trips/{id}
GET /api/trips/{id}/eta
PATCH /api/trips/{id}/status

// Boarding
POST /api/boarding/scan-qr
POST /api/boarding/{id}/confirm

// Alerts
GET /api/alerts/active
POST /api/alerts/{id}/resolve

// SOS
POST /api/sos
GET /api/sos/active
PATCH /api/sos/{id}/acknowledge
PATCH /api/sos/{id}/resolve

// Parent Portal
GET /api/parent-portal/students/{id}
GET /api/parent-portal/students/{id}/trips
```

---

## Next Steps for Implementation

1. **Choose Technology Stack**
   - Option 1: React Native + Expo
   - Option 2: React Native with native modules
   - Option 3: Native iOS + Android

2. **Set Up Development Environment**
   - iOS: Xcode + CocoaPods
   - Android: Android Studio + Gradle
   - Testing: Simulators + Real devices

3. **Implementation Phases**
   - Phase 1: Authentication + Basic Navigation
   - Phase 2: Location Tracking + Maps
   - Phase 3: Real-time Updates
   - Phase 4: Safety Features (SOS, Alerts)
   - Phase 5: Polish + Performance

4. **Third-party Integrations**
   - Google Maps / Apple Maps
   - Firebase Cloud Messaging (FCM)
   - OneSignal (Push notifications)
   - Bugsnag (Error tracking)

---

## Design Specifications

### Color Scheme (Matches Web)
- Primary: Dark Blue (#0f1a3d)
- Accent: Orange (#ff6b35)
- Success: Green (#4caf50)
- Warning: Yellow (#ffc107)
- Danger: Red (#f44336)

### Typography
- Headlines: Geist Bold
- Body: Geist Regular
- Monospace: Geist Mono

### Component Library
- React Native Paper (Material Design)
- React Native Gesture Handler
- React Native Reanimated (Animations)
- React Navigation (Routing)

---

## Accessibility Standards

- WCAG 2.1 Level AA compliance
- Large touch targets (min 44x44 pt)
- High contrast ratios
- Screen reader support
- Haptic feedback for actions

---

This document provides comprehensive wireframes and specifications for building Thadam mobile applications. Connect with your development team to begin implementation.
