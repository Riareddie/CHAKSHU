
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'button' | 'image' | 'table-row';
  lines?: number;
  width?: string;
  height?: string;
}

const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  lines = 1,
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-muted rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    button: 'h-10 w-24',
    image: 'h-48 w-full',
    'table-row': 'h-8 w-full'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && 'w-3/4'
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
    />
  );
};

// Specific skeleton components for common use cases
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className
}) => (
  <LoadingSkeleton variant="text" lines={lines} className={className} />
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border rounded-lg space-y-4', className)}>
    <div className="flex items-center space-x-4">
      <LoadingSkeleton variant="avatar" />
      <div className="space-y-2 flex-1">
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton variant="text" width="40%" />
      </div>
    </div>
    <div className="space-y-2">
      <LoadingSkeleton variant="text" lines={2} />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string 
}> = ({
  rows = 5,
  columns = 4,
  className
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <LoadingSkeleton key={`header-${index}`} variant="text" height="20px" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <LoadingSkeleton key={`cell-${rowIndex}-${colIndex}`} variant="table-row" />
        ))}
      </div>
    ))}
  </div>
);

export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-4', className)}>
    <LoadingSkeleton variant="text" width="30%" height="24px" />
    <div className="h-64 bg-muted rounded animate-pulse flex items-end justify-between p-4 space-x-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="bg-muted-foreground/20 rounded-t animate-pulse"
          style={{
            height: `${Math.random() * 60 + 20}%`,
            width: '12%'
          }}
        />
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
