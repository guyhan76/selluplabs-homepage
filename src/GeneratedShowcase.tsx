import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Maximize2, Sparkles, X } from 'lucide-react';
import { generatedCategories } from './generatedExamples';

export function GeneratedShowcase() {
  const [categoryId, setCategoryId] = useState('bag');
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const category = generatedCategories.find(item => item.id === categoryId)!;
  const current = category.examples[index];
  const formats = [...new Set(category.examples.map(item => item.format))];
  const move = (direction: number) => setIndex(previous => (previous + direction + category.examples.length) % category.examples.length);
  const open = () => {
    setExpanded(true);
    dialogRef.current?.showModal();
  };
  const controls = (inDialog = false) => (
    <div className="case-navigation">
      <button type="button" onClick={() => move(-1)} aria-label={inDialog ? '확대 이미지 이전 사례' : '이전 생성 사례'}><ArrowLeft size={18} /></button>
      <span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} <span>/ {String(category.examples.length).padStart(2, '0')}</span></span>
      <button type="button" onClick={() => move(1)} aria-label={inDialog ? '확대 이미지 다음 사례' : '다음 생성 사례'}><ArrowRight size={18} /></button>
    </div>
  );

  return (
    <div className="real-showcase">
      <div className="case-toolbar">
        <div className="case-categories" role="group" aria-label="상품 카테고리 선택">
          {generatedCategories.map(item => (
            <button key={item.id} type="button" aria-pressed={categoryId === item.id} onClick={() => { setCategoryId(item.id); setIndex(0); }}>{item.name}</button>
          ))}
        </div>
        <span className="case-status"><span /> ACTUAL AI OUTPUT</span>
      </div>
      <div className="case-body">
        <div className="case-story">
          <span className="case-eyebrow">GENERATED WITH AIADCAST</span>
          <h3>{category.headline.split('\n').map(line => <span key={line}>{line}</span>)}</h3>
          <p>{category.description}</p>
          <div className="case-features">
            <span><Check size={15} /> 상품 규격과 특징</span>
            <span><Check size={15} /> 제품을 설명하는 문구</span>
            <span><Check size={15} /> 회사 정보와 연락처</span>
          </div>
          <div className="case-current">
            <span className="case-eyebrow">{category.english}</span>
            <p className="case-title" aria-live="polite">{current.title}</p>
            {controls()}
          </div>
          <span className="case-authentic"><Sparkles size={15} /> 실제 앱에서 생성한 콘텐츠입니다.</span>
        </div>
        <div className="case-output">
          <div className="case-output-top">
            <span>SELECT A FORMAT</span>
            <div className="case-formats" role="group" aria-label="콘텐츠 비율 선택">
              {formats.map(format => <button key={format} type="button" aria-pressed={current.format === format} onClick={() => setIndex(category.examples.findIndex(item => item.format === format))}>{format} <span>{format === '9:16' ? '카드뉴스' : '포스터'}</span></button>)}
            </div>
          </div>
          <button type="button" className="case-image-button" onClick={open} aria-label={`${current.title} 이미지 크게 보기`}>
            <img key={current.src} data-testid="generated-image" src={current.src} alt={current.alt} width={current.width} height={current.height} loading="lazy" decoding="async" />
            <span className="case-enlarge"><Maximize2 size={15} /> 크게 보기</span>
          </button>
        </div>
      </div>
      <div className="case-note"><span>이미지 속 상품·가격·연락처는 생성 사례에 포함된 내용입니다.</span><span>REAL PRODUCTS. NEW POSSIBILITIES.</span></div>
      <dialog ref={dialogRef} className="case-dialog" aria-labelledby="case-dialog-title" onClose={() => setExpanded(false)} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
        <div className="case-dialog-header">
          <div><span>AIADCAST · 실제 생성 사례</span><h2 id="case-dialog-title">{current.title}</h2></div>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="생성 이미지 닫기" autoFocus><X size={23} /></button>
        </div>
        {expanded && <img className="case-dialog-image" src={current.src} alt={current.alt} width={current.width} height={current.height} />}
        <div className="case-dialog-footer">{controls(true)}<a href={current.src} target="_blank" rel="noopener noreferrer">원본 보기 <ArrowUpRight size={16} /></a></div>
      </dialog>
    </div>
  );
}
