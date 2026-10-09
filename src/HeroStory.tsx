import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Box, Check, Pause, Play, Sparkles } from "lucide-react";
import { useI18n } from "./i18n";
import { useReducedMotion } from "./Motion";
import { generatedCategories } from "./generatedExamples";

const steps = ["상품 정보", "AI 콘텐츠 구성", "홍보 이미지 완성"];
const example = generatedCategories[0].examples.find((item) => item.id === "box-19")!;
const duration = 4800;

export function HeroStory() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? 2 : 0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const root = useRef<HTMLDivElement>(null);
  const playing = !reduced && !paused && inView && pageVisible;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setStep((value) => (value + 1) % steps.length), duration);
    return () => window.clearTimeout(timer);
  }, [step, playing]);

  return (
    <div ref={root} className="hero-product motion-story" data-step={step} data-playing={playing}
      aria-label={t("상품 정보가 마케팅 콘텐츠가 되는 과정")}>
      <div className="story-top">
        <span className="aiadcast-mark" aria-label="aiadcast"><span>ai</span>adcast<i aria-hidden="true" /></span>
        <div className="story-controls">
          <span>{t("생성 과정 예시")}</span>
          {!reduced && <button type="button" onClick={() => setPaused(!paused)} aria-label={t(paused ? "자동 전환 재생" : "자동 전환 일시정지")} title={t(paused ? "자동 전환 재생" : "자동 전환 일시정지")}>
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </button>}
        </div>
      </div>
      <div className="story-canvas" id="hero-story-panel">
        <div className="story-grid" aria-hidden="true" />
        <div className="story-data">
          <div className="story-symbol" aria-hidden="true"><Box size={56} strokeWidth={1} /><span>300 × 200 × 100 mm</span></div>
          <div className="story-description" key={step}>
            <span className="story-kicker">{["01 / PRODUCT DATA", "02 / AI COMPOSITION", "03 / READY TO SHARE"][step]}</span>
            <h2>{t(["상품의 정보가", "하나의 콘텐츠로", "브랜드의 기회로."][step])}</h2>
            {step === 0 && <dl className="story-specs">
              <div><dt>{t("상품명")}</dt><dd>{t("크라프트 택배박스")}</dd></div>
              <div><dt>{t("규격")}</dt><dd>300 × 200 × 100 mm</dd></div>
              <div><dt>{t("소재")}</dt><dd>{t("크라프트")}</dd></div>
              <div><dt>{t("기업 정보")}</dt><dd>selluplabs</dd></div>
            </dl>}
            {step === 1 && <ul className="story-composition">
              {["규격을 반영한 상품 이미지", "제품의 강점을 담은 문구", "회사 정보와 연락처"].map((copy) => <li key={copy}><Sparkles size={12} aria-hidden="true" />{t(copy)}</li>)}
            </ul>}
            {step === 2 && <div className="story-ready"><p>{t("상품의 가치를 한 장에 담아, 고객과 만날 준비.")}</p><span>9:16 <span> / </span> 2:3</span><a href="#applications" onFocus={() => setPaused(true)}>{t("어디에 활용할까요?")}<ArrowUpRight size={14} aria-hidden="true" /></a></div>}
          </div>
        </div>
        <div className="story-connector" aria-hidden="true"><span /><ArrowUpRight size={15} /></div>
        <a className="hero-result story-output" href="#cases" aria-label={t("실제 생성 사례 보기")}>
          <img src={example.thumbnail} width={example.width} height={example.height} alt={t(example.alt)} fetchPriority="high" />
          <span className="story-scan" aria-hidden="true" />
          <span className="story-output-label"><Check size={12} aria-hidden="true" />{t("실제 앱 생성 결과")}</span>
        </a>
      </div>
      <div className="story-steps" role="group" aria-label={t("생성 과정 단계 선택")}>
        {steps.map((label, index) => <button type="button" key={label} aria-pressed={step === index} aria-controls="hero-story-panel" onClick={() => { setStep(index); setPaused(true); }}>
          <span className="story-step-line"><i key={`${step}-${playing}`} /></span>
          <span className="story-step-number">0{index + 1}</span><span>{t(label)}</span>
        </button>)}
      </div>
    </div>
  );
}
