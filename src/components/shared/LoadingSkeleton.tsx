'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className = '', count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
          className={`h-4 bg-muted rounded ${className}`}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-card rounded-lg border border-border"
    >
      <LoadingSkeleton className="h-6 w-1/3 mb-4" />
      <LoadingSkeleton className="h-4 w-full mb-2" count={3} />
    </motion.div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex gap-4 p-4 bg-card rounded-lg border border-border"
        >
          <LoadingSkeleton className="h-4 flex-1" count={4} />
        </motion.div>
      ))}
    </div>
  );
}
