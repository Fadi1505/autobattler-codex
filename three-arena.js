const THREE_URL = "three";
const GLTF_LOADER_URL = "three/addons/loaders/GLTFLoader.js";

let THREE;
let GLTFLoader;
let gltfLoader;
let scene;
let camera;
let renderer;
let clock;
let container;
let resizeObserver;
let arenaReady = false;

const units = {
  left: null,
  right: null
};

const effects = [];
const knownHeroes = new Map();
const modelViewers = new Map();
const basePositions = {
  left: { x: -2.35, y: 0, z: 0.12 },
  right: { x: 2.35, y: 0, z: -0.12 }
};

const api = {
  setHeroes,
  hydrateViewers,
  update,
  playEffect,
  clearEffects
};

window.Arena3D = api;
boot();

async function boot() {
  container = document.getElementById("arenaScene3d");
  if (!container) return;

  try {
    THREE = await import(THREE_URL);
    try {
      ({ GLTFLoader } = await import(GLTF_LOADER_URL));
      gltfLoader = new GLTFLoader();
    } catch {
      gltfLoader = null;
    }
  } catch (error) {
    console.warn("3D arena could not load. Falling back to 2D portraits.", error);
    return;
  }

  setupScene();
  arenaReady = true;
  document.body.classList.add("arena-3d-ready");

  if (Array.isArray(window.__arena3DHeroes)) setHeroes(window.__arena3DHeroes);
  if (window.__arena3DState) update(window.__arena3DState);
  if (window.__arena3DNeedsHydrate) hydrateViewers();
  if (Array.isArray(window.__arena3DEffectQueue)) {
    window.__arena3DEffectQueue.splice(0).forEach((effect) => playEffect(effect));
  }

  renderer.setAnimationLoop(animate);
}

function setupScene() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x101411, 7, 15);

  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0, 4.2, 8.1);
  camera.lookAt(0, 1.05, 0);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xfff4d5, 0x24342e, 1.5);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffdf9a, 2.25);
  key.position.set(-3.7, 7, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 18;
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x78e8e0, 1.15);
  rim.position.set(4, 3, -5);
  scene.add(rim);

  const arena = createArena();
  scene.add(arena);

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();
}

function createArena() {
  const group = new THREE.Group();

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x202a23,
    roughness: 0.92,
    metalness: 0.02
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 5.25), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  const laneMaterial = new THREE.MeshStandardMaterial({
    color: 0x314237,
    roughness: 0.9
  });
  const lane = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 1.45), laneMaterial);
  lane.rotation.x = -Math.PI / 2;
  lane.position.y = 0.012;
  lane.receiveShadow = true;
  group.add(lane);

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0c684,
    roughness: 0.66,
    metalness: 0.18
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.025, 8, 72), ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.035;
  group.add(ring);

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x65706a,
    roughness: 0.86,
    metalness: 0.03
  });
  for (let i = 0; i < 12; i += 1) {
    const x = -4.35 + i * 0.79;
    addStone(group, stoneMaterial, x, -2.74, 0.72, 0.18);
    addStone(group, stoneMaterial, x, 2.74, 0.72, 0.18);
  }
  for (let i = 0; i < 6; i += 1) {
    const z = -2.15 + i * 0.86;
    addStone(group, stoneMaterial, -4.82, z, 0.2, 0.74);
    addStone(group, stoneMaterial, 4.82, z, 0.2, 0.74);
  }

  const torchMaterial = new THREE.MeshStandardMaterial({
    color: 0x342a1d,
    roughness: 0.8
  });
  const fireMaterial = new THREE.MeshStandardMaterial({
    color: 0xffb642,
    emissive: 0xff7a2a,
    emissiveIntensity: 1.7,
    roughness: 0.45
  });
  [
    [-3.7, -2.2],
    [3.7, -2.2],
    [-3.7, 2.2],
    [3.7, 2.2]
  ].forEach(([x, z]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.7, 8), torchMaterial);
    post.position.set(x, 0.35, z);
    post.castShadow = true;
    group.add(post);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 9), fireMaterial);
    flame.position.set(x, 0.88, z);
    flame.userData.isFlame = true;
    group.add(flame);
    const light = new THREE.PointLight(0xffa248, 0.75, 3);
    light.position.set(x, 0.9, z);
    group.add(light);
  });

  return group;
}

function addStone(group, material, x, z, sx, sz) {
  const block = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.16, sz), material);
  block.position.set(x, 0.08, z);
  block.rotation.y = Math.sin(x * 3.1 + z) * 0.035;
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);
}

