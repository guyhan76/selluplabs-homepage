import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { company } from "./config";
import { ContactDialog, AppPreview } from "./Dialogs";
import { GeneratedShowcase } from "./GeneratedShowcase";

const navigation = [
  { label: "서비스", href: "#service" },
  { label: "생성 사례", href: "#cases" },
  { label: "기술", href: "#technology" },
  { label: "회사 소개", href: "#about" },
];
const faqs = [
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
      <img src="/favicon.svg" width="32" height="32" alt="" />
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
        본문으로 바로가기
      </a>
      <header className="site-header">
        <div className="header-inner wrap">
          <a className="brand-link" href="#home" aria-label="셀업랩스 홈">
            <Brand />
          </a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            {navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="header-contact"
              onClick={openContact}
            >
              문의하기 <ArrowUpRight size={16} />
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
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
          aria-label="모바일 메뉴"
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
                상품 정보로 만드는
                <br />
                <span>AI 마케팅 콘텐츠.</span>
              </h1>
              <p className="hero-description">
                셀업랩스는 상품 규격과 이미지를 결합해
                <br className="desktop-break" /> 마케팅 콘텐츠를 자동 생성하는
                <br className="desktop-break" /> AI 서비스를 개발·운영합니다.
              </p>
              <div className="hero-actions">
                <a className="button button-white" href="#service">
                  aiadcast 알아보기 <ArrowUpRight size={18} />
                </a>
                <a className="button button-outline" href="#cases">
                  실제 생성 사례 <ArrowRight size={18} />
                </a>
              </div>
              <div className="hero-domain">
                <span /> 포장재 특화 AI · 모바일 서비스
              </div>
            </div>
            <div
              className="hero-product"
              aria-label="aiadcast 실제 마케팅 콘텐츠 생성 결과"
            >
              <div className="product-window-top">
                <AiadcastMark />
                <span>
                  GENERATED CONTENTS <span className="status-dot" />
                </span>
              </div>
              <div className="hero-results">
                <a href="#cases" className="hero-result">
                  <img
                    src="/images/examples/box-22.png"
                    width="1008"
                    height="1792"
                    alt="aiadcast가 생성한 크라프트 택배박스 홍보 이미지. 상품 규격과 설명 문구가 함께 구성되어 있습니다."
                    fetchPriority="high"
                  />
                  <div>
                    <span>택배박스</span>
                    <span>9:16</span>
                  </div>
                </a>
                <a href="#cases" className="hero-result">
                  <img
                    src="/images/examples/bag-1.png"
                    width="1008"
                    height="1792"
                    alt="aiadcast가 생성한 오렌지 쇼핑백 홍보 이미지. 제품 특징과 회사 정보가 함께 구성되어 있습니다."
                  />
                  <div>
                    <span>쇼핑백</span>
                    <span>9:16</span>
                  </div>
                </a>
              </div>
              <div className="product-window-bottom">
                <span>
                  <Check size={13} /> 실제 앱 생성 결과
                </span>
                <span>PRODUCT DATA → MARKETING CONTENT</span>
              </div>
            </div>
          </div>
          <div className="hero-base wrap">
            <a href="#service" className="scroll-link">
              EXPLORE SELLUPLABS <ArrowDown size={14} />
            </a>
            <div className="hero-credentials">
              <span>특허 1건 출원</span>
              <span>연구개발전담부서 운영</span>
              <span>Google Play 서비스</span>
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
                  포장재를 위한
                  <br />
                  AI 마케팅 콘텐츠 서비스.
                </h2>
              </div>
              <div className="service-intro-copy">
                <p>
                  제품을 가장 잘 아는 사람의 정보가
                  <br />
                  좋은 마케팅 콘텐츠의 출발점이 됩니다.
                </p>
                <p>
                  aiadcast는 상품 규격과 참조 이미지를 바탕으로
                  <br className="desktop-break" /> 제품 이미지, 홍보 문구, 기업
                  정보를 하나로 구성합니다.
                </p>
                <div className="service-actions">
                  <a
                    className="text-link"
                    href={company.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Play에서 시작하기 <ArrowUpRight size={17} />
                  </a>
                  <button
                    className="text-link secondary-link"
                    type="button"
                    onClick={() => previewRef.current?.showModal()}
                  >
                    모바일 앱 살펴보기 <ArrowUpRight size={17} />
                  </button>
                </div>
              </div>
            </div>
            <div className="workflow" aria-label="aiadcast 사용 방법">
              <article className="workflow-step">
                <div className="step-top">
                  <span>01</span>
                  <span>PRODUCT DATA</span>
                </div>
                <h3>상품 정보를 입력합니다.</h3>
                <p>
                  상품명과 규격, 소재와 상세 설명.
                  <br />
                  기업 정보와 함께 입력합니다.
                </p>
                <div className="step-example">
                  <div>
                    <span>상품명</span>
                    <strong>택배박스</strong>
                  </div>
                  <div>
                    <span>규격</span>
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
                <h3>참조 이미지를 더합니다.</h3>
                <p>
                  상품의 형태와 특징을 알 수 있는
                  <br />
                  이미지를 최대 10장 업로드합니다.
                </p>
                <div className="step-example upload-example">
                  <span className="upload-line">
                    <Plus size={20} /> 상품 참조 이미지
                  </span>
                  <span className="upload-limit">
                    최대 <strong>10</strong>장
                  </span>
                </div>
              </article>
              <article className="workflow-step">
                <div className="step-top">
                  <span>03</span>
                  <span>MARKETING CONTENT</span>
                </div>
                <h3>형식을 선택하고 생성합니다.</h3>
                <p>
                  카드뉴스·릴스용 이미지 또는 포스터.
                  <br />
                  활용 목적에 맞는 비율을 선택합니다.
                </p>
                <div className="step-example format-example">
                  <div>
                    <span className="format-shape shape-916" />
                    <span>
                      <strong>9:16</strong>
                      <small>카드뉴스·릴스용 이미지</small>
                    </span>
                  </div>
                  <div>
                    <span className="format-shape shape-23" />
                    <span>
                      <strong>2:3</strong>
                      <small>마케팅 포스터</small>
                    </span>
                  </div>
                </div>
              </article>
            </div>
            <div className="service-output">
              <span>함께 제공되는 콘텐츠</span>
              <div>
                <span>마케팅 이미지</span>
                <span>제작 의도</span>
                <span>추천 매체</span>
                <span>검색 키워드</span>
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
                결과로 확인하는
                <br />
                AI 콘텐츠 생성.
              </h2>
              <p>
                박스부터 쇼핑백, 라벨과 용기까지.
                <br />
                aiadcast 앱에서 실제 생성한 마케팅 이미지입니다.
              </p>
            </div>
            <GeneratedShowcase />
          </div>
        </section>
        <section
          className="technology-section section-space"
          id="technology"
          aria-labelledby="technology-title"
        >
          <div className="wrap">
            <div className="section-eyebrow">
              <span>03 — OUR TECHNOLOGY</span>
              <span>BUILT ON PRODUCT INTELLIGENCE</span>
            </div>
            <div className="section-heading">
              <h2 id="technology-title">
                상품의 규격과 이미지.
                <br />
                <span>두 정보를 연결하는 기술.</span>
              </h2>
              <p>
                상품을 표현하는 데 필요한 구체적인 정보를
                <br />
                마케팅 콘텐츠 생성의 기준으로 활용합니다.
              </p>
            </div>
            <div
              className="technology-flow"
              aria-label="상품 규격과 이미지 결합 기반 콘텐츠 생성 기술"
            >
              <div className="tech-inputs">
                <div className="tech-input">
                  <span>01 / SPECIFICATION</span>
                  <strong>상품 규격 정보</strong>
                  <p>카테고리 · 크기 · 소재 · 특징</p>
                </div>
                <div className="tech-input">
                  <span>02 / REFERENCE</span>
                  <strong>상품 이미지</strong>
                  <p>형태 · 디테일 · 시각적 특징</p>
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
                <div>규격 정보 + 상품 이미지 결합</div>
              </div>
              <div className="tech-connector" aria-hidden="true">
                <span />
                <ArrowRight size={20} />
              </div>
              <div className="tech-result">
                <span>OUTPUT / CONTENT</span>
                <strong>마케팅 콘텐츠</strong>
                <p>
                  상품 이미지 + 설명 문구
                  <br />+ 기업 정보
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
                <h3>특허 1건 출원</h3>
                <p>
                  상품 규격 정보와 상품 이미지를 결합한
                  <br />
                  마케팅 콘텐츠 자동 생성 시스템 및 그 방법
                </p>
                <div className="evidence-detail">
                  출원번호 {company.patent}
                  <span>2026.08.21</span>
                </div>
              </article>
              <article>
                <span className="evidence-label">RESEARCH & DEVELOPMENT</span>
                <h3>연구개발전담부서 운영</h3>
                <p>
                  인정받은 연구개발전담부서를 중심으로
                  <br />
                  상품 정보 반영과 콘텐츠 품질을 연구합니다.
                </p>
                <div className="evidence-detail">
                  상품 이해 · 생성 품질 고도화
                </div>
              </article>
              <article>
                <span className="evidence-label">TECHNOLOGY TO PRODUCT</span>
                <h3>모바일 앱 MVP 개발</h3>
                <p>
                  출원 기술을 모바일 서비스로 구현했습니다.
                  <br />
                  Google Play에서 aiadcast를 만나보세요.
                </p>
                <a
                  className="evidence-detail"
                  href={company.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aiadcast 앱 보기 <ArrowUpRight size={16} />
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
              <span>04 — ABOUT SELLUPLABS</span>
              <span>FROM INDUSTRY TO TECHNOLOGY</span>
            </div>
            <div className="about-grid">
              <div>
                <h2 id="about-title">
                  현장의 이해에서 시작한
                  <br />
                  AI 기술 기업, 셀업랩스.
                </h2>
                <p>
                  셀업랩스 주식회사는 AI 마케팅 콘텐츠 생성 서비스를
                  개발·운영하는 정보통신 기업입니다. 포장 산업에서 쌓은 경험을
                  바탕으로, 상품의 가치를 쉽게 알릴 수 있는 기술을 만듭니다.
                </p>
                <p>
                  제품의 규격과 소재를 이해하는 것부터 기업의 마케팅을 돕는
                  것까지. 현장의 필요를 실제로 사용할 수 있는 서비스로
                  연결합니다.
                </p>
              </div>
              <div className="company-facts">
                <div className="experience">
                  <strong>
                    25<span>+</span>
                  </strong>
                  <span>
                    YEARS OF INDUSTRY EXPERIENCE
                    <small>대표자의 25년 이상 포장 산업 경험</small>
                  </span>
                </div>
                <dl>
                  <div>
                    <dt>기업명</dt>
                    <dd>
                      셀업랩스 주식회사 <span>selluplabs</span>
                    </dd>
                  </div>
                  <div>
                    <dt>사업 분야</dt>
                    <dd>AI 마케팅 콘텐츠 서비스 개발·운영</dd>
                  </div>
                  <div>
                    <dt>대표 서비스</dt>
                    <dd>aiadcast</dd>
                  </div>
                  <div>
                    <dt>소재지</dt>
                    <dd>{company.location}</dd>
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
              <h2 id="faq-title">자주 묻는 질문</h2>
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
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="wrap contact-grid">
            <div>
              <span className="eyebrow">LET’S WORK TOGETHER</span>
              <h2 id="contact-title">
                비즈니스에 필요한 AI,
                <br />
                함께 이야기해 보세요.
              </h2>
              <p>서비스 도입 · 비즈니스 제휴 · 기술 협력</p>
            </div>
            <div className="contact-actions">
              <button
                className="button button-white"
                type="button"
                onClick={openContact}
              >
                서비스·협업 문의 <ArrowUpRight size={19} />
              </button>
              <a href={`mailto:${company.email}`}>
                {company.email}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <a href="#home" aria-label="셀업랩스 홈">
              <Brand />
            </a>
            <span>AI TECHNOLOGY FOR REAL BUSINESS.</span>
            <a href="#home" className="back-top">
              맨 위로 <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="footer-bottom">
            <div>
              <strong>{company.name}</strong>
              <p>
                대표 {company.representative}
                <span>사업자등록번호 {company.businessNumber}</span>
              </p>
              <p>
                {company.location}
                <span>정보통신업 · AI 마케팅 콘텐츠 서비스 개발 및 운영</span>
              </p>
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
