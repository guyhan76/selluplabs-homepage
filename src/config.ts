// Public contact details only. Never put API keys or private business-plan data here.
export const company = {
  name: "셀업랩스 주식회사",
  englishName: "selluplabs",
  representative: "한동석",
  location: "서울특별시 마포구 양화로 176 B2001-30호",
  englishLocation:
    "B2001-30, 176 Yanghwa-ro, Mapo-gu, Seoul, Republic of Korea",
  phone: "+82 10-5635-6211",
  domesticPhone: "010-5635-6211",
  phoneHref: "tel:+821056356211",
  businessNumber: "849-81-03487",
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || "selluplabs@gmail.com",
  appUrl:
    import.meta.env.VITE_APP_URL?.trim() ||
    "https://play.google.com/store/apps/details?id=kr.co.beehivecorp.aiadcast",
  patent: "10-2026-0158120",
} as const;