function setHeroes(heroes) {
  if (!Array.isArray(heroes)) return;
  heroes.forEach((hero) => {
    if (!hero?.id) return;
    knownHeroes.set(hero.id, {
      id: hero.id,
      name: hero.name,
      color: hero.color,
      secondary: hero.secondary,
      shape: hero.shape
    });
  });
}

function hydrateViewers(root = document) {
  if (!arenaReady) {
    window.__arena3DNeedsHydrate = true;
    return;
  }

  modelViewers.forEach((viewer, element) => {
    if (!document.body.contains(element) || !isViewerInActiveScreen(element)) disposeViewer(element);
  });

  root.querySelectorAll(".hero-3d-viewer").forEach((element) => {
    if (!isViewerInActiveScreen(element)) return;
    if (modelViewers.has(element)) return;
    const hero = getViewerHero(element);
    if (!hero) return;
    const viewer = createModelViewer(element, hero);
    modelViewers.set(element, viewer);
    resizeViewer(element);
    element.classList.add("model-ready");
  });

  window.__arena3DNeedsHydrate = false;
}

function getViewerHero(element) {
  const id = element.dataset.heroId;
  return knownHeroes.get(id) || {
    id,
    name: element.dataset.heroName || id,
    color: element.dataset.heroColor || "#d95748",
    secondary: element.dataset.heroSecondary || "#f2b84b",
    shape: element.dataset.heroShape || "flame"
  };
}

function createModelViewer(element, hero) {
  const viewerScene = new THREE.Scene();
  const viewerCamera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
  const viewerRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  viewerRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  viewerRenderer.shadowMap.enabled = true;
  viewerRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  element.appendChild(viewerRenderer.domElement);

  const hemi = new THREE.HemisphereLight(0xfff1d6, 0x18221e, 1.45);
  viewerScene.add(hemi);
  const key = new THREE.DirectionalLight(0xffd89a, 1.85);
  key.position.set(-2.6, 4.2, 4.4);
  key.castShadow = true;
  viewerScene.add(key);
  const rim = new THREE.DirectionalLight(0x7de4dc, 0.8);
  rim.position.set(2.8, 2.2, -3);
  viewerScene.add(rim);

  const model = createHeroModel(hero, "left");
  model.group.position.set(0, -0.08, 0);
  model.group.scale.setScalar(viewerScale(element.dataset.viewerVariant));
  viewerScene.add(model.group);
  loadExternalHeroModel(model, hero);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 0.88, 0.08, 36),
    transparentMaterial(hero.secondary || "#f2b84b", 0.26, 0.25)
  );
  base.position.y = -0.02;
  viewerScene.add(base);

  const observer = new ResizeObserver(() => resizeViewer(element));
  observer.observe(element);

  const viewer = {
    element,
    hero,
    scene: viewerScene,
    camera: viewerCamera,
    renderer: viewerRenderer,
    model,
    base,
    observer,
    variant: element.dataset.viewerVariant || "card"
  };
  return viewer;
}

function update(payload) {
  window.__arena3DState = payload;
  if (!arenaReady || !payload) return;

  ensureUnit("left", payload.left);
  ensureUnit("right", payload.right);

  applyUnitPayload(units.left, payload.left);
  applyUnitPayload(units.right, payload.right);
}

function ensureUnit(side, payload) {
  const current = units[side];
  if (!payload) {
    if (current) current.group.visible = false;
    return;
  }

  if (current && current.heroId === payload.hero.id) {
    current.group.visible = true;
    return;
  }

  if (current) scene.remove(current.group);
  const model = createHeroModel(payload.hero, side);
  const base = getBasePosition(side);
  model.group.position.set(base.x, base.y, base.z);
  scene.add(model.group);
  units[side] = model;
  loadExternalHeroModel(model, payload.hero);
}

function applyUnitPayload(model, payload) {
  if (!model || !payload) return;
  model.payload = payload;
  model.group.visible = true;
}

