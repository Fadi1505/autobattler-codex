const PLAYER_COUNT = 8;
const USER_ID = "player-1";
const MAX_MANA = 100;
const TICK_MS = 250;

const categories = {
  attack: {
    label: "Attack",
    short: "ATK",
    color: "#d95748",
    stat: (level) => `+${level * 5} damage`
  },
  mana: {
    label: "Mana",
    short: "MAN",
    color: "#5f91d8",
    stat: (level) => `+${level * 2} gain`
  },
  defense: {
    label: "Defense",
    short: "DEF",
    color: "#7fb069",
    stat: (level) => `+${level * 2} armor`
  },
  evasion: {
    label: "Evasion",
    short: "EVA",
    color: "#52b7b1",
    stat: (level) => `+${Math.round(level * 3.5)}% dodge`
  },
  critical: {
    label: "Critical",
    short: "CRT",
    color: "#f2b84b",
    stat: (level) => `+${Math.round(level * 4.5)}% crit`
  },
  shield: {
    label: "Shield",
    short: "SHD",
    color: "#c47adf",
    stat: (level) => `+${level * 17} shield`
  }
};

const categoryOrder = ["attack", "mana", "defense", "evasion", "critical", "shield"];

const rarityInfo = {
  common: { label: "Common", color: "#b6b1a9", weight: 56 },
  rare: { label: "Rare", color: "#5f91d8", weight: 30 },
  epic: { label: "Epic", color: "#c47adf", weight: 11 },
  legendary: { label: "Legendary", color: "#f2b84b", weight: 3 }
};

const rarityOrder = ["common", "rare", "epic", "legendary"];

const rarityBonuses = {
  common: { points: 0, cost: 0 },
  rare: { points: 1, cost: 1 },
  epic: { points: 2, cost: 2 },
  legendary: { points: 3, cost: 3 }
};

const heroes = [
  {
    id: "ember-ronin",
    name: "Ember Ronin",
    role: "Burst duelist",
    color: "#e45845",
    secondary: "#f2b84b",
    shape: "flame",
    tags: ["Attack", "Critical"],
    prefers: ["attack", "critical", "mana"],
    base: { hp: 165, attack: 25, interval: 1350, defense: 2, evasion: 0.04, crit: 0.12, shield: 0 },
    abilities: [
      {
        id: "kindled-blade",
        type: "passive",
        trigger: "On attack",
        name: "Kindled Blade",
        text: "Basic attacks can ignite the enemy for bonus fire damage.",
        tooltip: "35% chance on basic attack to deal bonus fire damage. Scales with Attack upgrades and grants a little mana."
      },
      {
        id: "meteor-chain",
        type: "ultimate",
        trigger: "100 mana",
        name: "Meteor Chain",
        text: "Crashes a defense-piercing fire strike, then burns again.",
        tooltip: "At 100 mana, deals heavy damage that ignores defense, then deals a smaller ignite hit if the enemy survives."
      }
    ]
  },
  {
    id: "tide-warden",
    name: "Tide Warden",
    role: "Shield anchor",
    color: "#4da8bc",
    secondary: "#8fd6c8",
    shape: "tide",
    tags: ["Shield", "Defense"],
    prefers: ["shield", "defense", "mana"],
    base: { hp: 190, attack: 19, interval: 1550, defense: 5, evasion: 0.02, crit: 0.06, shield: 24 },
    abilities: [
    {
      id: "foam-guard",
      type: "active",
      trigger: "Auto: 5s",
      name: "Foam Guard",
      text: "Auto-casts a shield and gains a small burst of mana.",
      tooltip: "Auto-casts about every 5 seconds. Gives Tide Warden a shield and bonus mana. Mana upgrades reduce this cooldown."
    },
    {
      id: "tidal-bastion",
      type: "ultimate",
      trigger: "100 mana",
      name: "Tidal Bastion",
      text: "Shields, heals, and sends a wave into the enemy.",
      tooltip: "At 100 mana, gains a large shield, heals, and damages the enemy. Scales best with Shield and Defense upgrades."
    }
    ]
  },
  {
    id: "night-veil",
    name: "Night Veil",
    role: "Dodge assassin",
    color: "#8d74df",
    secondary: "#52b7b1",
    shape: "veil",
    tags: ["Evasion", "Critical"],
    prefers: ["evasion", "critical", "attack"],
    base: { hp: 150, attack: 23, interval: 1120, defense: 1, evasion: 0.13, crit: 0.16, shield: 0 },
    abilities: [
    {
      id: "ghost-step",
      type: "passive",
      trigger: "On dodge",
      name: "Ghost Step",
      text: "Dodging primes a lethal counter and grants mana.",
      tooltip: "When Night Veil dodges, the next attack has bonus critical chance and Night Veil gains mana. Evasion upgrades make this trigger more often."
    },
    {
      id: "shadow-bloom",
      type: "ultimate",
      trigger: "100 mana",
      name: "Shadow Bloom",
      text: "Lands a defense-piercing ambush and becomes harder to hit.",
      tooltip: "At 100 mana, deals defense-piercing damage and gains a large temporary evasion boost."
    }
    ]
  },
  {
    id: "iron-saint",
    name: "Iron Saint",
    role: "Attrition tank",
    color: "#a4acb8",
    secondary: "#f2b84b",
    shape: "iron",
    tags: ["Defense", "Shield"],
    prefers: ["defense", "shield", "attack"],
    base: { hp: 205, attack: 18, interval: 1650, defense: 7, evasion: 0.01, crit: 0.04, shield: 18 },
    abilities: [
    {
      id: "tempered-vow",
      type: "active",
      trigger: "Auto: 5s",
      name: "Tempered Vow",
      text: "Auto-casts a heal and temporary armor vow.",
      tooltip: "Auto-casts about every 5 seconds. Heals Iron Saint and gives temporary defense. Mana upgrades reduce this cooldown."
    },
    {
      id: "judgment-bell",
      type: "ultimate",
      trigger: "100 mana",
      name: "Judgment Bell",
      text: "Strikes hard and restores health.",
      tooltip: "At 100 mana, damages the enemy and heals Iron Saint. Scales strongly with Defense upgrades."
    }
    ]
  },
  {
    id: "storm-oracle",
    name: "Storm Oracle",
    role: "Mana caster",
    color: "#5f91d8",
    secondary: "#f5f0e8",
    shape: "storm",
    tags: ["Mana", "Attack"],
    prefers: ["mana", "attack", "critical"],
    base: { hp: 158, attack: 20, interval: 1400, defense: 2, evasion: 0.05, crit: 0.08, shield: 0 },
    abilities: [
    {
      id: "static-read",
      type: "passive",
      trigger: "On attack",
      name: "Static Read",
      text: "Attacks can shock the enemy and accelerate mana.",
      tooltip: "40% chance on basic attack to gain extra mana and deal a small lightning hit. Mana upgrades improve both tempo and shock damage."
    },
    {
      id: "storm-verdict",
      type: "ultimate",
      trigger: "100 mana",
      name: "Storm Verdict",
      text: "Fires a chain of lightning hits.",
      tooltip: "At 100 mana, strikes the enemy four times with lightning. Scales with Mana upgrades."
    }
    ]
  },
  {
    id: "thorn-beast",
    name: "Thorn Beast",
    role: "Bruiser",
    color: "#7fb069",
    secondary: "#d95748",
    shape: "thorn",
    tags: ["Defense", "Attack"],
    prefers: ["defense", "attack", "shield"],
    base: { hp: 198, attack: 22, interval: 1500, defense: 4, evasion: 0.03, crit: 0.07, shield: 10 },
    abilities: [
    {
      id: "wild-momentum",
      type: "passive",
      trigger: "On attack",
      name: "Wild Momentum",
      text: "Attacks can briefly increase attack speed.",
      tooltip: "28% chance on basic attack to gain Haste, reducing attack interval for a short time. Attack upgrades improve how often this matters."
    },
    {
      id: "granite-bash",
      type: "passive",
      trigger: "On attack",
      name: "Granite Bash",
      text: "Attacks can bash the enemy, delaying their next swing.",
      tooltip: "20% chance on basic attack to deal bonus damage and delay the enemy attack timer. Thorn Beast has no ultimate: its power is all passive uptime."
    }
    ]
  },
  {
    id: "prism-archer",
    name: "Prism Archer",
    role: "Crit striker",
    color: "#f2b84b",
    secondary: "#e45845",
    shape: "prism",
    tags: ["Critical", "Attack"],
    prefers: ["critical", "attack", "evasion"],
    base: { hp: 155, attack: 24, interval: 1200, defense: 1, evasion: 0.06, crit: 0.19, shield: 0 },
    abilities: [
    {
      id: "splinter-shot",
      type: "passive",
      trigger: "On crit",
      name: "Splinter Shot",
      text: "Critical hits can splinter for a second piercing hit.",
      tooltip: "When Prism Archer crits, there is a 45% chance to fire a bonus splinter hit. Scales with Critical upgrades."
    },
    {
      id: "solar-volley",
      type: "ultimate",
      trigger: "100 mana",
      name: "Solar Volley",
      text: "Releases five arrows that can critically strike.",
      tooltip: "At 100 mana, fires five quick arrows. Each arrow can crit, making Critical upgrades extremely valuable."
    }
    ]
  },
  {
    id: "void-alchemist",
    name: "Void Alchemist",
    role: "Mana denial",
    color: "#c47adf",
    secondary: "#52b7b1",
    shape: "void",
    tags: ["Mana", "Evasion"],
    prefers: ["mana", "evasion", "shield"],
    base: { hp: 170, attack: 19, interval: 1450, defense: 3, evasion: 0.07, crit: 0.08, shield: 8 },
    abilities: [
    {
      id: "null-siphon",
      type: "passive",
      trigger: "On attack",
      name: "Null Siphon",
      text: "Attacks can steal mana and convert it into damage.",
      tooltip: "35% chance on basic attack to drain enemy mana, gain mana, and deal bonus void damage based on the drained amount."
    },
    {
      id: "collapse-flask",
      type: "ultimate",
      trigger: "100 mana",
      name: "Collapse Flask",
      text: "Burns enemy mana and detonates it.",
      tooltip: "At 100 mana, burns enemy mana, gains a shield, and deals defense-piercing damage based on mana burned."
    }
    ]
  }
];

