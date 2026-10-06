import { useId } from "react";

export type Category = "box" | "bag" | "label" | "container";

export const products: Record<
  Category,
  {
    name: string;
    english: string;
    product: string;
    spec: string;
    material: string;
    headline: string;
    description: string;
  }
> = {
  box: {
    name: "박스",
    english: "BOXES",
    product: "프리미엄 패키지 박스",
    spec: "200 × 150 × 100 mm",
    material: "종이 · 맞춤 패키지",
    headline: "첫인상부터,\n남다르게.",
    description: "브랜드의 가치를 담는 단단하고 섬세한 패키지.",
  },
  bag: {
    name: "쇼핑백",
    english: "SHOPPING BAGS",
    product: "브랜드 쇼핑백",
    spec: "200 × 100 × 250 mm",
    material: "종이 · 로프 손잡이",
    headline: "담는 순간,\n브랜드가 되다.",
    description: "손끝에서 시작되는 특별한 브랜드 경험.",
  },
  label: {
    name: "스티커·라벨",
    english: "STICKERS & LABELS",
    product: "브랜드 원형 라벨",
    spec: "지름 60 mm",
    material: "종이 · 원형 스티커",
    headline: "작은 디테일,\n큰 차이.",
    description: "제품의 완성도를 높이는 브랜드의 작은 시그니처.",
  },
  container: {
    name: "용기",
    english: "CONTAINERS",
    product: "프리미엄 패키징 용기",
    spec: "지름 80 × 100 mm",
    material: "플라스틱 · 스크루 캡",
    headline: "좋은 것을,\n오롯이 담다.",
    description: "내용물의 가치를 돋보이게 하는 간결한 디자인.",
  },
};

