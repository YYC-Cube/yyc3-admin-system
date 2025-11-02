"use client"

import { useLanguage } from "@/hooks/useLanguage"

interface StepBarProps {
  currentStep: number
}

export const StepBar = ({ currentStep }: StepBarProps) => {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between w-full px-6 py-3 rounded-full bg-card/90 border border-border/20 shadow-sm">
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onStepChange(index)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
            currentStep === index
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold">
            {index + 1}
          </span>
          <span className="text-sm font-medium">{step.label}</span>
        </button>
      ))}
    </div>
  );
}