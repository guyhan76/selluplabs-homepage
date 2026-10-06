export type OutputFormat = '9:16' | '2:3';

export type GeneratedExample = {
  src: string;
  title: string;
  alt: string;
  format: OutputFormat;
  width: number;
  height: number;
};

const example = (file: string, title: string, alt: string, format: OutputFormat = '9:16', width = 1008, height = 1792): GeneratedExample => ({
  src: `/images/examples/${file}.png`, title, alt, format, width, height,
});

export const generatedCategories = [
  {
    id: 'box', name: '박스', english: 'BOXES',
    headline: '규격부터 강점까지,\n한눈에 전하는 패키지.',
    description: '크기와 소재, 제품의 특징이 하나의 마케팅 이미지로 이어집니다. 택배박스부터 맞춤형 패키지까지, 실제 생성 사례를 만나보세요.',
    examples: [
      example('box-22', '크라프트 택배박스', '300 × 200 × 100mm 택배박스의 규격, 소재와 제품 특징을 담은 실제 aiadcast 생성 이미지'),
      example('box-4', '맞춤형 패키지 박스', '여러 형태의 맞춤형 박스와 제품 설명을 구성한 실제 aiadcast 마케팅 포스터', '2:3', 1024, 1536),
    ],
  },
  {
    id: 'bag', name: '쇼핑백', english: 'SHOPPING BAGS',
    headline: '담는 것 이상의 가치,\n브랜드의 첫인상으로.',
    description: '쇼핑백의 소재와 형태, 브랜드의 개성을 콘텐츠에 담습니다. 상품 이미지와 홍보 문구가 만나는 실제 결과를 확인하세요.',
    examples: [
      example('bag-1', '브랜드 쇼핑백', '오렌지색 쇼핑백의 디자인과 규격, 제품 설명을 담은 실제 aiadcast 생성 이미지'),
      example('bag-10', '맞춤형 쇼핑백', '다양한 브랜드 쇼핑백과 제품 특징을 구성한 실제 aiadcast 마케팅 포스터', '2:3', 1024, 1536),
    ],
  },
  {
    id: 'label', name: '스티커·라벨', english: 'STICKERS & LABELS',
    headline: '작은 디테일이 만드는,\n선명한 브랜드의 차이.',
    description: '스티커와 라벨의 크기, 디자인, 활용 장면을 알기 쉽게 전달합니다. 작은 제품에도 충분한 이야기가 있습니다.',
    examples: [
      example('label-1', '스마일 감사 스티커', '여러 색상의 스마일 스티커와 사용 예시를 담은 실제 aiadcast 생성 이미지'),
      example('label-11', '주문 제작 스티커', '주문 제작 라벨의 형태와 활용 예시를 담은 실제 aiadcast 마케팅 포스터', '2:3', 1024, 1536),
    ],
  },
  {
    id: 'pouch', name: '비닐·파우치', english: 'FILMS & POUCHES',
    headline: '기능은 구체적으로,\n매력은 직관적으로.',
    description: '내용물을 지키는 포장재의 역할부터 사용의 편리함까지. 파우치의 기능과 제품 특성을 마케팅 콘텐츠로 전달합니다.',
    examples: [
      example('pouch-5', '스파우트 파우치', '음료용 스파우트 파우치의 사용 장면과 특징을 담은 실제 aiadcast 생성 이미지'),
      example('pouch-4', '냉동식품 포장', '냉동식품 포장재의 기능과 특징을 담은 실제 aiadcast 마케팅 포스터', '2:3', 605, 907),
    ],
  },
  {
    id: 'container', name: '용기', english: 'CONTAINERS',
    headline: '소재마다 다른 매력,\n제품마다 다른 이야기.',
    description: '유리의 투명함, 스테인리스의 견고함, 플라스틱의 실용성. 다양한 소재의 용기를 표현한 실제 생성 사례입니다.',
    examples: [
      example('container-1', '유리 향수 용기', '유리 향수 용기의 디자인과 제품 특징을 담은 실제 aiadcast 생성 이미지'),
      example('container-5', '스테인리스 용기', '스테인리스 보관 용기의 구성과 활용 장면을 담은 실제 aiadcast 생성 이미지'),
      example('container-10', '플라스틱 용기', '투명 플라스틱 용기의 규격과 제품 특징을 담은 실제 aiadcast 생성 이미지'),
    ],
  },
  {
    id: 'other', name: '포장재 외', english: 'BEYOND PACKAGING',
    headline: '포장재에서 시작해,\n더 다양한 상품으로.',
    description: '상품을 이해하는 기술의 가능성을 넓혀갑니다. 생활가전과 인테리어 제품에 적용한 마케팅 이미지도 살펴보세요.',
    examples: [
      example('other-4', '화장품 냉장고', '화장품 냉장고의 용량과 디자인, 사용 장면을 담은 실제 aiadcast 생성 이미지'),
      example('other-2', '클래식 시계', '클래식 시계의 디자인과 세부 특징을 담은 실제 aiadcast 마케팅 포스터', '2:3', 1024, 1536),
    ],
  },
];
