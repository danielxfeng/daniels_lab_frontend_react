/**
 * @file from https://originui.com/timeline
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

const TimelineContext = React.createContext<{ step: number }>({ step: 0 });

export function Timeline({
  className,
  children,
  defaultValue,
}: {
  className?: string;
  children: React.ReactNode;
  defaultValue?: number;
}) {
  return (
    <TimelineContext.Provider value={{ step: defaultValue ?? 0 }}>
      <div data-orientation='vertical' className={cn('relative grid gap-8', className)}>
        {children}
      </div>
    </TimelineContext.Provider>
  );
}

export function TimelineItem({
  className,
  step,
  children,
}: {
  className?: string;
  step: number;
  children: React.ReactNode;
}) {
  const context = React.useContext(TimelineContext);
  return (
    <div
      data-state={context.step === step ? 'active' : 'inactive'}
      data-orientation='vertical'
      className={cn('group relative flex flex-col', className)}
    >
      {children}
    </div>
  );
}

export function TimelineHeader({ children }: { children: React.ReactNode }) {
  return <div className='flex items-center gap-4'>{children}</div>;
}

export function TimelineSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-border data-[state=active]:bg-primary relative h-full w-px grow',
        className,
      )}
    />
  );
}

export function TimelineIndicator({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-border ring-background ring-offset-background data-[state=active]:bg-primary data-[state=active]:ring-primary/20 z-10 h-2.5 w-2.5 rounded-full ring-4 ring-offset-2',
        className,
      )}
    />
  );
}

export function TimelineDate({
  asChild,
  className,
  children,
}: {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const Comp = asChild ? Slot : 'time';
  return <Comp className={cn('text-muted-foreground text-sm', className)}>{children}</Comp>;
}

export function TimelineTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h3 className={cn('text-sm leading-none font-medium', className)}>{children}</h3>;
}

export function TimelineContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('text-muted-foreground text-sm [&_p]:leading-relaxed', className)}>
      {children}
    </div>
  );
}
