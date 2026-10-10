# 영화패키지 독립 Cloudflare Pages 배포

영화패키지만 별도 Pages 프로젝트로 배포한다. 같은 GitHub 저장소를 연결하지만 배포 결과에는 셀업랩스 홈페이지가 포함되지 않는다. 기존 Workers 프로젝트의 빌드와 도메인 설정은 그대로 둔다.

## Cloudflare에서 한 번 설정

1. Workers & Pages에서 새 애플리케이션을 만들고 **Pages → Git 저장소 연결**을 선택한다. Workers 배포 설정이 아닌 Pages의 정적 사이트 빌드 설정을 사용한다.
2. 저장소 `guyhan76/selluplabs-homepage`를 연결한다.
3. 다음 값을 입력한다.

| 설정 | 값 |
| --- | --- |
| 프로젝트 이름 | `younghwa-package` (사용 가능한 경우) |
| 프로덕션 브랜치 | `main` |
| 프레임워크 프리셋 | None |
| 루트 디렉터리 | 저장소 루트 / 비워두기 |
| 빌드 명령 | `node scripts/build-younghwa.mjs` |
| 빌드 출력 디렉터리 | `dist-younghwa` |
| 환경 변수 `YOUNGHWA_SITE_URL` | `https://younghwa-package.pages.dev` |
| 환경 변수 `NODE_VERSION` | `24` |

프로젝트 이름을 다르게 정했다면 `YOUNGHWA_SITE_URL`도 실제 프로덕션 주소로 바꾼다. 이 값은 비밀 키가 아니다. 배포별 임시 미리보기 URL은 넣지 않는다. 현재 위 주소의 사용 가능 여부와 프로젝트 생성은 확인하지 않았다.

4. 저장하고 배포한다. 성공 후 Cloudflare가 표시한 프로덕션 주소를 연다. Git 연동 이후에는 main 변경 시 이 프로젝트도 자동으로 빌드한다.

## 배포 후 확인

- 첫 화면, 제작 사례 50장, 한/영 전환, 회사 주소와 사업자 정보, 전화·이메일·박스보이 링크.
- `/robots.txt`와 `/sitemap.xml`이 새 주소를 표시하는지 확인.
- 네이버 서치어드바이저와 구글 서치 콘솔에 **새 사이트의 루트 주소**를 등록. 소유 확인 태그는 계정에서 실제 발급받아 추가한다. 구글은 URL 접두어 방식으로 등록한다.
- 새 사이트가 정상 공개된 뒤 기존 `/younghwa/` 경로를 새 주소로 영구 리디렉션하고 기존 사이트맵에서 제거한다. 아직 공개 여부를 확인하지 않았으므로 이 전환은 실행하지 않았다.

## 이후 수정과 도메인

콘텐츠 소스는 `public/younghwa/`다. JS 렌더링 내용과 정적 `index.html` 본문을 함께 갱신한다. 빌드 스크립트는 이 폴더만 복사해 루트 홈페이지로 만들고 canonical, Open Graph, 회사 구조화 데이터, robots와 sitemap을 새 주소로 맞춘다. 이미지 50장과 썸네일, 회사 정보, 쇼핑몰 버튼이 포함된다.

전용 도메인을 구입하면 Pages의 Custom domains에서 연결하고 `YOUNGHWA_SITE_URL`을 그 주소로 변경한 뒤 재배포한다. 기존 `www.boxboy.co.kr` 쇼핑몰은 계속 별도로 연결한다.

로컬 확인: `YOUNGHWA_SITE_URL=https://younghwa-package.pages.dev node scripts/build-younghwa.mjs`. 이 명령은 빌드만 실행하며 Cloudflare에 업로드하지 않는다. 무료 플랜의 저장·전송·빌드 사용 한도는 Cloudflare 계정에서 확인한다.
