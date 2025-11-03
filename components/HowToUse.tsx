'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';

export const HowToUse = () => {
  const { t } = useLanguage();

  // 使用 i18n 文案定义步骤数据，避免未定义变量错误
  const steps = [
    { title: t('howToUse.step1Title'), desc: t('howToUse.step1Desc') },
    { title: t('howToUse.step2Title'), desc: t('howToUse.step2Desc') },
    { title: t('howToUse.step3Title'), desc: t('howToUse.step3Desc') },
  ];

  return (
    <Card
      data-slot="how-to-use"
      className="mt-12 bg-card/90 backdrop-blur-sm border border-border/20 shadow-2xl"
    >
      <CardHeader className="bg-linear-to-r from-muted to-muted/60 border-b border-border">
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          {t('howToUse.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-linear-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <h3 className="text-foreground font-medium">{step.title}</h3>
              </div>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
