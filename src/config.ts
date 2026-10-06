// Public contact details only. Never put API keys or private business-plan data here.
export const company = {
  name: "셀업랩스 주식회사",
  englishName: "selluplabs",
  representative: "한동석",
  location: "서울특별시 마포구",
  businessNumber: "849-81-03487",
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || "selluplabs@gmail.com",
  appUrl:
    import.meta.env.VITE_APP_URL?.trim() ||
    "https://play.google.com/store/apps/details?id=kr.co.beehivecorp.aiadcast",
  patent: "10-2026-0158120",
} as const;
