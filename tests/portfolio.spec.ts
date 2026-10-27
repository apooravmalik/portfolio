import { expect, test } from "@playwright/test";

test("outline bulb replaces the i dot, lights on hover, and jumps without moving the headline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("I turn ideas into things.");
  const bulb = page.getByRole("button", { name: "Light up an idea" });
  const icon = bulb.locator("span").first();
  await expect(bulb.locator("svg")).toHaveCount(1);
  await expect(bulb.locator("..")).toContainText("ı");
  const titleBefore = await page.locator("#hero-title").boundingBox();
  await bulb.hover();
  await expect(icon).toHaveCSS("color", "rgb(229, 107, 60)");
  await bulb.click();
  await expect.poll(() => icon.evaluate((el) => el.getAnimations().length)).toBe(1);
  await expect.poll(() => icon.evaluate((el) => el.getAnimations().length)).toBe(0);
  expect(await page.locator("#hero-title").boundingBox()).toEqual(titleBefore);
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
});

test("bulb popups escalate with each click and finish with BOOM at the burst", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  const bulb = page.getByRole("button", { name: "Light up an idea" });
  const speech = page.getByRole("status");
  await expect(speech).toHaveText("Click me");
  const messages = [
    "Don’t do it.", "Seriously. Don’t.", "Is this how you treat a bulb?",
    "Easy on the bulb.", "It’s a dud.", "Expired bulb.",
    "You’re still here?", "Last warning.", "I’m gonna burst…", "BOOM!",
  ];
  for (const message of messages) {
    await bulb.click();
    await expect(speech).toHaveText(message);
    const popup = (await speech.boundingBox())!;
    expect(popup.x).toBeGreaterThanOrEqual(16);
    expect(popup.x + popup.width).toBeLessThanOrEqual(304);
    const header = (await page.locator("header").boundingBox())!;
    expect(popup.y).toBeGreaterThanOrEqual(header.y + header.height);
  }
  await expect(bulb).toHaveAttribute("data-burst", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(bulb).toHaveAttribute("data-burst", "false");
  await bulb.click();
  await expect(speech).toHaveText("Don’t do it.");
});

test("speech dismisses and the click invitation returns on hover or keyboard focus", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  const bulb = page.getByRole("button", { name: "Light up an idea" });
  const speech = page.locator("#bulb-message");
  await bulb.click();
  await expect(speech).toHaveText("Don’t do it.");
  await page.mouse.move(0, 0);
  await page.clock.fastForward(2700);
  await expect(speech).toBeHidden();
  await bulb.hover();
  await expect(speech).toBeVisible();
  await expect(speech).toHaveText("Click me");
  await page.mouse.move(0, 0);
  await page.keyboard.press("Tab");
  await bulb.focus();
  await expect(speech).toBeVisible();
});

test("the tenth click bursts the bulb and persists dark mode", async ({ page }) => {
  await page.goto("/");
  const bulb = page.getByRole("button", { name: "Light up an idea" });
  await bulb.click({ clickCount: 9, delay: 20 });
  await expect(bulb).toHaveAttribute("data-burst", "false");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  await bulb.click();
  await expect(bulb).toHaveAttribute("data-burst", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  await expect(bulb).toHaveAttribute("data-burst", "false");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("keyboard activation works with reduced motion and suppresses jump and burst travel", async ({ page }) => {
  await page.goto("/");
  const bulb = page.getByRole("button", { name: "Light up an idea" });
  const icon = bulb.locator("span").first();
  await bulb.focus();
  await expect(icon).toHaveCSS("color", "rgb(229, 107, 60)");
  await page.keyboard.press("Enter");
  expect(await icon.evaluate((el) => el.getAnimations().length)).toBe(0);
  for (let i = 1; i < 10; i++) await page.keyboard.press("Space");
  await expect(bulb).toHaveAttribute("data-burst", "true");
  await expect(icon).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test.describe("touch bulb", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test("ten taps trigger the same surprise without hover", async ({ page }) => {
    await page.goto("/");
    const bulb = page.getByRole("button", { name: "Light up an idea" });
    const bounds = (await bulb.boundingBox())!;
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeGreaterThanOrEqual(44);
    for (let i = 0; i < 10; i++) await bulb.tap();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test("bursts reset after ten clicks and leave an already-dark theme dark", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("portfolio-theme", "dark"));
  await page.goto("/");
  const bulb = page.getByRole("button", { name: "Light up an idea" });
  for (let cycle = 0; cycle < 2; cycle++) {
    await bulb.click({ clickCount: 10, delay: 20 });
    await expect(bulb).toHaveAttribute("data-burst", "true");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(bulb).toHaveAttribute("data-burst", "false");
  }
});

test.describe("bulb theme reveal with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the circular reveal starts at the bulb rather than the header toggle", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const root = document.documentElement;
      const animate = root.animate.bind(root);
      root.animate = (frames, options) => {
        Object.assign(window, { themeReveal: { frames, options } });
        return animate(frames, options);
      };
    });
    const bulb = page.getByRole("button", { name: "Light up an idea" });
    const icon = bulb.locator("span").first();
    await bulb.click({ clickCount: 9, delay: 20 });
    await expect.poll(() => icon.evaluate((el) => el.getAnimations().length)).toBe(0);
    const bounds = (await icon.boundingBox())!;
    await bulb.click();
    const reveal = () => page.evaluate(() => (window as Window & {
      themeReveal?: { frames: PropertyIndexedKeyframes; options: KeyframeAnimationOptions };
    }).themeReveal);
    await expect.poll(reveal).toBeTruthy();
    const captured = (await reveal())!;
    expect(captured.frames.clipPath).toEqual([
      `circle(0px at ${bounds.x + bounds.width / 2}px ${bounds.y + bounds.height / 2}px)`,
      expect.stringContaining(`at ${bounds.x + bounds.width / 2}px ${bounds.y + bounds.height / 2}px)`),
    ]);
    expect(captured.options.pseudoElement).toBe("::view-transition-new(root)");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  for (const failure of ["throws", "stalls"] as const) {
    test(`bulb still switches theme when the browser transition ${failure}`, async ({ page }) => {
      await page.addInitScript((mode) => {
        Object.defineProperty(document, "startViewTransition", {
          configurable: true,
          value: () => {
            if (mode === "throws") throw new Error("Transition unavailable");
            return { ready: new Promise(() => {}), finished: new Promise(() => {}), skipTransition() {} };
          },
        });
      }, failure);
      await page.goto("/");
      await page.getByRole("button", { name: "Light up an idea" }).click({ clickCount: 10, delay: 20 });
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark", { timeout: 1500 });
    });
  }

  test("a header toggle can supersede the bulb reveal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Light up an idea" }).click({ clickCount: 10, delay: 20 });
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  });
});