export function ProductIllustration({
  type,
  className = "",
}: {
  type: Category;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`product-illustration ${className}`}
      viewBox="0 0 500 520"
      fill="none"
      role="img"
      aria-label={`${products[type].name} 콘셉트 일러스트`}
    >
      <defs>
        <linearGradient
          id={`${id}-orange`}
          x1="110"
          y1="190"
          x2="360"
          y2="410"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff994a" />
          <stop offset=".5" stopColor="#f47b2d" />
          <stop offset="1" stopColor="#df5f18" />
        </linearGradient>
        <linearGradient
          id={`${id}-side`}
          x1="335"
          y1="200"
          x2="400"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c95820" />
          <stop offset="1" stopColor="#ac3f0f" />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="60"
          y1="240"
          x2="380"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffef9" />
          <stop offset=".5" stopColor="#efeade" />
          <stop offset="1" stopColor="#d4cbb7" />
        </linearGradient>
        <linearGradient
          id={`${id}-lid`}
          x1="110"
          y1="170"
          x2="390"
          y2="230"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fcfaf2" />
          <stop offset="1" stopColor="#e8e0d1" />
        </linearGradient>
        <linearGradient
          id={`${id}-jar`}
          x1="150"
          y1="300"
          x2="355"
          y2="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#bcb5a5" />
          <stop offset=".2" stopColor="#f5f0e4" />
          <stop offset=".5" stopColor="#fffdf5" />
          <stop offset=".84" stopColor="#dfd7c5" />
          <stop offset="1" stopColor="#aaa28f" />
        </linearGradient>
        <linearGradient
          id={`${id}-dark`}
          x1="160"
          y1="120"
          x2="340"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#525349" />
          <stop offset="1" stopColor="#24271f" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-40%"
          y="-50%"
          width="180%"
          height="220%"
        >
          <feGaussianBlur stdDeviation="15" />
        </filter>
        <filter id={`${id}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope=".035" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      {type === "bag" && (
        <>
          <ellipse
            cx="270"
            cy="449"
            rx="137"
            ry="19"
            fill="#5c3e24"
            opacity=".2"
            filter={`url(#${id}-shadow)`}
          />
          <path d="m107 171 64-55 221 43-54 58Z" fill="#a34517" />
          <path d="m120 172 57-43 200 36-45 40Z" fill="#723c24" />
          <path d="m338 214 54-55-1 229-54 64Z" fill={`url(#${id}-side)`} />
          <path d="m107 171 231 43-1 238-229-44Z" fill={`url(#${id}-orange)`} />
          <path d="m367 184-5 220 29-16" stroke="#ed8544" strokeOpacity=".6" />
          <path
            d="m107 171 231 43-1 238-229-44Z"
            fill="transparent"
            filter={`url(#${id}-grain)`}
          />
          <path
            d="M166 178v-44c0-78 107-59 107 17v45"
            stroke="#bc4c15"
            strokeWidth="12"
          />
          <path
            d="M166 177v-46c0-76 107-57 107 17v48"
            stroke="#f7cc94"
            strokeWidth="7"
          />
          <path
            d="M198 156v-34c0-68 100-44 100 13v42"
            stroke="#dbaa72"
            strokeWidth="6"
          />
          <g transform="matrix(1 .19 0 1 135 237)" fill="#672c16">
            <text
              x="0"
              y="40"
              fontSize="30"
              fontFamily="Manrope, sans-serif"
              fontWeight="800"
            >
              GOOD
            </text>
            <text
              x="0"
              y="74"
              fontSize="30"
              fontFamily="Manrope, sans-serif"
              fontWeight="800"
            >
              THINGS
            </text>
            <text
              x="0"
              y="108"
              fontSize="30"
              fontFamily="Manrope, sans-serif"
              fontWeight="800"
            >
              INSIDE.
            </text>
            <path d="M145 82v25h25" stroke="#672c16" strokeWidth="3" />
            <text
              x="0"
              y="143"
              fontSize="8"
              fontFamily="Manrope, sans-serif"
              letterSpacing="2.5"
            >
              MORE POSSIBILITIES
            </text>
          </g>
          <path d="m107 171 231 43" stroke="#ffb176" strokeWidth="2" />
        </>
      )}
      {type === "box" && (
        <>
          <ellipse
            cx="256"
            cy="405"
            rx="166"
            ry="20"
            fill="#63573d"
            opacity=".2"
            filter={`url(#${id}-shadow)`}
          />
          <path d="m73 233 224 50 130-92-208-41Z" fill={`url(#${id}-lid)`} />
          <path d="m73 233 224 50v130L74 356Z" fill={`url(#${id}-paper)`} />
          <path d="m297 283 130-92v122l-130 100Z" fill="#c9bea6" />
          <path d="m73 249 224 51 130-92" stroke="#b3aa98" strokeWidth="1.5" />
          <path d="m74 234 223 50 129-91" stroke="#fffdf4" strokeWidth="2" />
          <path d="m162 162 74 15 61 14-120 79-70-15Z" fill="#ef7525" />
          <path d="m107 255 70 16v111l-70-18Z" fill="#df6421" />
          <g transform="matrix(1 .24 0 1 191 317)" fill="#3d4135">
            <text
              x="0"
              y="0"
              fontSize="21"
              fontFamily="Manrope, sans-serif"
              fontWeight="800"
            >
              OPEN
            </text>
            <text
              x="0"
              y="24"
              fontSize="21"
              fontFamily="Manrope, sans-serif"
              fontWeight="800"
            >
              THE NEXT.
            </text>
            <text
              x="0"
              y="47"
              fontSize="6"
              fontFamily="Manrope, sans-serif"
              letterSpacing="1"
            >
              PACKED WITH POSSIBILITY
            </text>
          </g>
          <path
            d="m73 233 224 50v130L74 356Z"
            fill="transparent"
            filter={`url(#${id}-grain)`}
          />
          <g
            transform="matrix(1 -.73 0 1 330 329)"
            stroke="#6e725f"
            strokeWidth="1.3"
          >
            <path d="M0 0h32M0 4h32M0 8h32M0 12h32M0 16h32M0 20h32" />
          </g>
        </>
      )}
      {type === "container" && (
        <>
          <ellipse
            cx="265"
            cy="444"
            rx="118"
            ry="22"
            fill="#4c493b"
            opacity=".2"
            filter={`url(#${id}-shadow)`}
          />
          <path
            d="M148 187h204v224c0 48-204 48-204 0Z"
            fill={`url(#${id}-jar)`}
          />
          <ellipse cx="250" cy="185" rx="102" ry="28" fill="#c5bda9" />
          <path
            d="M143 161h214v52c0 40-214 40-214 0Z"
            fill={`url(#${id}-dark)`}
          />
          <ellipse cx="250" cy="160" rx="107" ry="31" fill="#565a4c" />
          <ellipse cx="250" cy="156" rx="92" ry="23" stroke="#676b5c" />
          <path
            d="M149 270c53 21 149 21 202 0v115c-53 26-149 26-202 0Z"
            fill="#f5803b"
          />
          <text
            x="250"
            y="317"
            textAnchor="middle"
            fontSize="31"
            fontFamily="Manrope, sans-serif"
            fontWeight="700"
            fill="#343b2c"
          >
            naturally.
          </text>
          <text
            x="250"
            y="344"
            textAnchor="middle"
            fontSize="8"
            fontFamily="Manrope, sans-serif"
            letterSpacing="3"
            fill="#343b2c"
          >
            GOOD FROM WITHIN
          </text>
          <path d="M242 359h16m-8-8v16" stroke="#343b2c" strokeWidth="1.5" />
        </>
      )}
      {type === "label" && (
        <>
          <ellipse
            cx="260"
            cy="425"
            rx="149"
            ry="21"
            fill="#625a44"
            opacity=".2"
            filter={`url(#${id}-shadow)`}
          />
          <path
            d="M107 249v92c0 96 286 96 286 0v-92Z"
            fill={`url(#${id}-paper)`}
          />
          <path
            d="M109 278c0 84 283 84 283 0M109 304c0 84 283 84 283 0M109 330c0 84 283 84 283 0"
            stroke="#d0c5ab"
            strokeWidth="1"
          />
          <ellipse cx="250" cy="246" rx="143" ry="84" fill="#f4823a" />
          <ellipse
            cx="250"
            cy="246"
            rx="125"
            ry="68"
            stroke="#693a20"
            strokeWidth="1"
          />
          <ellipse
            cx="250"
            cy="246"
            rx="131"
            ry="73"
            stroke="#ffc185"
            strokeWidth="1"
          />
          <g
            transform="translate(250 246) rotate(-12)"
            fill="#61391f"
            textAnchor="middle"
          >
            <text
              x="0"
              y="-15"
              fontSize="11"
              fontFamily="Manrope, sans-serif"
              letterSpacing="3"
            >
              A LITTLE DETAIL.
            </text>
            <text
              x="0"
              y="23"
              fontSize="37"
              fontFamily="Manrope, sans-serif"
              fontWeight="800"
            >
              A BIG DEAL.
            </text>
          </g>
          <path
            d="M331 308c-6 39 13 70 55 65l38-103c-25 29-58 47-93 38Z"
            fill="#fffdf3"
          />
          <path d="M332 307c22 13 49 9 76-20" stroke="#d3cab4" />
        </>
      )}
    </svg>
  );
}

