import { useI18n } from "./i18n";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  ContactRound,
  ImageIcon,
  Mail,
  Monitor,
  Music2,
  ShoppingBag,
  Smartphone,
  Store,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { allExamples } from "./generatedExamples";
import { company } from "./config";

const channelCopy = [
  {
    id: "brand",
    label: "기업 홍보",
    icon: Building2,
    eyebrow: "BUSINESS PRESENTATION",
    title: "회사 소개에,\n제품의 강점까지.",
    description:
      "제안 메일과 회사소개서에 제품을 설명하는 이미지를 더하세요. 상품의 모습, 규격, 강점과 문의 정보를 한 번에 전달할 수 있습니다.",
    benefit: "첫 제안부터 구체적인 제품 이야기로.",
    steps: [
      "앱에서 상품 이미지와 기업 정보가 담긴 콘텐츠 생성",
      "회사소개서·제안서·이메일 본문에 이미지 삽입",
      "제품 설명 옆에 상담 방법을 안내해 다음 대화로 연결",
    ],
    note: "기업 정보와 제품 소개를 실제 제안 내용에 맞게 편집해 활용하세요.",
  },
  {
    id: "card",
    label: "명함",
    icon: ContactRound,
    eyebrow: "BUSINESS CONNECTION",
    title: "명함을 건넨 다음,\n상품까지 보여주세요.",
    description:
      "누구인지 알리는 명함에 무엇을 만드는지 보여주는 이미지를 함께 전달하세요. 미팅 후에도 상대방이 제품을 다시 살펴볼 수 있습니다.",
    benefit: "연락처에서 끝나지 않는, 기억에 남는 소개.",
    steps: [
      "대표 상품의 9:16 소개 이미지 생성·다운로드",
      "모바일 명함과 함께 메신저·이메일로 공유",
      "인쇄 명함에는 제품 소개 페이지 링크나 QR을 별도로 배치",
    ],
    note: "명함·QR 제작은 별도 편집 도구를 사용하는 활용 방법입니다.",
  },
  {
    id: "blog",
    label: "블로그",
    icon: BookOpen,
    eyebrow: "PRODUCT STORYTELLING",
    title: "상품을 설명하는 글에,\n한눈에 이해되는 이미지.",
    description:
      "제품을 고르는 기준, 사용 장면, 소재의 특징을 소개하는 글에 생성 이미지를 넣어보세요. 함께 제공되는 검색 키워드는 글의 주제를 정리하는 데 활용할 수 있습니다.",
    benefit: "제품 사진과 설명을 함께 읽는 콘텐츠로.",
    steps: [
      "홍보 이미지와 제작 의도·검색 키워드 확인",
      "블로그 본문에 이미지 삽입 후 경험과 설명 작성",
      "문의 방법 또는 상품 페이지 링크를 마지막에 안내",
    ],
    note: "생성 이미지를 삽입하고, 블로그 글은 직접 작성·게시합니다.",
  },
  {
    id: "social",
    label: "릴스·스토리",
    icon: Smartphone,
    eyebrow: "VERTICAL SOCIAL CONTENT",
    title: "세로 화면 가득,\n내 상품을 보여주세요.",
    description:
      "9:16 이미지를 Instagram 스토리로 공유하거나, 음악과 재생 길이를 더해 릴스 소재로 활용하세요. 내 상품의 특징이 담긴 콘텐츠로 소식을 전할 수 있습니다.",
    benefit: "상품 정보가 담긴 이미지로 SNS의 시작을 쉽게.",
    steps: [
      "aiadcast에서 9:16 카드뉴스·릴스용 이미지 생성",
      "Instagram에서 이미지를 불러와 음악·길이·전환 편집",
      "미리보기로 글자와 화면 여백을 확인한 후 게시",
    ],
    note: "aiadcast는 이미지를 생성합니다. 영상 편집·SNS 게시는 Instagram 등에서 진행합니다.",
  },
  {
    id: "commerce",
    label: "상품 상세",
    icon: ShoppingBag,
    eyebrow: "PRODUCT COMMUNICATION",
    title: "구매 전 궁금한 정보,\n이미지로 설명하세요.",
    description:
      "제품 규격, 소재와 사용 장면을 쇼핑몰 상세 설명에 더하세요. 고객이 비교하고 선택할 때 필요한 제품 정보를 시각적으로 전달합니다.",
    benefit: "제품의 매력과 확인할 정보를 한자리에.",
    steps: [
      "상품의 규격과 상세 설명을 입력해 콘텐츠 생성",
      "상품 상세 페이지의 소개 영역에 이미지 배치",
      "실제 판매 정보와 맞는지 확인하고 상담·구매 경로 연결",
    ],
    note: "상품 상세 편집과 게시에는 운영 중인 쇼핑몰 도구를 사용합니다.",
  },
  {
    id: "offline",
    label: "매장·전시",
    icon: Store,
    eyebrow: "BEYOND THE SCREEN",
    title: "화면 밖에서도,\n제품 이야기는 이어집니다.",
    description:
      "매장 안내물, 상담 테이블, 전시회 제품 소개에 생성 이미지를 활용하세요. 방문자가 직접 제품을 보며 특징을 확인할 수 있습니다.",
    benefit: "상담 현장에 함께 놓는 시각적인 설명 자료.",
    steps: [
      "활용 목적에 맞는 세로 이미지 또는 2:3 포스터 생성",
      "안내판·리플릿 규격에 맞춰 별도 편집 도구에서 배치",
      "인쇄 전 해상도·재단·여백과 제품 정보 확인",
    ],
    note: "인쇄물 제작과 대형 출력용 편집은 별도로 진행합니다.",
  },
] as const;
const sampleCopy = [
  {
    label: "박스",
    id: "box-19",
    poster: "box-4",
    headline: "안전하게 담고, 선명하게 전하다.",
    detail: "제품의 크기와 용도에 맞는 패키지",
  },
  {
    label: "쇼핑백",
    id: "bag-1",
    poster: "bag-10",
    headline: "브랜드의 첫인상을 담다.",
    detail: "선물하는 순간까지 이어지는 브랜드 경험",
  },
  {
    label: "유리 용기",
    id: "container-1",
    poster: "container-1",
    headline: "디테일로 전하는 제품의 가치.",
    detail: "소재의 매력을 살린 제품 소개",
  },
] as const;
type Sample = (typeof sampleCopy)[number];
type ChannelId = (typeof channelCopy)[number]["id"];

