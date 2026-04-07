# Thadam - Vehicle Tracking & Student Safety Platform

A comprehensive, real-time vehicle tracking and fleet management system designed specifically for school buses, shuttle services, and student transportation with advanced safety features.

## 🎯 Features

### Core Features
- **Real-Time Vehicle Tracking** - Live GPS location updates with 2-5 second refresh
- **Route Management** - Create, edit, and manage vehicle routes with multiple waypoints
- **Trip Monitoring** - Track active trips with live occupancy and ETA
- **Student Boarding** - QR-code based confirmation system with parent verification
- **Parent Portal** - Track student location and boarding status in real-time

### Safety Features
- **Emergency SOS** - One-tap emergency alert with automatic responder notification
- **Route Deviation Alerts** - Automatic detection when vehicles deviate from planned routes
- **Occupancy Management** - Real-time passenger capacity tracking (Empty/Moderate/Full)
- **System Alerts** - Speed violations, delays, breakdowns, and other safety-critical alerts
- **Alert Resolution** - Operator dashboard for managing and resolving active alerts

### Admin Features
- **Fleet Dashboard** - Comprehensive overview of all vehicles and active trips
- **Vehicle Management** - Add, edit, and monitor vehicle status and diagnostics
- **Analytics & Reports** - Daily performance metrics, safety scores, on-time performance
- **User Management** - Role-based access control (Admin, Operator, Driver, Parent, Student)
- **Settings & Configuration** - Organization-wide settings and API integration

---

## 🏗️ Architecture

### Web Stack
- **Frontend:** Next.js 16 (React 19) with TypeScript
- **Styling:** Tailwind CSS with custom dark theme
- **UI Components:** shadcn/ui component library
- **State Management:** SWR for data fetching and caching
- **Real-time:** Custom polling system with WebSocket support

### Database
- **Primary:** PostgreSQL (via Supabase/Neon)
- **Real-time Subscriptions:** Supabase Realtime
- **Authentication:** JWT-based with Row-Level Security

### APIs
- **Maps:** Google Maps API for vehicle tracking
- **Geocoding:** Address lookup and validation
- **Notifications:** Push notifications (Firebase Cloud Messaging)
- **File Storage:** AWS S3 / Vercel Blob for documents and QR codes

---

## 📁 Project Structure

