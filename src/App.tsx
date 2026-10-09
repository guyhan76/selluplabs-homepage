import { HeroStory } from "./HeroStory";
import { useScrollReveal } from "./Motion";
import { useI18n } from "./i18n";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { company } from "./config";
import { ContactDialog, AppPreview } from "./Dialogs";
import { GeneratedShowcase } from "./GeneratedShowcase";
import { Applications, AppInstall } from "./Applications";

const navigationCopy = [
  { label: "서비스", href: "#service" },
  { label: "생성 사례", href: "#cases" },
  { label: "활용 방법", href: "#applications" },
  { label: "기술", href: "#technology" },
  { label: "회사 소개", href: "#about" },
];
const faqCopy = [
  {
    question: "aiadcast는 어떤 서비스를 제공하나요?",
    answer:
      "상품 규격과 참조 이미지를 결합해 상품 이미지, 홍보 문구, 회사 정보가 포함된 마케팅 이미지를 생성하는 모바일 서비스입니다. 박스, 쇼핑백, 스티커·라벨, 비닐·파우치, 용기 등 포장재에 특화되어 있으며 다른 제품에 적용한 생성 사례도 확인하실 수 있습니다.",
  },
  {
    question: "어떤 정보를 준비하면 되나요?",
    answer:
      "상품명, 회사명, 연락처, 이메일 또는 홈페이지 주소, 상품 카테고리, 규격, 상세 설명과 참조 이미지 최대 10장을 준비해주세요. 앱의 안내에 따라 정보를 입력하고 원하는 이미지 비율을 선택하면 됩니다.",
  },
  {
    question: "릴스 영상도 만들어주나요?",
    answer:
      "현재 제공하는 결과물은 9:16 카드뉴스·원페이지 릴스용 이미지와 2:3 홍보 포스터 이미지입니다. 동영상 자동 생성 기능을 의미하지 않습니다. 생성 이미지와 함께 제작 의도, 추천 매체, 검색 키워드를 확인할 수 있습니다.",
  },
  {
    question: "서비스는 어디에서 이용할 수 있나요?",
    answer:
      "Google Play에서 aiadcast 앱을 설치해 이용할 수 있습니다. 홈페이지의 ‘Google Play에서 시작하기’ 버튼이 공식 앱 페이지로 연결됩니다. 서비스 도입과 비즈니스·기술 협력은 selluplabs@gmail.com으로 문의해주세요.",
  },
];
function Brand() {
  return (
    <span className="brand">
      <img src="/favicon.svg?v=2" width="32" height="32" alt="" />
      <span>
        sell<span className="brand-up">up</span>labs
        <span className="brand-period">.</span>
      </span>
    </span>
  );
}
function AiadcastMark({ className = "" }: { className?: string }) {
  return (
    <span className={`aiadcast-mark ${className}`} aria-label="aiadcast">
      <span>ai</span>adcast
      <i aria-hidden="true" />
    </span>
  );
}
export default function App() {
  useScrollReveal();
  const { t, language, setLanguage, localize } = useI18n();
  const navigation = localize(navigationCopy);
  const faqs = localize(faqCopy);
  const address =
    language === "en" ? company.englishLocation : company.location;
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const contactRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLDialogElement>(null);
  const openContact = () => {
    setMenuOpen(false);
    contactRef.current?.showModal();
  };
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        {t("본문으로 바로가기")}
      </a>
      <header className="site-header">
        <div className="header-inner wrap">
          <a className="brand-link" href="#home" aria-label={t("셀업랩스 홈")}>
            <Brand />
          </a>
          <nav className="desktop-nav" aria-label={t("주 메뉴")}>
            {navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <div
              className="language-switch"
              role="group"
              aria-label={t("언어 선택")}
            >
              <button
                type="button"
                lang="ko"
                aria-label="한국어"
                aria-pressed={language === "ko"}
                onClick={() => setLanguage("ko")}
              >
                KO
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                lang="en"
                aria-label="English"
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className="header-contact"
              aria-label={t("문의하기")}
              title={t("문의하기")}
              onClick={openContact}
            >
              <span className="header-contact-label">{t("문의하기")}</span>
              <ArrowUpRight className="header-contact-arrow" size={16} />
              <Mail
                className="header-contact-mobile-icon"
                size={16}
                aria-hidden="true"
              />
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? t("메뉴 닫기") : t("메뉴 열기")}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label={t("모바일 메뉴")}
          hidden={!menuOpen}
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      </header>
      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                <span className="accent-line" /> AI MARKETING TECHNOLOGY
              </div>
              <h1 id="hero-title">
                {t("상품 정보로 만드는")}
                <br />
                <span>{t("AI 마케팅 콘텐츠.")}</span>
              </h1>
              <p className="hero-description">
                {t("셀업랩스는 상품 규격과 이미지를 결합해")}
                <br className="desktop-break" />
                {t(" 마케팅 콘텐츠를 자동 생성하는")}
                <br className="desktop-break" />
                {t(" AI 서비스를 개발·운영합니다.")}
              </p>
              <div className="hero-actions">
                <a
                  className="button button-white"
                  href={company.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("aiadcast 앱 설치 ")}
                  <ArrowUpRight size={18} />
                </a>
                <a className="button button-outline" href="#cases">
                  {t("실제 생성 사례 ")}
                  <ArrowRight size={18} />
                </a>
              </div>
              <div className="hero-domain">
                <span />
                {t(" 포장재 특화 AI · 모바일 서비스")}
              </div>
            </div>
            <HeroStory />
          </div>
          <div className="hero-base wrap">
            <a href="#service" className="scroll-link">
              EXPLORE SELLUPLABS <ArrowDown size={14} />
            </a>
            <div className="hero-credentials">
              <span>{t("특허 1건 출원")}</span>
              <span>{t("연구개발전담부서 운영")}</span>
              <span>{t("Google Play 서비스")}</span>
            </div>
          </div>
        </section>
        <section
          className="service-section section-space"
          id="service"
          aria-labelledby="service-title"
        >
          <div className="wrap">
            <div className="section-eyebrow">
              <span>01 — OUR SERVICE</span>
              <span>PRODUCT INFORMATION. TRANSFORMED.</span>
            </div>
            <div className="service-intro">
              <div>
                <AiadcastMark className="service-wordmark" />
                <h2 id="service-title">
                  {t("포장재를 위한")}
                  <br />
                  {t("AI 마케팅 콘텐츠 서비스.")}
                </h2>
              </div>
              <div className="service-intro-copy">
                <p>
                  {t("제품을 가장 잘 아는 사람의 정보가")}
                  <br />
                  {t("좋은 마케팅 콘텐츠의 출발점이 됩니다.")}
                </p>
                <p>
                  {t("aiadcast는 상품 규격과 참조 이미지를 바탕으로")}
                  <br className="desktop-break" />
                  {t(" 제품 이미지, 홍보 문구, 기업 정보를 하나로 구성합니다.")}
                </p>
                <div className="service-actions">
                  <a
                    className="text-link"
                    href={company.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Google Play에서 시작하기 ")}
                    <ArrowUpRight size={17} />
                  </a>
                  <button
                    className="text-link secondary-link"
                    type="button"
                    onClick={() => previewRef.current?.showModal()}
                  >
                    {t("모바일 앱 살펴보기 ")}
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </div>
            </div>
            <div className="workflow" aria-label={t("aiadcast 사용 방법")}>
              <article className="workflow-step">
                <div className="step-top">
                  <span>01</span>
                  <span>PRODUCT DATA</span>
                </div>
                <h3>{t("상품 정보를 입력합니다.")}</h3>
                <p>
                  {t("상품명과 규격, 소재와 상세 설명.")}
                  <br />
                  {t("기업 정보와 함께 입력합니다.")}
                </p>
                <div className="step-example">
                  <div>
                    <span>{t("상품명")}</span>
                    <strong>{t("택배박스")}</strong>
                  </div>
                  <div>
                    <span>{t("규격")}</span>
                    <strong>
                      300 × 200 × 100 <small>mm</small>
                    </strong>
                  </div>
                </div>
              </article>
              <article className="workflow-step">
                <div className="step-top">
                  <span>02</span>
                  <span>REFERENCE IMAGES</span>
                </div>
                <h3>{t("참조 이미지를 더합니다.")}</h3>
                <p>
                  {t("상품의 형태와 특징을 알 수 있는")}
                  <br />
                  {t("이미지를 최대 10장 업로드합니다.")}
                </p>
                <div className="step-example upload-example">
                  <span className="upload-line">
                    <Plus size={20} />
                    {t(" 상품 참조 이미지")}
                  </span>
                  <span className="upload-limit">
                    {t("최대 ")}
                    <strong>10</strong>
                    {t("장")}
                  </span>
                </div>
              </article>
              <article className="workflow-step">
                <div className="step-top">
                  <span>03</span>
                  <span>MARKETING CONTENT</span>
                </div>
                <h3>{t("형식을 선택하고 생성합니다.")}</h3>
                <p>
                  {t("카드뉴스·릴스용 이미지 또는 포스터.")}
                  <br />
                  {t("활용 목적에 맞는 비율을 선택합니다.")}
                </p>
                <div className="step-example format-example">
                  <div>
                    <span className="format-shape shape-916" />
                    <span>
                      <strong>9:16</strong>
                      <small>{t("카드뉴스·릴스용 이미지")}</small>
                    </span>
                  </div>
                  <div>
                    <span className="format-shape shape-23" />
                    <span>
                      <strong>2:3</strong>
                      <small>{t("마케팅 포스터")}</small>
                    </span>
                  </div>
                </div>
              </article>
            </div>
            <div className="service-output">
              <span>{t("함께 제공되는 콘텐츠")}</span>
              <div>
                <span>{t("마케팅 이미지")}</span>
                <span>{t("제작 의도")}</span>
                <span>{t("추천 매체")}</span>
                <span>{t("검색 키워드")}</span>
              </div>
            </div>
          </div>
        </section>
        <section
          className="cases-section section-space"
          id="cases"
          aria-labelledby="cases-title"
        >
          <div className="wrap">
            <div className="section-eyebrow">
              <span>02 — GENERATED WITH AIADCAST</span>
              <span>ACTUAL RESULTS</span>
            </div>
            <div className="section-heading">
              <h2 id="cases-title">
                {t("내 상품과 닮은 사례,")}
                <br />
                {t("여기서 찾아보세요.")}
              </h2>
              <p>
                {t("박스부터 쇼핑백, 라벨과 용기까지.")}
                <br />
                {t("aiadcast 앱에서 실제 생성한 마케팅 이미지입니다.")}
              </p>
            </div>
            <GeneratedShowcase />
          </div>
        </section>
        <Applications />
        <section
          className="technology-section section-space"
          id="technology"
          aria-labelledby="technology-title"
        >
          <div className="wrap">
            <div className="section-eyebrow">
              <span>04 — OUR TECHNOLOGY</span>
              <span>BUILT ON PRODUCT INTELLIGENCE</span>
            </div>
            <div className="section-heading">
              <h2 id="technology-title">
                {t("상품의 규격과 이미지.")}
                <br />
                <span>{t("두 정보를 연결하는 기술.")}</span>
              </h2>
              <p>
                {t("상품을 표현하는 데 필요한 구체적인 정보를")}
                <br />
                {t("마케팅 콘텐츠 생성의 기준으로 활용합니다.")}
              </p>
            </div>
            <div
              className="technology-flow"
              aria-label={t("상품 규격과 이미지 결합 기반 콘텐츠 생성 기술")}
            >
              <div className="tech-inputs">
                <div className="tech-input">
                  <span>01 / SPECIFICATION</span>
                  <strong>{t("상품 규격 정보")}</strong>
                  <p>{t("카테고리 · 크기 · 소재 · 특징")}</p>
                </div>
                <div className="tech-input">
                  <span>02 / REFERENCE</span>
                  <strong>{t("상품 이미지")}</strong>
                  <p>{t("형태 · 디테일 · 시각적 특징")}</p>
                </div>
              </div>
              <div className="tech-connector" aria-hidden="true">
                <span />
                <ArrowRight size={20} />
              </div>
              <div className="tech-engine">
                <span className="engine-label">SELLUPLABS TECHNOLOGY</span>
                <span className="engine-word">
                  ai<span>adcast</span>
                </span>
                <div>{t("규격 정보 + 상품 이미지 결합")}</div>
              </div>
              <div className="tech-connector" aria-hidden="true">
                <span />
                <ArrowRight size={20} />
              </div>
              <div className="tech-result">
                <span>OUTPUT / CONTENT</span>
                <strong>{t("마케팅 콘텐츠")}</strong>
                <p>
                  {t("상품 이미지 + 설명 문구")}
                  <br />
                  {t("+ 기업 정보")}
                </p>
                <div>
                  <span>9:16</span>
                  <span>2:3</span>
                </div>
              </div>
            </div>
            <div className="technology-evidence">
              <article>
                <span className="evidence-label">INTELLECTUAL PROPERTY</span>
                <h3>{t("특허 1건 출원")}</h3>
                <p>
                  {t("상품 규격 정보와 상품 이미지를 결합한")}
                  <br />
                  {t("마케팅 콘텐츠 자동 생성 시스템 및 그 방법")}
                </p>
                <div className="evidence-detail">
                  {t("출원번호 ")}
                  {company.patent}
                  <span>2026.08.21</span>
                </div>
              </article>
              <article>
                <span className="evidence-label">RESEARCH & DEVELOPMENT</span>
                <h3>{t("연구개발전담부서 운영")}</h3>
                <p>
                  {t("인정받은 연구개발전담부서를 중심으로")}
                  <br />
                  {t("상품 정보 반영과 콘텐츠 품질을 연구합니다.")}
                </p>
                <div className="evidence-detail">
                  {t("상품 이해 · 생성 품질 고도화")}
                </div>
              </article>
              <article>
                <span className="evidence-label">TECHNOLOGY TO PRODUCT</span>
                <h3>{t("모바일 앱 MVP 개발")}</h3>
                <p>
                  {t("출원 기술을 모바일 서비스로 구현했습니다.")}
                  <br />
                  {t("Google Play에서 aiadcast를 만나보세요.")}
                </p>
                <a
                  className="evidence-detail"
                  href={company.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("aiadcast 앱 보기 ")}
                  <ArrowUpRight size={16} />
                </a>
              </article>
            </div>
          </div>
        </section>
        <section
          className="about-section section-space"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="wrap">
            <div className="section-eyebrow">
              <span>05 — ABOUT SELLUPLABS</span>
              <span>FROM INDUSTRY TO TECHNOLOGY</span>
            </div>
            <div className="about-grid">
              <div>
                <h2 id="about-title">
                  {t("현장의 이해에서 시작한")}
                  <br />
                  {t("AI 기술 기업, 셀업랩스.")}
                </h2>
                <p>
                  {t(
                    "셀업랩스 주식회사는 AI 마케팅 콘텐츠 생성 서비스를 개발·운영하는 정보통신 기업입니다. 포장 산업에서 쌓은 경험을 바탕으로, 상품의 가치를 쉽게 알릴 수 있는 기술을 만듭니다.",
                  )}
                </p>
                <p>
                  {t(
                    "제품의 규격과 소재를 이해하는 것부터 기업의 마케팅을 돕는 것까지. 현장의 필요를 실제로 사용할 수 있는 서비스로 연결합니다.",
                  )}
                </p>
              </div>
              <div className="company-facts">
                <div className="experience">
                  <strong>
                    26<span>+</span>
                  </strong>
                  <span>
                    YEARS OF INDUSTRY EXPERIENCE
                    <small>{t("대표자의 26년 이상 포장 산업 경험")}</small>
                  </span>
                </div>
                <dl>
                  <div>
                    <dt>{t("기업명")}</dt>
                    <dd>
                      {t("셀업랩스 주식회사 ")}
                      <span>selluplabs</span>
                    </dd>
                  </div>
                  <div>
                    <dt>{t("사업 분야")}</dt>
                    <dd>{t("AI 마케팅 콘텐츠 서비스 개발·운영")}</dd>
                  </div>
                  <div>
                    <dt>{t("대표 서비스")}</dt>
                    <dd>aiadcast</dd>
                  </div>
                  <div>
                    <dt>{t("소재지")}</dt>
                    <dd>{address}</dd>
                  </div>
                  <div>
                    <dt>{t("연락처")}</dt>
                    <dd>
                      <a href={company.phoneHref}>{company.phone}</a>
                      <small className="domestic-phone">
                        {t("국내")} {company.domesticPhone}
                      </small>
                    </dd>
                  </div>
                  <div>
                    <dt>{t("이메일")}</dt>
                    <dd>
                      <a href={`mailto:${company.email}`}>{company.email}</a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <section className="faq-section" aria-labelledby="faq-title">
          <div className="wrap faq-layout">
            <div>
              <span className="eyebrow">FAQ</span>
              <h2 id="faq-title">{t("자주 묻는 질문")}</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <article className="faq-item" key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={openFaq === index}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                    >
                      {faq.question}
                      <Plus size={20} />
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    hidden={openFaq !== index}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <AppInstall />
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="wrap contact-grid">
            <div>
              <span className="eyebrow">LET’S WORK TOGETHER</span>
              <h2 id="contact-title">
                {t("비즈니스에 필요한 AI,")}
                <br />
                {t("함께 이야기해 보세요.")}
              </h2>
              <p>{t("서비스 도입 · 비즈니스 제휴 · 기술 협력")}</p>
            </div>
            <div className="contact-actions">
              <button
                className="button button-white"
                type="button"
                onClick={openContact}
              >
                {t("서비스·협업 문의 ")}
                <ArrowUpRight size={19} />
              </button>
              <a href={`mailto:${company.email}`}>
                {company.email}
                <ArrowUpRight size={15} />
              </a>
              <a href={company.phoneHref}>
                {company.phone}
                <ArrowUpRight size={15} />
              </a>
              <address>{address}</address>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <a href="#home" aria-label={t("셀업랩스 홈")}>
              <Brand />
            </a>
            <span>AI TECHNOLOGY FOR REAL BUSINESS.</span>
            <a href="#home" className="back-top">
              {t("맨 위로 ")}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="footer-bottom">
            <div>
              <strong>{t(company.name)}</strong>
              <p>
                {t("대표 ")}
                {language === "en" ? "Dong-seok Han" : company.representative}
                <span>
                  {t("사업자등록번호 ")}
                  {company.businessNumber}
                </span>
              </p>
              <p>
                {address}
                <span>
                  {t("정보통신업 · AI 마케팅 콘텐츠 서비스 개발 및 운영")}
                </span>
              </p>
            </div>
            <div className="footer-contact-details">
              <a href={company.phoneHref}>{company.phone}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
            <span className="copyright">
              © {new Date().getFullYear()} selluplabs. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
      <ContactDialog dialogRef={contactRef} />
      <AppPreview dialogRef={previewRef} />
    </>
  );
}
