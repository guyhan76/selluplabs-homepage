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
      <span className="eyebrow">CONTACT SELLUPLABS</span>
      <h2 id="contact-dialog-title">서비스 도입·협업 문의</h2>
      <p className="dialog-intro">
        서비스 도입부터 기술 협력까지,
        <br />
        문의 내용을 남겨주세요.
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

export function AppPreview({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
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
        <h2 id="app-dialog-title">aiadcast 모바일 앱</h2>
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
          실제 aiadcast 모바일 앱 화면
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
