# 셀업랩스 첫 화면 영상 제작안

현재 홈페이지에는 실제 aiadcast 생성 이미지와 웹 애니메이션으로 만든 3단계 소개가 적용되어 있습니다. 추가 영상 서비스나 API를 호출하지 않습니다. 아래는 이후 힉스필드에서 짧은 브랜드 영상을 만들 때 사용할 제작안입니다. 현재 힉스필드 연동이나 영상 생성은 수행하지 않았습니다.

## 최소 제작 범위

- 영상 한 개, 6~8초, 무음. 무료 계정에서 지원하는 가장 가까운 길이를 사용합니다.
- 힉스필드에서 제공되는 무료 크레딧, 다운로드, 워터마크, 상업적 사용 범위를 계정 화면에서 확인합니다. 무료 사용 범위가 충분할 때만 생성합니다.
- 첫 시안은 720p로 확인하고 만족하면 웹용으로 압축합니다. 추가 생성 횟수를 최소화합니다.
- 영상에는 포장재의 형태와 질감만 표현하고, 상품 규격·한글 문구·로고는 홈페이지의 선명한 텍스트와 실제 생성 이미지로 보여줍니다.

## 장면 구성

0~2초: 차콜색 스튜디오 바닥 위 크라프트 박스 한 개. 측면 조명이 종이 질감을 비춥니다.

2~5초: 카메라가 천천히 약간 이동하며 가로·세로·높이를 연상시키는 얇은 선이 박스 주변에 나타납니다. 숫자와 문자는 넣지 않습니다.

5~8초: 조명이 부드럽게 이동하며 첫 구도로 돌아옵니다. 실제 aiadcast 결과물과 설치 버튼은 웹 화면에서 함께 보여줍니다.

## 힉스필드용 프롬프트

> Create a restrained, premium technology brand film, 6–8 seconds, silent, designed for a seamless loop. A single realistic kraft cardboard shipping box sits on a charcoal-black studio surface. Preserve a believable rectangular box shape and natural paper texture. Use a very slow, subtle camera arc, soft directional studio lighting and a small warm orange edge light. Fine, precise white dimension lines gently appear around the box, with no numbers or letters. The light and camera gradually return to the opening composition. Minimal black, white and warm orange palette, editorial product photography, calm confidence, realistic materials, generous negative space. No text, no logos, no people, no particles, no explosions, no morphing, no fast cuts, no sound.

## 홈페이지 적용 시

- 로컬 MP4 파일을 현재 Cloudflare 정적 자산으로 배포합니다. 힉스필드 API 연결은 필요하지 않습니다.
- 목표 파일 크기는 약 1~2 MB입니다. 실제 화질을 확인해 조정합니다.
- `muted`, `playsInline`, `loop`와 대표 이미지를 사용합니다. 자동 재생이 차단되면 대표 이미지가 표시되어야 합니다.
- 움직임 줄이기 또는 데이터 절약 설정에서는 영상을 자동 로드·재생하지 않습니다. 화면 밖이나 다른 탭에서는 재생을 멈춥니다.
- 영상은 브랜드 연출용입니다. 앱이 동영상 자체를 생성한다고 소개하지 않습니다.