function createHeroModel(hero, side) {
  const group = new THREE.Group();
  const primary = hero.color || "#d95748";
  const secondary = hero.secondary || "#f2b84b";
  const mats = {
    primary: material(primary),
    secondary: material(secondary),
    dark: material("#1a1f20"),
    leather: material("#5b4030"),
    metal: material("#aab3ad", 0.58, 0.16),
    armor: material("#2f3936", 0.7, 0.08),
    cloth: material("#273130", 0.88, 0.01),
    stone: material("#c8cfcc", 0.88, 0.04),
    skin: material(heroSkinColor(hero), 0.74, 0.02),
    glow: material(secondary, 0.35, 0.08, secondary, 1.6),
    black: material("#071014", 0.72, 0)
  };

  const root = new THREE.Group();
  root.rotation.y = side === "left" ? -0.34 : 0.34;
  group.add(root);

  const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.64, 1), mats.primary);
  body.position.y = 1.08;
  body.scale.set(0.82, 1.04, 0.62);
  body.castShadow = true;
  root.add(body);

  const belly = new THREE.Mesh(new THREE.DodecahedronGeometry(0.31, 0), mats.secondary);
  belly.position.set(0, 1.06, 0.38);
  belly.scale.set(1.08, 0.74, 0.3);
  belly.castShadow = true;
  root.add(belly);

  const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.56, 1), mats.skin);
  head.position.y = 1.82;
  head.scale.set(1.04, 0.92, 0.98);
  head.castShadow = true;
  root.add(head);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), mats.black);
  const eyeR = eyeL.clone();
  eyeL.position.set(-0.18, 1.87, 0.48);
  eyeR.position.set(0.18, 1.87, 0.48);
  root.add(eyeL, eyeR);

  const browL = createBox(0.18, 0.035, 0.035, mats.dark, [-0.19, 2.01, 0.48]);
  const browR = createBox(0.18, 0.035, 0.035, mats.dark, [0.19, 2.01, 0.48]);
  browL.rotation.z = 0.22;
  browR.rotation.z = -0.22;
  root.add(browL, browR);

  const leftArm = limb(0.12, 0.62, mats.skin);
  leftArm.position.set(-0.55, 1.1, 0.02);
  leftArm.rotation.z = 0.35;
  const rightArm = limb(0.12, 0.62, mats.skin);
  rightArm.position.set(0.55, 1.1, 0.02);
  rightArm.rotation.z = -0.35;
  root.add(leftArm, rightArm);

  const leftLeg = limb(0.13, 0.5, mats.leather);
  leftLeg.position.set(-0.23, 0.45, 0);
  const rightLeg = limb(0.13, 0.5, mats.leather);
  rightLeg.position.set(0.23, 0.45, 0);
  root.add(leftLeg, rightLeg);

  const leftFoot = createBox(0.34, 0.15, 0.46, mats.leather, [-0.23, 0.12, 0.12]);
  const rightFoot = createBox(0.34, 0.15, 0.46, mats.leather, [0.23, 0.12, 0.12]);
  root.add(leftFoot, rightFoot);

  const parts = {
    root,
    body,
    head,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg
  };

  addCoreModelDetails(root, mats, parts);
  addHeroAccessories(root, hero, mats, parts);

  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.025, 8, 64),
    transparentMaterial(secondary, 0.34, 0.9)
  );
  aura.rotation.x = Math.PI / 2;
  aura.position.y = 0.08;
  aura.visible = false;
  group.add(aura);

  const shield = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 28, 16),
    transparentMaterial("#8fd6ff", 0.16, 0.35)
  );
  shield.position.y = 1.1;
  shield.scale.set(1.0, 1.15, 0.8);
  shield.visible = false;
  group.add(shield);

  parts.aura = aura;
  parts.shield = shield;
  return {
    heroId: hero.id,
    side,
    group,
    parts,
    payload: null
  };
}