test("hero has an alphabet-only orange donut with a still reduced-motion frame", async ({ page }) => {
  await page.goto("/");
  const donut = page.getByRole("img", { name: /donut drawn in orange alphabet letters/ });
  const art = donut.locator("pre");
  const frame = await art.textContent();
  expect(frame).toMatch(/^[A-Za-z \n]+$/);
  const rows = frame!.split("\n");
  expect(rows).toHaveLength(40);
  expect(rows.every((row) => row.length === 80)).toBe(true);
  expect(frame!.replace(/\s/g, "").length).toBeGreaterThan(500);
  // A visible central opening distinguishes the torus from a shaded sphere.
  expect(rows[20].slice(36, 44)).toBe("        ");
  await expect(art).toHaveCSS("color", "rgb(229, 107, 60)");
  await expect(page.getByRole("button", { name: "Pause donut animation" })).toBeHidden();
  await page.waitForTimeout(200);
  expect(await art.textContent()).toBe(frame);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(art).toHaveCSS("color", "rgb(242, 138, 96)");
});

test("donut animation pauses, resumes, and reacts to reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = page.locator("figure pre");
  const initial = await art.textContent();
  await expect.poll(() => art.textContent()).not.toBe(initial);
  await page.getByRole("button", { name: "Pause donut animation" }).click();
  const paused = await art.textContent();
  await page.waitForTimeout(200);
  expect(await art.textContent()).toBe(paused);
  const play = page.getByRole("button", { name: "Play donut animation" });
  await play.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => art.textContent()).not.toBe(paused);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Pause donut animation" })).toBeHidden();
  const reduced = await art.textContent();
  await page.waitForTimeout(200);
  expect(await art.textContent()).toBe(reduced);
});

test("donut sits beside the copy on desktop and below it on phones", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const title = await page.locator("#hero-title").boundingBox();
    const donut = await page.locator("figure").boundingBox();
    const action = await page.getByRole("link", { name: "Explore my work" }).boundingBox();
    if (width > 760) expect(donut!.x).toBeGreaterThan(title!.x + title!.width);
    else expect(donut!.y).toBeGreaterThan(action!.y + action!.height);
    const headlineLines = await page.locator("#hero-title").evaluate((element) =>
      element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight),
    );
    expect(headlineLines).toBeLessThanOrEqual(2.1);
  }
});

test("projects filter and all-work reset work without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Apoorav Malik/);
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Web development" }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card h3")).toHaveText("InsightDuck");
  await page.getByRole("button", { name: "AI & tools" }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.getByRole("button", { name: "All work" }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page).toHaveURL(/#work$/);
  expect(errors).toEqual([]);
});

test("theme choice persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test.describe("theme switching with motion enabled", () => {
  test.use({ reducedMotion: "no-preference" });

  for (const failure of ["throws", "stalls"] as const) {
    test(`theme still changes when the browser transition ${failure}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript((mode) => {
        Object.defineProperty(document, "startViewTransition", {
          configurable: true,
          value: () => {
            if (mode === "throws") throw new Error("Transition unavailable");
            return {
              ready: new Promise(() => {}),
              finished: new Promise(() => {}),
              skipTransition() {},
            };
          },
        });
      }, failure);
      await page.goto("/");
      await page.getByRole("button", { name: "Switch to dark theme" }).click();
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(27, 29, 26)", { timeout: 1500 });
      await expect(page.locator(".theme-button")).toHaveAttribute("aria-pressed", "true");
      await page.reload();
      const toggle = page.getByRole("button", { name: "Switch to light theme" });
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 249, 246)", { timeout: 1500 });
      expect(errors).toEqual([]);
    });
  }

  test("rapid presses apply the latest choice and leave the control usable", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.locator(".theme-button").click({ clickCount: 3, delay: 35 });
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(27, 29, 26)");
    await expect(page.locator(".theme-button")).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 249, 246)");
    await page.reload();
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test("mobile navigation opens, navigates, and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav).toBeHidden();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(nav).toBeHidden();
});

test("content fits phone, tablet, and desktop viewports", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(
      scrollWidth,
      `horizontal overflow at ${width}px`,
    ).toBeLessThanOrEqual(width);
    if (width < 560) {
      const heading = await page.locator("#about-heading").boundingBox();
      const signature = await page.locator(".about-signature").boundingBox();
      expect(signature!.y).toBeGreaterThan(heading!.y + heading!.height);
    }
  }
});

test("project and contact links use the supplied public profiles", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".contact-panel .button")).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/apoorav-malik/",
  );
  await expect(page.locator(".contact-socials a")).toHaveCount(3);
  const links = page.locator('a[target="_blank"]');
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAttribute("href", /^https:\/\//);
  }
});
