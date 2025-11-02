"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/useLanguage"

export const HowToUse = () => {
  const { t } = useLanguage()

  return (
    <Card className="mt-12 bg-white/90 backdrop-blur-sm border-white/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">{t("howToUse.title")}</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-semibold">
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
  )
}