function addHeroAccessories(root, hero, mats, parts) {
  switch (hero.shape) {
    case "flame":
      addHelmet(root, mats.armor, mats.secondary);
      addShoulders(root, mats.metal, 0.22);
      addSword(root, mats.metal, mats.secondary, [0.68, 1.14, 0.12], -0.45);
      addFlames(root, mats.secondary, mats.primary);
      break;
    case "tide":
      parts.body.scale.set(0.98, 1.08, 0.72);
      addShellPlates(root, mats.metal, mats.secondary);
      addShield(root, mats.secondary, [-0.68, 1.08, 0.2], 0.52);
      addShoulders(root, mats.metal, 0.24);
      break;
    case "veil":
      addHood(root, mats.dark, mats.primary);
      addCape(root, mats.primary);
      addSword(root, mats.metal, mats.secondary, [0.62, 1.03, 0.18], -0.58);
      break;
    case "saint":
      addHelmet(root, mats.metal, mats.secondary);
      addShoulders(root, mats.metal, 0.24);
      addShield(root, mats.primary, [-0.68, 1.12, 0.25], 0.62);
      addHammer(root, mats.metal, mats.secondary, [0.62, 1.1, 0.08]);
      break;
    case "storm":
      addRobePanels(root, mats.primary, mats.secondary);
      addStaff(root, mats.metal, mats.glow, [0.62, 1.1, 0.12]);
      addCrown(root, mats.secondary);
      break;
    case "thorn":
      parts.body.scale.set(1.18, 1.08, 0.9);
      parts.head.position.y = 1.75;
      addShoulders(root, mats.secondary, 0.26);
      addHorns(root, mats.secondary);
      addClaws(root, mats.metal);
      break;
    case "prism":
      addShoulders(root, mats.secondary, 0.16);
      addBow(root, mats.secondary, [0.66, 1.13, 0.14]);
      addQuiver(root, mats.dark, mats.secondary);
      break;
    case "void":
      addHood(root, mats.primary, mats.dark);
      addCape(root, mats.dark);
      addRobePanels(root, mats.dark, mats.secondary);
      addOrb(root, mats.glow, [0.62, 1.24, 0.28]);
      break;
    default:
      addSword(root, mats.metal, mats.secondary, [0.68, 1.14, 0.12], -0.45);
  }
}

function addCoreModelDetails(root, mats, parts) {
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.2, 10), mats.skin);
  neck.position.y = 1.48;
  neck.castShadow = true;
  root.add(neck);

  const belt = createBox(0.78, 0.14, 0.68, mats.dark, [0, 0.73, 0.02]);
  const buckle = createBox(0.16, 0.16, 0.08, mats.secondary, [0, 0.75, 0.38]);
  root.add(belt, buckle);

  const chestTop = createBox(0.62, 0.12, 0.11, mats.armor, [0, 1.35, 0.42]);
  const chestLeft = createBox(0.25, 0.33, 0.1, mats.armor, [-0.17, 1.15, 0.45]);
  const chestRight = createBox(0.25, 0.33, 0.1, mats.armor, [0.17, 1.15, 0.45]);
  root.add(chestTop, chestLeft, chestRight);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.16, 6), mats.skin);
  nose.position.set(0, 1.81, 0.58);
  nose.rotation.x = Math.PI / 2;
  nose.castShadow = true;
  root.add(nose);

  const mouth = createBox(0.18, 0.025, 0.02, mats.dark, [0, 1.66, 0.55]);
  mouth.rotation.x = 0.1;
  root.add(mouth);

  const leftHand = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), mats.skin);
  leftHand.position.set(-0.68, 0.76, 0.18);
  leftHand.castShadow = true;
  const rightHand = leftHand.clone();
  rightHand.position.x = 0.68;
  root.add(leftHand, rightHand);

  const leftGauntlet = createBox(0.19, 0.2, 0.2, mats.armor, [-0.58, 0.86, 0.13]);
  const rightGauntlet = createBox(0.19, 0.2, 0.2, mats.armor, [0.58, 0.86, 0.13]);
  root.add(leftGauntlet, rightGauntlet);

  const leftKnee = createBox(0.2, 0.14, 0.12, mats.armor, [-0.23, 0.46, 0.18]);
  const rightKnee = createBox(0.2, 0.14, 0.12, mats.armor, [0.23, 0.46, 0.18]);
  root.add(leftKnee, rightKnee);

  parts.leftHand = leftHand;
  parts.rightHand = rightHand;
}

function addSword(root, bladeMat, hiltMat, pos, zRot) {
  const blade = createBox(0.09, 0.86, 0.055, bladeMat, pos);
  blade.rotation.z = zRot;
  const hilt = createBox(0.33, 0.07, 0.08, hiltMat, [pos[0] - 0.11, pos[1] - 0.34, pos[2]]);
  hilt.rotation.z = zRot;
  root.add(blade, hilt);
}

function addHammer(root, headMat, handleMat, pos) {
  const handle = createBox(0.08, 0.82, 0.08, handleMat, pos);
  handle.rotation.z = -0.3;
  const head = createBox(0.42, 0.23, 0.24, headMat, [pos[0] + 0.1, pos[1] + 0.38, pos[2]]);
  head.rotation.z = -0.3;
  root.add(handle, head);
}

function addShield(root, mat, pos, radius) {
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.12, 28), mat);
  shield.position.set(pos[0], pos[1], pos[2]);
  shield.rotation.set(Math.PI / 2, 0.16, 0.08);
  shield.castShadow = true;
  root.add(shield);
}

