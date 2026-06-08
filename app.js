const orbit = document.getElementById("cardOrbit");
const canvas = document.getElementById("particleField");
const ctx = canvas.getContext("2d");
const video = document.getElementById("camera");

let cardLibrary = [
  { rarity: "SSR", title: "The Light / 光牌", copy: "最高位属性牌之一，带来纯白星辉与守护。" },
  { rarity: "SSR", title: "The Dark / 暗牌", copy: "最高位属性牌之一，与光牌成对显现。" },
  { rarity: "SSR", title: "The Nothing / 无牌", copy: "剧场版强力牌，空白魔力吞没一切声响。" },
  { rarity: "SSR", title: "The Hope / 希望牌", copy: "由无牌与爱意转化而来，释放温柔奇迹。" },
  { rarity: "SR", title: "The Firey / 火牌", copy: "四元素强牌，燃起粉金色魔法焰。" },
  { rarity: "SR", title: "The Watery / 水牌", copy: "四元素强牌，水光像透明丝带环绕。" },
  { rarity: "SR", title: "The Windy / 风牌", copy: "四元素强牌，也是最初被释放的牌。" },
  { rarity: "SR", title: "The Earthy / 地牌", copy: "四元素强牌，稳定而厚重的魔力。" },
  { rarity: "SR", title: "The Wood / 树牌", copy: "月系强牌，枝叶与花瓣温柔生长。" },
  { rarity: "SR", title: "The Thunder / 雷牌", copy: "闪电凝成星形火花，短促而强力。" },
  { rarity: "SR", title: "The Time / 时牌", copy: "操纵时间流速，粉色钟面短暂显现。" },
  { rarity: "SR", title: "The Return / 戾牌", copy: "回到过去片刻，花瓣倒流成环。" },
  { rarity: "SR", title: "The Sleep / 眠牌", copy: "轻柔羽毛落下，使魔法陷入安静梦境。" },
  { rarity: "SR", title: "The Create / 创牌", copy: "书页展开，想象力化作实体魔法。" },
  { rarity: "R", title: "The Flower / 花牌", copy: "花瓣飞舞，适合可爱而柔和的召唤。" },
  { rarity: "R", title: "The Fly / 翔牌", copy: "白色羽翼托起卡牌，在空中轻盈旋转。" },
  { rarity: "R", title: "The Jump / 跳牌", copy: "像小兔一样跃起，带来轻快魔法。" },
  { rarity: "R", title: "The Mirror / 镜牌", copy: "映出温柔倒影，守护心中的秘密。" },
  { rarity: "R", title: "The Maze / 迷牌", copy: "粉色迷宫线条展开，又慢慢消失。" },
  { rarity: "R", title: "The Illusion / 幻牌", copy: "梦幻泡影浮起，折射浅金光点。" },
  { rarity: "R", title: "The Sword / 剑牌", copy: "星光化成短剑，边缘泛起白色光。" },
  { rarity: "R", title: "The Shield / 盾牌", copy: "圆形护盾包裹卡面，像透明糖壳。" },
  { rarity: "R", title: "The Shadow / 影牌", copy: "柔和阴影从粉光中滑过。" },
  { rarity: "R", title: "The Glow / 灯牌", copy: "小小萤光散开，像夜里的糖霜。" },
  { rarity: "R", title: "The Silent / 静牌", copy: "安静魔力扫过，声音像泡泡一样消失。" },
  { rarity: "R", title: "The Move / 移牌", copy: "卡面跳动位移，留下细小粉色尾迹。" },
  { rarity: "R", title: "The Little / 小牌", copy: "魔法缩小成糖果般的微光。" },
  { rarity: "R", title: "The Big / 大牌", copy: "星光膨胀，卡牌边框柔软放大。" },
  { rarity: "R", title: "The Sweet / 甜牌", copy: "甜点香气和粉白糖霜一起飘落。" },
  { rarity: "R", title: "The Dash / 驱牌", copy: "轻快奔跑的魔力划出粉色弧线。" },
  { rarity: "R", title: "The Float / 浮牌", copy: "白色气球般的光点托起卡面。" },
  { rarity: "R", title: "The Bubbles / 泡牌", copy: "透明泡泡反射浅金与樱粉。" },
  { rarity: "R", title: "The Song / 歌牌", copy: "旋律化成小星星，在卡边闪烁。" },
  { rarity: "R", title: "The Voice / 声牌", copy: "声音波纹变成柔软的粉色光圈。" },
  { rarity: "R", title: "The Libra / 秤牌", copy: "金色天平轻轻摇晃，判断魔法重量。" },
  { rarity: "R", title: "The Lock / 锁牌", copy: "小小锁孔浮现，守住秘密房间。" },
];

