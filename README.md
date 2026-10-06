# selluplabs · 셀업랩스 주식회사

셀업랩스의 회사 소개 및 포장재 특화 AI 마케팅 서비스 **aiadcast**를 소개하는 반응형 홈페이지입니다. React, TypeScript, Vite를 사용하며 정적 웹 호스팅에 배포할 수 있습니다.

공개 주소: https://selluplabs-homepage.selluplabs.workers.dev/

블랙·화이트를 중심으로 회사의 사업 설명 → 서비스 사용 과정 → 실제 생성 사례 → 기술 근거 → 회사 소개 순서로 구성했습니다. 모바일에서는 메뉴, 사례 갤러리, 기술 설명과 문의 화면이 화면 폭에 맞게 재배치됩니다.

## 실행

Node.js 24를 권장합니다. 최소 지원 버전은 22.12입니다.

```bash
npm ci
npm run dev
```

개발 서버 포트는 5173입니다. 클라우드 작업에서는 기존 `/workspace/selluplabs-homepage` 체크아웃을 사용합니다. 각 작업은 이미 격리되어 있으므로 별도 Git worktree가 필요하지 않습니다.

클라우드에서 기본 npm 캐시 경로에 쓸 수 없으면 다음 명령을 사용합니다.

```bash
npm ci --cache /workspace/.npm-cache
```

이 환경의 재사용 설정 스크립트는 `scripts/cloud-setup.sh`입니다. 잠금 파일에 맞춰 의존성을 설치하고 타입 검사와 프로덕션 빌드를 수행합니다.

```bash
bash scripts/cloud-setup.sh
```

이 프로젝트는 빈 저장소에서 시작한 회사 홈페이지입니다. 소스와 실제 생성 사례를 함께 버전 관리합니다.

## 검증

```bash
npm run typecheck
npm run build -- --logLevel warn
```

브라우저 테스트는 빌드한 결과물을 사용하며, 미리보기 서버를 자동으로 시작·종료합니다. 처음 실행하는 일반 개발 환경에서는 `npx playwright install chromium`으로 테스트 브라우저를 설치하세요.

```bash
npm test
```

이 클라우드 환경에는 Chromium이 설치되어 있습니다.

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

검증 항목은 첫 화면의 사업 설명, PC·모바일 화면, 6개 상품 카테고리와 이미지 비율 필터, 13개 사례 더 보기, 모바일 내비게이션, FAQ, 앱 소개, 문의 양식과 클립보드, 키보드 초점 및 자동 접근성 검사입니다. 화면 폭 320~1920px에서 가로 넘침을 확인합니다. 테스트는 이메일을 발송하거나 결제를 수행하지 않습니다.

## 콘텐츠 수정

- `src/App.tsx`: 회사 소개, 서비스, 기술, FAQ 및 문의 영역
- `src/Dialogs.tsx`: 앱 미리보기 및 이메일 문의 창
- `src/GeneratedShowcase.tsx`, `src/generatedExamples.ts`: 실제 생성 사례 갤러리와 카테고리별 데이터
- `src/styles.css`: 브랜드 색상, 레이아웃, 반응형 및 모션 설정
- `src/config.ts`: 공개 기업 정보, 이메일, Google Play 주소
- `public/images/`: 실제 aiadcast 로고, 앱 홈 화면, 실제 생성 이미지 13장 및 링크 공유용 이미지

문의 이메일은 `selluplabs@gmail.com`, Google Play 패키지는 `kr.co.beehivecorp.aiadcast`입니다. 필요하면 `.env.example`을 참고하여 공개 환경변수 `VITE_CONTACT_EMAIL`, `VITE_APP_URL`로 변경할 수 있습니다. 값은 빌드 시 포함되며 변경 후 다시 빌드해야 합니다. `VITE_` 환경변수에 비밀키를 넣지 마세요.

## 문의 동작