function addStaff(root, staffMat, orbMat, pos) {
  const staff = createBox(0.07, 1.28, 0.07, staffMat, pos);
  staff.rotation.z = -0.12;
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 12), orbMat);
  orb.position.set(pos[0] + 0.08, pos[1] + 0.72, pos[2]);
  root.add(staff, orb);
}

function addBow(root, mat, pos) {
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.025, 8, 36, Math.PI * 1.3), mat);
  bow.position.set(pos[0], pos[1], pos[2]);
  bow.rotation.set(0.1, 0.1, Math.PI / 2);
  const string = createBox(0.025, 0.72, 0.025, material("#f5f0e8"), [pos[0] + 0.05, pos[1], pos[2]]);
  root.add(bow, string);
}

function addQuiver(root, mat, arrowMat) {
  const quiver = createBox(0.22, 0.62, 0.2, mat, [-0.38, 1.2, -0.36]);
  quiver.rotation.z = -0.42;
  root.add(quiver);
  for (let i = 0; i < 3; i += 1) {
    const arrow = createBox(0.035, 0.55, 0.035, arrowMat, [-0.43 + i * 0.05, 1.58, -0.44]);
    arrow.rotation.z = -0.42;
    root.add(arrow);
  }
}

function addShellPlates(root, plateMat, trimMat) {
  for (let i = 0; i < 4; i += 1) {
    const plate = createBox(0.42, 0.16, 0.12, i % 2 ? plateMat : trimMat, [-0.27 + i * 0.18, 1.26 - i * 0.13, -0.46]);
    plate.rotation.x = -0.24;
    plate.rotation.z = -0.18 + i * 0.12;
    root.add(plate);
  }
}

function addRobePanels(root, clothMat, trimMat) {
  const center = createBox(0.34, 0.78, 0.08, clothMat, [0, 0.62, 0.43]);
  center.rotation.x = 0.1;
  const left = createBox(0.22, 0.7, 0.07, clothMat, [-0.26, 0.6, 0.37]);
  left.rotation.z = -0.14;
  const right = createBox(0.22, 0.7, 0.07, clothMat, [0.26, 0.6, 0.37]);
  right.rotation.z = 0.14;
  const trim = createBox(0.42, 0.07, 0.08, trimMat, [0, 0.98, 0.47]);
  root.add(center, left, right, trim);
}

function addOrb(root, mat, pos) {
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), mat);
  orb.position.set(pos[0], pos[1], pos[2]);
  root.add(orb);
}

function addFlames(root, flameMat, baseMat) {
  for (let i = 0; i < 3; i += 1) {
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12 - i * 0.015, 0.38, 8), i % 2 ? baseMat : flameMat);
    flame.position.set(-0.14 + i * 0.14, 2.38 + i * 0.04, 0.04);
    flame.rotation.z = -0.2 + i * 0.2;
    flame.castShadow = true;
    root.add(flame);
  }
}

function addHood(root, hoodMat, trimMat) {
  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.56, 24, 1, true), hoodMat);
  hood.position.set(0, 2.03, 0);
  hood.rotation.x = -0.04;
  hood.castShadow = true;
  root.add(hood);
  const trim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 8, 30), trimMat);
  trim.position.set(0, 1.77, 0.08);
  trim.rotation.x = Math.PI / 2;
  root.add(trim);
}

function addCape(root, mat) {
  const cape = createBox(0.84, 1.18, 0.08, mat, [0, 1.05, -0.48]);
  cape.rotation.x = -0.18;
  root.add(cape);
}

function addHelmet(root, metalMat, hornMat) {
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.055, 8, 28), metalMat);
  band.position.set(0, 2.02, 0.01);
  band.rotation.x = Math.PI / 2;
  root.add(band);
  addHorns(root, hornMat);
}

function addHorns(root, mat) {
  const left = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.38, 10), mat);
  left.position.set(-0.4, 2.14, 0.02);
  left.rotation.z = 0.78;
  const right = left.clone();
  right.position.x = 0.4;
  right.rotation.z = -0.78;
  root.add(left, right);
}

function addCrown(root, mat) {
  for (let i = 0; i < 5; i += 1) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.28, 8), mat);
    spike.position.set(-0.28 + i * 0.14, 2.27 + Math.abs(i - 2) * -0.02, 0.02);
    root.add(spike);
  }
}