const cardPool = [
  { name: "Blade Contract", category: "attack", cost: 3, points: 1, text: "Adds a clean weapon rank." },
  { name: "Red Forge Edge", category: "attack", cost: 5, points: 2, text: "Doubles down on direct damage." },
  { name: "War Banner", category: "attack", cost: 7, points: 3, text: "Heavy attack growth." },
  { name: "Mystic Coil", category: "mana", cost: 3, points: 1, text: "Improves mana flow." },
  { name: "Blue Hourglass", category: "mana", cost: 5, points: 2, text: "Faster casts and more charge." },
  { name: "Oracle Engine", category: "mana", cost: 7, points: 3, text: "Big mana tempo." },
  { name: "Plate Oath", category: "defense", cost: 3, points: 1, text: "Adds armor and health." },
  { name: "Green Bulwark", category: "defense", cost: 5, points: 2, text: "Sturdier frontline scaling." },
  { name: "Citadel Mark", category: "defense", cost: 7, points: 3, text: "Massive armor growth." },
  { name: "Mirage Step", category: "evasion", cost: 3, points: 1, text: "Raises dodge chance." },
  { name: "Teal Feint", category: "evasion", cost: 5, points: 2, text: "Higher avoidance tempo." },
  { name: "Mist Crown", category: "evasion", cost: 7, points: 3, text: "Major evasion spike." },
  { name: "Razor Gem", category: "critical", cost: 3, points: 1, text: "Improves critical strikes." },
  { name: "Gold Lens", category: "critical", cost: 5, points: 2, text: "Sharper burst windows." },
  { name: "Execution Star", category: "critical", cost: 7, points: 3, text: "Large crit scaling." },
  { name: "Aegis Core", category: "shield", cost: 3, points: 1, text: "Starts each fight shielded." },
  { name: "Violet Ward", category: "shield", cost: 5, points: 2, text: "Thicker shield buffer." },
  { name: "Barrier Crown", category: "shield", cost: 7, points: 3, text: "Major shield growth." },
  { name: "Dragon King Relic", category: "attack", cost: 9, points: 4, rarity: "legendary", text: "A huge attack spike for closing rounds." },
  { name: "Astral Battery", category: "mana", cost: 9, points: 4, rarity: "legendary", text: "Turns your hero into an ultimate engine." },
  { name: "Titan Plate", category: "defense", cost: 9, points: 4, rarity: "legendary", text: "Massive late-game armor and health." },
  { name: "Phantom Crown", category: "evasion", cost: 9, points: 4, rarity: "legendary", text: "Elite dodge scaling for slippery builds." },
  { name: "Royal Execution Lens", category: "critical", cost: 9, points: 4, rarity: "legendary", text: "Huge crit scaling for burst builds." },
  { name: "Worldshell Aegis", category: "shield", cost: 9, points: 4, rarity: "legendary", text: "A massive shield package for tank builds." }
];

const aiNames = ["Mara", "Bex", "Olan", "Sera", "Kade", "Voss", "Nia"];

const state = {
  selectedHeroId: heroes[0].id,
  players: [],
  round: 1,
  gold: 14,
  shop: [],
  nextOpponentId: null,
  combat: null,
  timer: null,
  gameOver: false,
  shopLocked: false,
  lastResult: ""
};

const el = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  renderDraft();
});

function bindElements() {
  [
    "draftScreen", "gameScreen", "draftSlots", "heroGrid", "heroInspector",
    "playerPortrait", "playerName", "roundValue", "goldValue", "healthValue",
    "newGameBtn", "matchTitle", "fightBtn", "nextRoundBtn", "leftPortrait",
    "leftName", "leftShield", "leftHpBar", "leftManaBar", "rightPortrait",
    "rightName", "rightShield", "rightHpBar", "rightManaBar", "roundResult", "fxLayer",
    "combatAbilityGrid", "heroRole", "heroStatsGrid", "heroAbilityList",
    "roundSummary", "combatLog", "rerollBtn", "shopLockBtn", "shopGrid", "upgradeGrid", "powerValue",
    "standingsList", "aliveValue"
  ].forEach((id) => {
    el[id] = document.getElementById(id);
  });
}

function bindEvents() {
  el.fightBtn.addEventListener("click", startFight);
  el.nextRoundBtn.addEventListener("click", nextRound);
  el.rerollBtn.addEventListener("click", rerollShop);
  el.shopLockBtn.addEventListener("click", toggleShopLock);
  el.newGameBtn.addEventListener("click", resetToDraft);
  document.querySelectorAll(".mobile-game-nav button").forEach((button) => {
    button.addEventListener("click", () => scrollToPanel(button.dataset.scrollTarget));
  });
}

function renderDraft() {
  renderDraftSlots();
  el.heroGrid.innerHTML = heroes.map((hero) => `
    <button class="hero-card ${hero.id === state.selectedHeroId ? "selected" : ""}" data-hero-id="${hero.id}" style="--hero-color: ${hero.color}">
      <div class="hero-art">${heroSvg(hero)}</div>
      <h3>${hero.name}</h3>
      <p>${hero.role}</p>
      <div class="hero-tags">${hero.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    </button>
  `).join("");

  el.heroGrid.querySelectorAll(".hero-card").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedHeroId = button.dataset.heroId;
      renderDraft();
    });
  });

  renderHeroInspector(getHero(state.selectedHeroId));
}

function renderDraftSlots() {
  const selected = getHero(state.selectedHeroId);
  const slots = Array.from({ length: PLAYER_COUNT }, (_, index) => {
    const filled = index === 0;
    const bg = filled ? selected.color : "";
    const label = filled ? "YOU" : index + 1;
    return `<div class="draft-slot ${filled ? "filled" : ""}" style="${bg ? `background:${bg}` : ""}">${label}</div>`;
  });
  el.draftSlots.innerHTML = slots.join("");
}

function renderHeroInspector(hero) {
  el.heroInspector.style.setProperty("--hero-color", hero.color);
  const stats = calculateStats(hero, zeroUpgrades());
  el.heroInspector.innerHTML = `
    <div class="hero-art inspector-art">${heroSvg(hero)}</div>
    <h2>${hero.name}</h2>
    <p>${hero.role}</p>
    ${heroStatsMarkup(stats)}
    ${heroAbilitiesMarkup(hero)}
    <button id="startGameBtn" class="primary-button">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z"/></svg>
      Draft
    </button>
  `;
  document.getElementById("startGameBtn").addEventListener("click", () => startGame(hero.id));
}

