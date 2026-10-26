# 셀업랩스 광고형 랜딩페이지 시안

- 경로: `/motion-preview/`
- 소스: `public/motion-preview/index.html`, `motion.css`, `motion.js`
- 기존 메인 페이지와 영화패키지 페이지는 그대로 유지한다. 검색 대상이 아닌 디자인 검토용 페이지로 HTML 및 HTTP 헤더에 noindex를 지정한다.

## 연출

기존 실제 생성 사례의 WebP 미리보기를 사용한다. 첫 화면의 세 광고 카드는 CSS perspective와 3D transform으로 떠 있는 느낌을 만들고, 정밀 포인터에서는 커서에 반응한다. 제품 자체를 3D 모델로 복원한 것은 아니다.

광고 쇼케이스는 패키지·뷰티·테크 3개 사례를 5초 간격으로 전환한다. 이전/다음·분야 선택을 지원한다. 화면 밖이나 숨겨진 탭, 쇼케이스에 마우스/키보드 초점을 둔 동안 자동 전환을 멈춘다. 전역 움직임 정지 버튼과 prefers-reduced-motion을 지원한다. 스마트폰에서는 포인터 기울기를 사용하지 않는다.

이번 시안은 이미지 모션이며 MP4/WebM 영상은 포함하지 않는다. 앱의 영상 생성 기능을 광고하는 것이 아니다. 실제 촬영 영상·영상 생성 결과·회전 가능한 제품 모델을 사용하는 후속 작업에는 해당 미디어가 필요하다.

## 검증

`npm run build`로 현재 정적 사이트와 함께 출력한다. 별도 패키지 의존성은 없다.

```
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/motion-preview.spec.ts --workers=1
```

PC/모바일에서 이미지 로딩·레이아웃·수동 탐색·화면 안 자동 전환·정지·동작 줄이기를 확인한다. 공개 배포의 성공 여부는 Cloudflare에서 별도로 확인한다.