```
/vercel/share/v0-project/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Home/landing page
│   ├── passenger/                    # Passenger tracking interface
│   │   ├── page.tsx                  # Main tracking page
│   │   └── layout.tsx
│   ├── admin/                        # Admin dashboard
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── vehicles/                 # Vehicle management
│   │   ├── routes/                   # Route management
│   │   ├── alerts/                   # Alert management
│   │   ├── users/                    # User management
│   │   ├── settings/                 # Configuration
│   │   └── layout.tsx
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles & theme tokens
│
├── components/                       # Reusable React components
│   ├── ui/                           # shadcn/ui components
│   ├── passenger/                    # Passenger-specific components
│   │   ├── VehicleMap.tsx           # Live map display
│   │   ├── VehicleInfo.tsx          # Vehicle details card
│   │   ├── ETACard.tsx              # ETA countdown
│   │   └── BoardingConfirmation.tsx # Boarding status
│   ├── admin/                        # Admin-specific components
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   ├── FleetOverview.tsx        # Stats cards
│   │   ├── VehicleTable.tsx         # Vehicle listing
│   │   └── AlertsList.tsx           # Alert management
│   └── shared/                       # Shared components
│       ├── OccupancyManager.tsx     # Occupancy UI
│       ├── SOSManager.tsx           # Emergency SOS
│       └── AlertsCenter.tsx         # Notification center
│
├── lib/                              # Utilities and helpers
│   ├── api.ts                        # API client with endpoints
│   ├── types.ts                      # TypeScript type definitions
│   ├── realtime.ts                   # Real-time client
│   ├── utils.ts                      # Helper functions
│   └── hooks/
│       └── useRealtime.ts           # Real-time hooks
│
├── public/                           # Static assets
│   └── images/                       # Logos and illustrations
│
├── MOBILE_WIREFRAMES.md              # Mobile app designs
├── API_DOCUMENTATION.md              # API reference
├── README.md                         # This file
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
└── tailwind.config.ts                # Tailwind configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Google Maps API key (for maps)
- Supabase or Neon PostgreSQL instance

### Installation

1. **Clone and install dependencies**
```bash
pnpm install
```

2. **Configure environment variables**
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. **Set up database** (if using Supabase)
Run migrations from SQL files in `scripts/` folder to create tables and set up Row-Level Security

4. **Start development server**
```bash
pnpm dev
```

Visit http://localhost:3000

---

## 📱 Modules

### Passenger Tracking Interface (`/passenger`)

Real-time vehicle tracking for students and parents.

**Key Pages:**
- **Main Tracker** - Live map with vehicle location, ETA, and occupancy
- **Boarding Status** - QR code scanning and confirmation
- **Parent Portal** - View assigned students' status
- **Emergency SOS** - One-tap emergency alert

**Components:**
- `VehicleMap` - Google Maps integration with real-time markers
- `VehicleInfo` - Occupancy gauge and driver info
- `ETACard` - Countdown timer and distance
- `BoardingConfirmation` - Boarding status management

---

### Admin Dashboard (`/admin`)

Comprehensive fleet management and monitoring.

**Key Pages:**
- **Dashboard** - Fleet overview with key metrics
- **Vehicles** - List, filter, and manage fleet vehicles
- **Routes** - Create and edit transportation routes
- **Alerts** - Monitor and resolve safety alerts
- **Users** - Manage system users and permissions
- **Settings** - Configuration and integrations

**Key Metrics:**
- Total vehicles and active trips
- Critical alerts count
- Average occupancy
- Daily distance and time
- On-time performance (%)
- Safety score

---

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Row-Level Security (RLS) on database
- Role-based access control (RBAC)
- Secure session management with HTTP-only cookies

### Data Protection
- All API communications over HTTPS
- Sensitive data encrypted at rest
- Audit logs for critical actions
- GDPR-compliant data handling

### Emergency Safety
- Isolated SOS request system
- Multi-responder alert escalation
- Location tracking with GPS accuracy
- Direct emergency contact integration

---

## 🔄 Real-Time Features

### Data Flow

```
Driver App → GPS Location Updates → API → Passenger Web
     ↓                                        ↓
  Updates every 2-5 sec             WebSocket/Polling (2-3 sec)
```

### Implementation

1. **Location Updates** - Polling every 2-5 seconds
2. **Alerts** - Real-time notification system
3. **SOS Requests** - Immediate escalation to responders
4. **Boarding Status** - Live confirmation updates
5. **Occupancy Changes** - Real-time passenger count

**Hooks:**
- `useLocationUpdates()` - Real-time location tracking
- `useAlertSubscription()` - Alert notifications
- `useSOSSubscription()` - Emergency alerts
- `useTripUpdates()` - Trip status changes
- `useBoardingStatus()` - Boarding confirmations

---

## 📊 API Integration

### Connection Points

The application is designed to connect with your backend:

1. **Authentication**
   - `POST /api/auth/login` - User authentication
   - `POST /api/auth/register` - New user registration

2. **Vehicle Management**
   - `GET/POST /api/vehicles` - List and create vehicles
   - `PUT /api/vehicles/{id}` - Update vehicle info
   - `PATCH /api/vehicles/{id}/occupancy` - Update occupancy

3. **Location Tracking**
   - `POST /api/vehicles/{id}/location` - Update location
   - `GET /api/vehicles/{id}/location` - Current location
   - `GET /api/vehicles/{id}/locations` - History

4. **Trip Management**
   - `GET /api/trips/current` - Active trips
   - `GET/POST /api/trips` - Trip operations
   - `GET /api/trips/{id}/eta` - ETA calculation

5. **Boarding & Safety**
   - `POST /api/boarding/scan-qr` - QR code scanning
   - `POST /api/sos` - SOS request
   - `GET/PATCH /api/alerts` - Alert management

See `API_DOCUMENTATION.md` for complete endpoint specifications.

---

## 🎨 Design System

### Color Palette
- **Primary (Dark Blue):** #0f1a3d
- **Accent (Orange):** #ff6b35
- **Success (Green):** #4caf50
- **Warning (Yellow):** #ffc107
- **Danger (Red):** #f44336

### Typography
- **Headlines:** Geist Bold
- **Body:** Geist Regular
- **Monospace:** Geist Mono

### Component Variants
All components support light/dark modes with semantic design tokens.

---

## 📱 Mobile Applications

### Passenger App
- Real-time vehicle tracking
- Boarding confirmation via QR
- ETA countdown
- Emergency SOS button
- Parent notifications

### Driver App
- Active trip management
- Passenger boarding list
- Route navigation
- Vehicle diagnostics
- Occupancy management

See `MOBILE_WIREFRAMES.md` for detailed specifications.

---

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Manual Testing Checklist
- [ ] Login/authentication flow
- [ ] Real-time location updates
- [ ] Occupancy changes
- [ ] Alert notifications
- [ ] SOS activation
- [ ] QR code scanning
- [ ] ETA accuracy
- [ ] Mobile responsiveness

---

## 📈 Performance Optimization

### Frontend
- Image optimization with `next/image`
- Code splitting by route
- CSS purging with Tailwind
- Font optimization
- Lazy loading for components

### Backend
- API request caching with SWR
- Location update batching
- Alert throttling
- Query optimization

### Real-time
- Adaptive polling intervals
- Connection pooling
- Message queuing
- Compression for payloads

---

## 🚀 Deployment

### Vercel
```bash
pnpm build
vercel deploy
```

### Self-Hosted
```bash
pnpm build
pnpm start
```

### Environment Variables
Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_MAPS_API_KEY` - Maps API key
- `JWT_SECRET` - Session encryption key
- `WEBHOOK_SECRET` - Webhook verification

