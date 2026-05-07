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

  el.playerPortrait.innerHTML = heroSvg(hero);
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
  switch (hero.shape) {
    case "flame":
      return characterBase(hero, {
        cape: "flame",
        helm: "topknot",
        torso: "lamellar",
        weapon: "katana",
        offhand: "ember",
        stance: "duelist"
      });
    case "tide":
      return characterBase(hero, {
        cape: "wave",
        helm: "crest",
        torso: "scale",
        weapon: "trident",
        offhand: "towerShield",
        stance: "guardian"
      });
    case "veil":
      return characterBase(hero, {
        cape: "cloak",
        helm: "hood",
        torso: "leather",
        weapon: "daggers",
        offhand: "smoke",
        stance: "assassin"
      });
    case "iron":
      return characterBase(hero, {
        cape: "banner",
        helm: "haloHelm",
        torso: "plate",
        weapon: "mace",
        offhand: "kiteShield",
        stance: "tank"
      });
    case "storm":
      return characterBase(hero, {
        cape: "stormRobe",
        helm: "crown",
        torso: "robe",
        weapon: "staff",
        offhand: "spark",
        stance: "caster"
      });
    case "thorn":
      return characterBase(hero, {
        cape: "vines",
        helm: "horns",
        torso: "hide",
        weapon: "claws",
        offhand: "thorns",
        stance: "bruiser"
      });
    case "prism":
      return characterBase(hero, {
        cape: "shortCape",
        helm: "visor",
        torso: "lightArmor",
        weapon: "bow",
        offhand: "quiver",
        stance: "archer"
      });
    case "void":
      return characterBase(hero, {
        cape: "voidCoat",
        helm: "mask",
        torso: "alchemist",
        weapon: "flask",
        offhand: "orb",
        stance: "alchemist"
      });
    default:
      return characterBase(hero, {});
  }
}

function characterBase(hero, look) {
  const grad = `url(#g-${hero.id})`;
  const skin = look.helm === "mask" || look.helm === "hood" ? "#d6d1c7" : "#cda37a";
  return `
    <g class="sprite-character">
      ${capeSvg(look.cape, grad, hero)}
      ${weaponBackSvg(look.weapon, grad, hero)}
      <path d="M55 125 L66 88 L78 90 L73 130 Z" fill="#222827"/>
      <path d="M105 125 L94 88 L82 90 L87 130 Z" fill="#1a1e1e"/>
      <path d="M51 130 C59 124, 71 124, 77 132 L52 137 Z" fill="#2e3433"/>
      <path d="M109 130 C101 124, 89 124, 83 132 L108 137 Z" fill="#2e3433"/>
      <path d="M58 70 C61 56, 70 49, 80 49 C91 49, 100 57, 103 70 L98 104 C92 112, 68 112, 62 104 Z" fill="#191d1d"/>
      ${torsoSvg(look.torso, grad, hero)}
      ${armsSvg(look.weapon, look.offhand, grad, hero)}
      <circle cx="80" cy="42" r="18" fill="${skin}"/>
      <path d="M62 43 C66 25, 95 23, 100 43 C94 36, 89 34, 80 35 C71 34, 67 36, 62 43 Z" fill="#1b1f20"/>
      ${helmSvg(look.helm, grad, hero)}
      <circle cx="73" cy="43" r="2" fill="#141616"/>
      <circle cx="87" cy="43" r="2" fill="#141616"/>
      <path d="M74 53 C78 56, 83 56, 87 53" fill="none" stroke="#5a4032" stroke-width="2" stroke-linecap="round"/>
      ${weaponFrontSvg(look.weapon, grad, hero)}
      ${offhandFxSvg(look.offhand, grad, hero)}
    </g>
  `;
}

