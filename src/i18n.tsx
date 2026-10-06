import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import englishCopy from "./en.json";

export type Language = "ko" | "en";
const storageKey = "selluplabs-language";
const origin = "https://selluplabs-homepage.selluplabs.workers.dev/";
const dictionary: Record<string, string> = englishCopy;
type Values = Record<string, string | number>;

export function translateText(
  text: string,
  language: Language,
  values?: Values,
): string {
  let translated = text;
  if (language === "en") {
    const key = text.trim();
    const prefix = text.slice(0, text.length - text.trimStart().length);
    const suffix = text.slice(text.trimEnd().length);
    const exampleSuffix =
      "의 상품 이미지와 설명, 기업 정보를 구성한 실제 aiadcast 생성 결과";
    const value =
      dictionary[key] ??
      (key.endsWith(exampleSuffix)
        ? `${translateText(key.slice(0, -exampleSuffix.length), language)}: actual aiadcast output with product visuals, promotional copy and company details.`
        : key);
    translated = prefix + value + suffix;
  }
  return translated.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values?.[key] ?? match),
  );
}

function initialLanguage(): Language {
  const query = new URLSearchParams(window.location.search).get("lang");
  if (query === "en" || query === "ko") return query;
  try {
    return localStorage.getItem(storageKey) === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}

function localizedData<T>(value: T, language: Language): T {
  if (typeof value === "string") return translateText(value, language) as T;
  if (Array.isArray(value))
    return value.map((item) => localizedData(item, language)) as T;
  if (value && typeof value === "object" && !("$$typeof" in value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        localizedData(item, language),
      ]),
    ) as T;
  }
  return value;
}

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string, values?: Values) => string;
  localize: <T>(value: T) => T;
};
const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>(initialLanguage);
  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, selluplabsLanguage: language },
      "",
    );
    const onPopState = (event: PopStateEvent) => {
      const previous = event.state?.selluplabsLanguage;
      updateLanguage(
        previous === "ko" || previous === "en" ? previous : initialLanguage(),
      );
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      /* Storage can be unavailable in private browsers. */
    }
    document.title =
      language === "en"
        ? "selluplabs | AI Marketing Content Technology"
        : "셀업랩스 | AI 마케팅 콘텐츠 기술 기업 · selluplabs";
    const description =
      language === "en"
        ? "selluplabs develops AI services that combine product specifications and images to create marketing content. Explore aiadcast, our packaging-focused mobile service, and 72 real generated examples."
        : "셀업랩스는 상품 규격과 이미지를 결합해 마케팅 콘텐츠를 자동 생성하는 AI 서비스를 개발·운영합니다. 포장재 특화 모바일 서비스 aiadcast와 실제 생성 사례를 만나보세요.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", language === "en" ? "en_US" : "ko_KR");
    document
      .querySelector('meta[property="og:image:alt"]')
      ?.setAttribute(
        "content",
        language === "en"
          ? "selluplabs — AI marketing content from product data, with actual aiadcast outputs"
          : "셀업랩스 — 상품 정보로 만드는 AI 마케팅 콘텐츠와 aiadcast 실제 생성 결과",
      );
    const pageUrl = origin + (language === "en" ? "?lang=en" : "");
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", pageUrl);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", pageUrl);
  }, [language]);
  const context = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: (next) => {
        if (next === language) return;
        const url = new URL(window.location.href);
        url.searchParams.set("lang", next);
        window.history.pushState(
          { ...window.history.state, selluplabsLanguage: next },
          "",
          url,
        );
        updateLanguage(next);
      },
      t: (text, values) => translateText(text, language, values),
      localize: <T,>(value: T) => localizedData(value, language),
    }),
    [language],
  );
  return (
    <I18nContext.Provider value={context}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("LanguageProvider is required");
  return context;
}