---

## 📚 Documentation

- **[API Reference](./API_DOCUMENTATION.md)** - Complete API endpoint documentation
- **[Mobile Wireframes](./MOBILE_WIREFRAMES.md)** - Mobile app design specifications
- **[Architecture Plan](./v0_plans/grand-process.md)** - System design overview

---

## 🔧 Configuration

### Settings Pages (`/admin/settings`)

1. **Organization** - Company info and branding
2. **Integrations** - Google Maps, Supabase keys
3. **Notifications** - Alert preferences
4. **Security** - Password policies, API access
5. **Danger Zone** - Data export, account deletion

---

## 🛠️ Development Workflow

1. **Feature Branch**
```bash
git checkout -b feature/vehicle-management
```

2. **Development**
```bash
pnpm dev
```

3. **Testing**
```bash
pnpm test
pnpm lint
```

4. **Build**
```bash
pnpm build
```

5. **Deploy**
```bash
vercel deploy
```

---

## 📞 Support

- **GitHub Issues:** Report bugs and request features
- **Documentation:** https://docs.thadam.com
- **Community:** Discord server for discussions
- **Email:** support@thadam.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Contributing

Contributions are welcome! Please see CONTRIBUTING.md for guidelines.

---

## 🎯 Roadmap

### Phase 1: MVP (Current)
- ✅ Web passenger tracker
- ✅ Admin dashboard
- ✅ Real-time location tracking
- ✅ Boarding confirmation
- ✅ Safety alerts

### Phase 2: Mobile Apps
- [ ] iOS app (React Native)
- [ ] Android app (React Native)
- [ ] Push notifications
- [ ] Offline support

### Phase 3: Advanced Features
- [ ] Machine learning route optimization
- [ ] Traffic prediction
- [ ] Driver behavior analytics
- [ ] Maintenance scheduling
- [ ] Billing and subscriptions

### Phase 4: Enterprise
- [ ] Multi-organization support
- [ ] Advanced analytics
- [ ] Custom reporting
- [ ] API marketplace

---

## 🔐 Security Notes

This is a production-ready system designed with security in mind:

1. **Data Encryption** - All sensitive data is encrypted
2. **Access Control** - Role-based permissions on all resources
3. **Audit Logging** - All critical actions are logged
4. **Rate Limiting** - API rate limiting to prevent abuse
5. **Compliance** - GDPR ready with consent management

---

**Last Updated:** April 6, 2026

For the latest updates, visit the [Thadam repository](https://github.com/thadam/platform).