function capeSvg(type, grad, hero) {
  if (type === "flame") return `<path d="M55 65 C38 82, 37 112, 50 130 C55 116, 65 108, 76 103 C67 91, 68 76, 80 59 C70 60, 62 62, 55 65 Z" fill="${grad}" opacity="0.62"/><path d="M98 65 C119 86, 119 112, 106 132 C100 116, 92 109, 83 103 C94 89, 92 75, 80 59 C88 60, 94 62, 98 65 Z" fill="${hero.secondary}" opacity="0.28"/>`;
  if (type === "wave") return `<path d="M50 66 C32 85, 34 116, 55 132 C61 117, 75 116, 80 99 C89 119, 107 116, 113 132 C131 112, 126 83, 107 66 Z" fill="${grad}" opacity="0.52"/><path d="M39 111 C55 102, 69 108, 80 116 C94 102, 110 103, 123 112" fill="none" stroke="#d8fff5" stroke-width="5" opacity="0.36" stroke-linecap="round"/>`;
  if (type === "cloak") return `<path d="M49 63 C35 83, 36 118, 57 137 L80 104 L105 137 C124 116, 124 82, 108 63 C95 69, 66 69, 49 63 Z" fill="#151819"/><path d="M52 69 C61 89, 65 110, 59 134" fill="none" stroke="${hero.color}" stroke-width="4" opacity="0.55"/>`;
  if (type === "banner") return `<path d="M43 65 L62 62 L61 135 L47 126 L35 135 Z" fill="${hero.secondary}" opacity="0.55"/><path d="M117 65 L98 62 L99 135 L113 126 L125 135 Z" fill="${grad}" opacity="0.46"/>`;
  if (type === "stormRobe") return `<path d="M48 66 C42 94, 47 119, 62 137 L80 110 L99 137 C114 119, 119 94, 112 66 C96 75, 64 75, 48 66 Z" fill="${grad}" opacity="0.5"/><path d="M91 69 L75 101 H88 L72 130" fill="none" stroke="#fff8ec" stroke-width="4" opacity="0.58" stroke-linejoin="round"/>`;
  if (type === "vines") return `<path d="M48 69 C35 91, 42 120, 63 136 C58 113, 62 92, 79 68 C96 92, 102 113, 97 136 C119 121, 126 91, 111 69 Z" fill="${grad}" opacity="0.44"/><path d="M49 101 C65 91, 98 93, 113 105 M57 118 C76 107, 94 109, 107 121" fill="none" stroke="#cbe6a4" stroke-width="4" opacity="0.55" stroke-linecap="round"/>`;
  if (type === "shortCape") return `<path d="M52 67 C48 89, 56 107, 70 116 L80 101 L91 116 C105 107, 112 89, 108 67 Z" fill="${grad}" opacity="0.48"/>`;
  if (type === "voidCoat") return `<path d="M47 66 C36 91, 39 121, 60 139 L80 106 L101 139 C121 121, 124 91, 113 66 C97 72, 63 72, 47 66 Z" fill="#17131d"/><path d="M48 92 C61 83, 102 83, 114 93 M55 119 C73 112, 90 112, 106 120" fill="none" stroke="${hero.color}" stroke-width="4" opacity="0.5"/>`;
  return "";
}

