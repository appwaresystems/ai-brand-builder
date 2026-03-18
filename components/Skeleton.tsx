'use client';

import { motion } from 'motion/react';

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-200 animate-pulse rounded-md ${className}`} />
  );
}

export function BrandingSkeleton() {
  return (
    <div className="space-y-12">
      <section>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </section>
      
      <section>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}
