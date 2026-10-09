import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { generatedCategories, allExamples } from "../src/generatedExamples";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import jsQR from "jsqr";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("first screen explains the business and loads real product output without JavaScript errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI 마케팅 콘텐츠.",
  );
  await expect(page.locator(".hero-description")).toContainText(
    "AI 서비스를 개발·운영합니다",
  );
  await expect(page.locator(".hero-description")).toBeInViewport();
  await expect(
    page.getByRole("link", { name: "aiadcast 앱 설치", exact: true }),
  ).toBeInViewport();
  await expect(page.locator("footer")).toContainText("셀업랩스 주식회사");
  await expect(page.locator("#technology")).toContainText("특허 1건 출원");
  await expect(page.locator("#technology")).toContainText("10-2026-0158120");
  await expect
    .poll(() =>
      page
        .locator(".hero-result img")
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});

test("all 71 supplied originals remain intact and all delivery previews are available", async ({
  request,
}) => {
  expect(allExamples).toHaveLength(71);
  expect(new Set(allExamples.map((example) => example.id)).size).toBe(71);
  const manifest = JSON.parse(
    await readFile("public/images/examples/provenance.json", "utf8"),
  );
  expect(manifest).toHaveLength(71);
  for (const example of allExamples) {
    const original = await readFile(`public${example.src}`);
    const record = manifest.find((item: { file: string }) =>
      example.src.endsWith(`/${item.file}`),
    );
    expect(createHash("sha256").update(original).digest("hex")).toBe(
      record.sha256,
    );
    const metadata = await sharp(original).metadata();
    expect([metadata.width, metadata.height]).toEqual([
      example.width,
      example.height,
    ]);
    const response = await request.get(example.thumbnail);
    expect(response.ok(), example.thumbnail).toBe(true);
    const preview = await sharp(await response.body()).metadata();
    expect(preview.format).toBe("webp");
    expect(preview.width).toBeLessThanOrEqual(640);
    expect(
      Math.abs(
        preview.width! / preview.height! - example.width / example.height,
      ),
    ).toBeLessThan(0.002);
  }
});