function startGame(heroId) {
  const aiHeroIds = shuffle(heroes.filter((hero) => hero.id !== heroId).map((hero) => hero.id));
  state.players = [
    createPlayer(USER_ID, "You", heroId, true),
    ...aiNames.map((name, index) => createPlayer(`ai-${index + 1}`, name, aiHeroIds[index], false))
  ];
  state.round = 1;
  state.gold = 14;
  state.shop = generateShop();
  state.nextOpponentId = chooseOpponentId();
  state.combat = null;
  state.gameOver = false;
  state.shopLocked = false;
  state.lastResult = "";
  setScreen("game");
  renderGame();
}

function resetToDraft() {
  stopTimer();
  state.players = [];
  state.combat = null;
  state.gameOver = false;
  state.shopLocked = false;
  state.lastResult = "";
  setScreen("draft");
  renderDraft();
}

function setScreen(screen) {
  el.draftScreen.classList.toggle("active", screen === "draft");
  el.gameScreen.classList.toggle("active", screen === "game");
  document.body.dataset.screen = screen;
  window.scrollTo(0, 0);
  if (screen === "game") setActiveMobileNav("arenaPanel");
}

function createPlayer(id, name, heroId, isUser) {
  return {
    id,
    name,
    heroId,
    isUser,
    health: 30,
    alive: true,
    streak: 0,
    eliminatedRound: null,
    upgrades: Object.fromEntries(categoryOrder.map((category) => [category, 0]))
  };
}

function renderGame() {
  const player = getUser();
  const hero = getHero(player.heroId);
  const opponent = getOpponent();

  renderFighterPortrait(el.playerPortrait, hero, "header");
  el.playerName.textContent = hero.name;
  el.roundValue.textContent = state.round;
  el.goldValue.textContent = state.gold;
  el.healthValue.textContent = Math.max(0, player.health);
  el.aliveValue.textContent = `${state.players.filter((item) => item.alive).length} alive`;
  el.powerValue.textContent = `${Math.round(powerScore(player))} power`;
  el.matchTitle.textContent = opponent ? `You vs ${opponent.name}` : "Final";

  renderHeroDetails(player);
  renderShop();
  renderUpgrades();
  renderStandings();
  renderActionState();

  if (state.combat) {
    renderCombat();
  } else {
    renderIdleFighters();
  }
}

function renderActionState() {
  const inCombat = Boolean(state.combat && !state.combat.finished);
  const afterCombat = Boolean(state.combat && state.combat.finished);
  el.fightBtn.hidden = state.gameOver || inCombat || afterCombat;
  el.nextRoundBtn.hidden = state.gameOver || !afterCombat;
  el.rerollBtn.disabled = inCombat || afterCombat || state.gold < 2;
  el.shopLockBtn.disabled = inCombat || afterCombat || state.gameOver;
  el.shopLockBtn.classList.toggle("locked", state.shopLocked);
  el.shopLockBtn.title = state.shopLocked ? "Unlock shop" : "Lock shop";
  el.shopLockBtn.setAttribute("aria-label", state.shopLocked ? "Unlock shop" : "Lock shop");
}

function renderIdleFighters() {
  clearEffects();
  const player = getUser();
  const opponent = getOpponent();
  const leftStats = getStats(player);
  const rightStats = opponent ? getStats(opponent) : leftStats;

  const playerHero = getHero(player.heroId);
  renderFighterPortrait(el.leftPortrait, playerHero, "combat");
  applyFighterState(el.leftPortrait.parentElement, null);
  el.leftName.textContent = player.name;
  el.leftShield.textContent = leftStats.startShield;
  setBar(el.leftHpBar, 100);
  setBar(el.leftManaBar, 0);

  if (opponent) {
    renderFighterPortrait(el.rightPortrait, getHero(opponent.heroId), "combat");
    applyFighterState(el.rightPortrait.parentElement, null);
    el.rightName.textContent = opponent.name;
    el.rightShield.textContent = rightStats.startShield;
    setBar(el.rightHpBar, 100);
    setBar(el.rightManaBar, 0);
  }

  el.roundResult.textContent = state.lastResult || "VS";
  renderCombatAbilities(getHero(player.heroId), null);
  renderRoundSummary();
  syncArena3d();
  if (!state.combat) {
    el.combatLog.innerHTML = `<p><strong>Round ${state.round}</strong> prep phase.</p>`;
  }
}

function renderShop() {
  const disabled = state.gameOver || Boolean(state.combat);
  el.shopGrid.innerHTML = state.shop.map((card, index) => {
    const category = categories[card.category];
    const rarity = getCardRarity(card);
    const rarityMeta = rarityInfo[rarity];
    const cannotBuy = disabled || state.gold < card.cost;
    return `
      <button class="shop-card rarity-${rarity}" data-card-index="${index}" ${cannotBuy ? "disabled" : ""} style="--category-color: ${category.color}; --rarity-color: ${rarityMeta.color}">
        <div class="shop-card-header">
          <div>
            <span class="rarity-label">${rarityMeta.label}</span>
            <h3>${card.name}</h3>
          </div>
          <span class="cost">${card.cost}</span>
        </div>
        <p>${card.text}</p>
        <div class="category-row">
          <span class="category-chip">${category.short}</span>
          <span class="points">+${card.points}</span>
        </div>
      </button>
    `;
  }).join("");

  el.shopGrid.querySelectorAll(".shop-card").forEach((button) => {
    button.addEventListener("click", () => buyCard(Number(button.dataset.cardIndex)));
  });
}

function renderUpgrades() {
  const player = getUser();
  el.upgradeGrid.innerHTML = categoryOrder.map((id) => {
    const category = categories[id];
    const level = player.upgrades[id];
    return `
      <div class="upgrade-tile" style="--category-color: ${category.color}">
        <span>${category.label}</span>
        <strong>${level}</strong>
        <div class="upgrade-track"><i style="width: ${Math.min(100, (level % 5) * 20)}%"></i></div>
        <span>${category.stat(level)}</span>
      </div>
    `;
  }).join("");
}

function renderStandings() {
  const sorted = [...state.players].sort((a, b) => {
    if (a.alive !== b.alive) return a.alive ? -1 : 1;
    if (a.health !== b.health) return b.health - a.health;
    return powerScore(b) - powerScore(a);
  });

  el.standingsList.innerHTML = sorted.map((player, index) => {
    const hero = getHero(player.heroId);
    return `
      <div class="standing-row ${player.isUser ? "you" : ""} ${player.alive ? "" : "eliminated"}" style="--hero-color: ${hero.color}; --hero-secondary: ${hero.secondary}">
        <span class="standing-rank" style="background:${player.isUser ? categories.critical.color : hero.color}">${index + 1}</span>
        <span class="standing-avatar">${heroMiniSprite(hero)}</span>
        <span class="standing-name">
          <strong>${player.name}</strong>
          <span>${hero.name}</span>
        </span>
        <span class="standing-health">${Math.max(0, player.health)}</span>
      </div>
    `;
  }).join("");
}

function renderHeroDetails(player) {
  const hero = getHero(player.heroId);
  const stats = getStats(player);
  el.heroRole.textContent = hero.role;
  el.heroStatsGrid.innerHTML = heroStatItems(stats).map((item) => `
    <div class="hero-stat tooltip-target" tabindex="0" data-tooltip="${escapeAttr(item.tooltip)}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `).join("");
  el.heroAbilityList.innerHTML = hero.abilities.map((ability) => abilityCardMarkup(ability, "compact")).join("");
}

function renderCombatAbilities(hero, unit) {
  if (!el.combatAbilityGrid) return;
  el.combatAbilityGrid.innerHTML = hero.abilities.map((ability) => {
    const progress = abilityProgress(ability, unit);
    return `
      <div class="ability-tile ${ability.type} tooltip-target" tabindex="0" data-tooltip="${escapeAttr(ability.tooltip || ability.text)}">
        <span>${abilityTypeLabel(ability)}</span>
        <strong>${ability.name}</strong>
        <p>${ability.text}</p>
        <div class="cooldown ${progress.mode}"><span style="width: ${progress.value}%"></span></div>
      </div>
    `;
  }).join("");
}