let soundLibrary = {
  R: ["./assets/audio/r_magic.ogg", "./assets/audio/r_sparkle.ogg"],
  SR: ["./assets/audio/sr_magic.ogg", "./assets/audio/sr_words.wav"],
  SSR: ["./assets/audio/ssr_fantasy.mp3", "./assets/audio/ssr_heal.wav"],
};

let audioUnlocked = false;
let bgmAudio = null;

const rarityWeights = [
  { rarity: "SSR", weight: 8 },
  { rarity: "SR", weight: 30 },
  { rarity: "R", weight: 62 },
];

async function loadCardLibrary() {
  try {
    const response = await fetch("./assets/cards/cards.json");
    if (!response.ok) {
      return;
    }
    const remoteLibrary = await response.json();
    if (Array.isArray(remoteLibrary) && remoteLibrary.length > 0) {
      cardLibrary = remoteLibrary;
    }
  } catch {
    // Keep the inline fallback library when local assets cannot be loaded.
  }
}

async function loadSoundLibrary() {
  try {
    const response = await fetch("./assets/audio/sounds.json");
    if (!response.ok) {
      return;
    }
    const remoteLibrary = await response.json();
    if (remoteLibrary && typeof remoteLibrary === "object") {
      soundLibrary = remoteLibrary;
    }
  } catch {
    // Keep the inline fallback sound library when local assets cannot be loaded.
  }
}

function unlockAudio() {
  if (audioUnlocked) {
    return;
  }
  audioUnlocked = true;
  const audio = new Audio();
  audio.muted = true;
  audio.play().catch(() => {});
  startBgm();
}

function startBgm() {
  if (bgmAudio) {
    return;
  }
  bgmAudio = new Audio("./assets/audio/bgm.ogg");
  bgmAudio.loop = true;
  bgmAudio.volume = 0.22;
  bgmAudio.play().catch(() => {});
}

function playRaritySound(rarity) {
  const sounds = soundLibrary[rarity] || soundLibrary.R || [];
  if (!sounds.length) {
    return;
  }
  const src = sounds[Math.floor(Math.random() * sounds.length)];
  const audio = new Audio(src);
  audio.volume = rarity === "SSR" ? 0.72 : rarity === "SR" ? 0.58 : 0.46;
  audio.play().catch(() => {});
}

const state = {
  scroll: 0,
  targetScroll: 0,
  gestureVelocity: 0,
  lastGestureAt: 0,
  drawing: false,
  pointerDown: false,
  pointerX: 0,
  cursorActive: false,
  cursorX: window.innerWidth / 2,
  cursorY: window.innerHeight / 2,
  selectedCard: null,
  pinchActive: false,
  heldCard: null,
  heldSince: 0,
  releaseQueued: false,
  canReleaseAt: 0,
};

const visualCardCount = 15;
const particles = [];
let cursor;
let effectLayer;

function createCards() {
  for (let index = 0; index < visualCardCount; index += 1) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.slot = String(index);
    card.innerHTML = `
      <div class="card-sparks" aria-hidden="true"></div>
      <div class="card-face card-back">
        <div class="glyph sakura-glyph" aria-hidden="true">
          <span class="magic-ring"></span>
          <span class="wing left"></span>
          <span class="wing right"></span>
          <span class="star-core"></span>
          <span class="wand"></span>
        </div>
      </div>
      <div class="card-face card-front">
      </div>
    `;
    orbit.appendChild(card);
  }
}

