# 영화패키지 무료 공개 경로

> 2026-10-10: 사용자가 독립 프로젝트 배포를 선택했다. 새 배포 설정은 [YOUNGHWA-PAGES.md](YOUNGHWA-PAGES.md)를 따른다. 아래 주소는 전환 전 기존 공개 경로이며, 새 프로젝트 공개 확인 후 이전한다.

사용자는 2026-10-10 농산물 제작 사례 20장을 추가하고 무료 웹 주소로 공개하도록 요청했다. 기존 Cloudflare Workers와 GitHub main 자동 배포 연결을 사용한다.

- 공개 대상 경로: https://selluplabs-homepage.selluplabs.workers.dev/younghwa/
- 운영 소스: `public/younghwa/`. 기존 셀업랩스 루트 페이지 소스는 변경하지 않는다.
- 이미지: 프리미엄 15 + 농산물·식품 20 + 골판지 15 = 50장. 원본/목록용 WebP 100개와 회사 로고.
- 문의: 1644-1410, lis000@hanmail.net. 박스보이 기성박스 쇼핑몰 https://www.boxboy.co.kr 에 새 창으로 연결한다.
- 수정 후 `npm run build` → `dist/younghwa/`에 반영. `main` push가 기존 Cloudflare 자동 배포의 입력이다.
- 배포 확인은 Cloudflare 해당 프로젝트의 Deployments에서 커밋과 성공 상태를 확인하고 위 경로를 연다. 이 실행 환경은 workers.dev 도메인 직접 접속이 프록시에서 차단되어 원격 HTTP 성공을 검증할 수 없다. GitHub push 성공과 공개 서버 반영 완료를 구분한다.

## 검색 노출 준비

공개 HTML에는 `index,follow`, canonical, 한국어 제목/설명, Open Graph, Organization 구조화 데이터, JavaScript 없이 읽을 수 있는 본문을 포함한다. 앱 내용이 변경되면 초기 HTML 본문도 함께 갱신해야 한다. robots.txt에 사이트맵을 알리고 사이트맵에는 공개 경로를 명시한다.

- 사이트맵: https://selluplabs-homepage.selluplabs.workers.dev/younghwa/sitemap.xml
- 네이버: https://searchadvisor.naver.com/ → 웹마스터 도구 → 사이트 등록 → 소유 확인 → 사이트맵 제출/수집 요청. 현재 하위 경로는 소유한 상위 호스트의 등록·확인 범위에서 관리한다. 입력 가능한 URL 범위는 실제 등록 화면에서 확인한다.
- Google: https://search.google.com/search-console → URL 접두어 속성에 공개 URL 등록 → 소유 확인 → 사이트맵 제출 → URL 검사/색인 생성 요청.
- 소유 확인용 HTML 파일/메타 태그는 계정에서 발급한 실제 값만 사용한다. 아직 계정 등록·소유 확인·수집 요청을 실행하지 않았다.
- 검색 반영이나 ‘영화패키지’ 검색의 상위 노출은 보장하지 않는다. 회사명, 제품 소개, 실제 연락처와 지속적인 콘텐츠가 필요하다.

## 별도 도메인 연결

별도 Cloudflare Pages/Workers 사이트에 `public/younghwa/` 내용만 루트로 배포하면 독립 사이트로 사용할 수 있다. 프로젝트 Custom domains에서 도메인을 추가하고 DNS를 연결한 뒤 canonical·og:url·Organization URL·sitemap 주소를 새 주소로 바꾼다. 이후 새 도메인으로 검색엔진 소유 확인/사이트맵 제출을 진행한다. 현재 `www.boxboy.co.kr` 쇼핑몰 설정은 변경하지 않는다.

확인판 소스·ZIP·캡처는 `preview/younghwa-package-20261010` 브랜치의 `docs/younghwa-preview/`에 보관되어 있다. 이 브랜치 전체를 main에 합칠 필요는 없다. 이후 운영 변경의 기준 경로는 main의 `public/younghwa/`이다.