function renderRoundSummary() {
  if (!el.roundSummary) return;
  const player = getUser();
  const income = incomeForRound();
  if (state.gameOver) {
    el.roundSummary.innerHTML = `
      <div class="summary-card ${player.alive ? "victory" : "defeat"}">
        <strong>${state.lastResult}</strong>
        <span>${player.alive ? "You outlasted the lobby." : "Your hero was eliminated."}</span>
      </div>
    `;
    return;
  }
  if (state.combat && !state.combat.finished) {
    const leftMana = Math.round(state.combat.left.mana);
    const rightMana = Math.round(state.combat.right.mana);
    el.roundSummary.innerHTML = `
      <div class="summary-card combat">
        <strong>Combat Live</strong>
        <span>Abilities fire automatically. Mana: you ${leftMana}/100, ${state.combat.right.player.name} ${rightMana}/100.</span>
      </div>
    `;
    return;
  }
  if (state.combat?.finished) {
    const resultClass = state.lastResult === "Victory" ? "victory" : "defeat";
    const damage = roundDamage();
    const combatOpponent = state.combat.right.player;
    const target = state.lastResult === "Victory" ? `${combatOpponent.name} lost ${damage} health` : `You lost ${damage} health`;
    el.roundSummary.innerHTML = `
      <div class="summary-card ${resultClass}">
        <strong>${state.lastResult}</strong>
        <span>${target}. Next round income: +${income} gold.</span>
      </div>
    `;
    return;
  }
  const opponent = getOpponent();
  const lockText = state.shopLocked ? "Shop is locked and will stay for next round." : "Lock the shop if you want to keep these cards.";
  el.roundSummary.innerHTML = `
    <div class="summary-card prep">
      <strong>Prep Phase</strong>
      <span>Buy cards, then fight ${opponent ? opponent.name : "the final opponent"}. ${lockText}</span>
    </div>
  `;
}

function heroStatsMarkup(stats) {
  return `<div class="hero-stats-grid inspector-stats">${heroStatItems(stats).map((item) => `
    <div class="hero-stat tooltip-target" tabindex="0" data-tooltip="${escapeAttr(item.tooltip)}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `).join("")}</div>`;
}

function heroAbilitiesMarkup(hero) {
  return `<div class="ability-list">${hero.abilities.map((ability) => abilityCardMarkup(ability)).join("")}</div>`;
}

function abilityCardMarkup(ability, variant = "") {
  return `
    <div class="ability-row ${ability.type} ${variant} tooltip-target" tabindex="0" data-tooltip="${escapeAttr(ability.tooltip || ability.text)}">
      <span>${abilityTypeLabel(ability)}</span>
      <strong>${ability.name}</strong>
      <p>${ability.text}</p>
    </div>
  `;
}

function heroStatItems(stats) {
  return [
    { label: "HP", value: stats.maxHp, tooltip: "Maximum health at the start of each duel." },
    { label: "Attack", value: stats.attack, tooltip: "Base damage dealt by each basic attack before defense." },
    { label: "Speed", value: `${(1000 / stats.interval).toFixed(2)}/s`, tooltip: "Approximate attacks per second. Lower interval means faster attacks." },
    { label: "Armor", value: stats.defense, tooltip: "Flat damage reduction against most hits." },
    { label: "Dodge", value: `${Math.round(stats.evasion * 100)}%`, tooltip: "Chance to avoid basic attacks and dodgeable effects." },
    { label: "Crit", value: `${Math.round(stats.crit * 100)}%`, tooltip: "Chance for basic attacks and some skills to critically strike." },
    { label: "Mana", value: `+${stats.manaGain}`, tooltip: "Mana gained when attacking. Ultimates cast at 100 mana." },
    { label: "Shield", value: stats.startShield, tooltip: "Starting shield at the beginning of combat." }
  ];
}

function abilityProgress(ability, unit) {
  if (!unit) return { value: ability.type === "passive" ? 100 : 0, mode: ability.type };
  if (ability.type === "active") {
    return {
      value: 100 - (unit.activeTimer / unit.stats.activeCooldown) * 100,
      mode: "active"
    };
  }
  if (ability.type === "ultimate") return { value: unit.mana, mode: "ultimate" };
  return { value: 100, mode: "passive" };
}

function abilityTypeLabel(ability) {
  const labels = {
    passive: "Passive",
    active: "Active",
    ultimate: "Ultimate"
  };
  return `${labels[ability.type] || ability.type} - ${ability.trigger}`;
}

function buyCard(index) {
  if (state.combat || state.gameOver) return;
  const card = state.shop[index];
  if (!card || state.gold < card.cost) {
    showToast("Need more gold");
    return;
  }
  const player = getUser();
  state.gold -= card.cost;
  player.upgrades[card.category] += card.points;
  state.shop[index] = randomCard();
  renderGame();
}

function rerollShop() {
  if (state.combat || state.gameOver) return;
  if (state.gold < 2) {
    showToast("Need 2 gold");
    return;
  }
  state.gold -= 2;
  state.shop = generateShop();
  state.shopLocked = false;
  renderGame();
}

function toggleShopLock() {
  if (state.combat || state.gameOver) return;
  state.shopLocked = !state.shopLocked;
  showToast(state.shopLocked ? "Shop locked" : "Shop unlocked");
  renderActionState();
  renderRoundSummary();
}

function scrollToPanel(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  setActiveMobileNav(targetId);
  const headerOffset = window.matchMedia("(max-width: 760px)").matches ? 96 : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo(0, Math.max(0, top));
}

function setActiveMobileNav(targetId) {
  document.querySelectorAll(".mobile-game-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.scrollTarget === targetId);
  });
}

function startFight() {
  if (state.gameOver || state.combat) return;
  const opponent = getOpponent();
  if (!opponent) {
    finishGame(true);
    return;
  }

  state.lastResult = "";
  state.combat = {
    elapsed: 0,
    finished: false,
    logs: [],
    left: createUnit(getUser(), "left"),
    right: createUnit(opponent, "right")
  };
  clearEffects();
  addLog(`<strong>Round ${state.round}</strong>: ${getUser().name} faces ${opponent.name}.`);
  renderGame();

  stopTimer();
  state.timer = window.setInterval(tickCombat, TICK_MS);
}

function createUnit(player, side) {
  const hero = getHero(player.heroId);
  const stats = getStats(player);
  return {
    player,
    hero,
    side,
    stats,
    hp: stats.maxHp,
    shield: stats.startShield,
    mana: 0,
    attackTimer: 650,
    activeTimer: hasActiveAbility(hero) ? stats.activeCooldown : 0,
    pose: "idle",
    poseUntil: 0,
    buffs: {
      focus: false,
      haste: false,
      hasteTimer: 0,
      evasion: 0,
      evasionTimer: 0,
      defense: 0,
      defenseTimer: 0
    }
  };
}

function tickCombat() {
  const combat = state.combat;
  if (!combat || combat.finished) return;

  combat.elapsed += TICK_MS;
  tickBuffs(combat.left);
  tickBuffs(combat.right);
  tickUnit(combat.left, combat.right);
  if (!isAlive(combat.right)) return finishCombat("left");
  tickUnit(combat.right, combat.left);
  if (!isAlive(combat.left)) return finishCombat("right");

  if (combat.elapsed >= 65000) {
    const leftRatio = combat.left.hp / combat.left.stats.maxHp;
    const rightRatio = combat.right.hp / combat.right.stats.maxHp;
    finishCombat(leftRatio >= rightRatio ? "left" : "right");
    return;
  }

  renderCombat();
}

function tickBuffs(unit) {
  if (unit.buffs.hasteTimer > 0) {
    unit.buffs.hasteTimer -= TICK_MS;
    if (unit.buffs.hasteTimer <= 0) unit.buffs.haste = false;
  }
  if (unit.buffs.evasionTimer > 0) {
    unit.buffs.evasionTimer -= TICK_MS;
    if (unit.buffs.evasionTimer <= 0) unit.buffs.evasion = 0;
  }
  if (unit.buffs.defenseTimer > 0) {
    unit.buffs.defenseTimer -= TICK_MS;
    if (unit.buffs.defenseTimer <= 0) unit.buffs.defense = 0;
  }
}

function tickUnit(unit, enemy) {
  if (hasActiveAbility(unit.hero)) unit.activeTimer -= TICK_MS;
  unit.attackTimer -= TICK_MS;

  if (hasActiveAbility(unit.hero) && unit.activeTimer <= 0) {
    unit.activeTimer += unit.stats.activeCooldown;
    castActive(unit, enemy);
    if (!isAlive(enemy)) return;
  }

  if (hasUltimateAbility(unit.hero) && unit.mana >= MAX_MANA) {
    unit.mana -= MAX_MANA;
    castUltimate(unit, enemy);
    if (!isAlive(enemy)) return;
  }

  if (unit.attackTimer <= 0) {
    unit.attackTimer += attackInterval(unit);
    basicAttack(unit, enemy);
  }
}

