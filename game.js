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
    passive: {
      name: "Cinder Sweep",
      text: "Every 5 seconds, scorches the enemy."
    },
    ultimate: {
      name: "Meteor Chain",
      text: "At 100 mana, crashes a heavy fire strike."
    }
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
    passive: {
      name: "Foam Guard",
      text: "Every 5 seconds, gains a shield."
    },
    ultimate: {
      name: "Tidal Bastion",
      text: "At 100 mana, shields, heals, and sends a wave."
    }
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
    passive: {
      name: "Ghost Step",
      text: "Every 5 seconds, primes a lethal strike and slips attacks."
    },
    ultimate: {
      name: "Shadow Bloom",
      text: "At 100 mana, lands a defense-piercing ambush."
    }
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
    passive: {
      name: "Tempered Vow",
      text: "Every 5 seconds, heals and hardens armor."
    },
    ultimate: {
      name: "Judgment Bell",
      text: "At 100 mana, strikes hard and restores health."
    }
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
    passive: {
      name: "Static Read",
      text: "Every 5 seconds, gains mana and shocks the enemy."
    },
    ultimate: {
      name: "Storm Verdict",
      text: "At 100 mana, fires a chain of lightning hits."
    }
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
    passive: {
      name: "Bramble Surge",
      text: "Every 5 seconds, lashes out and grows a shield."
    },
    ultimate: {
      name: "Wild Maul",
      text: "At 100 mana, mauls and heals from the hit."
    }
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
    passive: {
      name: "Splinter Shot",
      text: "Every 5 seconds, fires a shot that can crit."
    },
    ultimate: {
      name: "Solar Volley",
      text: "At 100 mana, releases five critical arrows."
    }
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
    passive: {
      name: "Null Siphon",
      text: "Every 5 seconds, steals mana and turns it into damage."
    },
    ultimate: {
      name: "Collapse Flask",
      text: "At 100 mana, burns enemy mana and detonates it."
    }
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
  { name: "Barrier Crown", category: "shield", cost: 7, points: 3, text: "Major shield growth." }
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
    "passiveName", "passiveCooldown", "ultimateName", "ultimateCharge",
    "combatLog", "rerollBtn", "shopGrid", "upgradeGrid", "powerValue",
    "standingsList", "aliveValue"
  ].forEach((id) => {
    el[id] = document.getElementById(id);
  });
}