function PreviewImage({
  sample,
  poster = false,
}: {
  sample: Sample;
  poster?: boolean;
}) {
  const { t } = useI18n();
  const result = allExamples.find(
    (example) => example.id === (poster ? sample.poster : sample.id),
  )!;
  return (
    <img
      className="application-product-image"
      src={result.thumbnail}
      width={result.width}
      height={result.height}
      alt={t("{title} 실제 생성 이미지를 활용한 배치 예시", {
        title: t(result.title),
      })}
      loading="lazy"
      decoding="async"
    />
  );
}
function BrowserBar({ title }: { title: string }) {
  return (
    <div className="mock-browser-bar">
      <span aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>{title}</span>
      <Monitor size={14} aria-hidden="true" />
    </div>
  );
}
function ApplicationPreview({
  channel,
  sample,
}: {
  channel: ChannelId;
  sample: Sample;
}) {
  const { t } = useI18n();
  if (channel === "brand")
    return (
      <div className="mock-browser brand-mock">
        <BrowserBar title={t("브랜드 소개 페이지")} />
        <div className="brand-mock-header">
          <strong>
            YOUR BRAND<span>.</span>
          </strong>
          <span>PRODUCT COLLECTION</span>
        </div>
        <div className="brand-mock-body">
          <div>
            <span className="mock-kicker">{t("제품 소개")}</span>
            <h4>{sample.headline}</h4>
            <p>{sample.detail}</p>
            <div className="mock-specs">
              <span>{t("상품 규격")}</span>
              <span>{t("소재와 특징")}</span>
              <span>{t("기업 문의 정보")}</span>
            </div>
            <span className="mock-link">
              {t("제품에 대해 이야기해 보세요 ")}
              <ArrowUpRight size={13} />
            </span>
          </div>
          <PreviewImage sample={sample} />
        </div>
        <div className="mock-browser-footer">
          {t("회사소개서 · 비즈니스 제안서 · 이메일 홍보")}
        </div>
      </div>
    );
  if (channel === "card")
    return (
      <div className="business-card-scene">
        <div className="business-card-example">
          <div>
            <span>YOUR BRAND</span>
            <ArrowUpRight size={24} />
          </div>
          <strong>
            {t("제품과 사람을")}
            <br />
            {t("연결하는 소개.")}
          </strong>
          <p>
            {t("홍보 담당자 ")}
            <span>{t("제품 상담 · 비즈니스 문의")}</span>
          </p>
          <div className="business-card-rule" />
          <span>
            <Mail size={13} />
            {t(" 명함의 연락처로 상담 연결")}
          </span>
        </div>
        <div className="business-card-attachment">
          <span>
            <ImageIcon size={14} />
            {t(" 명함과 함께 전달하는 상품 이미지")}
          </span>
          <PreviewImage sample={sample} />
        </div>
      </div>
    );
  if (channel === "blog")
    return (
      <div className="mock-browser blog-mock">
        <BrowserBar title={t("우리 브랜드의 제품 이야기")} />
        <div className="blog-mock-content">
          <span className="mock-kicker">PRODUCT JOURNAL</span>
          <h4>
            {sample.label},<br />
            {t("고르기 전에 살펴볼 것들.")}
          </h4>
          <p className="blog-byline">{t("우리 브랜드 · 제품 가이드")}</p>
          <div className="blog-columns">
            <PreviewImage sample={sample} />
            <div>
              <h5>{t("01. 필요한 규격부터")}</h5>
              <p>{t("사용할 공간과 담을 제품에 맞는 크기를 확인해 보세요.")}</p>
              <h5>{t("02. 제품의 특징까지")}</h5>
              <p>{t("소재와 디자인, 활용 목적을 함께 살펴보세요.")}</p>
              <h5>{t("03. 더 궁금한 점은")}</h5>
              <p>{t("제품에 관한 자세한 상담을 이어가세요.")}</p>
              <span className="blog-tag">
                #{sample.label.replaceAll(" ", "")}
                {t(" #제품소개")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  if (channel === "social")
    return (
      <div className="social-scene">
        <div className="social-phone">
          <div className="social-phone-top">
            <span>Reels</span>
            <span>{t("구성 예시")}</span>
          </div>
          <div className="social-image">
            <PreviewImage sample={sample} />
          </div>
          <div className="social-caption">
            <strong>
              {t("우리 브랜드의 ")}
              {sample.label}
            </strong>
            <span>{t("상품의 특징을 한눈에 만나보세요.")}</span>
            <div>
              <Music2 size={13} />
              <span>{t("Instagram에서 음악 추가")}</span>
            </div>
          </div>
        </div>
        <div className="social-format">
          9:16<span>{t("릴스 소재 · 스토리 이미지")}</span>
        </div>
      </div>
    );
  if (channel === "commerce")
    return (
      <div className="mock-browser commerce-mock">
        <BrowserBar title={t("상품 상세 페이지")} />
        <div className="commerce-title">
          <strong>YOUR BRAND</strong>
          <span>PRODUCT DETAIL</span>
        </div>
        <div className="commerce-body">
          <PreviewImage sample={sample} />
          <div>
            <span className="mock-kicker">{t("제품 소개")}</span>
            <h4>
              {t("우리 브랜드의")}
              <br />
              {sample.label}
            </h4>
            <p>{sample.detail}</p>
            <dl>
              <div>
                <dt>{t("규격")}</dt>
                <dd>{t("제품에 맞는 크기")}</dd>
              </div>
              <div>
                <dt>{t("특징")}</dt>
                <dd>{t("소재 · 디자인 · 용도")}</dd>
              </div>
              <div>
                <dt>{t("문의")}</dt>
                <dd>{t("기업 정보로 연결")}</dd>
              </div>
            </dl>
            <span className="commerce-inquiry">
              {t("제품 상담 안내 ")}
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
    );
  return (
    <div className="poster-scene">
      <div className="poster-mat">
        <PreviewImage sample={sample} poster />
      </div>
      <div className="poster-caption">
        <span>STORE DISPLAY</span>
        <strong>
          {t("고객이 만나는 곳에,")}
          <br />
          {t("제품의 이야기를.")}
        </strong>
      </div>
    </div>
  );
}

export function Applications() {
  const { t, localize } = useI18n();
  const channels = localize(channelCopy);
  const samples = localize(sampleCopy);
  const [active, setActive] = useState(0);
  const [sampleIndex, setSampleIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const channel = channels[active];
  return (
    <section
      className="applications-section section-space"
      id="applications"
      aria-labelledby="applications-title"
    >
      <div className="wrap">
        <div className="section-eyebrow">
          <span>03 — MADE TO BE USED</span>
          <span>FROM CONTENT TO CUSTOMER</span>
        </div>
        <div className="section-heading">
          <h2 id="applications-title">
            {t("한 장의 상품 이미지,")}
            <br />
            {t("고객을 만나는 여섯 가지 방법.")}
          </h2>
          <p>
            {t("어디에 써야 할지 고민했다면.")}
            <br />
            {t("내 비즈니스에 가까운 활용 장면을 선택해 보세요.")}
          </p>
        </div>
        <div
          className="application-tabs"
          role="tablist"
          aria-label={t("마케팅 이미지 활용 채널")}
        >
          {channels.map((item, index) => (
            <button
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              key={item.id}
              type="button"
              role="tab"
              id={`application-tab-${item.id}`}
              aria-selected={active === index}
              aria-controls="application-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight")
                  next = (index + 1) % channels.length;
                else if (event.key === "ArrowLeft")
                  next = (index + channels.length - 1) % channels.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = channels.length - 1;
                else return;
                event.preventDefault();
                setActive(next);
                tabRefs.current[next]?.focus();
              }}
            >
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="application-panel"
          id="application-panel"
          role="tabpanel"
          aria-labelledby={`application-tab-${channel.id}`}
        >
          <div className="application-story">
            <span className="application-eyebrow">{channel.eyebrow}</span>
            <h3>
              {channel.title.split("\n").map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h3>
            <p className="application-description">{channel.description}</p>
            <p className="application-benefit">
              <Check size={17} aria-hidden="true" />
              {channel.benefit}
            </p>
            <ol className="application-steps">
              {channel.steps.map((step, index) => (
                <li key={step}>
                  <span>0{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <a
              href={company.appUrl}
              className="button button-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("내 상품으로 시작하기 ")}
              <ArrowUpRight size={18} />
            </a>
            <p className="application-note">{channel.note}</p>
          </div>
          <div className="application-visual">
            <div className="application-preview-toolbar">
              <span>{t("활용 화면 예시")}</span>
              <label>
                {t("상품 선택")}
                <select
                  aria-label={t("활용 예시 상품 선택")}
                  value={sampleIndex}
                  onChange={(event) =>
                    setSampleIndex(Number(event.target.value))
                  }
                >
                  {samples.map((sample, index) => (
                    <option key={sample.id} value={index}>
                      {sample.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <figure className={`application-stage stage-${channel.id}`}>
              <ApplicationPreview
                channel={channel.id}
                sample={samples[sampleIndex]}
              />
              <figcaption>
                {t(
                  "실제 생성 이미지를 활용해 게시·배치 화면을 재구성했습니다.",
                )}
              </figcaption>
            </figure>
          </div>
        </div>
        <WhyAiadcast />
      </div>
    </section>
  );
}
function WhyAiadcast() {
  const { t } = useI18n();
  return (
    <div className="why-aiadcast" aria-labelledby="why-title">
      <div className="why-heading">
        <span className="eyebrow">WHY AIADCAST</span>
        <h3 id="why-title">
          {t("제품은 이미 준비됐으니까.")}
          <br />
          {t("이제, 알리는 일을 시작하세요.")}
        </h3>
      </div>
      <div className="why-reasons">
        <article>
          <span>01 / PRODUCT FIRST</span>
          <h4>{t("내 상품의 정보에서 출발합니다.")}</h4>
          <p>
            {t(
              "규격, 소재, 특징과 참조 이미지를 생성의 기준으로 활용합니다. 제품을 아는 사람의 정보가 홍보의 재료가 됩니다.",
            )}
          </p>
        </article>
        <article>
          <span>02 / READY TO INTRODUCE</span>
          <h4>{t("이미지·설명·기업 정보를 함께.")}</h4>
          <p>
            {t(
              "상품의 모습부터 설명 문구, 회사명과 연락처까지. 고객에게 보여줄 내용을 하나의 마케팅 이미지로 구성합니다.",
            )}
          </p>
        </article>
        <article>
          <span>03 / MORE PLACES TO SHARE</span>
          <h4>{t("만든 콘텐츠를 여러 접점으로.")}</h4>
          <p>
            {t(
              "생성한 이미지를 다운로드해 블로그, SNS, 제안서 등에 활용하세요. 각 채널에 맞게 편집하고 직접 게시할 수 있습니다.",
            )}
          </p>
        </article>
      </div>
    </div>
  );
}
export function AppInstall() {
  const { t } = useI18n();
  return (
    <section
      className="install-section section-space"
      id="get-app"
      aria-labelledby="install-title"
    >
      <div className="wrap install-grid">
        <div className="install-copy">
          <span className="eyebrow">YOUR NEXT PRODUCT STORY</span>
          <h2 id="install-title">
            {t("다음에 소개할 상품은,")}
            <br />
            <span>{t("당신의 상품입니다.")}</span>
          </h2>
          <p>
            {t("상품 정보와 참조 이미지를 준비하세요.")}
            <br />
            {t("aiadcast에서 첫 마케팅 콘텐츠를 만들어보세요.")}
          </p>
          <a
            className="button button-white install-link"
            href={company.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Smartphone size={21} />
            {t(" Google Play에서 aiadcast 설치")} <ArrowUpRight size={19} />
          </a>
          <span className="install-platform">
            {t("Android 앱 · 이용권과 요금은 앱에서 확인할 수 있습니다.")}
          </span>
          <a className="install-back-link" href="#cases">
            {t("생성 사례를 더 살펴볼게요 ")}
            <ArrowRight size={15} />
          </a>
        </div>
        <div className="install-guide">
          <div className="install-qr">
            <a
              href={company.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("QR코드 대신 Google Play 설치 페이지 열기")}
            >
              <QRCodeSVG
                value={company.appUrl}
                size={136}
                level="M"
                marginSize={2}
                title={t("Google Play aiadcast 설치 페이지 QR코드")}
                role="img"
              />
            </a>
            <div>
              <Smartphone size={20} />
              <strong>
                {t("휴대폰 카메라로")}
                <br />
                {t("앱을 만나보세요.")}
              </strong>
              <span>{t("QR을 스캔하면 Google Play로 연결됩니다.")}</span>
            </div>
          </div>
          <ol>
            <li>
              <span>01</span>
              <p>
                {t("aiadcast 앱 설치")}
                <small>{t("Google Play에서 시작")}</small>
              </p>
              <ChevronRight size={17} />
            </li>
            <li>
              <span>02</span>
              <p>
                {t("상품 정보와 참조 이미지 입력")}
                <small>{t("상품명 · 규격 · 상세 설명 · 기업 정보")}</small>
              </p>
              <ChevronRight size={17} />
            </li>
            <li>
              <span>03</span>
              <p>
                {t("원하는 비율로 생성")}
                <small>{t("9:16 카드뉴스 · 2:3 포스터")}</small>
              </p>
              <Check size={17} />
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