function attackInterval(unit) {
  return Math.round(unit.stats.interval * (unit.buffs.haste ? 0.64 : 1));
}

function basicAttack(unit, enemy) {
  setUnitPose(unit, "attacking", 430);
  flash(unit.side, "attacking");
  playStrikeEffect(unit, enemy);
  const result = dealDamage(unit, enemy, unit.stats.attack, {
    label: "attacks",
    canCrit: true,
    canDodge: true,
    mana: unit.stats.manaGain
  });
  applyAttackPassives(unit, enemy, result);
}

function applyAttackPassives(unit, enemy, damage) {
  if (!isAlive(unit) || !isAlive(enemy) || damage <= 0) return;
  const upgrades = unit.player.upgrades;

  switch (unit.hero.id) {
    case "ember-ronin":
      if (Math.random() < 0.35) {
        addLog(`${unitLabel(unit)} triggers <strong>Kindled Blade</strong>.`);
        playProjectileEffect(unit, enemy, "fx-fire", unit.hero.color, unit.hero.secondary, 0, 480);
        dealDamage(unit, enemy, 10 + upgrades.attack * 2, { label: "ignites", mana: 4 });
      }
      break;
    case "storm-oracle":
      if (Math.random() < 0.4) {
        addLog(`${unitLabel(unit)} triggers <strong>Static Read</strong>.`);
        gainMana(unit, 10 + upgrades.mana);
        playBeamEffect(unit, enemy, unit.hero.color, unit.hero.secondary, 0);
        dealDamage(unit, enemy, 8 + upgrades.mana * 2, { label: "shocks", mana: 0 });
      }
      break;
    case "thorn-beast":
      if (Math.random() < 0.28) {
        addLog(`${unitLabel(unit)} triggers <strong>Wild Momentum</strong>.`);
        unit.buffs.haste = true;
        unit.buffs.hasteTimer = 2600 + upgrades.attack * 70;
        unit.attackTimer = Math.min(unit.attackTimer, Math.round(attackInterval(unit) * 0.45));
        setUnitPose(unit, "guarding", 520);
        playFloatText(unit.side, "HASTE", unit.hero.color, unit.hero.secondary);
      }
      if (isAlive(enemy) && Math.random() < 0.2) {
        addLog(`${unitLabel(unit)} triggers <strong>Granite Bash</strong>.`);
        enemy.attackTimer += 520 + upgrades.defense * 20;
        setUnitPose(enemy, "hit", 420);
        playImpactEffect(enemy, "critical", unit.hero.color, unit.hero.secondary);
        dealDamage(unit, enemy, 12 + upgrades.attack * 2 + upgrades.defense, { label: "bashes", mana: 6 });
        playFloatText(enemy.side, "BASH", unit.hero.color, unit.hero.secondary);
      }
      break;
    case "prism-archer":
      if (unit.lastHitCrit && Math.random() < 0.45) {
        addLog(`${unitLabel(unit)} triggers <strong>Splinter Shot</strong>.`);
        playProjectileEffect(unit, enemy, "fx-arrow", unit.hero.color, unit.hero.secondary, 0, 420);
        dealDamage(unit, enemy, 12 + upgrades.critical * 3, {
          label: "splinters",
          ignoreDefense: true,
          mana: 6
        });
      }
      break;
    case "void-alchemist":
      if (Math.random() < 0.35) {
        const drained = Math.min(enemy.mana, 12 + upgrades.mana);
        enemy.mana -= drained;
        gainMana(unit, 8 + drained);
        addLog(`${unitLabel(unit)} triggers <strong>Null Siphon</strong> and drains ${Math.round(drained)} mana.`);
        playPlacedEffect("fx-vortex", enemy.side, unit.hero.color, unit.hero.secondary, 560, 0);
        dealDamage(unit, enemy, 9 + drained * 0.45 + upgrades.mana, { label: "siphons", mana: 0 });
      }
      break;
  }
}

function applyDodgePassives(unit, enemy) {
  if (unit.hero.id !== "night-veil") return;
  addLog(`${unitLabel(unit)} triggers <strong>Ghost Step</strong>.`);
  unit.buffs.focus = true;
  gainMana(unit, 12 + unit.player.upgrades.mana);
  playFloatText(unit.side, "GHOST STEP", unit.hero.color, unit.hero.secondary);
  if (enemy) enemy.attackTimer += 140;
}

function castActive(unit, enemy) {
  const upgrades = unit.player.upgrades;
  const ability = getActiveAbility(unit.hero);
  if (!ability) return;
  setUnitPose(unit, "casting", 680);
  flash(unit.side, "casting");
  playCastName(unit, ability.name, false);
  playHeroEffect("active", unit, enemy);

  switch (unit.hero.id) {
    case "tide-warden":
      addLog(`${unitLabel(unit)} auto-casts <strong>${ability.name}</strong>.`);
      gainShield(unit, 26 + upgrades.shield * 5);
      gainMana(unit, 8);
      break;
    case "iron-saint":
      addLog(`${unitLabel(unit)} auto-casts <strong>${ability.name}</strong>.`);
      heal(unit, 14 + upgrades.defense * 3);
      unit.buffs.defense = 4 + upgrades.defense;
      unit.buffs.defenseTimer = 2800;
      gainMana(unit, 7);
      break;
  }
}

function castUltimate(unit, enemy) {
  const upgrades = unit.player.upgrades;
  const ability = getUltimateAbility(unit.hero);
  if (!ability) return;
  setUnitPose(unit, "casting", 920);
  flash(unit.side, "casting");
  addLog(`${unitLabel(unit)} unleashes <strong>${ability.name}</strong>.`);
  playCastName(unit, ability.name, true);
  playHeroEffect("ultimate", unit, enemy);

  switch (unit.hero.id) {
    case "ember-ronin":
      dealDamage(unit, enemy, 72 + upgrades.attack * 5, {
        label: "crashes",
        ignoreDefense: true,
        mana: 0
      });
      if (isAlive(enemy)) dealDamage(unit, enemy, 18 + upgrades.mana * 2, { label: "ignites", mana: 0 });
      break;
    case "tide-warden":
      gainShield(unit, 75 + upgrades.shield * 8);
      heal(unit, 30 + upgrades.defense * 3);
      dealDamage(unit, enemy, 42 + upgrades.shield * 2, { label: "floods", mana: 0 });
      break;
    case "night-veil":
      unit.buffs.evasion = 0.32;
      unit.buffs.evasionTimer = 3200;
      dealDamage(unit, enemy, 58 + upgrades.evasion * 5 + upgrades.attack * 2, {
        label: "ambushes",
        ignoreDefense: true,
        mana: 0
      });
      break;
    case "iron-saint":
      dealDamage(unit, enemy, 54 + upgrades.defense * 5, { label: "judges", mana: 0 });
      heal(unit, 28 + upgrades.defense * 4);
      break;
    case "storm-oracle":
      for (let i = 0; i < 4 && isAlive(enemy); i += 1) {
        dealDamage(unit, enemy, 22 + upgrades.mana * 2, { label: "chains lightning into", mana: 0 });
      }
      break;
    case "thorn-beast": {
      const dealt = dealDamage(unit, enemy, 55 + (upgrades.defense + upgrades.shield) * 3, {
        label: "mauls",
        mana: 0
      });
      heal(unit, 25 + Math.round(dealt * 0.25));
      break;
    }
    case "prism-archer":
      for (let i = 0; i < 5 && isAlive(enemy); i += 1) {
        dealDamage(unit, enemy, 18 + upgrades.critical * 3, {
          label: "volleys",
          canCrit: true,
          mana: 0
        });
      }
      break;
    case "void-alchemist": {
      const burned = Math.min(enemy.mana, 55 + upgrades.mana * 3);
      enemy.mana -= burned;
      gainShield(unit, 20 + upgrades.shield * 4);
      dealDamage(unit, enemy, 48 + burned * 0.8 + upgrades.mana * 3, {
        label: "collapses",
        ignoreDefense: true,
        mana: 0
      });
      break;
    }
  }
}

