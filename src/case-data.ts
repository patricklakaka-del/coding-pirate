export type RarityId = "mil-spec" | "restricted" | "classified" | "covert" | "rare-special";

export interface CaseItem {
  weapon: string;
  name: string;
}

export interface RarityTier {
  id: RarityId;
  label: string;
  chance: number;
  items: CaseItem[];
}

export interface CaseDrop {
  rarity: RarityTier;
  item: CaseItem;
}

export const rarityTiers: RarityTier[] = [
  {
    id: "mil-spec",
    label: "Mil-Spec",
    chance: 79.92,
    items: [
      { weapon: "Glock-18", name: "Winterized" },
      { weapon: "M249", name: "Downtown" },
      { weapon: "MP5-SD", name: "Kitbash" },
      { weapon: "P90", name: "Vent Rush" },
      { weapon: "R8 Revolver", name: "Crazy 8" },
      { weapon: "SG 553", name: "Dragon Tech" },
      { weapon: "UMP-45", name: "Roadblock" },
    ],
  },
  {
    id: "restricted",
    label: "Restricted",
    chance: 15.98,
    items: [
      { weapon: "Dual Berettas", name: "Flora Carnivora" },
      { weapon: "FAMAS", name: "Meow 36" },
      { weapon: "Galil AR", name: "Destroyer" },
      { weapon: "MAC-10", name: "Monkeyflage" },
    ],
  },
  {
    id: "classified",
    label: "Classified",
    chance: 3.2,
    items: [
      { weapon: "AK-47", name: "Ice Coaled" },
      { weapon: "P250", name: "Visions" },
      { weapon: "Sawed-Off", name: "Kiss♥Love" },
    ],
  },
  {
    id: "covert",
    label: "Covert",
    chance: 0.64,
    items: [
      { weapon: "AWP", name: "Chromatic Aberration" },
      { weapon: "USP-S", name: "Printstream" },
    ],
  },
  {
    id: "rare-special",
    label: "Rare special item",
    chance: 0.26,
    items: [
      { weapon: "Specialist Gloves", name: "Tiger Strike" },
      { weapon: "Driver Gloves", name: "Black Tie" },
      { weapon: "Sport Gloves", name: "Big Game" },
      { weapon: "Moto Gloves", name: "3rd Commando Company" },
    ],
  },
];

export function rollCaseDrop(random: () => number = Math.random): CaseDrop {
  const rarityRoll = random();
  if (!Number.isFinite(rarityRoll) || rarityRoll < 0 || rarityRoll >= 1) {
    throw new RangeError("The random source must return a value from 0 to less than 1.");
  }

  const percentile = rarityRoll * 100;
  let cumulativeChance = 0;
  const rarity = rarityTiers.find((tier) => {
    cumulativeChance += tier.chance;
    return percentile < cumulativeChance;
  });
  if (!rarity) {
    throw new Error("The case rarity probabilities do not cover the random roll.");
  }

  const itemRoll = random();
  if (!Number.isFinite(itemRoll) || itemRoll < 0 || itemRoll >= 1) {
    throw new RangeError("The random source must return a value from 0 to less than 1.");
  }

  const item = rarity.items[Math.floor(itemRoll * rarity.items.length)];
  if (!item) throw new Error(`The ${rarity.label} tier does not contain any items.`);

  return { rarity, item };
}
