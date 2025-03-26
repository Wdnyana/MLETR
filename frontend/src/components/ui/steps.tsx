import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

interface StepsContextValue {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

export function useSteps({ count, index = 0 }: { count: number; index?: number }) {
  const [activeStep, setActiveStep] = React.useState(index);

  return {
    activeStep,
    setActiveStep,
    count,
  };
}

interface StepsProps {
  children: React.ReactNode;
  activeStep: number;
  responsive?: boolean;
  className?: string;
}

export function Steps({ children, activeStep, responsive = true, className }: StepsProps) {
  return (
    <StepsContext.Provider value={{ activeStep, setActiveStep: () => {} }}>
      <div
        className={cn(
          'flex w-full justify-between',
          responsive && 'flex-col gap-2 sm:flex-row sm:gap-0',
          className
        )}
      >
        {children}
      </div>
    </StepsContext.Provider>
  );
}

interface StepStatusProps {
  children: React.ReactNode;
  className?: string;
}

export function StepStatus({ children, className }: StepStatusProps) {
  const context = useContext(StepsContext);

  if (!context) {
    throw new Error('StepStatus must be used within a Steps component');
  }

  return (
    <div className={cn('flex flex-1 flex-col items-center justify-center', className)}>
      {children}
    </div>
  );
}

interface StepIndicatorProps {
  className?: string;
}

export function StepIndicator({ className, children }: StepIndicatorProps & { children: React.ReactNode }) {
  const context = useContext(StepsContext);

  if (!context) {
    throw new Error('StepIndicator must be used within a Steps component');
  }

  const status = React.Children.toArray(children).findIndex(child => React.isValidElement(child));

  const isActive = status === context.activeStep;
  const isCompleted = status < context.activeStep;

  return (
    <div
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold',
        isCompleted ? 'border-primary bg-primary text-primary-foreground' : '',
        isActive
          ? 'border-primary text-primary'
          : !isCompleted
          ? 'border-gray-300 text-gray-500'
          : '',
        className
      )}
    >
      {isCompleted ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <div>{status + 1}</div>
      )}
    </div>
  );
}

interface StepTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function StepTitle({ children, className }: StepTitleProps & { children: React.ReactNode }) {
  const context = useContext(StepsContext);
  

  if (!context) {
    throw new Error('StepTitle must be used within a Steps component');
  }

  const status = React.Children.toArray(children).findIndex(child => React.isValidElement(child));
  const isCompleted = status < context.activeStep;
  const isActive = status === context.activeStep;


  return (
    <div
      className={cn(
        'mt-2 text-sm font-medium',
        isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StepSeparatorProps {
  className?: string;
}

export function StepSeparator({ className }: StepSeparatorProps) {
  return (
    <div
      className={cn(
        'absolute top-4 left-full h-[2px] w-full -translate-y-1/2',
        'hidden sm:block',
        className
      )}
    >
      <div className="h-full w-full bg-gray-200" />
    </div>
  );
}