function dealDamage(unit, enemy, rawAmount, options = {}) {
  if (!isAlive(unit) || !isAlive(enemy)) return 0;
  const label = options.label || "hits";
  const dodgeChance = clamp(enemy.stats.evasion + enemy.buffs.evasion, 0, 0.62);

  if (options.canDodge && Math.random() < dodgeChance) {
    unit.lastHitCrit = false;
    unit.lastDamage = 0;
    gainMana(enemy, 6 + enemy.player.upgrades.mana);
    addLog(`${unitLabel(enemy)} evades ${unitLabel(unit)}.`);
    applyDodgePassives(enemy, unit);
    setUnitPose(enemy, "dodging", 540);
    flash(enemy.side, "casting");
    playDodgeEffect(enemy);
    playFloatText(enemy.side, "DODGE", enemy.hero.color, enemy.hero.secondary);
    return 0;
  }

  let amount = rawAmount;
  let crit = false;
  const critBonus = unit.buffs.focus ? 0.25 : 0;
  if (options.canCrit && Math.random() < clamp(unit.stats.crit + critBonus, 0, 0.9)) {
    amount *= unit.stats.critMult + (unit.buffs.focus ? 0.3 : 0);
    crit = true;
  }
  unit.buffs.focus = false;

  const armor = options.ignoreDefense ? 0 : enemy.stats.defense + enemy.buffs.defense;
  amount = Math.max(1, Math.round(amount - armor));

  const shieldDamage = Math.min(enemy.shield, amount);
  enemy.shield -= shieldDamage;
  const healthDamage = amount - shieldDamage;
  enemy.hp = Math.max(0, enemy.hp - healthDamage);

  gainMana(unit, options.mana ?? unit.stats.manaGain);
  if (healthDamage > 0) gainMana(enemy, 4 + enemy.player.upgrades.mana);

  const parts = [];
  if (crit) parts.push("critical");
  parts.push(`${amount} damage`);
  if (shieldDamage > 0) parts.push(`${shieldDamage} blocked`);
  addLog(`${unitLabel(unit)} ${label} ${unitLabel(enemy)} for <strong>${parts.join(", ")}</strong>.`);
  unit.lastHitCrit = crit;
  unit.lastDamage = amount;
  playImpactEffect(enemy, crit ? "critical" : "hit", unit.hero.color, unit.hero.secondary);
  playFloatText(enemy.side, `${crit ? "CRIT " : ""}${amount}`, crit ? categories.critical.color : unit.hero.color, unit.hero.secondary);
  setUnitPose(enemy, "hit", 380);
  flash(enemy.side, "hit");
  return amount;
}

function gainMana(unit, amount) {
  if (!hasUltimateAbility(unit.hero)) return;
  unit.mana = clamp(unit.mana + amount, 0, MAX_MANA);
}

function gainShield(unit, amount) {
  const cap = unit.stats.startShield + 120 + unit.player.upgrades.shield * 16;
  unit.shield = Math.min(cap, Math.round(unit.shield + amount));
  addLog(`${unitLabel(unit)} gains <strong>${Math.round(amount)} shield</strong>.`);
  setUnitPose(unit, "guarding", 620);
  playShieldEffect(unit);
  playFloatText(unit.side, `+${Math.round(amount)} shield`, categories.shield.color, unit.hero.secondary);
}

function heal(unit, amount) {
  const before = unit.hp;
  unit.hp = Math.min(unit.stats.maxHp, Math.round(unit.hp + amount));
  const healed = unit.hp - before;
  if (healed > 0) {
    addLog(`${unitLabel(unit)} heals <strong>${healed}</strong>.`);
    setUnitPose(unit, "guarding", 620);
    playHealEffect(unit);
    playFloatText(unit.side, `+${healed}`, categories.defense.color, "#fff8ec");
  }
}
function finishCombat(winnerSide) {
  const combat = state.combat;
  if (!combat || combat.finished) return;
  stopTimer();
  combat.finished = true;

  const userWon = winnerSide === "left";
  const user = getUser();
  const opponent = combat.right.player;
  const damage = roundDamage();
  const winnerUnit = winnerSide === "left" ? combat.left : combat.right;
  const loserUnit = winnerSide === "left" ? combat.right : combat.left;
  setUnitPose(winnerUnit, "victory", 1600);
  setUnitPose(loserUnit, "dead", 200000);
  playFloatText(winnerUnit.side, "VICTORY", categories.critical.color, winnerUnit.hero.secondary);

  if (userWon) {
    opponent.health -= damage;
    user.streak += 1;
    state.lastResult = "Victory";
    addLog(`<strong>Victory.</strong> ${opponent.name} loses ${damage} health.`);
  } else {
    user.health -= damage;
    user.streak = 0;
    state.lastResult = "Defeat";
    addLog(`<strong>Defeat.</strong> You lose ${damage} health.`);
  }

  simulateAiMatches(opponent.id);
  markEliminations();
  renderCombat();
  renderHeaderAndLists();
  checkGameOver();
  renderRoundSummary();
  renderActionState();
}

function renderHeaderAndLists() {
  const user = getUser();
  el.roundValue.textContent = state.round;
  el.goldValue.textContent = state.gold;
  el.healthValue.textContent = Math.max(0, user.health);
  el.aliveValue.textContent = `${state.players.filter((item) => item.alive).length} alive`;
  el.powerValue.textContent = `${Math.round(powerScore(user))} power`;
  renderHeroDetails(user);
  renderStandings();
}

function nextRound() {
  if (state.gameOver) return;
  stopTimer();
  state.round += 1;
  state.gold += incomeForRound();
  state.combat = null;
  state.lastResult = "";
  upgradeAiPlayers();
  if (!state.shopLocked) state.shop = generateShop();
  state.shopLocked = false;
  state.nextOpponentId = chooseOpponentId();
  renderGame();
}

function renderCombat() {
  const combat = state.combat;
  if (!combat) return;
  const left = combat.left;
  const right = combat.right;

  renderFighterPortrait(el.leftPortrait, left.hero, "combat");
  renderFighterPortrait(el.rightPortrait, right.hero, "combat");
  applyFighterState(el.leftPortrait.parentElement, left);
  applyFighterState(el.rightPortrait.parentElement, right);
  el.leftName.textContent = left.player.name;
  el.rightName.textContent = right.player.name;
  el.leftShield.textContent = Math.round(left.shield);
  el.rightShield.textContent = Math.round(right.shield);
  setBar(el.leftHpBar, (left.hp / left.stats.maxHp) * 100);
  setBar(el.rightHpBar, (right.hp / right.stats.maxHp) * 100);
  setBar(el.leftManaBar, left.mana);
  setBar(el.rightManaBar, right.mana);
  renderCombatAbilities(left.hero, left);
  el.roundResult.textContent = combat.finished ? state.lastResult : "";
  renderRoundSummary();
  syncArena3d();
  el.combatLog.innerHTML = combat.logs.slice(-10).map((line) => `<p>${line}</p>`).join("");
  el.combatLog.scrollTop = el.combatLog.scrollHeight;
}

function addLog(message) {
  if (!state.combat) return;
  state.combat.logs.push(message);
}

function syncArena3d() {
  const player = getUser();
  if (!player) return;
  const opponent = state.combat ? null : getOpponent();
  const payload = state.combat
    ? {
        phase: state.combat.finished ? "result" : "combat",
        round: state.round,
        left: arenaUnitFromCombat(state.combat.left),
        right: arenaUnitFromCombat(state.combat.right)
      }
    : {
        phase: "prep",
        round: state.round,
        left: arenaUnitFromPlayer(player, "left"),
        right: opponent ? arenaUnitFromPlayer(opponent, "right") : null
      };

  window.__arena3DState = payload;
  if (window.Arena3D) window.Arena3D.update(payload);
}

function arenaUnitFromCombat(unit) {
  return {
    side: unit.side,
    hero: arenaHeroPayload(unit.hero),
    hp: unit.hp,
    maxHp: unit.stats.maxHp,
    mana: unit.mana,
    shield: unit.shield,
    pose: activePose(unit),
    alive: isAlive(unit)
  };
}

function arenaUnitFromPlayer(player, side) {
  const hero = getHero(player.heroId);
  const stats = getStats(player);
  return {
    side,
    hero: arenaHeroPayload(hero),
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    mana: 0,
    shield: stats.startShield,
    pose: "",
    alive: player.alive
  };
}

function arenaHeroPayload(hero) {
  return {
    id: hero.id,
    name: hero.name,
    color: hero.color,
    secondary: hero.secondary,
    shape: hero.shape
  };
}

function triggerArena3dEffect(type, unit, enemy, options = {}) {
  const effect = {
    type,
    side: unit?.side,
    targetSide: enemy?.side,
    color: options.color || unit?.hero?.color,
    secondary: options.secondary || unit?.hero?.secondary,
    tier: options.tier || "basic"
  };
  window.__arena3DEffectQueue = window.__arena3DEffectQueue || [];
  if (window.Arena3D) window.Arena3D.playEffect(effect);
  else window.__arena3DEffectQueue.push(effect);
}