export function HeroArtwork() {
  return (
    <div
      className="hero-art"
      aria-label="상품 정보에서 마케팅 콘텐츠로 이어지는 과정을 표현한 포장재 일러스트"
      role="img"
    >
      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />
      <div className="hero-disc">
        <span>
          MAKE
          <br />
          IT
          <br />
          <em>MATTER.</em>
        </span>
      </div>
      <div className="hero-bag">
        <ProductIllustration type="bag" />
      </div>
      <div className="hero-box">
        <ProductIllustration type="box" />
      </div>
      <div className="hero-jar">
        <ProductIllustration type="container" />
      </div>
      <div className="art-spec">
        <span className="spec-cross">+</span>
        <span>
          PRODUCT DATA
          <strong>
            200 × 100 × 250 <small>mm</small>
          </strong>
        </span>
        <span className="spec-check">↗</span>
      </div>
      <div className="art-output">
        <span className="output-symbol">
          a<span>▶</span>
        </span>
        <span>
          IDEAS INTO IMPACT.<strong>상품을 넘어, 가능성으로.</strong>
        </span>
        <span className="output-dot" />
      </div>
      <span className="art-coordinate coordinate-top">S/L — 001</span>
      <span className="art-coordinate coordinate-bottom">
        PRODUCT × AI = POSSIBILITY
      </span>
      <span className="art-plus plus-one">+</span>
      <span className="art-plus plus-two">+</span>
    </div>
  );
}
