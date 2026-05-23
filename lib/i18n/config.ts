// 国际化配置

export const locales = ["zh-CN", "en-US"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "zh-CN"

export const localeNames: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "en-US": "English",
}

// 语言检测
export function detectLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale

  const stored = localStorage.getItem("locale") as Locale
  if (stored && locales.includes(stored)) return stored

  const browserLang = navigator.language
  if (browserLang.startsWith("zh")) return "zh-CN"
  if (browserLang.startsWith("en")) return "en-US"

  return defaultLocale
}

// 设置语言
export function setLocale(locale: Locale) {
  if (typeof window === "undefined") return
  localStorage.setItem("locale", locale)
  window.location.reload()
}
