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
  const character = heroCharacter(hero);
  const sigil = heroSigil(hero);
  return `
    <svg class="hero-model" viewBox="0 0 192 192" role="img" aria-label="${hero.name}">
      <defs>
        <linearGradient id="g-${hero.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${hero.color}"/>
          <stop offset="1" stop-color="${hero.secondary}"/>
        </linearGradient>
        <linearGradient id="rim-${hero.id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff8ec" stop-opacity="0.36"/>
          <stop offset="0.55" stop-color="${hero.secondary}" stop-opacity="0.16"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.28"/>
        </linearGradient>
        <radialGradient id="aura-${hero.id}" cx="50%" cy="40%" r="60%">
          <stop offset="0" stop-color="${hero.secondary}" stop-opacity="0.42"/>
          <stop offset="0.48" stop-color="${hero.color}" stop-opacity="0.22"/>
          <stop offset="1" stop-color="${hero.color}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="ground-${hero.id}" cx="50%" cy="42%" r="64%">
          <stop offset="0" stop-color="${hero.secondary}" stop-opacity="0.28"/>
          <stop offset="0.48" stop-color="#33413c" stop-opacity="0.98"/>
          <stop offset="1" stop-color="#171c1a" stop-opacity="1"/>
        </radialGradient>
        <filter id="shadow-${hero.id}" x="-45%" y="-45%" width="190%" height="190%">
          <feDropShadow dx="0" dy="11" stdDeviation="7" flood-color="#000" flood-opacity="0.55"/>
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${hero.color}" flood-opacity="0.4"/>
        </filter>
      </defs>
      <rect width="192" height="192" rx="12" fill="#101313"/>
      <path d="M0 121 C33 94, 48 68, 96 58 C142 68, 164 96, 192 123 L192 192 L0 192 Z" fill="url(#aura-${hero.id})"/>
      <path d="M96 121 L162 151 L96 182 L30 151 Z" fill="url(#ground-${hero.id})" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <path d="M96 121 L162 151 L96 182 L30 151 Z M63 136 L129 166 M129 136 L63 166 M96 121 V182 M30 151 H162" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <path d="M96 133 L148 154 L96 177 L44 154 Z" fill="none" stroke="${hero.secondary}" stroke-width="2" opacity="0.38"/>
      <ellipse cx="96" cy="150" rx="48" ry="17" fill="rgba(0,0,0,0.46)"/>
      <g transform="translate(16 7) scale(1.02)" filter="url(#shadow-${hero.id})">
        ${character}
      </g>
      <path d="M31 151 L96 181 L96 188 L29 156 Z" fill="#090b0b" opacity="0.38"/>
      <path d="M162 151 L96 181 L96 188 L164 156 Z" fill="#060707" opacity="0.52"/>
      <g transform="translate(16 8)">${sigil}</g>
      <path d="M18 24 C46 5, 145 6, 174 25" fill="none" stroke="url(#rim-${hero.id})" stroke-width="2" opacity="0.68"/>
    </svg>
  `;
}
function heroUnitSvg(hero) {
  const character = heroCharacter(hero);
  const sigil = heroSigil(hero);
  return `
    <svg class="hero-unit" viewBox="0 0 180 180" role="img" aria-label="${hero.name}">
      <defs>
        <linearGradient id="unit-g-${hero.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${hero.color}"/>
          <stop offset="1" stop-color="${hero.secondary}"/>
        </linearGradient>
        <radialGradient id="unit-aura-${hero.id}" cx="50%" cy="42%" r="58%">
          <stop offset="0" stop-color="${hero.secondary}" stop-opacity="0.38"/>
          <stop offset="0.5" stop-color="${hero.color}" stop-opacity="0.18"/>
          <stop offset="1" stop-color="${hero.color}" stop-opacity="0"/>
        </radialGradient>
        <filter id="unit-shadow-${hero.id}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="13" stdDeviation="7" flood-color="#000" flood-opacity="0.55"/>
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="${hero.color}" flood-opacity="0.34"/>
        </filter>
      </defs>
      <ellipse cx="90" cy="140" rx="57" ry="20" fill="rgba(0,0,0,0.48)"/>
      <path d="M90 112 L148 139 L90 168 L32 139 Z" fill="url(#unit-aura-${hero.id})" stroke="${hero.secondary}" stroke-width="2" opacity="0.78"/>
      <path d="M90 112 L148 139 L90 168 L32 139 Z M61 126 L119 153 M119 126 L61 153" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
      <g transform="translate(9 -5) scale(1.02)" filter="url(#unit-shadow-${hero.id})">
        ${character.replaceAll(`url(#g-${hero.id})`, `url(#unit-g-${hero.id})`)}
      </g>
      <g transform="translate(10 -2) scale(0.78)" opacity="0.72">${sigil.replaceAll(`url(#g-${hero.id})`, `url(#unit-g-${hero.id})`)}</g>
    </svg>
  `;
}
function heroCharacter(hero) {
  const specs = {
    flame: {
      base: "#5d5a55", mid: "#77736c", light: "#aaa59a", dark: "#2b2a29",
      accent: "#ef684a", glow: "#ffc45a", eyes: "#171b1c", patch: "magma", accessory: "ember"
    },
    tide: {
      base: "#b8c2bd", mid: "#d2d9d4", light: "#f1f4ee", dark: "#68736f",
      accent: "#53b7c8", glow: "#8ff0dc", eyes: "#0b3142", patch: "water", accessory: "shell"
    },
    veil: {
      base: "#3e3a54", mid: "#5b5480", light: "#8f86c8", dark: "#151521",
      accent: "#8d74df", glow: "#56d4cf", eyes: "#05070a", patch: "shadow", accessory: "crescent"
    },
    iron: {
      base: "#aeb3b9", mid: "#d6d3ca", light: "#fff4d4", dark: "#636a70",
      accent: "#d9b85d", glow: "#fff0ad", eyes: "#172637", patch: "gold", accessory: "bulwark"
    },
    storm: {
      base: "#b9c8d9", mid: "#dfe9f3", light: "#ffffff", dark: "#63758a",
      accent: "#5f91d8", glow: "#d9f2ff", eyes: "#0d2744", patch: "lightning", accessory: "rod"
    },
    thorn: {
      base: "#8e9278", mid: "#b6aa7e", light: "#d8d0a6", dark: "#4a513f",
      accent: "#7fb069", glow: "#d8ef9f", eyes: "#182513", patch: "moss", accessory: "horns"
    },
    prism: {
      base: "#caa04b", mid: "#f0bc5a", light: "#ffe6a0", dark: "#6a4528",
      accent: "#f2b84b", glow: "#fff2b7", eyes: "#1f1710", patch: "crystal", accessory: "crystal"
    },
    void: {
      base: "#51405f", mid: "#725687", light: "#b293d0", dark: "#17101f",
      accent: "#c47adf", glow: "#6de0db", eyes: "#050608", patch: "void", accessory: "orb"
    }
  };
  return creatureModel(hero, specs[hero.shape] || specs.thorn);
}

function creatureModel(hero, spec) {
  return `
    <g class="model-creature">
      <ellipse cx="80" cy="141" rx="48" ry="13" fill="rgba(0,0,0,0.34)"/>
      ${creatureBackAccessory(spec)}
      <path d="M48 81 C35 91, 27 111, 25 131 C31 139, 43 136, 49 127 C50 115, 55 101, 66 94 Z" fill="${spec.dark}"/>
      <path d="M112 81 C126 91, 135 112, 137 133 C131 141, 118 138, 111 128 C110 115, 105 101, 94 94 Z" fill="${spec.dark}"/>
      <path d="M42 92 L57 83 L70 95 L57 116 L39 113 Z" fill="${spec.mid}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M118 92 L103 83 L90 95 L103 116 L121 113 Z" fill="${spec.mid}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M31 112 L55 105 L66 124 L54 149 L28 143 L20 126 Z" fill="${spec.base}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M129 112 L105 105 L94 124 L106 149 L132 143 L140 126 Z" fill="${spec.base}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M57 79 L75 67 L96 68 L111 83 L106 116 L94 131 L65 131 L52 116 Z" fill="${spec.base}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M66 86 L80 76 L94 86 L92 110 L80 120 L67 110 Z" fill="${spec.mid}" opacity="0.92"/>
      <path d="M65 130 L78 130 L75 151 L61 154 L54 145 Z" fill="${spec.mid}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M95 130 L82 130 L85 151 L99 154 L106 145 Z" fill="${spec.mid}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M53 150 L76 148 L82 158 L67 166 L49 162 Z" fill="${spec.base}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M107 150 L84 148 L78 158 L93 166 L111 162 Z" fill="${spec.base}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M44 42 C45 24, 60 14, 82 13 C105 14, 121 27, 123 47 C125 66, 111 78, 88 82 C66 83, 48 74, 44 55 Z" fill="${spec.base}" stroke="${spec.dark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M53 34 L76 20 L103 24 L117 42 L104 58 L76 63 L53 54 Z" fill="${spec.mid}" opacity="0.88"/>
      <path d="M49 50 L64 62 L61 72 L48 63 Z" fill="${spec.dark}" opacity="0.42"/>
      <path d="M115 49 L99 62 L102 72 L116 62 Z" fill="${spec.dark}" opacity="0.42"/>
      <path d="M67 47 C65 38, 72 33, 79 37 C84 40, 84 50, 77 54 C71 57, 68 53, 67 47 Z" fill="${spec.eyes}"/>
      <path d="M94 47 C92 38, 99 33, 106 37 C111 40, 111 50, 104 54 C98 57, 95 53, 94 47 Z" fill="${spec.eyes}"/>
      <circle cx="76" cy="42" r="3" fill="#ffffff" opacity="0.75"/>
      <circle cx="103" cy="42" r="3" fill="#ffffff" opacity="0.75"/>
      <path d="M76 61 L90 60 L96 68 L82 72 Z" fill="${spec.light}" opacity="0.58"/>
      <path d="M59 28 C71 17, 95 18, 109 29" fill="none" stroke="${spec.light}" stroke-width="4" opacity="0.36" stroke-linecap="round"/>
      <path d="M60 88 L75 77 M87 77 L103 90 M62 111 L79 120 M98 120 L107 104 M37 124 L58 117 M122 123 L103 117" fill="none" stroke="${spec.dark}" stroke-width="3" opacity="0.42" stroke-linecap="round"/>
      ${creatureElementPatches(spec)}
      ${creatureFrontAccessory(spec)}
    </g>
  `;
}

function creatureElementPatches(spec) {
  const fill = spec.accent;
  const glow = spec.glow;
  const common = `
    <path d="M61 25 C71 20, 78 25, 73 35 C65 38, 57 34, 61 25 Z" fill="${fill}" opacity="0.88"/>
    <path d="M101 28 C112 27, 118 34, 112 42 C104 44, 97 38, 101 28 Z" fill="${fill}" opacity="0.82"/>
    <path d="M56 91 C65 87, 72 92, 68 101 C59 104, 52 99, 56 91 Z" fill="${fill}" opacity="0.82"/>
    <path d="M110 111 C122 108, 128 117, 121 128 C110 129, 104 121, 110 111 Z" fill="${fill}" opacity="0.84"/>
    <path d="M34 121 C43 116, 51 122, 47 133 C37 136, 30 130, 34 121 Z" fill="${fill}" opacity="0.82"/>
  `;
  if (spec.patch === "magma") {
    return common + `<path d="M72 83 L84 102 L78 123 M95 89 L88 108" fill="none" stroke="${glow}" stroke-width="5" stroke-linecap="round" opacity="0.82"/>`;
  }
  if (spec.patch === "lightning") {
    return common + `<path d="M82 76 L70 105 H82 L73 132 L99 94 H84 Z" fill="${glow}" opacity="0.82"/>`;
  }
  if (spec.patch === "crystal") {
    return common + `<path d="M80 74 L96 94 L81 119 L65 94 Z" fill="${glow}" opacity="0.78"/><path d="M81 74 V119 M65 94 H96" stroke="#fff8ec" stroke-width="2" opacity="0.55"/>`;
  }
  if (spec.patch === "void") {
    return common + `<circle cx="82" cy="100" r="15" fill="${fill}" opacity="0.78"/><circle cx="82" cy="100" r="7" fill="${spec.dark}"/><circle cx="82" cy="100" r="3" fill="${glow}"/>`;
  }
  return common;
}

function creatureBackAccessory(spec) {
  if (spec.accessory === "horns") {
    return `<path d="M55 35 C34 21, 36 7, 53 15 C49 20, 51 28, 65 38 Z" fill="${spec.light}" stroke="${spec.dark}" stroke-width="3"/><path d="M105 35 C126 21, 124 7, 107 15 C111 20, 109 28, 95 38 Z" fill="${spec.light}" stroke="${spec.dark}" stroke-width="3"/>`;
  }
  if (spec.accessory === "rod") {
    return `<path d="M126 32 L116 127" stroke="${spec.light}" stroke-width="6" stroke-linecap="round"/><circle cx="127" cy="31" r="12" fill="${spec.glow}"/><path d="M127 13 V49 M109 31 H145" stroke="#fff" stroke-width="3" opacity="0.55"/>`;
  }
  if (spec.accessory === "shell") {
    return `<path d="M31 67 C20 50, 31 33, 51 34 C42 45, 42 58, 55 70 Z" fill="${spec.glow}" opacity="0.58"/>`;
  }
  if (spec.accessory === "crescent") {
    return `<circle cx="121" cy="34" r="16" fill="${spec.accent}" opacity="0.38"/><circle cx="128" cy="30" r="15" fill="#111313"/>`;
  }
  return "";
}

function creatureFrontAccessory(spec) {
  if (spec.accessory === "ember") {
    return `<path d="M125 42 C141 60, 123 71, 135 90 C116 84, 107 67, 119 52 C123 47, 124 43, 125 42 Z" fill="${spec.accent}" opacity="0.86"/>`;
  }
  if (spec.accessory === "bulwark") {
    return `<path d="M114 84 L143 96 L138 130 C134 145, 123 152, 114 156 C104 151, 96 144, 92 130 L88 96 Z" fill="${spec.mid}" stroke="${spec.dark}" stroke-width="3"/><path d="M114 94 V145 M99 116 H130" stroke="${spec.accent}" stroke-width="5" opacity="0.7"/>`;
  }
  if (spec.accessory === "crystal") {
    return `<path d="M125 39 L145 77 L126 112 L107 77 Z" fill="${spec.glow}" stroke="${spec.dark}" stroke-width="3" opacity="0.9"/><path d="M126 39 V112 M107 77 H145" stroke="#fff8ec" stroke-width="3" opacity="0.48"/>`;
  }
  if (spec.accessory === "orb") {
    return `<circle cx="123" cy="82" r="20" fill="${spec.accent}" opacity="0.86"/><circle cx="123" cy="82" r="9" fill="${spec.dark}"/><circle cx="123" cy="82" r="4" fill="${spec.glow}"/><path d="M101 82 C111 65, 136 65, 146 82 C136 99, 111 99, 101 82 Z" fill="none" stroke="${spec.glow}" stroke-width="3" opacity="0.58"/>`;
  }
  return "";
}
function heroSigil(hero) {
  const stroke = hero.secondary;
  const fill = hero.color;
  if (hero.shape === "flame") return `<path d="M127 31 C138 46, 125 54, 134 68 C119 63, 112 50, 121 39 C124 35, 125 32, 127 31 Z" fill="${fill}" opacity="0.76"/>`;
  if (hero.shape === "tide") return `<path d="M25 50 C39 38, 51 41, 58 53 C47 50, 39 54, 34 64 C30 59, 27 55, 25 50 Z" fill="${fill}" opacity="0.78"/>`;
  if (hero.shape === "veil") return `<circle cx="129" cy="36" r="13" fill="${fill}" opacity="0.38"/><circle cx="134" cy="34" r="12" fill="#111313"/>`;
  if (hero.shape === "iron") return `<path d="M28 34 V66 M14 50 H42" stroke="${stroke}" stroke-width="5" stroke-linecap="round" opacity="0.75"/>`;
  if (hero.shape === "storm") return `<path d="M31 27 L17 55 H31 L24 76 L47 43 H32 Z" fill="${stroke}" opacity="0.82"/>`;
  if (hero.shape === "thorn") return `<path d="M25 72 C39 55, 50 51, 60 38 M38 59 L26 52 M45 51 L44 36" stroke="${stroke}" stroke-width="5" stroke-linecap="round" opacity="0.66"/>`;
  if (hero.shape === "prism") return `<path d="M129 24 L145 47 L129 70 L113 47 Z" fill="${fill}" opacity="0.78"/><path d="M129 24 V70 M113 47 H145" stroke="#fff8ec" stroke-width="3" opacity="0.52"/>`;
  if (hero.shape === "void") return `<circle cx="128" cy="42" r="18" fill="${fill}" opacity="0.62"/><circle cx="128" cy="42" r="9" fill="#111313"/><circle cx="128" cy="42" r="4" fill="${stroke}"/>`;
  return "";
}