function renderFighterPortrait(container, hero, variant) {
  if (!container || !hero) return;
  const key = `${variant}:${hero.id}`;
  if (container.dataset.portraitKey !== key) {
    container.innerHTML = variant === "header" ? heroMiniSprite(hero) : heroUnitSvg(hero);
    container.dataset.portraitKey = key;
  }
  container.style.setProperty("--hero-color", hero.color);
  container.style.setProperty("--hero-secondary", hero.secondary);
  const fighter = container.closest(".fighter");
  if (fighter) {
    fighter.style.setProperty("--hero-color", hero.color);
    fighter.style.setProperty("--hero-secondary", hero.secondary);
  }
}

function applyFighterState(node, unit) {
  if (!node) return;
  const dynamicClasses = [
    "attacking", "casting", "hit", "dodging", "guarding",
    "dead", "victory", "low-health", "charged", "shielded"
  ];
  node.classList.remove(...dynamicClasses);
  if (!unit) return;

  const pose = activePose(unit);
  if (pose) node.classList.add(pose);
  if (!isAlive(unit) || pose === "dead") node.classList.add("dead");
  if (unit.hp / unit.stats.maxHp <= 0.32) node.classList.add("low-health");
  if (unit.mana >= 82) node.classList.add("charged");
  if (unit.shield > 0) node.classList.add("shielded");
}

function activePose(unit) {
  const combat = state.combat;
  if (!combat || !unit.pose || unit.poseUntil <= combat.elapsed) return "";
  return unit.pose;
}

function setUnitPose(unit, pose, duration) {
  if (!unit || !state.combat) return;
  unit.pose = pose;
  unit.poseUntil = state.combat.elapsed + duration;
}

function flash(side, className) {
  const node = document.querySelector(side === "left" ? ".fighter-left" : ".fighter-right");
  if (!node) return;
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
  window.setTimeout(() => node.classList.remove(className), 460);
}

function clearEffects() {
  if (el.fxLayer) el.fxLayer.innerHTML = "";
  if (window.Arena3D) window.Arena3D.clearEffects();
}

function playStrikeEffect(unit, enemy) {
  triggerArena3dEffect("strike", unit, enemy, { color: unit.hero.color, secondary: unit.hero.secondary });
  playPlacedEffect("fx-slash", enemy.side, unit.hero.color, unit.hero.secondary, 380, 110);
}

function playHeroEffect(tier, unit, enemy) {
  const ultimate = tier === "ultimate";
  const hero = unit.hero;
  const burstDelay = ultimate ? 420 : 260;
  triggerArena3dEffect("hero", unit, enemy, { color: hero.color, secondary: hero.secondary, tier });

  switch (hero.id) {
    case "ember-ronin":
      playProjectileEffect(unit, enemy, ultimate ? "fx-fire" : "fx-projectile", hero.color, hero.secondary, 0, ultimate ? 720 : 560);
      playPlacedEffect("fx-burst", enemy.side, hero.color, hero.secondary, ultimate ? 850 : 560, burstDelay);
      break;
    case "tide-warden":
      playShieldEffect(unit, 0);
      if (ultimate) {
        playBeamEffect(unit, enemy, hero.color, hero.secondary, 220);
        playPlacedEffect("fx-burst", enemy.side, hero.color, hero.secondary, 650, 360);
      }
      break;
    case "night-veil":
      playDodgeEffect(unit, 0);
      playPlacedEffect("fx-slash", enemy.side, hero.color, hero.secondary, 420, ultimate ? 170 : 260);
      if (ultimate) playPlacedEffect("fx-vortex", enemy.side, hero.color, hero.secondary, 760, 240);
      break;
    case "iron-saint":
      playShieldEffect(unit, 0);
      playHealEffect(unit, 130);
      if (ultimate) playPlacedEffect("fx-burst", enemy.side, hero.color, hero.secondary, 720, 260);
      break;
    case "storm-oracle":
      if (ultimate) {
        for (let i = 0; i < 4; i += 1) playBeamEffect(unit, enemy, hero.color, hero.secondary, i * 140);
        playPlacedEffect("fx-burst", enemy.side, hero.color, hero.secondary, 720, 540);
      } else {
        playBeamEffect(unit, enemy, hero.color, hero.secondary, 0);
      }
      break;
    case "thorn-beast":
      playShieldEffect(unit, 0);
      playPlacedEffect("fx-slash", enemy.side, hero.color, hero.secondary, 420, 220);
      if (ultimate) playPlacedEffect("fx-burst", enemy.side, hero.color, hero.secondary, 760, 320);
      break;
    case "prism-archer":
      for (let i = 0; i < (ultimate ? 5 : 1); i += 1) {
        playProjectileEffect(unit, enemy, "fx-arrow", hero.color, hero.secondary, i * 90, 470);
      }
      if (ultimate) playPlacedEffect("fx-burst", enemy.side, hero.color, hero.secondary, 620, 520);
      break;
    case "void-alchemist":
      playPlacedEffect("fx-vortex", enemy.side, hero.color, hero.secondary, ultimate ? 900 : 620, 80);
      playBeamEffect(enemy, unit, hero.secondary, hero.color, 140);
      if (ultimate) playPlacedEffect("fx-burst", enemy.side, hero.color, hero.secondary, 820, 450);
      break;
  }
}

function playProjectileEffect(unit, enemy, className, color, secondary, delay = 0, duration = 560) {
  scheduleEffect(() => {
    const from = getArenaPoint(unit.side);
    const to = getArenaPoint(enemy.side);
    const node = createFx(`${className} ${unit.side === "right" ? "from-right" : "from-left"}`, from.x, from.y, color, secondary, duration);
    node.style.setProperty("--dx", `${to.x - from.x}px`);
    node.style.setProperty("--dy", `${to.y - from.y}px`);
  }, delay);
}

function playBeamEffect(unit, enemy, color, secondary, delay = 0) {
  scheduleEffect(() => {
    const from = getArenaPoint(unit.side);
    const to = getArenaPoint(enemy.side);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(40, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const node = createFx("fx-beam", from.x, from.y, color, secondary, 430);
    node.style.width = `${length}px`;
    node.style.transform = `translateY(-50%) rotate(${angle}rad)`;
  }, delay);
}

function playPlacedEffect(className, side, color, secondary, duration = 620, delay = 0, text = "") {
  scheduleEffect(() => {
    const point = getArenaPoint(side);
    createFx(className, point.x, point.y, color, secondary, duration, text);
  }, delay);
}

function playImpactEffect(unit, kind, color, secondary) {
  const className = kind === "critical" ? "fx-burst" : "fx-slash";
  triggerArena3dEffect("impact", unit, unit, { color, secondary, tier: kind });
  playPlacedEffect(className, unit.side, color, secondary, kind === "critical" ? 580 : 360, 0);
}

function playShieldEffect(unit, delay = 0) {
  scheduleEffect(() => triggerArena3dEffect("shield", unit, unit, { color: categories.shield.color, secondary: unit.hero.secondary }), delay);
  playPlacedEffect("fx-shield", unit.side, categories.shield.color, unit.hero.secondary, 760, delay);
}

function playHealEffect(unit, delay = 0) {
  scheduleEffect(() => triggerArena3dEffect("heal", unit, unit, { color: categories.defense.color, secondary: "#fff8ec" }), delay);
  playPlacedEffect("fx-heal", unit.side, categories.defense.color, "#fff8ec", 820, delay);
}

function playDodgeEffect(unit, delay = 0) {
  playPlacedEffect("fx-dodge", unit.side, unit.hero.color, unit.hero.secondary, 520, delay);
}

function playFloatText(side, text, color, secondary, delay = 0) {
  scheduleEffect(() => {
    const point = getArenaPoint(side);
    createFx("fx-float", point.x, point.y - 56, color, secondary, 860, text);
  }, delay);
}

function playCastName(unit, text, ultimate) {
  const className = `fx-cast-name${ultimate ? " ultimate" : ""}`;
  const color = ultimate ? categories.critical.color : unit.hero.color;
  const secondary = ultimate ? unit.hero.color : unit.hero.secondary;
  playPlacedEffect(className, unit.side, color, secondary, ultimate ? 920 : 760, 0, text);
}

function createFx(className, x, y, color, secondary, duration, text = "") {
  if (!el.fxLayer) return document.createElement("div");
  const node = document.createElement("div");
  node.className = `fx ${className}`;
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.setProperty("--fx-color", color);
  node.style.setProperty("--fx-secondary", secondary);
  if (text) node.textContent = text;
  el.fxLayer.appendChild(node);
  window.setTimeout(() => node.remove(), duration);
  return node;
}

function getArenaPoint(side) {
  const board = document.querySelector(".arena-board");
  const portrait = document.getElementById(side === "left" ? "leftPortrait" : "rightPortrait");
  if (!board || !portrait) {
    return { x: side === "left" ? 180 : 520, y: 180 };
  }
  const boardRect = board.getBoundingClientRect();
  const rect = portrait.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - boardRect.left,
    y: rect.top + rect.height * 0.54 - boardRect.top
  };
}

