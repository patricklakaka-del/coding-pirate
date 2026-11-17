import "./style.css";
import { rarityTiers, rollCaseDrop, type CaseDrop } from "./case-data";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("The page is missing its #app main element.");

const allItems = rarityTiers.flatMap((tier) => tier.items.map((item) => ({ item, rarity: tier })));

function itemCard(drop: CaseDrop, compact = false): string {
  const weaponClass = drop.item.weapon
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const finishClass = drop.item.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const isGloves = /gloves|wraps/i.test(drop.item.weapon);
  const glovePhoto = drop.item.weapon.startsWith("Specialist Gloves")
    ? "glove-specialist"
    : drop.item.weapon.startsWith("Driver Gloves")
      ? "glove-driver"
      : drop.item.weapon.startsWith("Sport Gloves")
        ? "glove-sport"
        : drop.item.weapon.startsWith("Moto Gloves")
          ? "glove-moto"
          : drop.item.weapon.startsWith("Hand Wraps")
            ? "glove-wraps"
            : "glove-sport";
  const photo = isGloves ? glovePhoto : weaponClass;

  return `
    <article class="drop-card rarity-${drop.rarity.id} skin-${finishClass}${compact ? " drop-card-compact" : ""}">
      <div class="item-art" aria-hidden="true">
        <img class="skin-photo weapon-${weaponClass}${isGloves ? " glove-photo" : ""}" src="./skins/${photo}.png" alt="" draggable="false" />
      </div>
      <div class="item-meta">
        <span class="item-weapon">${drop.item.weapon}</span>
        <strong>${drop.item.name}</strong>
        <span class="item-rarity">${drop.rarity.label}</span>
      </div>
    </article>`;
}

function renderLootPool(): string {
  return rarityTiers
    .map(
      (tier) => `
        <section class="pool-tier rarity-${tier.id}" aria-labelledby="tier-${tier.id}">
          <div class="pool-tier-heading">
            <h3 id="tier-${tier.id}">${tier.label}</h3>
            <span>${tier.items.length} ${tier.items.length === 1 ? "item" : "items"}</span>
          </div>
          <div class="pool-grid">
            ${tier.items.map((item) => itemCard({ item, rarity: tier }, true)).join("")}
          </div>
        </section>`,
    )
    .join("");
}

function renderOdds(): string {
  return rarityTiers
    .map(
      (tier) => `
        <div class="odds-row rarity-${tier.id}">
          <span class="odds-name"><i aria-hidden="true"></i>${tier.label}</span>
          <span class="odds-bar" aria-hidden="true"><i style="width: ${tier.chance}%"></i></span>
          <strong>${tier.chance.toFixed(tier.chance < 1 ? 2 : tier.chance % 1 ? 2 : 0)}%</strong>
        </div>`,
    )
    .join("");
}

