import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  FileCheck2,
  Fingerprint,
  FlaskConical,
  Layers3,
  Mail,
  Menu,
  MoveUpRight,
  Plus,
  ScanLine,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { company } from "./config";
import { HeroArtwork } from "./Packaging";
import { GeneratedShowcase } from "./GeneratedShowcase";

const navItems = [
  { label: "회사 소개", href: "#about" },
  { label: "서비스", href: "#service" },
  { label: "기술과 연구", href: "#technology" },
];

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand ${inverse ? "brand-inverse" : ""}`}>
      <img src="/favicon.svg" width="34" height="34" alt="" />
      <span>
        sell<span className="brand-up">up</span>
        <span className="brand-labs">labs</span>
        <span className="brand-period">.</span>
      </span>
    </span>
  );
}

function SectionLabel({
  number,
  children,
  light = false,
}: {
  number: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`section-label ${light ? "label-light" : ""}`}>
      <span className="section-dot" />
      <span>{children}</span>
      <span className="section-number">{number}</span>
    </div>
  );
}

function Reveal({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          target.classList.add("is-visible");
          observer.unobserve(target);
        }
      },
      { threshold: 0.08 },
    );
    target.classList.add("reveal-ready");
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} id={id}>
      {children}
    </div>
  );
}

function ContactDialog({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "서비스 도입 문의",
    message: "",
  });
  const body = `문의 유형: ${form.type}\n이름 / 회사명: ${form.name}\n회신 이메일: ${form.email}\n\n${form.message}`;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const href = `mailto:${company.email}?subject=${encodeURIComponent(`[셀업랩스] ${form.type} — ${form.name}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus(
      "이메일 앱에 문의 내용을 준비했습니다. 이메일 앱에서 보내기를 눌러주세요. 앱이 열리지 않으면 내용을 복사해 아래 주소로 보내실 수 있습니다.",
    );
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `받는 사람: ${company.email}\n제목: [셀업랩스] ${form.type}\n\n${body}`,
      );
      setCopied(true);
      setStatus(
        "문의 내용을 복사했습니다. 사용하시는 이메일에 붙여넣어 보내주세요.",
      );
    } catch {
      setStatus(
        "자동 복사가 지원되지 않습니다. 아래 이메일 주소로 직접 문의해주세요.",
      );
    }
  };
  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby="contact-dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      onClose={() => {
        setStatus("");
        setCopied(false);
      }}
    >
      <button
        type="button"
        className="dialog-close"
        aria-label="문의 창 닫기"
        onClick={() => dialogRef.current?.close()}
      >
        <X size={23} />
      </button>
      <span className="eyebrow">LET’S BUILD THE NEXT.</span>
      <h2 id="contact-dialog-title">
        어떤 가능성을
        <br />
        함께 만들어볼까요?
      </h2>
      <p className="dialog-intro">
        서비스 도입부터 기술 협력까지,
        <br />
        셀업랩스에 당신의 이야기를 들려주세요.
      </p>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>
            이름 / 회사명
            <input
              required
              name="name"
              autoComplete="organization"
              maxLength={100}
              value={form.name}
              placeholder="이름 또는 회사명"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            회신 이메일
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              maxLength={200}
              value={form.email}
              placeholder="name@company.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
        </div>
        <label>
          문의 유형
          <span className="select-wrap">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>서비스 도입 문의</option>
              <option>비즈니스·기술 협력</option>
              <option>투자·미디어 문의</option>
              <option>기타 문의</option>
            </select>
            <ChevronDown size={17} />
          </span>
        </label>
        <label>
          문의 내용
          <textarea
            required
            name="message"
            rows={4}
            minLength={5}
            maxLength={2000}
            value={form.message}
            placeholder="관심 있는 서비스나 협업 아이디어를 자유롭게 남겨주세요."
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        <p className="form-note">
          작성 내용은 이 홈페이지에 저장되지 않습니다. 버튼을 누르면 기기의
          이메일 앱이 열립니다.
        </p>
        <div className="form-actions">
          <button className="button button-dark" type="submit">
            이메일로 문의하기 <ArrowUpRight size={18} />
          </button>
          <button className="copy-button" type="button" onClick={copy}>
            {copied ? <CheckCheck size={18} /> : <Copy size={18} />} 내용 복사
          </button>
        </div>
        <p className="form-status" role="status">
          {status}
        </p>
      </form>
      <a className="dialog-email" href={`mailto:${company.email}`}>
        <Mail size={16} />
        {company.email}
      </a>
    </dialog>
  );
}

function AppPreview({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="app-dialog"
      aria-labelledby="app-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
    >
      <button
        type="button"
        className="dialog-close"
        aria-label="앱 소개 닫기"
        onClick={() => dialogRef.current?.close()}
      >
        <X size={23} />
      </button>
      <div className="app-dialog-copy">
        <span className="eyebrow">MEET AIADCAST</span>
        <h2 id="app-dialog-title">
          가능성은 이미,
          <br />
          손안에 있습니다.
        </h2>
        <p>
          특허 출원 기술을 기반으로 개발한 aiadcast 모바일 앱 MVP입니다. 상품의
          규격과 참조 이미지를 마케팅 콘텐츠로 연결합니다.
        </p>
        <ul>
          <li>
            <Check size={17} /> 상품 정보와 참조 이미지 입력
          </li>
          <li>
            <Check size={17} /> 9:16 릴스용 · 2:3 포스터용 이미지
          </li>
          <li>
            <Check size={17} /> 브랜드 정보가 담긴 홍보 콘텐츠
          </li>
          <li>
            <Check size={17} /> 제작 의도 · 추천 매체 · 검색 키워드
          </li>
        </ul>
        {company.appUrl ? (
          <a
            className="button button-dark"
            href={company.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Play에서 보기 <ArrowUpRight size={18} />
          </a>
        ) : (
          <a
            className="button button-dark"
            href={`mailto:${company.email}?subject=${encodeURIComponent("aiadcast 앱 이용 문의")}`}
          >
            앱 이용 문의 <ArrowUpRight size={18} />
          </a>
        )}
        <span className="app-screenshot-caption">
          사업계획서에 수록된 모바일 앱 화면
        </span>
      </div>
      <div className="app-phone">
        <img
          src="/images/aiadcast-mvp.jpg"
          alt="aiadcast 모바일 MVP 홈 화면. Marketing Package와 분석 요청하기 버튼이 표시되어 있습니다."
          width="992"
          height="2118"
        />
      </div>
    </dialog>
  );
}

const faqs = [
  {
    question: "aiadcast는 어떤 서비스를 제공하나요?",
    answer:
      "박스, 쇼핑백, 스티커·라벨, 용기 등 포장재에 특화된 AI 마케팅 콘텐츠 생성 서비스입니다. 상품 규격과 참조 이미지를 결합해 상품 이미지, 설명 문구, 회사 정보가 포함된 홍보 이미지를 제작하는 모바일 앱 MVP를 개발했습니다.",
  },
  {
    question: "어떤 정보를 준비하면 되나요?",
    answer:
      "상품명, 회사명, 연락처, 이메일 또는 홈페이지 주소, 상품 카테고리, 규격, 상세 설명과 참조 이미지 최대 10장을 준비해주세요. 복잡한 프롬프트 대신 실제 상품 정보를 단계별로 입력하는 방식입니다.",
  },
  {
    question: "릴스 영상도 만들어주나요?",
    answer:
      "현재 안내하는 기능은 원페이지 릴스에 활용할 수 있는 9:16 비율의 이미지와 홍보용 포스터에 맞는 2:3 비율의 이미지 생성입니다. 동영상 자동 생성 기능을 의미하지 않습니다.",
  },
  {
    question: "서비스 도입이나 협업은 어떻게 문의하나요?",
    answer: `서비스 도입, 기술·사업 제휴, 투자 관련 문의는 ${company.email}으로 보내주세요. 아래 ‘문의하기’에서 내용을 작성하면 이메일 앱으로 이어집니다.`,
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const contactRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLDialogElement>(null);
  const openContact = () => {
    setMenuOpen(false);
    contactRef.current?.showModal();
  };
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand-link" aria-label="셀업랩스 홈">
            <Brand />
          </a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="header-contact"
              type="button"
              onClick={openContact}
            >
              함께하기 <ArrowUpRight size={16} />
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="모바일 메뉴"
          inert={!menuOpen}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
          <button type="button" onClick={openContact}>
            문의하기 <ArrowUpRight size={18} />
          </button>
        </nav>
      </header>
      <main id="main">
        <section
          className="hero section-wrap"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-topline">
            <span>
              <span className="live-dot" /> SMALL BUSINESS. BIG POSSIBILITIES.
            </span>
            <span>
              SEOUL, KOREA <ArrowUpRight size={12} />
            </span>
          </div>
          <div className="hero-main">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span>현장의 경험에 AI의 가능성을 더하다</span>
              </div>
              <h1 id="hero-title">
                당신의 상품이,
                <br />
                <span className="hero-emphasis">더 큰 세상</span>으로
                <span className="orange-dot">.</span>
              </h1>
              <p>
                좋은 상품의 가치를, 더 많은 사람에게.
                <br />
                셀업랩스는 상품을 이해하는 AI 기술로
                <br />
                작은 기업의 더 큰 가능성을 만듭니다.
              </p>
              <div className="hero-buttons">
                <a className="button button-dark" href="#service">
                  aiadcast 만나보기 <ArrowUpRight size={19} />
                </a>
                <a className="text-button" href="#about">
                  우리의 이야기 <ArrowRight size={17} />
                </a>
              </div>
              <div className="hero-proof">
                <span className="mini-symbol">
                  s<span>▲</span>
                </span>
                <span>
                  FROM REAL-WORLD EXPERIENCE
                  <br />
                  <strong>포장 산업의 경험, AI 기술로 이어지다.</strong>
                </span>
              </div>
            </div>
            <HeroArtwork />
          </div>
          <div className="hero-bottom">
            <a href="#about">
              SCROLL TO EXPLORE <ArrowDown size={15} />
            </a>
            <span>We turn product details into brand possibilities.</span>
            <span>01 — 05</span>
          </div>
        </section>
        <div className="marquee" aria-hidden="true">
          <div>
            {[0, 1, 2].map((i) => (
              <span key={i}>
                PRODUCT INTELLIGENCE <span>✳</span> CREATIVE POSSIBILITIES{" "}
                <span>✳</span> REAL BUSINESS IMPACT <span>✳</span>{" "}
              </span>
            ))}
          </div>
        </div>
        <section
          className="about section-wrap section-space"
          id="about"
          aria-labelledby="about-title"
        >
          <Reveal>
            <SectionLabel number="01">WHY SELLUPLABS</SectionLabel>
            <div className="about-top">
              <h2 id="about-title">
                좋은 상품은,
                <br />더 넓은 세상을 만날
                <br />
                <span className="muted-text">자격이 있으니까.</span>
              </h2>
              <div className="about-story">
                <span className="about-arrow">
                  <ArrowDownRight size={58} strokeWidth={1.1} />
                </span>
                <p>
                  좋은 제품을 만들지만, 알리는 일은 어려운 분들이 있습니다. 바쁜
                  하루에 디자인도, 마케팅도 혼자 해내야 하는 작은 기업들.
                </p>
                <p>
                  셀업랩스는 포장 산업 현장에서 마주한 이 질문에서 시작했습니다.{" "}
                  <strong>
                    “상품을 가장 잘 아는 사람이, 가장 쉽게 알릴 수는 없을까?”
                  </strong>
                </p>
                <p>
                  우리는 현장의 언어를 기술로 바꾸고, 누구나 자신의 상품을 더 잘
                  알릴 수 있는 내일을 만듭니다.
                </p>
              </div>
            </div>
            <div className="about-values">
              <article>
                <span className="value-number">
                  25<span>+</span>
                </span>
                <div>
                  <h3>산업을 이해하는 경험</h3>
                  <p>대표자의 25년 이상 포장 산업 경험</p>
                </div>
                <ArrowUpRight size={21} />
              </article>
              <article>
                <span className="value-icon">
                  <Fingerprint size={43} strokeWidth={1.2} />
                </span>
                <div>
                  <h3>현장에서 출발한 기술</h3>
                  <p>상품 규격과 이미지를 결합하는 AI</p>
                </div>
                <ArrowUpRight size={21} />
              </article>
              <article>
                <span className="value-icon">
                  <MoveUpRight size={43} strokeWidth={1.2} />
                </span>
                <div>
                  <h3>작은 기업의 큰 가능성</h3>
                  <p>마케팅의 진입장벽을 낮추는 서비스</p>
                </div>
                <ArrowUpRight size={21} />
              </article>
            </div>
          </Reveal>
        </section>
        <section
          className="service-section section-space"
          id="service"
          aria-labelledby="service-title"
        >
          <div className="section-wrap">
            <Reveal>
              <SectionLabel number="02" light>
                OUR FIRST ANSWER, AIADCAST
              </SectionLabel>
              <div className="service-intro">
                <div>
                  <img
                    className="aiadcast-logo"
                    src="/images/aiadcast-logo.png"
                    width="1313"
                    height="341"
                    alt="aiadcast"
                  />
                  <h2 id="service-title">
                    상품의 디테일이,
                    <br />
                    <span>콘텐츠의 경쟁력으로.</span>
                  </h2>
                </div>
                <div className="service-description">
                  <span className="service-chip">
                    <span /> AI MARKETING FOR PACKAGING
                  </span>
                  <p>
                    규격, 소재, 이미지. 당신이 알려준 상품의 정보를
                    <br className="desktop-break" /> 이해하고 마케팅 콘텐츠로
                    연결합니다.
                    <br />
                    포장재를 위한 AI, aiadcast.
                  </p>
                  <div className="service-actions">
                    <button
                      className="text-button light-button"
                      type="button"
                      onClick={() => previewRef.current?.showModal()}
                    >
                      모바일 앱 살펴보기 <ArrowUpRight size={18} />
                    </button>
                    <a
                      className="store-link"
                      href={company.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Smartphone size={15} /> Google Play{" "}
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <GeneratedShowcase />
            </Reveal>
            <div className="service-deliverables">
              <span>하나의 흐름으로 연결되는 마케팅</span>
              <div>
                <span>
                  <Check size={15} /> 마케팅 이미지
                </span>
                <span>
                  <Check size={15} /> 제작 의도
                </span>
                <span>
                  <Check size={15} /> 추천 매체
                </span>
                <span>
                  <Check size={15} /> 검색 키워드
                </span>
              </div>
            </div>
          </div>
        </section>
        <section
          className="process section-wrap section-space"
          aria-labelledby="process-title"
        >
          <Reveal>
            <SectionLabel number="03">
              LESS COMPLEXITY. MORE POSSIBILITY.
            </SectionLabel>
            <div className="section-title-row">
              <h2 id="process-title">
                복잡한 기술은 안으로.
                <br />
                쉬운 경험은 당신에게.
              </h2>
              <p>
                프롬프트를 공부하는 대신,
                <br />
                당신의 상품 이야기에 집중하세요.
              </p>
            </div>
            <div className="process-grid">
              <article>
                <div className="process-top">
                  <span>01</span>
                  <ScanLine size={29} strokeWidth={1.3} />
                </div>
                <h3>상품을 알려주세요.</h3>
                <p>
                  상품명과 카테고리, 규격과 상세 설명.
                  <br />
                  회사명과 연락처 등 상품과 브랜드의
                  <br />
                  기본 정보를 입력합니다.
                </p>
                <div className="step-graphic graphic-input">
                  <span>상품 규격</span>
                  <Plus size={15} />
                  <span>참조 이미지</span>
                </div>
              </article>
              <article>
                <div className="process-top">
                  <span>02</span>
                  <Sparkles size={29} strokeWidth={1.3} />
                </div>
                <h3>실제 모습을 더하세요.</h3>
                <p>
                  참조 이미지를 최대 10장까지 더해
                  <br />
                  AI가 상품의 형태와 특징을
                  <br />
                  함께 이해할 수 있도록 합니다.
                </p>
                <div className="step-graphic graphic-ai">
                  <span />
                  <span />
                  <div>ai</div>
                  <span />
                  <span />
                </div>
              </article>
              <article>
                <div className="process-top">
                  <span>03</span>
                  <Layers3 size={29} strokeWidth={1.3} />
                </div>
                <h3>형식을 고르고, 생성.</h3>
                <p>
                  9:16 카드뉴스·릴스용 또는 2:3 포스터.
                  <br />
                  원하는 형식을 선택해 생성한 뒤,
                  <br />
                  이미지와 활용 가이드를 확인합니다.
                </p>
                <div className="step-graphic graphic-formats">
                  <span>9:16</span>
                  <span>2:3</span>
                  <ArrowUpRight size={24} />
                </div>
              </article>
            </div>
          </Reveal>
        </section>
        <section
          className="technology section-space"
          id="technology"
          aria-labelledby="technology-title"
        >
          <div className="section-wrap">
            <Reveal>
              <SectionLabel number="04">
                BUILT ON RESEARCH. DRIVEN BY REALITY.
              </SectionLabel>
              <div className="section-title-row">
                <h2 id="technology-title">
                  가능성을 말하고,
                  <br />
                  기술로 증명합니다.
                </h2>
                <p>
                  현장의 문제를 깊이 연구하고,
                  <br />
                  실제로 사용할 수 있는 서비스로 만듭니다.
                </p>
              </div>
              <div className="tech-grid">
                <article className="patent-card">
                  <div className="tech-card-top">
                    <span>PATENT PENDING</span>
                    <FileCheck2 size={23} strokeWidth={1.3} />
                  </div>
                  <div className="patent-visual" aria-hidden="true">
                    <div className="patent-orbit" />
                    <div className="patent-orbit" />
                    <div className="patent-core">
                      <Fingerprint size={76} strokeWidth={0.8} />
                    </div>
                    <span className="patent-node node-left">SPEC</span>
                    <span className="patent-node node-right">IMAGE</span>
                  </div>
                  <span className="tech-status">
                    <span /> 특허 1건 출원
                  </span>
                  <h3>
                    상품을 이해하는
                    <br />
                    우리만의 접근.
                  </h3>
                  <p>
                    상품 규격 정보와 상품 이미지를 결합한
                    <br />
                    마케팅 콘텐츠 자동 생성 시스템 및 그 방법
                  </p>
                  <div className="patent-number">
                    출원번호 {company.patent}
                    <span>2026.08.21</span>
                  </div>
                </article>
                <div className="tech-right">
                  <article>
                    <div className="tech-card-top">
                      <span>RESEARCH & DEVELOPMENT</span>
                      <FlaskConical size={24} strokeWidth={1.3} />
                    </div>
                    <div>
                      <span className="tech-status">
                        <span /> 연구개발전담부서 인정 · 운영
                      </span>
                      <h3>
                        더 정확하게.
                        <br />더 쓸모 있게.
                      </h3>
                      <p>
                        상품 규격의 반영과 포장재 카테고리별
                        <br />
                        콘텐츠 품질 고도화를 연구합니다.
                      </p>
                    </div>
                    <span className="tech-large-word" aria-hidden="true">
                      R&D
                    </span>
                  </article>
                  <article>
                    <div className="tech-card-top">
                      <span>FROM TECHNOLOGY TO PRODUCT</span>
                      <Smartphone size={24} strokeWidth={1.3} />
                    </div>
                    <div>
                      <span className="tech-status">
                        <span /> 모바일 앱 MVP 개발
                      </span>
                      <h3>
                        아이디어를 넘어,
                        <br />
                        손안의 서비스로.
                      </h3>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => previewRef.current?.showModal()}
                      >
                        aiadcast 앱 살펴보기 <ArrowUpRight size={17} />
                      </button>
                    </div>
                    <span className="tech-large-word" aria-hidden="true">
                      MVP
                    </span>
                  </article>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <section
          className="faq section-wrap section-space"
          aria-labelledby="faq-title"
        >
          <Reveal className="faq-layout">
            <div>
              <SectionLabel number="05">A LITTLE MORE ABOUT US</SectionLabel>
              <h2 id="faq-title">
                궁금한 점이
                <br />
                있으신가요?
              </h2>
              <a className="text-button" href={`mailto:${company.email}`}>
                직접 문의하기 <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <article
                  className={
                    openFaq === index ? "faq-item is-open" : "faq-item"
                  }
                  key={faq.question}
                >
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
                      <span>
                        <span className="faq-number">0{index + 1}</span>
                        {faq.question}
                      </span>
                      <Plus size={21} />
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
          </Reveal>
        </section>
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-wrap">
            <Reveal>
              <div className="contact-top">
                <span>GOOD PRODUCTS DESERVE A BIGGER WORLD.</span>
                <span>
                  LET’S TALK <ArrowDownRight size={18} />
                </span>
              </div>
              <div className="contact-main">
                <h2 id="contact-title">
                  다음 가능성을,
                  <br />
                  함께 만듭니다<span>.</span>
                </h2>
                <button
                  className="contact-round"
                  type="button"
                  onClick={openContact}
                  aria-label="셀업랩스 문의하기"
                >
                  <ArrowUpRight size={51} strokeWidth={1.2} />
                  <span>문의하기</span>
                </button>
              </div>
              <div className="contact-bottom">
                <p>
                  서비스 도입, 비즈니스 협력, 새로운 아이디어.
                  <br />
                  셀업랩스와 함께 시작해보세요.
                </p>
                <a href={`mailto:${company.email}`}>
                  {company.email}
                  <ArrowUpRight size={21} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="section-wrap">
          <div className="footer-top">
            <a href="#home" aria-label="셀업랩스 홈">
              <Brand inverse />
            </a>
            <span>GLOBAL VENTURE BUILDER</span>
            <a href="#home" className="back-top">
              BACK TO TOP <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="footer-info">
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
            <a href={`mailto:${company.email}`}>
              {company.email}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} selluplabs. All rights reserved.
            </span>
            <span>Built for the next possibility.</span>
          </div>
        </div>
      </footer>
      <ContactDialog dialogRef={contactRef} />
      <AppPreview dialogRef={previewRef} />
    </>
  );
}