function scheduleEffect(callback, delay) {
  window.setTimeout(callback, delay);
}
function renderActionButtonsAfterGame(message) {
  state.lastResult = message;
  el.roundResult.textContent = message;
  el.fightBtn.hidden = true;
  el.nextRoundBtn.hidden = true;
}

function simulateAiMatches(excludedId) {
  const contenders = shuffle(state.players.filter((player) => {
    return player.alive && !player.isUser && player.id !== excludedId;
  }));
  for (let index = 0; index < contenders.length - 1; index += 2) {
    const a = contenders[index];
    const b = contenders[index + 1];
    const aScore = powerScore(a) * randomBetween(0.86, 1.16);
    const bScore = powerScore(b) * randomBetween(0.86, 1.16);
    const loser = aScore >= bScore ? b : a;
    loser.health -= roundDamage();
  }
}

function markEliminations() {
  state.players.forEach((player) => {
    if (player.health <= 0 && player.alive) {
      player.alive = false;
      player.eliminatedRound = state.round;
    }
  });
}

function checkGameOver() {
  const user = getUser();
  const enemiesAlive = state.players.filter((player) => player.alive && !player.isUser).length;
  if (!user.alive) {
    state.gameOver = true;
    renderActionButtonsAfterGame("Eliminated");
  } else if (enemiesAlive === 0) {
    state.gameOver = true;
    renderActionButtonsAfterGame("Champion");
  }
}

function finishGame(won) {
  state.gameOver = true;
  state.lastResult = won ? "Champion" : "Eliminated";
  renderGame();
}

function roundDamage() {
  return Math.min(13, 3 + Math.floor(state.round / 2));
}

function incomeForRound() {
  const streak = Math.min(4, getUser().streak);
  return 8 + Math.min(6, Math.floor(state.round / 2)) + streak;
}

function upgradeAiPlayers() {
  state.players.filter((player) => player.alive && !player.isUser).forEach((player) => {
    const hero = getHero(player.heroId);
    const buys = 1 + Math.floor(state.round / 2);
    for (let i = 0; i < buys; i += 1) {
      const preferred = Math.random() < 0.72;
      const category = preferred ? randomChoice(hero.prefers) : randomChoice(categoryOrder);
      player.upgrades[category] += Math.random() < 0.22 ? 2 : 1;
    }
  });
}

function getStats(player) {
  const hero = getHero(player.heroId);
  return calculateStats(hero, player.upgrades);
}

function calculateStats(hero, upgrades) {
  return {
    maxHp: hero.base.hp + upgrades.defense * 16 + upgrades.shield * 4,
    attack: hero.base.attack + upgrades.attack * 5 + Math.floor(upgrades.critical * 0.8),
    interval: Math.max(820, hero.base.interval - upgrades.attack * 12 - upgrades.evasion * 8),
    defense: hero.base.defense + upgrades.defense * 2,
    evasion: clamp(hero.base.evasion + upgrades.evasion * 0.035, 0, 0.48),
    crit: clamp(hero.base.crit + upgrades.critical * 0.045, 0, 0.68),
    critMult: 1.55 + upgrades.critical * 0.05,
    manaGain: 12 + upgrades.mana * 2,
    startShield: hero.base.shield + upgrades.shield * 17,
    activeCooldown: Math.max(3200, 5000 - upgrades.mana * 90)
  };
}

function powerScore(player) {
  const stats = getStats(player);
  return (
    stats.maxHp * 0.9 +
    stats.attack * 7 +
    stats.defense * 14 +
    stats.evasion * 210 +
    stats.crit * 150 +
    stats.manaGain * 4 +
    stats.startShield * 1.4
  );
}

function chooseOpponentId() {
  const alive = state.players.filter((player) => player.alive && !player.isUser);
  if (!alive.length) return null;
  const sorted = alive.sort((a, b) => b.health - a.health);
  return sorted[(state.round - 1) % sorted.length].id;
}

function getUser() {
  return state.players.find((player) => player.id === USER_ID);
}

function getOpponent() {
  if (!state.nextOpponentId) return null;
  const opponent = state.players.find((player) => player.id === state.nextOpponentId && player.alive);
  if (opponent) return opponent;
  state.nextOpponentId = chooseOpponentId();
  return state.players.find((player) => player.id === state.nextOpponentId) || null;
}

function getHero(heroId) {
  return heroes.find((hero) => hero.id === heroId);
}

function getActiveAbility(hero) {
  return hero.abilities.find((ability) => ability.type === "active") || null;
}

function getUltimateAbility(hero) {
  return hero.abilities.find((ability) => ability.type === "ultimate") || null;
}

function hasActiveAbility(hero) {
  return Boolean(getActiveAbility(hero));
}

function hasUltimateAbility(hero) {
  return Boolean(getUltimateAbility(hero));
}

function zeroUpgrades() {
  return Object.fromEntries(categoryOrder.map((category) => [category, 0]));
}

function generateShop() {
  return Array.from({ length: 5 }, randomCard);
}

function randomCard() {
  const availableCards = state.round >= 4 ? cardPool : cardPool.filter((card) => card.rarity !== "legendary");
  const card = randomChoice(availableCards);
  const rarity = getCardRarity(card) === "legendary" ? "legendary" : rollRarity();
  const bonus = card.rarity ? rarityBonuses.common : rarityBonuses[rarity];
  const rarityLabel = rarityInfo[rarity].label.toLowerCase();
  return {
    ...card,
    rarity,
    cost: card.cost + bonus.cost,
    points: card.points + bonus.points,
    text: card.rarity || rarity === "common" ? card.text : `${card.text} This ${rarityLabel} version grants extra upgrade points.`
  };
}

function getCardRarity(card) {
  return rarityInfo[card?.rarity] ? card.rarity : "common";
}

function rollRarity() {
  const allowed = rarityOrder.filter((rarity) => {
    if (rarity === "legendary") return state.round >= 4;
    if (rarity === "epic") return state.round >= 2;
    return true;
  });
  const total = allowed.reduce((sum, rarity) => sum + rarityInfo[rarity].weight, 0);
  let roll = Math.random() * total;
  for (const rarity of allowed) {
    roll -= rarityInfo[rarity].weight;
    if (roll <= 0) return rarity;
  }
  return "common";
}

function setBar(node, value) {
  node.style.width = `${clamp(value, 0, 100)}%`;
}

function unitLabel(unit) {
  return unit.player.isUser ? "You" : unit.player.name;
}

function isAlive(unit) {
  return unit.hp > 0;
}

function stopTimer() {
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  window.setTimeout(() => node.remove(), 1400);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function heroSvg(hero) {
  return heroSpriteMarkup(hero, "hero-card-sprite", "hero model preview");
}

function heroUnitSvg(hero) {
  return heroSpriteMarkup(hero, "hero-combat-sprite", "combat unit");
}

function heroMiniSprite(hero) {
  return heroSpriteMarkup(hero, "hero-mini-sprite", "miniature portrait");
}

function heroSpriteMarkup(hero, variant, label) {
  return `
    <div class="sprite-stage ${variant}" data-hero-id="${hero.id}" data-hero-shape="${hero.shape}" style="--hero-color: ${hero.color}; --hero-secondary: ${hero.secondary}" role="img" aria-label="${hero.name} ${label}">
      <span class="sprite-aura"></span>
      <span class="sprite-shadow"></span>
      <span class="sprite-base"></span>
      <img class="hero-sprite" src="${heroSpritePath(hero)}" alt="${hero.name}" draggable="false">
    </div>
  `;
}

function heroSpritePath(hero) {
  return `assets/heroes/${hero.id}.png`;
}