function torsoSvg(type, grad, hero) {
  if (type === "lamellar") return `<path d="M63 70 L97 70 L103 103 C95 113, 66 113, 58 103 Z" fill="${grad}"/><path d="M66 78 H96 M64 88 H99 M63 98 H101" stroke="#fff8ec" stroke-width="3" opacity="0.38"/>`;
  if (type === "scale") return `<path d="M61 70 L99 70 L105 102 C96 114, 64 114, 55 102 Z" fill="${grad}"/><path d="M68 80 C72 86, 77 86, 80 80 C84 86, 89 86, 93 80 M64 92 C70 99, 77 99, 80 92 C84 99, 91 99, 97 92" fill="none" stroke="#eafffb" stroke-width="3" opacity="0.42"/>`;
  if (type === "leather") return `<path d="M62 70 L98 70 L102 104 C94 111, 67 111, 59 104 Z" fill="#202526"/><path d="M64 72 L96 72 L88 103 L70 103 Z" fill="${grad}" opacity="0.72"/><path d="M72 75 L88 103" stroke="#111313" stroke-width="4" opacity="0.7"/>`;
  if (type === "plate") return `<path d="M58 72 L70 66 H91 L103 72 L108 102 C97 115, 63 115, 52 102 Z" fill="${grad}"/><path d="M66 76 H94 L99 101 C91 107, 69 107, 61 101 Z" fill="#e4e0d4" opacity="0.42"/><path d="M80 67 V109 M63 88 H98" stroke="#111313" stroke-width="4" opacity="0.55"/>`;
  if (type === "robe") return `<path d="M61 69 L99 69 L109 132 C92 140, 68 140, 51 132 Z" fill="${grad}"/><path d="M80 71 L69 132 M80 71 L93 132" stroke="#fff8ec" stroke-width="4" opacity="0.35"/>`;
  if (type === "hide") return `<path d="M57 72 L72 64 H89 L104 72 L108 105 C96 118, 64 118, 52 105 Z" fill="${grad}"/><path d="M64 75 L71 86 L61 93 L73 101 L66 113 M96 75 L89 86 L99 93 L87 101 L94 113" fill="none" stroke="#1b1e1d" stroke-width="5" opacity="0.5"/>`;
  if (type === "lightArmor") return `<path d="M61 71 L99 71 L102 101 C94 111, 66 111, 58 101 Z" fill="${grad}"/><path d="M68 76 H92 L86 103 H74 Z" fill="#fff8ec" opacity="0.48"/><circle cx="80" cy="89" r="7" fill="${hero.secondary}"/>`;
  if (type === "alchemist") return `<path d="M60 70 L100 70 L106 108 C95 118, 65 118, 54 108 Z" fill="#202326"/><path d="M67 73 H93 L98 107 C90 113, 70 113, 62 107 Z" fill="${grad}" opacity="0.68"/><path d="M71 82 H89 M69 94 H91" stroke="#fff8ec" stroke-width="3" opacity="0.36"/>`;
  return `<path d="M61 70 L99 70 L104 103 C95 113, 65 113, 56 103 Z" fill="${grad}"/>`;
}

function armsSvg(weapon, offhand, grad, hero) {
  const leftArm = `<path d="M61 75 C45 78, 39 92, 43 107" fill="none" stroke="#2b3130" stroke-width="10" stroke-linecap="round"/><circle cx="43" cy="108" r="6" fill="#cda37a"/>`;
  const rightArm = `<path d="M99 75 C115 78, 121 92, 117 107" fill="none" stroke="#2b3130" stroke-width="10" stroke-linecap="round"/><circle cx="117" cy="108" r="6" fill="#cda37a"/>`;
  if (weapon === "bow") return `<path d="M61 76 C46 79, 38 92, 39 108" fill="none" stroke="#2b3130" stroke-width="9" stroke-linecap="round"/><path d="M98 76 C111 82, 116 94, 121 108" fill="none" stroke="#2b3130" stroke-width="9" stroke-linecap="round"/><circle cx="39" cy="108" r="5" fill="#cda37a"/><circle cx="121" cy="108" r="5" fill="#cda37a"/>`;
  if (weapon === "daggers") return `<path d="M62 76 C47 79, 40 91, 36 103" fill="none" stroke="#2b3130" stroke-width="9" stroke-linecap="round"/><path d="M98 76 C113 79, 120 91, 124 103" fill="none" stroke="#2b3130" stroke-width="9" stroke-linecap="round"/><circle cx="36" cy="103" r="5" fill="#cda37a"/><circle cx="124" cy="103" r="5" fill="#cda37a"/>`;
  return leftArm + rightArm;
}