function addShoulders(root, mat, size) {
  const left = new THREE.Mesh(new THREE.SphereGeometry(size, 14, 10), mat);
  left.position.set(-0.48, 1.45, 0.02);
  left.scale.set(1.45, 0.8, 1);
  const right = left.clone();
  right.position.x = 0.48;
  root.add(left, right);
}

function addClaws(root, mat) {
  [-0.72, 0.72].forEach((x, armIndex) => {
    for (let i = 0; i < 3; i += 1) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 7), mat);
      claw.position.set(x + (armIndex ? i * 0.035 : -i * 0.035), 0.72, 0.34);
      claw.rotation.x = Math.PI / 2;
      root.add(claw);
    }
  });
}

function limb(radius, length, mat) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 4, 10), mat);
  mesh.castShadow = true;
  return mesh;
}

function createBox(w, h, d, mat, pos) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function material(color, roughness = 0.78, metalness = 0.04, emissive = null, emissiveIntensity = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive: emissive || "#000000",
    emissiveIntensity,
    flatShading: true
  });
}

function transparentMaterial(color, opacity, emissiveIntensity = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.32,
    metalness: 0.04,
    emissive: color,
    emissiveIntensity,
    depthWrite: false
  });
}

function heroSkinColor(hero) {
  const colors = {
    flame: "#d99b63",
    tide: "#83b7ad",
    veil: "#9ba9c9",
    saint: "#e3b07a",
    storm: "#d8d3c4",
    thorn: "#84a165",
    prism: "#d8a06f",
    void: "#8798bd"
  };
  return colors[hero.shape] || "#d99b63";
}

async function loadExternalHeroModel(model, hero) {
  if (!gltfLoader || !model || !hero?.id) return;
  const url = `assets/models/${hero.id}.glb`;
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) return;
    const gltf = await gltfLoader.loadAsync(url);
    if (!model.group || model.heroId !== hero.id) return;
    const assetRoot = gltf.scene;
    prepareExternalModel(assetRoot);
    model.parts.root.visible = false;
    model.group.add(assetRoot);
    model.parts.assetRoot = assetRoot;
  } catch {
    // Missing model files intentionally fall back to the procedural rig.
  }
}

function prepareExternalModel(assetRoot) {
  const box = new THREE.Box3().setFromObject(assetRoot);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const scale = 2.35 / Math.max(size.x || 1, size.y || 1, size.z || 1);
  assetRoot.position.sub(center);
  assetRoot.scale.setScalar(scale);
  assetRoot.position.y = 1.15;
  assetRoot.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
    if (node.material) {
      node.material.flatShading = true;
      node.material.needsUpdate = true;
    }
  });
}

function animate() {
  if (!renderer || !scene || !camera) return;
  const delta = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;
  updateModel(units.left, time, delta);
  updateModel(units.right, time, delta);
  updateEffects(delta);
  renderer.render(scene, camera);
  updateModelViewers(time);
}

function updateModelViewers(time) {
  modelViewers.forEach((viewer, element) => {
    if (!document.body.contains(element)) {
      disposeViewer(element);
      return;
    }
    if (!isViewerVisible(element)) return;

    const root = viewer.model.parts.root;
    const variant = viewer.variant;
    const compact = variant.includes("mini") || variant.includes("standing");
    root.rotation.y = Math.sin(time * 0.45 + viewer.hero.id.length) * 0.1;
    root.position.y = Math.sin(time * 1.8 + viewer.hero.id.length) * (compact ? 0.025 : 0.04);
    viewer.model.parts.leftArm.rotation.x = Math.sin(time * 2.5) * 0.08;
    viewer.model.parts.rightArm.rotation.x = -Math.sin(time * 2.4) * 0.08;
    viewer.base.rotation.y += 0.006;
    viewer.renderer.render(viewer.scene, viewer.camera);
  });
}

function isViewerVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 4 && rect.height > 4 && rect.bottom >= 0 && rect.top <= window.innerHeight;
}

function isViewerInActiveScreen(element) {
  const screen = element.closest(".screen");
  return !screen || screen.classList.contains("active");
}

