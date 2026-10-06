import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Plus,
  X,
} from "lucide-react";
import { generatedCategories } from "./generatedExamples";
import type { OutputFormat } from "./generatedExamples";

const examples = [
  ...generatedCategories.map((category) => ({
    ...category.examples[0],
    categoryId: category.id,
    categoryName: category.name,
  })),
  ...generatedCategories.flatMap((category) =>
    category.examples
      .slice(1)
      .map((example) => ({
        ...example,
        categoryId: category.id,
        categoryName: category.name,
      })),
  ),
];

export function GeneratedShowcase() {
  const [categoryId, setCategoryId] = useState("all");
  const [format, setFormat] = useState<OutputFormat | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const categoryExamples = examples.filter(
    (example) => categoryId === "all" || example.categoryId === categoryId,
  );
  const formats = [
    ...new Set(categoryExamples.map((example) => example.format)),
  ];
  const filtered = categoryExamples.filter(
    (example) => format === "all" || example.format === format,
  );
  const visible =
    categoryId === "all" && !showAll ? filtered.slice(0, 4) : filtered;
  const current = activeIndex === null ? null : visible[activeIndex];
  const move = (direction: number) =>
    setActiveIndex((previous) =>
      previous === null
        ? null
        : (previous + direction + visible.length) % visible.length,
    );
  const open = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  };
  return (
    <div className="generated-showcase">
      <div className="gallery-filters">
        <div
          className="category-tabs"
          role="group"
          aria-label="상품 카테고리 선택"
        >
          {[{ id: "all", name: "전체" }, ...generatedCategories].map(
            (category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={categoryId === category.id}
                onClick={() => {
                  setCategoryId(category.id);
                  setFormat("all");
                  setShowAll(false);
                }}
              >
                {category.name}
              </button>
            ),
          )}
        </div>
        <div className="format-tabs" role="group" aria-label="콘텐츠 비율 선택">
          <button
            type="button"
            aria-pressed={format === "all"}
            onClick={() => {
              setFormat("all");
              setShowAll(false);
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
                setShowAll(false);
              }}
            >
              {value} <span>{value === "9:16" ? "카드뉴스" : "포스터"}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="gallery-grid" aria-label="실제 생성 이미지 목록">
        {visible.map((example, index) => (
          <article className="gallery-card" key={example.src}>
            <button
              type="button"
              className="gallery-image-button"
              aria-label={`${example.title} 이미지 크게 보기`}
              onClick={() => open(index)}
            >
              <img
                data-testid="generated-image"
                src={example.src}
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
      <div className="gallery-bottom">
        <p>
          실제 aiadcast 생성 결과 · 이미지 속 상품·가격·연락처는 사례에 포함된
          내용입니다.
        </p>
        <span aria-live="polite" className="gallery-count">
          {visible.length} / {filtered.length} CASES
        </span>
      </div>
      {categoryId === "all" && filtered.length > 4 && (
        <button
          className="gallery-more"
          type="button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? "대표 사례만 보기"
            : `생성 사례 더 보기 (${filtered.length})`}
          <Plus size={17} className={showAll ? "is-expanded" : ""} />
        </button>
      )}
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
                  disabled={visible.length < 2}
                >
                  <ArrowLeft size={18} />
                </button>
                <span aria-live="polite">
                  {(activeIndex ?? 0) + 1} <span>/ {visible.length}</span>
                </span>
                <button
                  type="button"
                  aria-label="확대 이미지 다음 사례"
                  onClick={() => move(1)}
                  disabled={visible.length < 2}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <a href={current.src} target="_blank" rel="noopener noreferrer">
                원본 보기 <ArrowUpRight size={16} />
              </a>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