function weaponBackSvg(weapon, grad, hero) {
  if (weapon === "trident") return `<path d="M43 31 V117" stroke="#d8fff5" stroke-width="5" stroke-linecap="round"/><path d="M32 39 C37 47, 49 47, 54 39 M43 31 L33 48 M43 31 L53 48" fill="none" stroke="${hero.secondary}" stroke-width="4" stroke-linecap="round"/>`;
  if (weapon === "staff") return `<path d="M119 28 L105 124" stroke="#efe9dc" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="28" r="11" fill="${grad}"/><path d="M120 14 L120 42 M106 28 H134" stroke="#fff8ec" stroke-width="3" opacity="0.56"/>`;
  if (weapon === "bow") return `<path d="M126 40 C145 68, 145 101, 126 129" fill="none" stroke="${grad}" stroke-width="6" stroke-linecap="round"/><path d="M126 40 C132 70, 132 100, 126 129" fill="none" stroke="#fff8ec" stroke-width="2" opacity="0.7"/>`;
  if (weapon === "mace") return `<path d="M111 43 L48 123" stroke="#e4e0d4" stroke-width="6" stroke-linecap="round"/><circle cx="113" cy="41" r="13" fill="${grad}"/><path d="M113 24 V58 M96 41 H130" stroke="#111313" stroke-width="4" opacity="0.44"/>`;
  return "";
}

function weaponFrontSvg(weapon, grad, hero) {
  if (weapon === "katana") return `<path d="M111 63 L41 127" stroke="#fff8ec" stroke-width="5" stroke-linecap="round"/><path d="M105 69 L117 81" stroke="${hero.secondary}" stroke-width="6" stroke-linecap="round"/>`;
  if (weapon === "daggers") return `<path d="M34 98 L20 118" stroke="#fff8ec" stroke-width="4" stroke-linecap="round"/><path d="M126 98 L140 118" stroke="#fff8ec" stroke-width="4" stroke-linecap="round"/><path d="M31 102 L39 110 M129 102 L121 110" stroke="${hero.color}" stroke-width="4"/>`;
  if (weapon === "claws") return `<path d="M36 105 L22 115 M39 109 L24 124 M42 112 L31 130" stroke="#f3eadc" stroke-width="4" stroke-linecap="round"/><path d="M124 105 L138 115 M121 109 L136 124 M118 112 L129 130" stroke="#f3eadc" stroke-width="4" stroke-linecap="round"/>`;
  if (weapon === "flask") return `<path d="M116 91 L128 112" stroke="#d6d1c7" stroke-width="5" stroke-linecap="round"/><path d="M125 105 C116 113, 124 129, 136 125 C148 120, 139 103, 128 105 Z" fill="${grad}"/><circle cx="133" cy="115" r="4" fill="#fff8ec" opacity="0.65"/>`;
  return "";
}