function updateModel(model, time, delta) {
  if (!model || !model.group.visible) return;
  const payload = model.payload;
  const sideSign = model.side === "left" ? 1 : -1;
  const base = getBasePosition(model.side);
  const pose = payload?.pose || "";
  const alive = payload?.alive !== false;
  const hpRatio = payload?.maxHp ? Math.max(0, payload.hp / payload.maxHp) : 1;
  const mana = payload?.mana || 0;

  const target = new THREE.Vector3(base.x, base.y, base.z);
  if (pose === "attacking") target.x += 0.45 * sideSign;
  if (pose === "casting") target.y += 0.2;
  if (pose === "dodging") target.x -= 0.42 * sideSign;
  if (pose === "hit") target.x -= 0.18 * sideSign;

  model.group.position.lerp(target, Math.min(1, delta * 10));
  model.group.position.y += alive && pose !== "dead" ? Math.sin(time * 2.1 + (model.side === "left" ? 0 : 1.2)) * 0.018 : 0;

  const root = model.parts.root;
  root.rotation.y = model.side === "left" ? -0.34 : 0.34;
  root.rotation.z = 0;
  root.scale.setScalar(1);

  if (!alive || pose === "dead") {
    root.rotation.z = -0.95 * sideSign;
    root.position.y = -0.12;
    root.scale.setScalar(0.92);
  } else {
    root.position.y = 0;
    root.rotation.z = pose === "hit" ? -0.1 * sideSign : Math.sin(time * 1.9) * 0.018;
    if (pose === "victory") root.position.y = Math.abs(Math.sin(time * 7)) * 0.15;
    if (pose === "guarding") root.scale.setScalar(1.05);
  }

  model.parts.leftArm.rotation.x = Math.sin(time * 2.8) * 0.12;
  model.parts.rightArm.rotation.x = -Math.sin(time * 2.6) * 0.12;
  if (pose === "attacking") model.parts.rightArm.rotation.x = -1.25;
  if (pose === "casting") {
    model.parts.leftArm.rotation.x = -0.75;
    model.parts.rightArm.rotation.x = -0.75;
  }
  if (pose === "guarding") model.parts.leftArm.rotation.x = -0.35;

  const lowHealth = hpRatio <= 0.32;
  model.parts.body.material.emissiveIntensity = lowHealth ? 0.12 : 0;
  model.parts.aura.visible = mana >= 82 || pose === "casting" || pose === "victory";
  model.parts.aura.scale.setScalar(1 + Math.sin(time * 4) * 0.08);
  model.parts.shield.visible = (payload?.shield || 0) > 0 || pose === "guarding";
  model.parts.shield.material.opacity = pose === "guarding" ? 0.24 : 0.12;
}

function playEffect(effect) {
  if (!arenaReady) {
    window.__arena3DEffectQueue = window.__arena3DEffectQueue || [];
    window.__arena3DEffectQueue.push(effect);
    return;
  }
  if (!effect) return;

  const from = sidePoint(effect.side);
  const to = sidePoint(effect.targetSide || (effect.side === "left" ? "right" : "left"));
  const color = effect.color || "#f2b84b";
  const secondary = effect.secondary || "#fff8ec";
  const duration = effect.tier === "ultimate" ? 0.92 : 0.58;
  let mesh;

  if (effect.type === "shield") {
    mesh = new THREE.Mesh(new THREE.SphereGeometry(1.08, 28, 16), transparentMaterial(color, 0.24, 0.45));
    mesh.position.copy(from);
    mesh.position.y = 1.08;
    effects.push({ mesh, kind: "pulse", age: 0, duration: 0.8 });
  } else if (effect.type === "heal") {
    mesh = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.035, 8, 36), transparentMaterial("#8adf8a", 0.45, 0.7));
    mesh.position.copy(from);
    mesh.position.y = 1.45;
    effects.push({ mesh, kind: "rise", age: 0, duration: 0.9 });
  } else if (effect.type === "impact" || effect.type === "strike") {
    mesh = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 8, 34), transparentMaterial(secondary, 0.65, 1.0));
    mesh.position.copy(to);
    mesh.position.y = 1.1;
    mesh.rotation.set(Math.PI / 2, 0, Math.PI / 4);
    effects.push({ mesh, kind: "burst", age: 0, duration: 0.42 });
  } else {
    mesh = new THREE.Mesh(new THREE.SphereGeometry(effect.tier === "ultimate" ? 0.2 : 0.13, 18, 12), material(color, 0.32, 0.08, secondary, 1.1));
    mesh.position.copy(from);
    mesh.position.y = 1.32;
    effects.push({ mesh, kind: "projectile", from: mesh.position.clone(), to: new THREE.Vector3(to.x, 1.3, to.z), age: 0, duration });
  }

  mesh.castShadow = false;
  scene.add(mesh);
}