function createEffectLayers() {
  const anomaly = document.createElement("div");
  anomaly.id = "anomaly";
  anomaly.setAttribute("aria-hidden", "true");
  document.body.appendChild(anomaly);

  effectLayer = document.createElement("div");
  effectLayer.id = "effectLayer";
  effectLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(effectLayer);

  cursor = document.createElement("div");
  cursor.id = "sakuraCursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = `<span class="cursor-star"></span><span class="cursor-wing left"></span><span class="cursor-wing right"></span>`;
  document.body.appendChild(cursor);
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles.length = 0;
  const count = Math.floor(Math.min(320, Math.max(150, window.innerWidth / 6)));
  for (let i = 0; i < count; i += 1) {
    particles.push(makeParticle(true));
  }
}

function makeParticle(randomY = false) {
  const radius = Math.random() * 0.95 + 0.22;
  return {
    x: Math.random() * window.innerWidth,
    y: randomY ? Math.random() * window.innerHeight : -12,
    vx: (Math.random() - 0.5) * 0.22,
    vy: Math.random() * 0.24 + 0.06,
    radius,
    alpha: Math.random() * 0.34 + 0.16,
    pulse: Math.random() * Math.PI * 2,
    sway: Math.random() * 0.012 + 0.004,
    tail: Math.random() * 6 + 4,
    hue: Math.random() > 0.36 ? "pink" : "gold",
  };
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const particle of particles) {
    particle.x += particle.vx + Math.sin(particle.pulse) * particle.sway * 18;
    particle.y += particle.vy;
    particle.pulse += 0.014;

    if (particle.y > window.innerHeight + 18 || particle.x < -18 || particle.x > window.innerWidth + 18) {
      Object.assign(particle, makeParticle(false));
    }

    const glow = particle.alpha + Math.sin(particle.pulse) * 0.07;
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 5,
    );
    if (particle.hue === "pink") {
      gradient.addColorStop(0, `rgba(255, 255, 255, ${glow})`);
      gradient.addColorStop(0.34, `rgba(255, 166, 210, ${glow * 0.52})`);
      gradient.addColorStop(1, "rgba(255, 150, 202, 0)");
    } else {
      gradient.addColorStop(0, `rgba(255, 250, 190, ${glow})`);
      gradient.addColorStop(0.34, `rgba(255, 221, 112, ${glow * 0.44})`);
      gradient.addColorStop(1, "rgba(255, 218, 102, 0)");
    }
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = particle.hue === "pink" ? `rgba(255, 173, 214, ${glow * 0.1})` : `rgba(255, 217, 105, ${glow * 0.1})`;
    ctx.lineWidth = Math.max(0.35, particle.radius * 0.55);
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y - particle.tail);
    ctx.lineTo(particle.x + particle.vx * 8, particle.y);
    ctx.stroke();
  }
}

function wrap(value, range) {
  return ((value % range) + range) % range;
}

function renderCards() {
  state.scroll += (state.targetScroll - state.scroll) * 0.12;

  if (!state.drawing && !state.selectedCard) {
    const isGestureActive = performance.now() - state.lastGestureAt < 420;
    state.targetScroll += 0.48 + state.gestureVelocity;
    state.gestureVelocity *= isGestureActive ? 0.76 : 0.9;
  }

  const cards = [...orbit.querySelectorAll(".card")];
  const spacing = Math.min(Math.max(window.innerWidth * 0.18, 138), 230);
  const range = visualCardCount * spacing;
  const halfRange = range / 2;
  const depthRange = Math.min(window.innerWidth * 0.46, 520);

  cards.forEach((card, index) => {
    if (card.classList.contains("drawn") || card.classList.contains("dispersing")) {
      return;
    }

    const loopX = wrap(index * spacing + state.scroll + halfRange, range) - halfRange;
    const center = 1 - Math.min(Math.abs(loopX) / depthRange, 1);
    const hoverLift = card === state.selectedCard ? -34 : 0;
    const scale = 0.7 + center * 0.22 + (card === state.selectedCard ? 0.05 : 0);
    const y = Math.abs(loopX) * 0.025 + hoverLift;
    const z = center * 95 + (card === state.selectedCard ? 45 : 0);
    const rotY = Math.max(-18, Math.min(18, loopX / -24));
    const opacity = 0.28 + center * 0.72;
    const blur = (1 - center) * 1.3;

    card.style.setProperty("--x", `${loopX}px`);
    card.style.setProperty("--y", `${y}px`);
    card.style.setProperty("--z", `${z}px`);
    card.style.setProperty("--scale", scale.toFixed(3));
    card.style.setProperty("--rotY", `${rotY.toFixed(2)}deg`);
    card.style.setProperty("--tilt", "0deg");
    card.style.setProperty("--opacity", opacity.toFixed(3));
    card.style.setProperty("--blur", `${blur.toFixed(2)}px`);
    card.style.setProperty("--shine", center.toFixed(3));
    card.style.zIndex = String(Math.round(center * 100 + (card === state.selectedCard ? 40 : 0)));
  });
}