function bindEvents() {
  el.fightBtn.addEventListener("click", startFight);
  el.nextRoundBtn.addEventListener("click", nextRound);
  el.rerollBtn.addEventListener("click", rerollShop);
  el.newGameBtn.addEventListener("click", resetToDraft);
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
  el.heroInspector.innerHTML = `
    <div class="hero-art inspector-art">${heroSvg(hero)}</div>
    <h2>${hero.name}</h2>
    <p>${hero.role}</p>
    <div class="ability-list">
      <div class="ability-row">
        <span>Interval</span>
        <strong>${hero.passive.name}</strong>
        <p>${hero.passive.text}</p>
      </div>
      <div class="ability-row">
        <span>Ultimate</span>
        <strong>${hero.ultimate.name}</strong>
        <p>${hero.ultimate.text}</p>
      </div>
    </div>
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
  state.lastResult = "";
  setScreen("game");
  renderGame();
}

function resetToDraft() {
  stopTimer();
  state.players = [];
  state.combat = null;
  state.gameOver = false;
  state.lastResult = "";
  setScreen("draft");
  renderDraft();
}

function setScreen(screen) {
  el.draftScreen.classList.toggle("active", screen === "draft");
  el.gameScreen.classList.toggle("active", screen === "game");
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

  el.playerPortrait.innerHTML = heroUnitSvg(hero);
  el.playerName.textContent = hero.name;
  el.roundValue.textContent = state.round;
  el.goldValue.textContent = state.gold;
  el.healthValue.textContent = Math.max(0, player.health);
  el.aliveValue.textContent = `${state.players.filter((item) => item.alive).length} alive`;
  el.powerValue.textContent = `${Math.round(powerScore(player))} power`;
  el.passiveName.textContent = hero.passive.name;
  el.ultimateName.textContent = hero.ultimate.name;
  el.matchTitle.textContent = opponent ? `You vs ${opponent.name}` : "Final";

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
}

function renderIdleFighters() {
  clearEffects();
  const player = getUser();
  const opponent = getOpponent();
  const leftStats = getStats(player);
  const rightStats = opponent ? getStats(opponent) : leftStats;

  el.leftPortrait.innerHTML = heroUnitSvg(getHero(player.heroId));
  el.leftPortrait.parentElement.style.setProperty("--hero-color", getHero(player.heroId).color);
  el.leftName.textContent = player.name;
  el.leftShield.textContent = leftStats.startShield;
  setBar(el.leftHpBar, 100);
  setBar(el.leftManaBar, 0);

  if (opponent) {
    el.rightPortrait.innerHTML = heroUnitSvg(getHero(opponent.heroId));
    el.rightPortrait.parentElement.style.setProperty("--hero-color", getHero(opponent.heroId).color);
    el.rightName.textContent = opponent.name;
    el.rightShield.textContent = rightStats.startShield;
    setBar(el.rightHpBar, 100);
    setBar(el.rightManaBar, 0);
  }

  el.roundResult.textContent = state.lastResult;
  setBar(el.passiveCooldown, 0);
  setBar(el.ultimateCharge, 0);
  if (!state.combat) {
    el.combatLog.innerHTML = `<p><strong>Round ${state.round}</strong> prep phase.</p>`;
  }
}

function renderShop() {
  const disabled = state.gameOver || Boolean(state.combat);
  el.shopGrid.innerHTML = state.shop.map((card, index) => {
    const category = categories[card.category];
    const cannotBuy = disabled || state.gold < card.cost;
    return `
      <button class="shop-card" data-card-index="${index}" ${cannotBuy ? "disabled" : ""} style="--category-color: ${category.color}">
        <div class="shop-card-header">
          <h3>${card.name}</h3>
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
      <div class="standing-row ${player.isUser ? "you" : ""} ${player.alive ? "" : "eliminated"}">
        <span class="standing-rank" style="background:${player.isUser ? categories.critical.color : hero.color}">${index + 1}</span>
        <span class="standing-name">
          <strong>${player.name}</strong>
          <span>${hero.name}</span>
        </span>
        <span class="standing-health">${Math.max(0, player.health)}</span>
      </div>
    `;
  }).join("");
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
  renderGame();
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
    passiveTimer: stats.passiveCooldown,
    buffs: {
      focus: false,
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
  unit.passiveTimer -= TICK_MS;
  unit.attackTimer -= TICK_MS;

  if (unit.passiveTimer <= 0) {
    unit.passiveTimer += unit.stats.passiveCooldown;
    castPassive(unit, enemy);
    if (!isAlive(enemy)) return;
  }

  if (unit.mana >= MAX_MANA) {
    unit.mana -= MAX_MANA;
    castUltimate(unit, enemy);
    if (!isAlive(enemy)) return;
  }

  if (unit.attackTimer <= 0) {
    unit.attackTimer += unit.stats.interval;
    basicAttack(unit, enemy);
  }
}

function basicAttack(unit, enemy) {
  flash(unit.side, "attacking");
  playStrikeEffect(unit, enemy);
  dealDamage(unit, enemy, unit.stats.attack, {
    label: "attacks",
    canCrit: true,
    canDodge: true,
    mana: unit.stats.manaGain
  });
}
function castPassive(unit, enemy) {
  const upgrades = unit.player.upgrades;
  flash(unit.side, "casting");
  playCastName(unit, unit.hero.passive.name, false);
  playHeroEffect("passive", unit, enemy);

  switch (unit.hero.id) {
    case "ember-ronin":
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      dealDamage(unit, enemy, 18 + upgrades.attack * 2, { label: "burns", mana: 10 });
      break;
    case "tide-warden":
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      gainShield(unit, 26 + upgrades.shield * 5);
      gainMana(unit, 8);
      break;
    case "night-veil":
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      unit.buffs.focus = true;
      unit.buffs.evasion = 0.18;
      unit.buffs.evasionTimer = 2300;
      gainMana(unit, 8);
      break;
    case "iron-saint":
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      heal(unit, 14 + upgrades.defense * 3);
      unit.buffs.defense = 4 + upgrades.defense;
      unit.buffs.defenseTimer = 2800;
      gainMana(unit, 7);
      break;
    case "storm-oracle":
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      gainMana(unit, 20 + upgrades.mana * 2);
      dealDamage(unit, enemy, 12 + upgrades.mana * 2, { label: "shocks", mana: 0 });
      break;
    case "thorn-beast":
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      gainShield(unit, 10 + upgrades.shield * 3);
      dealDamage(unit, enemy, 14 + (upgrades.defense + upgrades.shield) * 2, { label: "lashes", mana: 9 });
      break;
    case "prism-archer":
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      dealDamage(unit, enemy, unit.stats.attack * 0.75 + upgrades.critical * 2, {
        label: "snipes",
        canCrit: true,
        mana: 10
      });
      break;
    case "void-alchemist": {
      addLog(`${unitLabel(unit)} casts <strong>${unit.hero.passive.name}</strong>.`);
      const drained = Math.min(enemy.mana, 14 + upgrades.mana);
      enemy.mana -= drained;
      gainMana(unit, drained + 8);
      dealDamage(unit, enemy, 12 + drained * 0.5, { label: "siphons", mana: 0 });
      break;
    }
  }
}

function castUltimate(unit, enemy) {
  const upgrades = unit.player.upgrades;
  flash(unit.side, "casting");
  addLog(`${unitLabel(unit)} unleashes <strong>${unit.hero.ultimate.name}</strong>.`);
  playCastName(unit, unit.hero.ultimate.name, true);
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
    gainMana(enemy, 6 + enemy.player.upgrades.mana);
    addLog(`${unitLabel(enemy)} evades ${unitLabel(unit)}.`);
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
  playImpactEffect(enemy, crit ? "critical" : "hit", unit.hero.color, unit.hero.secondary);
  playFloatText(enemy.side, `${crit ? "CRIT " : ""}${amount}`, crit ? categories.critical.color : unit.hero.color, unit.hero.secondary);
  flash(enemy.side, "hit");
  return amount;
}

function gainMana(unit, amount) {
  unit.mana = clamp(unit.mana + amount, 0, MAX_MANA);
}

function gainShield(unit, amount) {
  const cap = unit.stats.startShield + 120 + unit.player.upgrades.shield * 16;
  unit.shield = Math.min(cap, Math.round(unit.shield + amount));
  addLog(`${unitLabel(unit)} gains <strong>${Math.round(amount)} shield</strong>.`);
  playShieldEffect(unit);
  playFloatText(unit.side, `+${Math.round(amount)} shield`, categories.shield.color, unit.hero.secondary);
}

function heal(unit, amount) {
  const before = unit.hp;
  unit.hp = Math.min(unit.stats.maxHp, Math.round(unit.hp + amount));
  const healed = unit.hp - before;
  if (healed > 0) {
    addLog(`${unitLabel(unit)} heals <strong>${healed}</strong>.`);
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
  renderActionState();
}

function renderHeaderAndLists() {
  const user = getUser();
  el.roundValue.textContent = state.round;
  el.goldValue.textContent = state.gold;
  el.healthValue.textContent = Math.max(0, user.health);
  el.aliveValue.textContent = `${state.players.filter((item) => item.alive).length} alive`;
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
  state.shop = generateShop();
  state.nextOpponentId = chooseOpponentId();
  renderGame();
}

function renderCombat() {
  const combat = state.combat;
  if (!combat) return;
  const left = combat.left;
  const right = combat.right;

  el.leftPortrait.innerHTML = heroUnitSvg(left.hero);
  el.rightPortrait.innerHTML = heroUnitSvg(right.hero);
  el.leftPortrait.parentElement.style.setProperty("--hero-color", left.hero.color);
  el.rightPortrait.parentElement.style.setProperty("--hero-color", right.hero.color);
  el.leftName.textContent = left.player.name;
  el.rightName.textContent = right.player.name;
  el.leftShield.textContent = Math.round(left.shield);
  el.rightShield.textContent = Math.round(right.shield);
  setBar(el.leftHpBar, (left.hp / left.stats.maxHp) * 100);
  setBar(el.rightHpBar, (right.hp / right.stats.maxHp) * 100);
  setBar(el.leftManaBar, left.mana);
  setBar(el.rightManaBar, right.mana);
  setBar(el.passiveCooldown, 100 - (left.passiveTimer / left.stats.passiveCooldown) * 100);
  setBar(el.ultimateCharge, left.mana);
  el.roundResult.textContent = combat.finished ? state.lastResult : "";
  el.combatLog.innerHTML = combat.logs.slice(-10).map((line) => `<p>${line}</p>`).join("");
  el.combatLog.scrollTop = el.combatLog.scrollHeight;
}

function addLog(message) {
  if (!state.combat) return;
  state.combat.logs.push(message);
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
}

function playStrikeEffect(unit, enemy) {
  playPlacedEffect("fx-slash", enemy.side, unit.hero.color, unit.hero.secondary, 380, 110);
}

function playHeroEffect(tier, unit, enemy) {
  const ultimate = tier === "ultimate";
  const hero = unit.hero;
  const burstDelay = ultimate ? 420 : 260;

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
  playPlacedEffect(className, unit.side, color, secondary, kind === "critical" ? 580 : 360, 0);
}

function playShieldEffect(unit, delay = 0) {
  playPlacedEffect("fx-shield", unit.side, categories.shield.color, unit.hero.secondary, 760, delay);
}

function playHealEffect(unit, delay = 0) {
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
  const upgrades = player.upgrades;
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
    passiveCooldown: Math.max(3200, 5000 - upgrades.mana * 90)
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

function generateShop() {
  return Array.from({ length: 5 }, randomCard);
}

function randomCard() {
  const card = randomChoice(cardPool);
  return { ...card };
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

function heroSvg(hero) {
  return heroSpriteMarkup(hero, "hero-card-sprite", "hero model preview");
}

function heroUnitSvg(hero) {
  return heroSpriteMarkup(hero, "hero-combat-sprite", "combat unit");
}

function heroSpriteMarkup(hero, variant, label) {
  return `
    <div class="sprite-stage ${variant}" style="--hero-color: ${hero.color}; --hero-secondary: ${hero.secondary}" role="img" aria-label="${hero.name} ${label}">
      <span class="sprite-aura"></span>
      <span class="sprite-base"></span>
      <img class="hero-sprite" src="${heroSpritePath(hero)}" alt="${hero.name}" draggable="false">
    </div>
  `;
}

function heroSpritePath(hero) {
  return `assets/heroes/${hero.id}.png`;
}

