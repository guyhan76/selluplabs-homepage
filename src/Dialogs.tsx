import { useI18n } from "./i18n";
import { useState } from "react";
import type { FormEvent, RefObject } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  Mail,
  X,
} from "lucide-react";
import { company } from "./config";

export function ContactDialog({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const { t, language } = useI18n();
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "service",
    message: "",
  });
  const inquiryTypes = {
    service: "서비스 도입 문의",
    partnership: "비즈니스·기술 협력",
    media: "투자·미디어 문의",
    other: "기타 문의",
  };
  const inquiryType = t(inquiryTypes[form.type as keyof typeof inquiryTypes]);
  const body = `${t("문의 유형")}: ${inquiryType}\n${t("이름 / 회사명")}: ${form.name}\n${t("회신 이메일")}: ${form.email}\n\n${form.message}`;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const href = `mailto:${company.email}?subject=${encodeURIComponent(`[${t("셀업랩스")}] ${inquiryType} — ${form.name}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus(
      "이메일 앱에 문의 내용을 준비했습니다. 이메일 앱에서 보내기를 눌러주세요. 앱이 열리지 않으면 내용을 복사해 아래 주소로 보내실 수 있습니다.",
    );
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${t("받는 사람")}: ${company.email}\n${t("제목")}: [${t("셀업랩스")}] ${inquiryType}\n\n${body}`,
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
        aria-label={t("문의 창 닫기")}
        onClick={() => dialogRef.current?.close()}
      >
        <X size={23} />
      </button>
      <span className="eyebrow">CONTACT SELLUPLABS</span>
      <h2 id="contact-dialog-title">{t("서비스 도입·협업 문의")}</h2>
      <p className="dialog-intro">
        {t("서비스 도입부터 기술 협력까지,")}
        <br />
        {t("문의 내용을 남겨주세요.")}
      </p>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>
            {t("이름 / 회사명")}
            <input
              required
              name="name"
              autoComplete="organization"
              maxLength={100}
              value={form.name}
              placeholder={t("이름 또는 회사명")}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            {t("회신 이메일")}
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
          {t("문의 유형")}
          <span className="select-wrap">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="service">{t("서비스 도입 문의")}</option>
              <option value="partnership">{t("비즈니스·기술 협력")}</option>
              <option value="media">{t("투자·미디어 문의")}</option>
              <option value="other">{t("기타 문의")}</option>
            </select>
            <ChevronDown size={17} />
          </span>
        </label>
        <label>
          {t("문의 내용")}
          <textarea
            required
            name="message"
            rows={4}
            minLength={5}
            maxLength={2000}
            value={form.message}
            placeholder={t(
              "관심 있는 서비스나 협업 아이디어를 자유롭게 남겨주세요.",
            )}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        <p className="form-note">
          {t(
            "작성 내용은 이 홈페이지에 저장되지 않습니다. 버튼을 누르면 기기의 이메일 앱이 열립니다.",
          )}
        </p>
        <div className="form-actions">
          <button className="button button-dark" type="submit">
            {t("이메일로 문의하기 ")}
            <ArrowUpRight size={18} />
          </button>
          <button className="copy-button" type="button" onClick={copy}>
            {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
            {t(" 내용 복사")}
          </button>
        </div>
        <p className="form-status" role="status">
          {t(status)}
        </p>
      </form>
      <a className="dialog-email" href={`mailto:${company.email}`}>
        <Mail size={16} />
        {company.email}
      </a>
      <div className="dialog-contact-details">
        <a href={company.phoneHref}>{company.phone}</a>
        <address>
          {language === "en" ? company.englishLocation : company.location}
        </address>
      </div>
    </dialog>
  );
}

export function AppPreview({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const { t } = useI18n();
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
        aria-label={t("앱 소개 닫기")}
        onClick={() => dialogRef.current?.close()}
      >
        <X size={23} />
      </button>
      <div className="app-dialog-copy">
        <span className="eyebrow">MEET AIADCAST</span>
        <h2 id="app-dialog-title">{t("aiadcast 모바일 앱")}</h2>
        <p>
          {t(
            "특허 출원 기술을 기반으로 개발한 aiadcast 모바일 앱 MVP입니다. 상품의 규격과 참조 이미지를 마케팅 콘텐츠로 연결합니다.",
          )}
        </p>
        <ul>
          <li>
            <Check size={17} />
            {t(" 상품 정보와 참조 이미지 입력")}
          </li>
          <li>
            <Check size={17} />
            {t(" 9:16 릴스용 · 2:3 포스터용 이미지")}
          </li>
          <li>
            <Check size={17} />
            {t(" 브랜드 정보가 담긴 홍보 콘텐츠")}
          </li>
          <li>
            <Check size={17} />
            {t(" 제작 의도 · 추천 매체 · 검색 키워드")}
          </li>
        </ul>
        {company.appUrl ? (
          <a
            className="button button-dark"
            href={company.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Google Play에서 보기 ")}
            <ArrowUpRight size={18} />
          </a>
        ) : (
          <a
            className="button button-dark"
            href={`mailto:${company.email}?subject=${encodeURIComponent(t("aiadcast 앱 이용 문의"))}`}
          >
            {t("앱 이용 문의 ")}
            <ArrowUpRight size={18} />
          </a>
        )}
        <span className="app-screenshot-caption">
          {t("실제 aiadcast 모바일 앱 화면")}
        </span>
      </div>
      <div className="app-phone">
        <img
          src="/images/aiadcast-mvp.jpg"
          alt={t(
            "aiadcast 모바일 MVP 홈 화면. Marketing Package와 분석 요청하기 버튼이 표시되어 있습니다.",
          )}
          width="992"
          height="2118"
        />
      </div>
    </dialog>
  );
}
