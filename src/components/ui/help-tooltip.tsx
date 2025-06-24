
import React, { useState } from 'react';
import { HelpCircle, Info, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  variant?: 'help' | 'info' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showArrow?: boolean;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  variant = 'help',
  size = 'md',
  className,
  triggerClassName,
  contentClassName,
  showArrow = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const icons = {
    help: HelpCircle,
    info: Info,
    warning: AlertCircle,
  };

  const Icon = icons[variant];

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const iconColors = {
    help: 'text-muted-foreground hover:text-foreground',
    info: 'text-info hover:text-info/80',
    warning: 'text-warning hover:text-warning/80',
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 rounded-full',
              triggerClassName
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={typeof content === 'string' ? content : 'Help information'}
          >
            {children || (
              <Icon 
                className={cn(
                  iconSizes[size],
                  iconColors[variant],
                  'transition-colors'
                )} 
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            'max-w-xs z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
            contentClassName
          )}
        >
          <div className={className}>
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Predefined help tooltips for common use cases
export const FieldHelpTooltip: React.FC<{
  content: string | React.ReactNode;
  className?: string;
}> = ({ content, className }) => (
  <HelpTooltip
    content={content}
    variant="help"
    size="sm"
    side="right"
    className={className}
  />
);

export const InfoTooltip: React.FC<{
  content: string | React.ReactNode;
  className?: string;
}> = ({ content, className }) => (
  <HelpTooltip
    content={content}
    variant="info"
    size="sm"
    side="top"
    className={className}
  />
);

export const WarningTooltip: React.FC<{
  content: string | React.ReactNode;
  className?: string;
}> = ({ content, className }) => (
  <HelpTooltip
    content={content}
    variant="warning"
    size="sm"
    side="top"
    className={className}
  />
);

// Complex tooltip with rich content
export const RichHelpTooltip: React.FC<{
  title: string;
  description: string;
  steps?: string[];
  link?: { text: string; url: string };
  className?: string;
}> = ({ title, description, steps, link, className }) => (
  <HelpTooltip
    content={
      <div className="space-y-2">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        {steps && (
          <div className="space-y-1">
            <div className="text-sm font-medium">Steps:</div>
            <ol className="text-xs space-y-1 list-decimal list-inside">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {link && (
          <div className="pt-1 border-t">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              {link.text} →
            </a>
          </div>
        )}
      </div>
    }
    variant="help"
    size="md"
    side="right"
    className={cn('p-0', className)}
    contentClassName="max-w-sm"
  />
);

export default HelpTooltip;