function updateCursor() {
  if (!cursor) {
    return;
  }
  cursor.style.setProperty("--cx", `${state.cursorX}px`);
  cursor.style.setProperty("--cy", `${state.cursorY}px`);
  cursor.classList.toggle("active", state.cursorActive);
  cursor.classList.toggle("pinching", state.pinchActive);
}

function updateSelection() {
  const previous = state.selectedCard;
  let selected = null;
  let bestScore = Infinity;

  if (state.cursorActive && !state.drawing) {
    for (const card of orbit.querySelectorAll(".card")) {
      if (card.classList.contains("drawn") || card.classList.contains("dispersing")) {
        continue;
      }
      const rect = card.getBoundingClientRect();
      const visible = parseFloat(card.style.getPropertyValue("--opacity")) || 0;
      if (visible < 0.34) {
        continue;
      }
      const within =
        state.cursorX >= rect.left &&
        state.cursorX <= rect.right &&
        state.cursorY >= rect.top &&
        state.cursorY <= rect.bottom;
      if (!within) {
        continue;
      }
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const score = Math.hypot(state.cursorX - centerX, state.cursorY - centerY);
      if (score < bestScore) {
        bestScore = score;
        selected = card;
      }
    }
  }

  state.selectedCard = selected;
  if (previous !== selected) {
    previous?.classList.remove("hovered");
  }
  for (const card of orbit.querySelectorAll(".card.hovered")) {
    if (card !== selected) {
      card.classList.remove("hovered");
    }
  }
  if (selected) {
    selected.classList.add("hovered");
    emitHoverParticles(selected);
  }
}

function animate() {
  drawParticles();
  renderCards();
  updateSelection();
  updateCursor();
  requestAnimationFrame(animate);
}

function pushCardsByDelta(delta) {
  if (state.drawing) {
    return;
  }
  const movement = Math.max(-58, Math.min(58, delta * 1.65));
  state.targetScroll += movement;
  state.gestureVelocity = movement * 0.18;
  state.lastGestureAt = performance.now();
}

function chooseRarity() {
  const total = rarityWeights.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of rarityWeights) {
    roll -= item.weight;
    if (roll <= 0) {
      return item.rarity;
    }
  }
  return "R";
}

function drawRandomReward() {
  const rarity = chooseRarity();
  const pool = cardLibrary.filter((card) => card.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function triggerAnomaly(rarity) {
  const anomaly = document.getElementById("anomaly");
  if (!anomaly) {
    return;
  }

  anomaly.className = "";
  void anomaly.offsetWidth;
  anomaly.classList.add("active", rarity.toLowerCase());

  setTimeout(() => {
    anomaly.className = "";
  }, rarity === "SSR" ? 2900 : 2300);
}

function emitHoverParticles(card) {
  if (!effectLayer || Math.random() > 0.45) {
    return;
  }
  const rect = card.getBoundingClientRect();
  const particle = document.createElement("span");
  particle.className = "rise-particle";
  particle.style.left = `${rect.left + rect.width * (0.22 + Math.random() * 0.56)}px`;
  particle.style.top = `${rect.top + rect.height * (0.22 + Math.random() * 0.58)}px`;
  particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 34}px`);
  effectLayer.appendChild(particle);
  setTimeout(() => particle.remove(), 900);
}

function emitBurst(rect, rarity) {
  if (!effectLayer) {
    return;
  }
  const count = rarity === "SSR" ? 80 : rarity === "SR" ? 54 : 34;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * (rarity === "SSR" ? 210 : 140);
    particle.className = `burst-particle ${rarity.toLowerCase()}`;
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance - 40}px`);
    particle.style.setProperty("--delay", `${Math.random() * 140}ms`);
    effectLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 1250);
  }
}