function sidePoint(side) {
  const base = getBasePosition(side);
  return new THREE.Vector3(base.x, base.y, base.z);
}

function updateEffects(delta) {
  for (let i = effects.length - 1; i >= 0; i -= 1) {
    const effect = effects[i];
    effect.age += delta;
    const progress = Math.min(1, effect.age / effect.duration);

    if (effect.kind === "projectile") {
      effect.mesh.position.lerpVectors(effect.from, effect.to, easeOut(progress));
      effect.mesh.scale.setScalar(1 + progress * 0.35);
    } else if (effect.kind === "burst") {
      effect.mesh.scale.setScalar(0.4 + progress * 2.1);
      effect.mesh.material.opacity = 0.65 * (1 - progress);
    } else if (effect.kind === "pulse") {
      effect.mesh.scale.setScalar(0.65 + progress * 0.8);
      effect.mesh.material.opacity = 0.24 * (1 - progress);
    } else if (effect.kind === "rise") {
      effect.mesh.position.y += delta * 0.75;
      effect.mesh.rotation.z += delta * 3.5;
      effect.mesh.material.opacity = 0.45 * (1 - progress);
    }

    if (progress >= 1) {
      scene.remove(effect.mesh);
      disposeObject(effect.mesh);
      effects.splice(i, 1);
    }
  }
}

function clearEffects() {
  if (!arenaReady) return;
  effects.splice(0).forEach((effect) => {
    scene.remove(effect.mesh);
    disposeObject(effect.mesh);
  });
}

function easeOut(value) {
  return 1 - Math.pow(1 - value, 3);
}

function resize() {
  if (!container || !renderer || !camera) return;
  const width = Math.max(1, container.clientWidth);
  const height = Math.max(1, container.clientHeight);
  renderer.setSize(width, height, false);
  const narrow = width < 620;
  camera.fov = narrow ? 48 : 36;
  camera.position.set(0, narrow ? 4.55 : 4.2, narrow ? 9.8 : 8.1);
  camera.lookAt(0, narrow ? 1.0 : 1.05, 0);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function resizeViewer(element) {
  const viewer = modelViewers.get(element);
  if (!viewer) return;
  const width = Math.max(1, element.clientWidth);
  const height = Math.max(1, element.clientHeight);
  viewer.renderer.setSize(width, height, false);
  viewer.camera.aspect = width / height;

  const preset = viewerCameraPreset(viewer.variant, width, height);
  viewer.camera.fov = preset.fov;
  viewer.camera.position.set(preset.x, preset.y, preset.z);
  viewer.camera.lookAt(0, preset.lookY, 0);
  viewer.camera.updateProjectionMatrix();
}

function viewerCameraPreset(variant, width, height) {
  if (variant.includes("mini")) {
    return { fov: 31, x: 0, y: 1.56, z: 4.35, lookY: 1.22 };
  }
  if (variant.includes("combat")) {
    return { fov: 32, x: 0, y: 1.9, z: 4.9, lookY: 1.05 };
  }
  const tall = height > width * 0.82;
  return {
    fov: tall ? 31 : 34,
    x: 0,
    y: tall ? 1.9 : 1.75,
    z: tall ? 4.75 : 4.95,
    lookY: 1.05
  };
}

function viewerScale(variant = "") {
  if (variant.includes("mini")) return 0.62;
  if (variant.includes("combat")) return 1.0;
  return 0.9;
}

function getBasePosition(side) {
  const fallback = basePositions[side] || { x: 0, y: 0, z: 0 };
  const narrow = container ? container.clientWidth < 620 : false;
  if (!narrow) return fallback;
  return {
    x: side === "left" ? -1.35 : 1.35,
    y: 0,
    z: side === "left" ? 0.38 : -0.38
  };
}

function disposeViewer(element) {
  const viewer = modelViewers.get(element);
  if (!viewer) return;
  viewer.observer.disconnect();
  viewer.renderer.dispose();
  viewer.renderer.forceContextLoss();
  if (viewer.renderer.domElement.parentElement) {
    viewer.renderer.domElement.remove();
  }
  disposeObject(viewer.model.group);
  disposeObject(viewer.base);
  modelViewers.delete(element);
}

function disposeObject(mesh) {
  if (!mesh) return;
  if (mesh.children) mesh.children.forEach((child) => disposeObject(child));
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) {
    if (Array.isArray(mesh.material)) mesh.material.forEach((item) => item.dispose());
    else mesh.material.dispose();
  }
}
