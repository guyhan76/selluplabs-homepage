# Cloudflare Pages 무료 공개

이 홈페이지는 정적 사이트입니다. 별도 서버나 데이터베이스 없이 Cloudflare Pages에 배포할 수 있습니다. Cloudflare가 제공하는 `pages.dev` 주소를 사용하면 별도 도메인을 구매하지 않아도 됩니다. 직접 구입한 도메인은 나중에 연결할 수 있습니다.

## GitHub 연결

1. https://dash.cloudflare.com/sign-up 에서 무료 계정을 만들고 로그인합니다.
2. **Workers & Pages**에서 새 애플리케이션을 만듭니다. **Pages**를 선택하고 **Git 저장소 가져오기 / Connect to Git**로 진행합니다. 화면의 메뉴 이름은 언어와 UI 버전에 따라 다를 수 있습니다.
3. GitHub 계정을 연결하고 `guyhan76/selluplabs-homepage` 저장소에 대한 접근을 허용합니다.
4. 아래 설정을 입력한 후 **Save and Deploy / 저장 및 배포**를 선택합니다.

| 항목 | 값 |
| --- | --- |
| 프로젝트 이름 | `selluplabs` 또는 사용 가능한 다른 이름 |
| 프로덕션 브랜치 | `main` |
| 프레임워크 | React (Vite), 없으면 None |
| 빌드 명령 | `npm run build` |
| 빌드 출력 디렉터리 | `dist` |
| 루트 디렉터리 | 기본값 / 저장소 루트 |
| 필수 환경변수 | 없음 |

이 프로젝트는 `.node-version`에 Node.js 버전을 지정했습니다. 공개 문의 이메일과 Google Play 주소에는 기본값이 있으므로 환경변수를 추가할 필요가 없습니다. 결제 기능이나 AI 생성 서버도 이 홈페이지에는 없습니다.

5. 배포가 성공하면 대시보드에 표시되는 `https://프로젝트이름.pages.dev` 주소를 엽니다. 프로젝트 이름은 중복 여부에 따라 달라지므로 대시보드에 실제로 나온 주소를 사용합니다.
6. PC와 휴대전화에서 메뉴, 실제 생성 사례 확대 보기, Google Play 링크, 이메일 문의를 확인합니다.

이후 GitHub `main`에 업데이트를 반영하면 Cloudflare Pages가 새 버전을 자동 배포합니다. 홈페이지 공개 후 첫 화면이나 문구를 수정해도 주소는 유지됩니다.

## 비용과 범위

Cloudflare Pages에는 정적 사이트용 무료 플랜이 있습니다. 무료 플랜의 사용량 제한과 현재 조건은 Cloudflare 공식 안내를 확인하세요. 유료 플랜, 도메인 구입, 추가 유료 서비스는 이 홈페이지를 처음 공개하는 데 필수 조건이 아닙니다.

현재 정적 빌드는 149개 파일이며 최대 파일 크기는 약 2.54 MB입니다. 사용자가 제공한 생성 이미지 13장은 원본 그대로 포함되어 있습니다.

문의 양식은 방문자의 이메일 앱을 엽니다. 방문자가 이메일 앱에서 직접 보내기를 눌러야 하며, 홈페이지 서버가 자동으로 메일을 보내지는 않습니다.

## 배포 전 화면 확인

- [PC 전체 화면](previews/desktop.png)
- [모바일 전체 화면](previews/mobile.png)

이 화면들은 현재 구현한 홈페이지의 캡처입니다. 실제 공개 주소는 Cloudflare 배포가 성공한 뒤 생성됩니다. Codex의 환경 저장·게시와 Cloudflare의 홈페이지 배포는 서로 별개입니다.

공식 안내: https://developers.cloudflare.com/pages/get-started/git-integration/