function drawSelectedCard(card = state.selectedCard) {
  if (state.drawing || !card) {
    return;
  }

  const reward = drawRandomReward();
  if (!reward) {
    return;
  }

  if (reward.image) {
    const preload = new Image();
    preload.src = reward.image;
    card.dataset.cardImage = reward.image;
    card.style.setProperty("--front-image", `url("${reward.image}")`);
  }
  card.dataset.rarity = reward.rarity.toLowerCase();

  state.drawing = true;
  state.heldCard = card;
  state.heldSince = performance.now();
  state.canReleaseAt = state.heldSince + 2600;
  state.releaseQueued = false;
  playRaritySound(reward.rarity);
  triggerAnomaly(reward.rarity);
  card.classList.remove("hovered", "revealed");
  card.classList.add("drawn");
  card.style.setProperty("--x", "0px");
  card.style.setProperty("--y", "-8px");
  card.style.setProperty("--z", "420px");
  card.style.setProperty("--scale", "1.16");
  card.style.setProperty("--rotY", "900deg");
  card.style.setProperty("--tilt", "0deg");
  card.style.setProperty("--opacity", "1");
  card.style.setProperty("--blur", "0px");
  card.style.setProperty("--shine", "1");

  setTimeout(() => {
    if (state.heldCard === card) {
      card.classList.add("revealed", "show-front");
      card.style.transition = "none";
      card.style.setProperty("--rotY", "0deg");
      void card.offsetWidth;
      card.style.transition = "";
    }
  }, 1820);
}

function releaseHeldCard() {
  if (!state.heldCard) {
    return;
  }

  if (!state.heldCard.classList.contains("show-front")) {
    state.releaseQueued = false;
    return;
  }

  const wait = state.canReleaseAt - performance.now();
  if (wait > 0 || state.pinchActive) {
    if (!state.releaseQueued) {
      state.releaseQueued = true;
      setTimeout(() => {
        state.releaseQueued = false;
        releaseHeldCard();
      }, Math.max(wait, 180));
    }
    return;
  }

  const card = state.heldCard;
  const rect = card.getBoundingClientRect();
  const rarity = (card.dataset.rarity || "r").toUpperCase();
  emitBurst(rect, rarity);
  card.classList.add("dispersing");

  setTimeout(() => {
    card.classList.remove("drawn", "dispersing", "hovered", "revealed", "show-front");
    card.removeAttribute("data-rarity");
    card.removeAttribute("data-card-image");
    card.style.removeProperty("--front-image");
    state.drawing = false;
    state.heldCard = null;
    state.releaseQueued = false;
    state.canReleaseAt = 0;
    state.targetScroll += Math.min(Math.max(window.innerWidth * 0.18, 138), 230);
  }, 760);
}