app.innerHTML = `
  <div class="site-shell">
    <header class="topbar">
      <a class="wordmark" href="#top" aria-label="Case Lab home">
        <span class="wordmark-icon" aria-hidden="true"><span>C</span></span>
        <span>CASE<span class="wordmark-accent">LAB</span></span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#opening">Open case</a>
        <a href="#loot-pool">Loot pool</a>
        <a href="#odds">Drop odds</a>
      </nav>
      <span class="simulator-badge"><i aria-hidden="true"></i>SIMULATOR</span>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow"><span>COUNTER-STRIKE 2 CASE SIMULATOR</span><span class="eyebrow-line"></span></p>
          <h1 id="page-title">The Recoil Case.<br /><span>Just one more.</span></h1>
          <p class="hero-description">Explore the Recoil Case drop pool and odds in a free, no-stakes simulator. No keys, no purchases, just the spin.</p>
          <a class="text-link" href="#odds">See the drop odds <span aria-hidden="true">↘</span></a>
        </div>
        <div class="case-visual" aria-hidden="true">
          <div class="case-aura"></div>
          <div class="case-orbit case-orbit-one"></div>
          <div class="case-orbit case-orbit-two"></div>
          <img class="case-photo" src="./skins/recoil-case.png" alt="" />
          <span class="visual-caption">COLLECTION 01 <span>—</span> 2022</span>
        </div>
        <div class="hero-index" aria-hidden="true"><span>01</span> / CASE SERIES</div>
      </section>

      <section class="opening-section" id="opening" aria-labelledby="opening-title">
        <div class="section-title">
          <div>
            <p class="eyebrow">THE DROP</p>
            <h2 id="opening-title">Take your shot</h2>
          </div>
          <span class="section-note">RECOIL CASE <span>·</span> FREE SIMULATION</span>
        </div>
        <div class="opening-panel">
          <div class="reel-marker" aria-hidden="true"></div>
          <div
            class="reel-viewport"
            id="reel-viewport"
            role="img"
            aria-label="Animated case roulette. The result is announced after the spin."
          >
            <div class="reel-track" id="reel-track" aria-hidden="true"></div>
          </div>
          <div class="opening-controls">
            <button class="open-button" id="open-case" type="button">
              <span class="button-icon" aria-hidden="true">↗</span>
              <span class="button-label">Open the case</span>
            </button>
            <p>Free to try <span>·</span> No real items or money</p>
          </div>
          <div class="drop-result" id="drop-result" role="status" aria-live="polite">
            <span class="result-indicator" aria-hidden="true"></span>
            Your next drop is waiting.
          </div>
        </div>
        <div class="recent-section">
          <div class="recent-heading"><h3>Latest drops</h3><span>THIS SESSION</span></div>
          <div class="recent-list" id="recent-list"><p class="recent-empty">Open a case to start your drop history.</p></div>
        </div>
      </section>

      <section class="odds-section" id="odds" aria-labelledby="odds-title">
        <div class="section-title">
          <div>
            <p class="eyebrow">KNOW THE NUMBERS</p>
            <h2 id="odds-title">Drop odds</h2>
          </div>
          <span class="section-note">STANDARD CASE RARITY ODDS</span>
        </div>
        <div class="odds-panel">
          <div class="odds-list">${renderOdds()}</div>
          <p class="odds-disclaimer">Odds shown are the commonly published CS case rarity probabilities. Items within each rarity tier are selected evenly for this simulation; wear, float, and StatTrak variations are not modeled.</p>
        </div>
      </section>

      <section class="loot-section" id="loot-pool" aria-labelledby="loot-title">
        <div class="section-title">
          <div>
            <p class="eyebrow">INSIDE THE CASE</p>
            <h2 id="loot-title">The loot pool</h2>
          </div>
          <span class="section-note">${allItems.length} POSSIBLE DROPS</span>
        </div>
        <div class="loot-pool">${renderLootPool()}</div>
      </section>
    </main>

    <footer class="footer">
      <a class="wordmark" href="#top"><span class="wordmark-icon" aria-hidden="true"><span>C</span></span><span>CASE<span class="wordmark-accent">LAB</span></span></a>
      <p>Community-made case simulator. Not affiliated with Valve or Counter-Strike.</p>
      <a href="#top">BACK TO TOP ↑</a>
    </footer>
  </div>`;

let isOpening = false;
const recentDrops: CaseDrop[] = [];
const openingDuration = 5200;

app.addEventListener("click", (event) => {
  if (!(event.target instanceof Element) || !event.target.closest("#open-case")) return;
  if (isOpening) return;

  const button = app.querySelector<HTMLButtonElement>("#open-case");
  const track = app.querySelector<HTMLElement>("#reel-track");
  const viewport = app.querySelector<HTMLElement>("#reel-viewport");
  const result = app.querySelector<HTMLElement>("#drop-result");
  const recentList = app.querySelector<HTMLElement>("#recent-list");
  const buttonLabel = button?.querySelector<HTMLSpanElement>(".button-label");
  if (!button || !buttonLabel || !track || !viewport || !result || !recentList) {
    throw new Error("The case simulator is missing an opening control.");
  }

  isOpening = true;
  button.disabled = true;
  buttonLabel.textContent = "Opening...";
  result.innerHTML =
    '<span class="result-indicator" aria-hidden="true"></span>Rolling for your drop…';

  const winningDrop = rollCaseDrop();
  const winningIndex = 26;
  const reelDrops = Array.from({ length: 36 }, (_, index) =>
    index === winningIndex ? winningDrop : rollCaseDrop(),
  );
  track.innerHTML = reelDrops.map((drop) => itemCard(drop, true)).join("");
  track.style.transition = "none";
  track.style.transform = "translateX(0)";

  const winningCard = track.children[winningIndex] as HTMLElement | undefined;
  if (!winningCard) throw new Error("The case roulette could not render its winning drop.");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finishOpening = () => {
    isOpening = false;
    button.disabled = false;
    buttonLabel.textContent = "Open the case";
    result.innerHTML = `
      <span class="result-indicator" aria-hidden="true"></span>
      <span class="result-copy">YOU UNBOXED</span>
      ${itemCard(winningDrop, true)}`;
    recentDrops.unshift(winningDrop);
    recentDrops.splice(5);
    recentList.innerHTML = recentDrops.map((drop) => itemCard(drop, true)).join("");
  };

  if (reducedMotion) {
    finishOpening();
    return;
  }

  const offset = viewport.clientWidth / 2 - (winningCard.offsetLeft + winningCard.offsetWidth / 2);
  window.requestAnimationFrame(() => {
    track.style.transition = `transform ${openingDuration}ms cubic-bezier(0.42, 0, 0.58, 1)`;
    track.style.transform = `translateX(${offset}px)`;
  });
  window.setTimeout(finishOpening, openingDuration + 100);
});