문의 양식은 필수 항목을 검증한 후 사용자의 이메일 앱에 받는 사람, 제목, 내용을 전달합니다. 사용자가 이메일 앱에서 직접 발송하는 방식이며, 자동 발송 서버나 문의 데이터베이스는 없습니다. 이메일 앱이 없는 경우 문의 내용을 복사할 수 있습니다. 작성 정보는 홈페이지에 저장하지 않습니다.

## 사실과 시각 자료

- 특허는 **출원** 단계로 표시합니다. 등록 특허나 벤처기업 확인을 받은 회사라고 표기하지 않습니다.
- 연구개발 조직은 사용자가 확인한 **연구개발전담부서**로 표기합니다.
- 9:16 결과물은 카드뉴스·원페이지 릴스에 활용하는 **이미지**입니다. 자동 동영상 생성 기능으로 소개하지 않습니다.
- 이미지 생성 모델 자체는 이 회사 홈페이지에서 실행하지 않습니다. 실제 서비스는 Google Play의 aiadcast 앱으로 연결합니다.
- 첫 화면과 서비스 갤러리는 사용자가 제공한 6개 ZIP에서 선정한 **실제 aiadcast 생성 이미지 13장**을 사용합니다. 원본 PNG를 변경 없이 사용하며 출처 파일명과 SHA-256을 `public/images/examples/provenance.json`에 기록했습니다.
- 카테고리는 박스, 쇼핑백, 스티커·라벨, 비닐·파우치, 용기, 포장재 외 제품입니다. 카테고리마다 제공된 사례의 비율만 선택할 수 있습니다. 용기 사례는 모두 9:16이며, 2:3 이미지가 있는 것처럼 표시하지 않습니다. 모든 이미지는 원본 종횡비를 유지합니다.
- 첫 화면의 두 생성 사례를 먼저 로드하고, 나머지 갤러리 이미지는 필요할 때 로드합니다. 생성 이미지에 들어 있는 상품·가격·연락처는 사례의 일부이며, 홈페이지에서 해당 제품을 판매하지 않습니다. 원본 ZIP은 저장소에 넣지 않습니다.
- 첨부 사업계획서의 매출·자금 조달·개인별 인사 정보와 앱의 결제 이력·개인 계정 화면은 홈페이지에 포함하지 않습니다. 원본 사업계획서도 이 저장소에 넣지 않습니다.

## 배포

현재 사이트는 GitHub와 연결된 **Cloudflare Workers**의 정적 사이트로 공개되어 있습니다. 기존 프로젝트에서 `main`의 업데이트를 자동 배포하도록 설정한 상태를 유지합니다. 빌드 명령은 `npm run build`, 정적 파일은 `dist/`입니다. 수정본 공개를 위해 Pages 프로젝트를 새로 만들 필요는 없습니다.

처음부터 별도 Pages 프로젝트를 만드는 경우에는 [Cloudflare Pages 배포 안내](docs/CLOUDFLARE-PAGES.md)를 참고할 수 있습니다.

[PC 화면 캡처](docs/previews/desktop.png) · [모바일 화면 캡처](docs/previews/mobile.png)

`npm run build` 후 생성되는 `dist/` 폴더를 정적 웹 호스팅에 배포합니다. 현재 페이지는 섹션 앵커를 사용하는 단일 페이지이므로 별도 API 서버나 데이터베이스가 필요하지 않습니다. 글꼴과 앱 이미지는 자체 호스팅하며 외부 이미지 CDN에 의존하지 않습니다.

도메인을 변경할 때는 `index.html`의 canonical, `og:url`, `og:image` 주소도 함께 변경하세요. 소셜 공유 이미지는 `public/images/social-preview.png`입니다.

Codex 환경의 **저장 및 게시**는 개발 환경을 재사용하기 위한 기능입니다. 회사 홈페이지를 일반 방문자에게 공개하는 웹 배포와는 별도입니다.