test("six categories expose every result with accurate formats and working original images", async ({
  page,
}) => {
  const gallery = page.locator(".generated-showcase");
  for (const category of generatedCategories) {
    const button = gallery.getByRole("button", {
      name: category.name,
      exact: true,
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("generated-image")).toHaveCount(8);
    await gallery
      .getByRole("button", {
        name: `전체 ${category.examples.length}개 펼치기`,
        exact: true,
      })
      .click();
    await expect(page.getByTestId("generated-image")).toHaveCount(
      category.examples.length,
    );
    const ids = await page
      .getByTestId("generated-image")
      .evaluateAll((images) =>
        images.map((img) => img.getAttribute("data-original")),
      );
    expect(ids).toEqual(category.examples.map((example) => example.src));
    const last = category.examples.at(-1)!;
    await gallery
      .getByRole("button", {
        name: `${last.title} 이미지 크게 보기`,
        exact: true,
      })
      .click();
    const image = page.locator(".case-dialog-image");
    await expect
      .poll(() =>
        image.evaluate((img: HTMLImageElement) => [
          img.naturalWidth,
          img.naturalHeight,
        ]),
      )
      .toEqual([last.width, last.height]);
    await page.keyboard.press("Escape");
  }
  await gallery.getByRole("button", { name: "쇼핑백", exact: true }).click();
  await gallery
    .getByRole("button", { name: "2:3 포스터", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(3);
  await gallery
    .getByRole("button", { name: "9:16 카드뉴스", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(7);
  await gallery.getByRole("button", { name: "용기", exact: true }).click();
  await expect(
    gallery.getByRole("button", { name: "2:3 포스터", exact: true }),
  ).toHaveCount(0);
  await expect(
    gallery.getByRole("button", { name: "전체 비율", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("gallery search, pagination, full expansion, and empty state work together", async ({
  page,
}) => {
  const gallery = page.locator(".generated-showcase");
  await expect(page.getByTestId("generated-image")).toHaveCount(8);
  await gallery
    .getByRole("button", { name: "12개 더 보기", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(20);
  await gallery
    .getByRole("button", { name: "전체 71개 펼치기", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(71);
  await expect(gallery.getByRole("status")).toHaveText("71 / 71 CASES");
  await gallery
    .getByRole("button", { name: "대표 사례만 보기", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(8);
  await gallery
    .getByRole("button", { name: "2:3 포스터", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(7);
  await gallery.getByRole("button", { name: "전체 비율", exact: true }).click();
  await gallery.getByRole("searchbox", { name: "상품 검색" }).fill("화장품");
  await expect(page.getByTestId("generated-image")).toHaveCount(3);
  await gallery.getByRole("searchbox", { name: "상품 검색" }).fill("유리 용기");
  await expect(page.getByTestId("generated-image")).toHaveCount(4);
  await gallery
    .getByRole("searchbox", { name: "상품 검색" })
    .fill("검색결과없는상품");
  await expect(
    gallery.getByText("검색 조건에 맞는 사례가 없습니다."),
  ).toBeVisible();
  await expect(page.getByTestId("generated-image")).toHaveCount(0);
  await gallery.getByRole("button", { name: "필터 초기화" }).click();
  await expect(page.getByTestId("generated-image")).toHaveCount(8);
  await expect(
    gallery.getByRole("searchbox", { name: "상품 검색" }),
  ).toHaveValue("");
});

test("lightbox navigates all filtered results beyond the first page and restores focus", async ({
  page,
}) => {
  const gallery = page.locator(".generated-showcase");
  await gallery.getByRole("button", { name: "쇼핑백", exact: true }).click();
  const trigger = gallery.getByRole("button", {
    name: "브랜드 쇼핑백 이미지 크게 보기",
    exact: true,
  });
  await trigger.click();
  const dialog = page.locator(".case-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "원본 보기" })).toHaveAttribute(
    "href",
    "/images/examples/bag-1.png",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator("h2")).toHaveText("맞춤형 쇼핑백");
  await expect(dialog.getByRole("link", { name: "원본 보기" })).toHaveAttribute(
    "href",
    "/images/examples/bag-10.png",
  );
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator("h2")).toHaveText("브랜드 쇼핑백");
  await expect(
    dialog.getByRole("link", { name: "내 상품도 aiadcast로 만들어보기" }),
  ).toHaveAttribute("href", /play.google.com/);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("six use-case previews switch channels and products with accessible keyboard controls", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const applications = page.locator("#applications");
  for (const name of [
    "기업 홍보",
    "명함",
    "블로그",
    "릴스·스토리",
    "상품 상세",
    "매장·전시",
  ]) {
    const tab = applications.getByRole("tab", { name, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = applications.getByRole("tabpanel");
    await expect(
      panel.getByRole("link", { name: "내 상품으로 시작하기" }),
    ).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=kr.co.beehivecorp.aiadcast",
    );
    await applications
      .getByRole("combobox", { name: "활용 예시 상품 선택" })
      .selectOption("2");
    await expect(panel.locator(".application-product-image")).toHaveAttribute(
      "src",
      "/images/examples/previews/container-1.webp",
    );
    const img = panel.locator(".application-product-image");
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(panel.locator("figcaption")).toContainText("재구성했습니다");
    const accessibility = await new AxeBuilder({ page })
      .include("#applications")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(accessibility.violations, name).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
  }
  const first = applications.getByRole("tab", {
    name: "기업 홍보",
    exact: true,
  });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    applications.getByRole("tab", { name: "명함", exact: true }),
  ).toBeFocused();
  await expect(
    applications.getByRole("tab", { name: "명함", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    applications.getByRole("tab", { name: "매장·전시", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
  await applications
    .getByRole("tab", { name: "릴스·스토리", exact: true })
    .click();
  await expect(applications.locator(".application-note")).toContainText(
    "aiadcast는 이미지를 생성합니다",
  );
});

test("installation links and desktop QR point to the official app without free-service claims", async ({
  page,
  isMobile,
}) => {
  const install = page.locator("#get-app");
  await expect(
    install.getByRole("link", {
      name: "Google Play에서 aiadcast 설치",
      exact: true,
    }),
  ).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=kr.co.beehivecorp.aiadcast",
  );
  await expect(install).toContainText("이용권과 요금은 앱에서 확인");
  if (!isMobile) {
    const qr = install.getByRole("img", {
      name: "Google Play aiadcast 설치 페이지 QR코드",
    });
    await qr.scrollIntoViewIfNeeded();
    const pixels = await sharp(await qr.screenshot())
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const decoded = jsQR(
      new Uint8ClampedArray(pixels.data),
      pixels.info.width,
      pixels.info.height,
    );
    expect(decoded?.data).toBe(
      "https://play.google.com/store/apps/details?id=kr.co.beehivecorp.aiadcast",
    );
    await expect(
      install.getByRole("img", {
        name: "Google Play aiadcast 설치 페이지 QR코드",
      }),
    ).toBeVisible();
    await expect(
      install.getByRole("link", {
        name: "QR코드 대신 Google Play 설치 페이지 열기",
      }),
    ).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=kr.co.beehivecorp.aiadcast",
    );
  }
});

test("app dialog has a real screenshot and the confirmed Google Play link", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "모바일 앱 살펴보기", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "aiadcast 모바일 앱" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "Google Play에서 보기" }),
  ).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=kr.co.beehivecorp.aiadcast",
  );
  expect(
    await dialog
      .locator("img")
      .evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("contact form validates input, copies the inquiry, and clearly identifies email handoff", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "문의하기", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "서비스 도입·협업 문의" });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "이메일로 문의하기", exact: true })
    .click();
  expect(
    await dialog
      .locator("form")
      .evaluate((form: HTMLFormElement) => form.checkValidity()),
  ).toBe(false);
  await dialog.getByLabel("이름 / 회사명").fill("브라우저 검증 회사");
  await dialog.getByLabel("회신 이메일").fill("tester@example.com");
  await dialog
    .getByLabel("문의 유형")
    .selectOption({ label: "비즈니스·기술 협력" });
  await dialog
    .getByLabel("문의 내용")
    .fill("자동 검증용 문의 내용입니다. 이메일은 발송하지 않습니다.");
  expect(
    await dialog
      .locator("form")
      .evaluate((form: HTMLFormElement) => form.checkValidity()),
  ).toBe(true);
  await dialog.getByRole("button", { name: "내용 복사", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "문의 내용을 복사했습니다",
  );
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("selluplabs@gmail.com");
  expect(copied).toContain("브라우저 검증 회사");
  expect(copied).toContain("비즈니스·기술 협력");
  await expect(dialog.locator(".form-note")).toContainText(
    "기기의 이메일 앱이 열립니다",
  );
  await expect(
    dialog.getByRole("link", { name: "selluplabs@gmail.com" }),
  ).toHaveAttribute("href", "mailto:selluplabs@gmail.com");
  await dialog.getByRole("button", { name: "문의 창 닫기" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "문의하기", exact: true }),
  ).toBeFocused();
});

test("FAQ answers expand and collapse and navigation reaches the right section", async ({
  page,
  isMobile,
}) => {
  const button = page.getByRole("button", { name: /릴스 영상도 만들어주나요/ });
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-answer-2")).toContainText(
    "동영상 자동 생성 기능을 의미하지 않습니다",
  );
  await button.click();
  await expect(page.locator("#faq-answer-2")).toBeHidden();
  if (isMobile) {
    await page.getByRole("button", { name: "메뉴 열기" }).click();
    await page
      .getByRole("navigation", { name: "모바일 메뉴" })
      .getByRole("link", { name: "서비스", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "메뉴 열기" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else {
    await page
      .getByRole("navigation", { name: "주 메뉴" })
      .getByRole("link", { name: "서비스", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/#service$/);
});

test("page has no detected WCAG A/AA accessibility violations", async ({
  page,
}) => {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("contact dialog is accessible", async ({ page }) => {
  await page.getByRole("button", { name: "문의하기", exact: true }).click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("layout fits narrow phones, tablets, and wide desktop screens", async ({
  page,
}) => {
  for (const width of [320, 375, 390, 680, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `overflow at ${width}px`,
    ).toBeLessThanOrEqual(width);
  }
});

test("company contact information is accurate and actionable in both languages", async ({
  page,
}) => {
  const address = "서울특별시 마포구 양화로 176 B2001-30호";
  await expect(page.locator("#about")).toContainText(address);
  await expect(page.locator("#contact address")).toHaveText(address);
  await expect(page.locator("footer")).toContainText(address);
  await expect(page.locator(".experience strong")).toHaveText("26+");
  await expect(page.locator("#about a[href='tel:+821056356211']")).toHaveText(
    "+82 10-5635-6211",
  );
  await expect(
    page.locator("#about a[href='mailto:selluplabs@gmail.com']"),
  ).toHaveText("selluplabs@gmail.com");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#about")).toContainText(
    "B2001-30, 176 Yanghwa-ro, Mapo-gu, Seoul, Republic of Korea",
  );
  await expect(page.locator("#about")).toContainText(
    "Over 26 years of packaging industry experience",
  );
  await expect(page.locator("#contact address")).toContainText("B2001-30");
  await expect(page.locator("footer")).toContainText("176 Yanghwa-ro");
  await expect(page.locator("#contact a[href='tel:+821056356211']")).toHaveText(
    "+82 10-5635-6211",
  );
});

test("language choice has shareable URLs, persistence, explicit overrides and browser history", async ({
  page,
}) => {
  await page.goto("/?lang=ko#cases");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\?lang=en#cases$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(
    "selluplabs | AI Marketing Content Technology",
  );
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
    "href",
    "https://selluplabs-homepage.selluplabs.workers.dev/?lang=en",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "한국어", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/?lang=ko");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
});

test("English gallery, use cases, FAQ and app introduction are translated and functional", async ({
  page,
}) => {
  await page.goto("/?lang=en");
  await page
    .getByRole("button", { name: "Show all 71 examples", exact: true })
    .click();
  await expect(page.locator(".gallery-card")).toHaveCount(71);
  expect(await page.locator(".gallery-grid").innerText()).not.toMatch(
    /[가-힣]/,
  );
  await page.getByRole("searchbox", { name: "Search products" }).fill("glass");
  await expect(page.locator(".gallery-card")).toHaveCount(4);
  await page
    .getByRole("button", { name: "Enlarge Glass perfume bottle", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Glass perfume bottle" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Clear search" }).click();
  const labels = [
    "Company promotion",
    "Business cards",
    "Blog",
    "Reels & Stories",
    "Product pages",
    "Stores & exhibitions",
  ];
  for (const label of labels) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    await page
      .getByRole("combobox", { name: "Choose a product for the preview" })
      .selectOption("2");
    expect(await page.locator("#application-panel").innerText()).not.toMatch(
      /[가-힣]/,
    );
    await expect(page.locator("#application-panel img")).toHaveAttribute(
      "src",
      /container-1/,
    );
  }
  await page
    .getByRole("button", {
      name: "Does aiadcast generate Reels videos?",
      exact: true,
    })
    .click();
  await expect(page.locator(".faq-list")).toContainText(
    "does not automatically generate videos",
  );
  await page
    .getByRole("button", { name: "Explore the mobile app", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "The aiadcast mobile app" }),
  ).toBeVisible();
  expect(await page.locator(".app-dialog").innerText()).not.toMatch(/[가-힣]/);
  await page.keyboard.press("Escape");
  expect(await page.locator("body").innerText()).not.toMatch(/[가-힣]/);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("English contact form retains draft details and copies a localized inquiry", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "문의하기", exact: true }).click();
  await page.getByLabel("이름 / 회사명").fill("Example Company");
  await page.getByLabel("회신 이메일").fill("test@example.com");
  await page.getByLabel("문의 유형").selectOption("partnership");
  await page
    .getByLabel("문의 내용")
    .fill("We would like to discuss a technology partnership.");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Contact", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Service & partnership inquiries",
  });
  await expect(dialog.getByLabel("Name / Company")).toHaveValue(
    "Example Company",
  );
  await expect(dialog.getByLabel("Inquiry type")).toHaveValue("partnership");
  await dialog
    .getByRole("button", { name: "Copy message", exact: true })
    .click();
  await expect(dialog.getByRole("status")).toContainText(
    "Your inquiry has been copied",
  );
  const body = await page.evaluate(() => navigator.clipboard.readText());
  expect(body).toContain("Inquiry type: Business / technology partnership");
  expect(body).toContain("Reply email: test@example.com");
  expect(body).toContain("selluplabs@gmail.com");
  expect(body).not.toMatch(/[가-힣]/);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("English layout and language controls fit phones, tablets and desktop screens", async ({
  page,
}) => {
  await page.goto("/?lang=en");
  for (const width of [320, 375, 390, 680, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBe(true);
    const brand = await page.locator(".site-header .brand").boundingBox();
    const controls = await page.locator(".header-actions").boundingBox();
    expect(
      brand && controls && brand.x + brand.width <= controls.x,
      `header overlap at ${width}px`,
    ).toBe(true);
    await expect(
      page.getByRole("button", { name: "English", exact: true }),
    ).toBeVisible();
  }
});

test("hero story respects reduced motion and allows each step in both languages", async ({ page }) => {
  const story = page.locator(".motion-story");
  await story.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-playing", "false");
  await expect(story).toHaveAttribute("data-step", "2");
  await expect(story.getByRole("button", { name: "자동 전환 일시정지" })).toHaveCount(0);
  for (const label of ["상품 정보", "AI 콘텐츠 구성", "홍보 이미지 완성"]) {
    const control = story.getByRole("button", { name: label });
    await control.click();
    await expect(control).toHaveAttribute("aria-pressed", "true");
    await expect(story.locator(".story-description")).toBeVisible();
  }
  await page.getByRole("button", { name: "English", exact: true }).click();
  await story.getByRole("button", { name: "AI composition" }).click();
  expect(await story.innerText()).not.toMatch(/[가-힣]/);
  await expect(story.getByRole("link", { name: "View actual generated examples" })).toHaveAttribute("href", "#cases");
});

test("hero automatic sequence can pause, resume and stops outside the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.reload();
  const story = page.locator(".motion-story");
  await story.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-playing", "true");
  await expect(story).toHaveAttribute("data-step", "0");
  await page.clock.fastForward(4900);
  await expect(story).toHaveAttribute("data-step", "1");
  await story.getByRole("button", { name: "자동 전환 일시정지" }).click();
  await page.clock.fastForward(10000);
  await expect(story).toHaveAttribute("data-step", "1");
  await story.getByRole("button", { name: "홍보 이미지 완성" }).click();
  await expect(story).toHaveAttribute("data-step", "2");
  await page.clock.fastForward(10000);
  await expect(story).toHaveAttribute("data-step", "2");
  await story.getByRole("button", { name: "자동 전환 재생" }).click();
  await page.clock.fastForward(4900);
  await expect(story).toHaveAttribute("data-step", "0");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-playing", "false");
  await page.clock.fastForward(10000);
  await expect(story).toHaveAttribute("data-step", "0");
  await story.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-playing", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(story).toHaveAttribute("data-playing", "false");
});
