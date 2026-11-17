import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe("Recoil Case simulator entry point", () => {
  it("renders the case simulator and installs its opening interaction", async () => {
    const app = { innerHTML: "", addEventListener: vi.fn() };
    const querySelector = vi.fn(() => app);
    vi.stubGlobal("document", { querySelector });

    await import("../src/main.ts");

    expect(querySelector).toHaveBeenCalledWith("#app");
    expect(app.innerHTML).toContain("COUNTER-STRIKE 2 CASE SIMULATOR");
    expect(app.innerHTML).toContain("The loot pool");
    expect(app.innerHTML).toContain("Drop odds");
    expect(app.innerHTML.match(/<img class="skin-photo/g)).toHaveLength(20);
    expect(app.innerHTML).toContain('src="./skins/recoil-case.png"');
    expect(app.innerHTML).toContain('src="./skins/ak-47.png"');
    expect(app.innerHTML).toContain("skin-chromatic-aberration");
    expect(app.innerHTML).toContain('src="./skins/glove-specialist.png"');
    expect(app.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
  });

  it("explains a missing main element instead of silently rendering nothing", async () => {
    vi.stubGlobal("document", { querySelector: () => null });

    await expect(import("../src/main.ts")).rejects.toThrow(
      "The page is missing its #app main element.",
    );
  });
});
