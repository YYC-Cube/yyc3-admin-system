'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface StepBarProps {
  currentStep: number;
  onStepChange?: (index: number) => void;
}

export const StepBar = ({ currentStep, onStepChange }: StepBarProps) => {
  const { t } = useLanguage();

  // 本地步骤数据（采用 i18n 文案）
  const steps = [
    { id: 'step1', label: t('steps.step1') },
    { id: 'step2', label: t('steps.step2') },
    { id: 'step3', label: t('steps.step3') },
  ];

  // 兼容 1-based 的 currentStep（页面中默认从 1 开始）
  const activeIndex = Math.max(0, Math.min(steps.length - 1, currentStep - 1));

  return (
    <div
      data-slot="stepbar"
      className="flex items-center justify-between w-full px-6 py-3 rounded-full bg-card/90 border border-border/20 shadow-sm"
    >
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onStepChange?.(index)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
            activeIndex === index
              ? 'bg-linear-to-r from-primary to-primary/80 text-primary-foreground shadow'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
};
