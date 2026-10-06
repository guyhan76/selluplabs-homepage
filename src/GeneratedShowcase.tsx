import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  allExamples,
  generatedCategories,
  totalExamples,
} from "./generatedExamples";
import type { OutputFormat } from "./generatedExamples";
import { company } from "./config";

const INITIAL_COUNT = 8;
const PAGE_SIZE = 12;
const normalize = (value: string) =>
  value.toLowerCase().replace(/[\s·・-]/g, "");

export function GeneratedShowcase() {
  const [categoryId, setCategoryId] = useState("all");
  const [format, setFormat] = useState<OutputFormat | "all">("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(INITIAL_COUNT);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const categoryExamples = allExamples.filter(
    (example) => categoryId === "all" || example.categoryId === categoryId,
  );
  const formats = [
    ...new Set(categoryExamples.map((example) => example.format)),
  ];
  const filtered = categoryExamples.filter(
    (example) =>
      (format === "all" || example.format === format) &&
      query
        .trim()
        .split(/\s+/)
        .every((term) =>
          normalize(`${example.title} ${example.categoryName}`).includes(
            normalize(term),
          ),
        ),
  );
  const visible = filtered.slice(0, limit);
  const current = activeIndex === null ? null : filtered[activeIndex];
  const move = (direction: number) =>
    setActiveIndex((previous) =>
      previous === null
        ? null
        : (previous + direction + filtered.length) % filtered.length,
    );
  const reset = () => {
    setCategoryId("all");
    setFormat("all");
    setQuery("");
    setLimit(INITIAL_COUNT);
  };
  const expand = (nextLimit: number) => {
    const firstNew = visible.length;
    setLimit(nextLimit);
    // Keep keyboard users at the first newly revealed result.
    requestAnimationFrame(() =>
      gridRef.current
        ?.querySelectorAll<HTMLButtonElement>(".gallery-image-button")
        [firstNew]?.focus({ preventScroll: true }),
    );
  };
  return (
    <div className="generated-showcase">
      <div className="gallery-toolbar">
        <p className="gallery-total">
          <strong>{totalExamples}</strong> 실제 생성 사례{" "}
          <span>6개 상품 카테고리</span>
        </p>
        <div className="gallery-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            aria-label="상품 검색"
            placeholder="택배박스, 화장품, 유리 용기 검색"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(INITIAL_COUNT);
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => {
                setQuery("");
                setLimit(INITIAL_COUNT);
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="gallery-filters">
        <div
          className="category-tabs"
          role="group"
          aria-label="상품 카테고리 선택"
        >
          {[
            { id: "all", name: "전체", count: totalExamples },
            ...generatedCategories.map((category) => ({
              ...category,
              count: category.examples.length,
            })),
          ].map((category) => (
            <button
              key={category.id}
              type="button"
              aria-label={category.name}
              aria-pressed={categoryId === category.id}
              onClick={() => {
                setCategoryId(category.id);
                setFormat("all");
                setLimit(INITIAL_COUNT);
              }}
            >
              {category.name}{" "}
              <span aria-hidden="true" className="category-count">
                {category.count}
              </span>
            </button>
          ))}
        </div>
        <div className="format-tabs" role="group" aria-label="콘텐츠 비율 선택">
          <button
            type="button"
            aria-pressed={format === "all"}
            onClick={() => {
              setFormat("all");
              setLimit(INITIAL_COUNT);
            }}
          >
            전체 비율
          </button>
          {formats.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={value === "9:16" ? "9:16 카드뉴스" : "2:3 포스터"}
              aria-pressed={format === value}
              onClick={() => {
                setFormat(value);
                setLimit(INITIAL_COUNT);
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={gridRef}
        className="gallery-grid"
        aria-label="실제 생성 이미지 목록"
      >
        {visible.map((example, index) => (
          <article className="gallery-card" key={example.id}>
            <button
              type="button"
              className="gallery-image-button"
              aria-label={`${example.title} 이미지 크게 보기`}
              onClick={() => {
                setActiveIndex(index);
                dialogRef.current?.showModal();
              }}
            >
              <img
                data-testid="generated-image"
                data-original={example.src}
                src={example.thumbnail}
                width={example.width}
                height={example.height}
                alt={example.alt}
                loading="lazy"
                decoding="async"
              />
              <span className="gallery-expand">
                <Maximize2 size={16} />
                <span>크게 보기</span>
              </span>
            </button>
            <div className="gallery-card-info">
              <div>
                <span>{example.categoryName}</span>
                <h3>{example.title}</h3>
              </div>
              <span className="format-label">{example.format}</span>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="gallery-empty">
          <Search size={28} />
          <h3>검색 조건에 맞는 사례가 없습니다.</h3>
          <p>다른 상품명으로 검색하거나 전체 사례를 살펴보세요.</p>
          <button className="text-link" type="button" onClick={reset}>
            필터 초기화 <ArrowRight size={17} />
          </button>
        </div>
      )}
      <div className="gallery-bottom">
        <p>
          실제 aiadcast 생성 결과 · 이미지 속 상품·가격·연락처는 사례에 포함된
          내용입니다.
        </p>
        <span role="status" className="gallery-count">
          {visible.length} / {filtered.length} CASES
        </span>
      </div>
      {filtered.length > INITIAL_COUNT && (
        <div className="gallery-pagination">
          {visible.length < filtered.length ? (
            <>
              <button
                className="gallery-more"
                type="button"
                onClick={() => expand(limit + PAGE_SIZE)}
              >
                {Math.min(PAGE_SIZE, filtered.length - visible.length)}개 더
                보기 <Plus size={17} />
              </button>
              <button
                className="gallery-show-all"
                type="button"
                onClick={() => expand(filtered.length)}
              >
                전체 {filtered.length}개 펼치기 <ArrowDownIcon />
              </button>
            </>
          ) : (
            <button
              className="gallery-more"
              type="button"
              onClick={() => {
                setLimit(INITIAL_COUNT);
                requestAnimationFrame(() => {
                  gridRef.current?.scrollIntoView({ block: "start" });
                  gridRef.current
                    ?.querySelector<HTMLButtonElement>(".gallery-image-button")
                    ?.focus({ preventScroll: true });
                });
              }}
            >
              대표 사례만 보기 <X size={17} />
            </button>
          )}
        </div>
      )}
      <div className="gallery-next">
        <p>내 상품은 어디에 활용할 수 있을까요?</p>
        <a className="text-link" href="#applications">
          채널별 활용 예시 보기 <ArrowRight size={17} />
        </a>
      </div>
      <dialog
        ref={dialogRef}
        className="case-dialog"
        aria-labelledby="case-dialog-title"
        onClose={() => setActiveIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className="case-dialog-header">
          <div>
            <span>AIADCAST · 실제 생성 사례</span>
            <h2 id="case-dialog-title">{current?.title || "생성 이미지"}</h2>
          </div>
          <button
            type="button"
            aria-label="생성 이미지 닫기"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            <X size={23} />
          </button>
        </div>
        {current && (
          <>
            <img
              className="case-dialog-image"
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
            />
            <div className="case-dialog-footer">
              <div className="case-navigation">
                <button
                  type="button"
                  aria-label="확대 이미지 이전 사례"
                  onClick={() => move(-1)}
                  disabled={filtered.length < 2}
                >
                  <ArrowLeft size={18} />
                </button>
                <span aria-live="polite">
                  {(activeIndex ?? 0) + 1} <span>/ {filtered.length}</span>
                </span>
                <button
                  type="button"
                  aria-label="확대 이미지 다음 사례"
                  onClick={() => move(1)}
                  disabled={filtered.length < 2}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <a href={current.src} target="_blank" rel="noopener noreferrer">
                원본 보기 <ArrowUpRight size={16} />
              </a>
            </div>
            <a
              className="case-install"
              href={company.appUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              내 상품도 aiadcast로 만들어보기 <ArrowUpRight size={17} />
            </a>
          </>
        )}
      </dialog>
    </div>
  );
}
function ArrowDownIcon() {
  return <ArrowRight size={15} style={{ transform: "rotate(90deg)" }} />;
}