function bindPointerFallback() {
  window.addEventListener("pointermove", (event) => {
    unlockAudio();
    state.cursorActive = true;
    state.cursorX = event.clientX;
    state.cursorY = event.clientY;

    if (!state.pointerDown || state.heldCard) {
      return;
    }
    const delta = event.clientX - state.pointerX;
    if (Math.abs(delta) > 1 && !state.selectedCard) {
      pushCardsByDelta(delta);
      state.pointerX = event.clientX;
    }
  });

  window.addEventListener("pointerdown", (event) => {
    unlockAudio();
    state.pointerDown = true;
    state.pointerX = event.clientX;
    state.pinchActive = true;
    if (state.selectedCard) {
      drawSelectedCard(state.selectedCard);
    }
  });

  window.addEventListener("pointerup", () => {
    state.pointerDown = false;
    state.pinchActive = false;
    releaseHeldCard();
  });
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getPalmCenter(landmarks) {
  const points = [landmarks[0], landmarks[5], landmarks[9], landmarks[13], landmarks[17]];
  return points.reduce(
    (center, point) => {
      center.x += point.x / points.length;
      center.y += point.y / points.length;
      return center;
    },
    { x: 0, y: 0 },
  );
}

function getSwipeAnchor(landmarks) {
  const palm = getPalmCenter(landmarks);
  const indexTip = landmarks[8];
  return {
    x: palm.x * 0.7 + indexTip.x * 0.3,
    y: palm.y * 0.7 + indexTip.y * 0.3,
  };
}

function getHandOpenness(landmarks) {
  const wrist = landmarks[0];
  const palmSize = Math.max(distance(landmarks[0], landmarks[9]), 0.001);
  const fingertips = [8, 12, 16, 20];
  const openness = fingertips.reduce((sum, index) => sum + distance(landmarks[index], wrist) / palmSize, 0);
  return openness / fingertips.length;
}

function isPinchGesture(landmarks) {
  const palmSize = Math.max(distance(landmarks[0], landmarks[9]), 0.001);
  return distance(landmarks[4], landmarks[8]) < palmSize * 0.64;
}

function isSwipeReady(landmarks) {
  return getHandOpenness(landmarks) > 1.3;
}

async function setupHands() {
  if (!window.Hands || !window.Camera) {
    return;
  }

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.62,
  });

  let lastPalmX = null;
  let lastPalmAt = 0;
  let smoothDelta = 0;
  const handHistory = [];

  hands.onResults((results) => {
    const landmarks = results.multiHandLandmarks?.[0];
    if (!landmarks) {
      state.cursorActive = false;
      if (state.pinchActive) {
        state.pinchActive = false;
        releaseHeldCard();
      }
      lastPalmX = null;
      lastPalmAt = 0;
      smoothDelta = 0;
      handHistory.length = 0;
      return;
    }

    const indexTip = landmarks[8];
    state.cursorActive = true;
    state.cursorX = (1 - indexTip.x) * window.innerWidth;
    state.cursorY = indexTip.y * window.innerHeight;

    const pinching = isPinchGesture(landmarks);
    if (pinching && !state.pinchActive) {
      unlockAudio();
      state.pinchActive = true;
      if (state.selectedCard) {
        drawSelectedCard(state.selectedCard);
      }
    } else if (!pinching && state.pinchActive) {
      state.pinchActive = false;
      releaseHeldCard();
    }

    const anchor = getSwipeAnchor(landmarks);
    const palmX = anchor.x;
    const now = performance.now();

    if (pinching || state.selectedCard) {
      lastPalmX = palmX;
      lastPalmAt = now;
      smoothDelta = 0;
      handHistory.length = 0;
      return;
    }

    if (!isSwipeReady(landmarks)) {
      lastPalmX = palmX;
      lastPalmAt = now;
      smoothDelta *= 0.72;
      return;
    }

    handHistory.push({ x: palmX, t: now });
    while (handHistory.length > 0 && now - handHistory[0].t > 260) {
      handHistory.shift();
    }

    if (lastPalmX !== null) {
      const frameTime = Math.max(now - lastPalmAt, 16);
      const frameDelta = palmX - lastPalmX;
      const velocityDelta = (frameDelta / frameTime) * 16.67;
      let historyDelta = 0;

      if (handHistory.length > 1) {
        historyDelta = palmX - handHistory[0].x;
      }

      smoothDelta = smoothDelta * 0.62 + (velocityDelta * 0.72 + historyDelta * 0.28) * 0.38;
      if (Math.abs(smoothDelta) > 0.0012) {
        pushCardsByDelta(smoothDelta * window.innerWidth * 3.2);
      }
    }

    lastPalmX = palmX;
    lastPalmAt = now;
  });

  const camera = new Camera(video, {
    width: 640,
    height: 480,
    onFrame: async () => {
      await hands.send({ image: video });
    },
  });

  try {
    await camera.start();
  } catch {
    state.cursorActive = true;
  }
}

window.addEventListener("resize", resizeCanvas);
createCards();
createEffectLayers();
resizeCanvas();
bindPointerFallback();
Promise.all([loadCardLibrary(), loadSoundLibrary()]).finally(() => {
  setupHands();
  animate();
});
