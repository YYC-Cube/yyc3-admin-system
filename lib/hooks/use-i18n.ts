// 国际化Hook

"use client"

import { useState, useEffect } from "react"
import { type Locale, detectLocale, setLocale as setLocaleConfig } from "@/lib/i18n/config"
import { t as translate } from "@/lib/i18n/translations"

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>("zh-CN")

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    setLocaleConfig(newLocale)
  }

  const t = (key: string) => translate(locale, key)

  return { locale, setLocale, t }
}