function offhandFxSvg(type, grad, hero) {
  if (type === "ember") return `<path d="M38 90 C47 101, 35 105, 45 117 C34 114, 29 105, 34 96 C37 92, 36 90, 38 90 Z" fill="${grad}"/>`;
  if (type === "towerShield") return `<path d="M109 82 L132 90 L128 119 C125 131, 116 137, 109 140 C101 137, 94 131, 91 119 L88 90 Z" fill="${grad}"/><path d="M109 90 V130 M96 108 H123" stroke="#eafffb" stroke-width="4" opacity="0.55"/>`;
  if (type === "kiteShield") return `<path d="M112 79 L136 90 L130 119 C126 132, 116 138, 112 140 C106 137, 96 132, 92 119 L87 90 Z" fill="${grad}"/><path d="M112 89 V129 M99 106 H126" stroke="#111313" stroke-width="5" opacity="0.38"/>`;
  if (type === "spark") return `<path d="M40 95 L30 113 H42 L35 131 L53 106 H42 Z" fill="${grad}"/><path d="M41 97 L36 110 H44" fill="none" stroke="#fff8ec" stroke-width="3" opacity="0.62"/>`;
  if (type === "thorns") return `<path d="M118 99 C103 96, 100 112, 113 119 C127 126, 137 111, 128 101" fill="none" stroke="${hero.secondary}" stroke-width="5" stroke-linecap="round"/><path d="M106 108 L94 101 M117 119 L113 134 M129 105 L143 99" stroke="#cbe6a4" stroke-width="4" stroke-linecap="round"/>`;
  if (type === "quiver") return `<path d="M102 70 L118 65 L126 114 L111 119 Z" fill="#252b2a"/><path d="M108 64 L113 100 M115 62 L118 100 M122 62 L121 101" stroke="#fff8ec" stroke-width="3" opacity="0.65"/>`;
  if (type === "orb") return `<circle cx="42" cy="101" r="16" fill="${grad}" opacity="0.86"/><circle cx="42" cy="101" r="7" fill="#111313"/><path d="M24 101 C32 87, 53 87, 61 101 C53 115, 32 115, 24 101 Z" fill="none" stroke="#fff8ec" stroke-width="3" opacity="0.54"/>`;
  if (type === "smoke") return `<path d="M35 100 C23 101, 22 116, 35 117 C47 117, 50 101, 38 98" fill="${hero.color}" opacity="0.32"/><path d="M27 111 C39 105, 47 112, 54 104" fill="none" stroke="${hero.secondary}" stroke-width="4" opacity="0.5" stroke-linecap="round"/>`;
  return "";
}

function helmSvg(type, grad, hero) {
  if (type === "topknot") return `<path d="M70 28 C76 17, 85 17, 90 28 C84 24, 76 24, 70 28 Z" fill="${hero.secondary}"/><path d="M79 21 L81 8" stroke="${hero.secondary}" stroke-width="5" stroke-linecap="round"/>`;
  if (type === "crest") return `<path d="M62 38 C70 24, 91 24, 99 38 C92 31, 69 31, 62 38 Z" fill="${grad}"/><path d="M80 24 C75 14, 85 14, 80 24 Z" fill="#d8fff5"/>`;
  if (type === "hood") return `<path d="M57 47 C58 25, 74 18, 80 18 C91 20, 103 30, 103 47 C94 38, 67 38, 57 47 Z" fill="#151819"/><path d="M63 46 C67 32, 92 32, 97 46" fill="none" stroke="${hero.color}" stroke-width="4" opacity="0.65"/>`;
  if (type === "haloHelm") return `<path d="M61 40 C64 25, 96 25, 99 40 C90 35, 70 35, 61 40 Z" fill="${grad}"/><ellipse cx="80" cy="25" rx="22" ry="7" fill="none" stroke="${hero.secondary}" stroke-width="4" opacity="0.78"/>`;
  if (type === "crown") return `<path d="M61 35 L67 22 L77 33 L80 18 L84 33 L94 22 L100 35 Z" fill="${grad}"/><circle cx="80" cy="19" r="4" fill="#fff8ec"/>`;
  if (type === "horns") return `<path d="M65 34 C49 25, 48 12, 62 18 C57 22, 61 28, 70 34 Z" fill="#d8d0bb"/><path d="M95 34 C111 25, 112 12, 98 18 C103 22, 99 28, 90 34 Z" fill="#d8d0bb"/><path d="M60 43 C63 25, 97 25, 100 43" fill="${grad}"/>`;
  if (type === "visor") return `<path d="M60 40 C64 27, 96 27, 100 40 L96 47 H64 Z" fill="${grad}"/><path d="M66 42 H94" stroke="#fff8ec" stroke-width="4" opacity="0.66"/>`;
  if (type === "mask") return `<path d="M62 39 C64 25, 96 25, 98 39 C98 54, 89 63, 80 65 C71 63, 62 54, 62 39 Z" fill="#d6d1c7"/><path d="M67 43 H76 M84 43 H93" stroke="#111313" stroke-width="4" stroke-linecap="round"/><path d="M80 47 L76 56 H84 Z" fill="${hero.color}" opacity="0.7"/>`;
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




