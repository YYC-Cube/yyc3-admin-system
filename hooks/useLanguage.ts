"use client"

import { useEffect, useState } from "react"

import { translations, type Language } from "@/lib/i18n/translations"

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("zh")

  useEffect(() => {
    // 获取浏览器语言设置
    const browserLang = navigator.language.toLowerCase()
    setLanguage("zh")
  }, [])

  const t = (key: string | undefined, ...args: string[]): string => {
    // 防御性编程：key 非字符串或为空时直接返回空字符串，避免运行时错误
    if (typeof key !== "string" || key.length === 0) return ""

    const keys = key.split(".")
    let value: unknown = translations[language]

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }

    if (typeof value === "string") {
      // 引数がある場合は置換
      return args.reduce((str, arg, index) => {
        return str.replace(`{${index}}`, arg)
      }, value)
    }

    return key // キーが見つからない場合はキー自体を返す
  }

  const toggleLanguage = () => {
    setLanguage((prev: Language) => (prev === "ja" ? "en" : "ja"))
  }

  return { language, setLanguage, t, toggleLanguage }
}
