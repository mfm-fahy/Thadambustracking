'use client';

import dynamic from 'next/dynamic';

const RouteMapInner = dynamic(() => import('./RouteMapInner'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-lg" style={{ minHeight: '500px' }}>
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading Map...</p>
      </div>
    </div>
  )
});

export function RouteOverviewMap({ routes }: { routes: any[] }) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-border" style={{ height: '500px' }}>
      <RouteMapInner routes={routes} />
    </div>
  );
}
