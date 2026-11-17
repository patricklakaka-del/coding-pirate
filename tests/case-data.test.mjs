import { describe, expect, it } from "vitest";
import { rarityTiers, rollCaseDrop } from "../src/case-data.ts";

describe("Recoil Case drop table", () => {
  it("uses the standard case rarity probabilities and a glove-only rare item pool", () => {
    expect(rarityTiers.reduce((sum, tier) => sum + tier.chance, 0)).toBeCloseTo(100);
    expect(rarityTiers.map((tier) => tier.chance)).toEqual([79.92, 15.98, 3.2, 0.64, 0.26]);
    expect(rarityTiers.map((tier) => tier.items.length)).toEqual([7, 4, 3, 2, 4]);
    const rareSpecial = rarityTiers.find((tier) => tier.id === "rare-special");
    expect(rareSpecial?.items.every(({ weapon }) => /(?:gloves|wraps)$/i.test(weapon))).toBe(true);
  });

  it.each([
    [0.7991, "mil-spec"],
    [0.7993, "restricted"],
    [0.9591, "classified"],
    [0.9911, "covert"],
    [0.9975, "rare-special"],
  ])("selects the correct rarity for random value %s", (randomValue, rarityId) => {
    const drop = rollCaseDrop(() => randomValue);

    expect(drop.rarity.id).toBe(rarityId);
    expect(drop.rarity.items).toContain(drop.item);
  });

  it.each([-0.01, 1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid random values: %s",
    (randomValue) => {
      expect(() => rollCaseDrop(() => randomValue)).toThrow(RangeError);
    },
  );
});
