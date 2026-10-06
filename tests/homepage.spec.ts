import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { generatedCategories } from "../src/generatedExamples";

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
    page.getByRole("link", { name: "aiadcast 알아보기", exact: true }),
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

test("six category filters display intact original images and only available formats", async ({
  page,
}) => {
  for (const category of generatedCategories) {
    const button = page.getByRole("button", {
      name: category.name,
      exact: true,
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("generated-image")).toHaveCount(
      category.examples.length,
    );
    for (const example of category.examples) {
      const img = page.locator(`.gallery-grid img[src="${example.src}"]`);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
        )
        .toBe(true);
      const dimensions = await img.evaluate((image: HTMLImageElement) => ({
        width: image.naturalWidth,
        height: image.naturalHeight,
      }));
      expect(dimensions).toEqual({
        width: example.width,
        height: example.height,
      });
    }
  }
  await page.getByRole("button", { name: "쇼핑백", exact: true }).click();
  await page.getByRole("button", { name: "2:3 포스터", exact: true }).click();
  await expect(page.getByTestId("generated-image")).toHaveCount(1);
  await expect(page.getByTestId("generated-image")).toHaveAttribute(
    "src",
    "/images/examples/bag-10.png",
  );
  await page
    .getByRole("button", { name: "9:16 카드뉴스", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveAttribute(
    "src",
    "/images/examples/bag-1.png",
  );
  await page.getByRole("button", { name: "용기", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "2:3 포스터", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId("generated-image")).toHaveCount(3);
});

test("gallery reveals all 13 examples and combined filters have no empty categories", async ({
  page,
}) => {
  await expect(page.getByTestId("generated-image")).toHaveCount(4);
  await page
    .getByRole("button", { name: "생성 사례 더 보기 (13)", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(13);
  await page
    .getByRole("button", { name: "대표 사례만 보기", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(4);
  await page.getByRole("button", { name: "2:3 포스터", exact: true }).click();
  await page
    .getByRole("button", { name: "생성 사례 더 보기 (5)", exact: true })
    .click();
  await expect(page.getByTestId("generated-image")).toHaveCount(5);
  await page.getByRole("button", { name: "용기", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "전체 비율", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("generated-image")).toHaveCount(3);
});

test("generated images expand with accessible controls and keyboard navigation", async ({
  page,
}) => {
  await page.getByRole("button", { name: "쇼핑백", exact: true }).click();
  const trigger = page.getByRole("button", {
    name: "브랜드 쇼핑백 이미지 크게 보기",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "브랜드 쇼핑백",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "원본 보기" })).toHaveAttribute(
    "href",
    "/images/examples/bag-1.png",
  );
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".case-dialog h2")).toHaveText("맞춤형 쇼핑백");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".case-dialog h2")).toHaveText("브랜드 쇼핑백");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
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
  await dialog.getByLabel("문의 유형").selectOption("비즈니스·기술 협력");
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
