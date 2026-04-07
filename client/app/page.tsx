'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Users, Shield, Clock, BarChart3, AlertCircle, Bus, Navigation, Star, ChevronRight, Zap, Globe, GraduationCap, Briefcase, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const STATS = [
  { label: 'Active Vehicles', value: '2,400+', icon: Bus },
  { label: 'Daily Passengers', value: '48,000+', icon: Users },
  { label: 'Cities Covered', value: '120+', icon: Globe },
  { label: 'Uptime', value: '99.9%', icon: Zap },
];

const FEATURES = [
  { icon: MapPin, title: 'Live GPS Tracking', desc: 'Real-time location updates every 3 seconds with sub-10m accuracy.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { icon: Clock, title: 'Smart ETA', desc: 'AI-powered arrival estimates based on live traffic and route history.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Users, title: 'Passenger Management', desc: 'QR boarding, occupancy tracking, and seat availability in real time.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: AlertCircle, title: 'SOS & Safety Alerts', desc: 'One-tap emergency alerts with instant operator and parent notification.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Shield, title: 'Route Compliance', desc: 'Automatic deviation detection and geofence breach alerts.', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: BarChart3, title: 'Fleet Analytics', desc: 'Trip reports, on-time performance, and fuel efficiency dashboards.', color: 'text-teal-500', bg: 'bg-teal-500/10' },
];

const MODULES = [
  {
    title: 'Passenger Tracker',
    subtitle: 'For commuters & parents',
    desc: 'Track any bus in real time, get live ETAs, view occupancy, and trigger SOS — all from your phone.',
    icon: Navigation,
    color: 'text-orange-500',
    bg: 'from-orange-500/10 to-orange-500/5',
    border: 'border-orange-500/20 hover:border-orange-500/50',
    href: '/login',
    cta: 'Open Tracker',
    features: ['Live bus location on map', 'Real-time ETA countdown', 'Occupancy status', 'Emergency SOS'],
  },
  {
    title: 'Driver Console',
    subtitle: 'For bus drivers',
    desc: 'Activate your bus, manage stops, share your unique bus ID & QR code, and broadcast live location.',
    icon: Bus,
    color: 'text-blue-500',
    bg: 'from-blue-500/10 to-blue-500/5',
    border: 'border-blue-500/20 hover:border-blue-500/50',
    href: '/login',
    cta: 'Driver Login',
    features: ['One-tap bus activation', 'Stop editor', 'QR code sharing', 'GPS broadcasting'],
  },
  {
    title: 'Admin Dashboard',
    subtitle: 'For fleet operators',
    desc: 'Full fleet visibility — manage vehicles, routes, alerts, and analytics from a single control panel.',
    icon: BarChart3,
    color: 'text-purple-500',
    bg: 'from-purple-500/10 to-purple-500/5',
    border: 'border-purple-500/20 hover:border-purple-500/50',
    href: '/admin',
    cta: 'Open Dashboard',
    features: ['Fleet overview', 'Route management', 'Alert resolution', 'Performance reports'],
  },
];

const TRANSPORT_TYPES = [
  { icon: Globe, label: 'Public Transit', color: 'text-blue-500' },
  { icon: GraduationCap, label: 'School Buses', color: 'text-orange-500' },
  { icon: GraduationCap, label: 'College Shuttles', color: 'text-purple-500' },
  { icon: Briefcase, label: 'Corporate Fleets', color: 'text-teal-500' },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-card/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Thadam</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {['Features', 'Modules', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button size="sm" className="bg-accent hover:bg-accent/90 gap-1.5">
                Get Started <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-4 space-y-2">
            {['Features', 'Modules', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">{item}</a>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-accent hover:bg-accent/90 mt-2">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live tracking across 120+ cities
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Real-Time Fleet Tracking<br />
              <span className="text-accent">Built for Everyone</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              From school buses to corporate shuttles — Thadam gives passengers live ETAs, drivers a smart console, and operators full fleet visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login">
                <Button className="bg-accent hover:bg-accent/90 gap-2 h-11 px-6">
                  <Navigation className="w-4 h-4" /> Track a Bus
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="gap-2 h-11 px-6">
                  <BarChart3 className="w-4 h-4" /> Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Transport type pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {TRANSPORT_TYPES.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground shadow-sm">
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-5 text-center hover:border-accent/40 transition-colors">
                <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Everything you need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete platform for real-time tracking, safety, and fleet management.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-accent/40 hover:shadow-sm transition-all group">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Three portals, one platform</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Each role gets a purpose-built experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MODULES.map(({ title, subtitle, desc, icon: Icon, color, bg, border, href, cta, features }) => (
              <div key={title} className={`bg-gradient-to-b ${bg} border ${border} rounded-2xl p-6 flex flex-col transition-all`}>
                <div className="mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{subtitle}</p>
                  <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={href}>
                  <Button className="w-full bg-accent hover:bg-accent/90 gap-2">
                    {cta} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / CTA */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <blockquote className="text-xl font-medium text-foreground mb-4 italic">
            "Thadam cut our parent complaint calls by 80%. Parents can see exactly where the bus is — no more guessing."
          </blockquote>
          <p className="text-sm text-muted-foreground">— Fleet Manager, Greenwood School District</p>
        </div>
      </section>

      {/* CTA Banner */}
      <section id="contact" className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of operators already using Thadam.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button className="px-8 h-11 bg-accent hover:bg-accent/90 gap-2">
                <Navigation className="w-4 h-4" /> Start Tracking Free
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" className="px-8 h-11">View Admin Demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="font-bold text-foreground">Thadam</span>
              </div>
              <p className="text-sm text-muted-foreground">Real-time fleet tracking and passenger safety platform.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'GDPR'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-foreground mb-3 text-sm">{title}</h4>
                <ul className="space-y-2">
                  {links.map((l) => <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">© 2026 Thadam. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
