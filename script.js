// ===== MATRIX =====
const matrix = document.getElementById("matrix");
const mtx = matrix.getContext("2d");

const LETTERS = "HAPPY BIRTHDAY";
const LETTERS_LEN = LETTERS.length;
let fontSize, columns, matrixStreams;

function initMatrix() {
  matrix.width = innerWidth;
  matrix.height = innerHeight;
  const isMobile = innerWidth < 768;
  fontSize = isMobile ? Math.max(18, Math.min(30, innerWidth / 30)) : Math.max(16, Math.min(28, innerWidth / 42));
  columns = Math.floor(matrix.width / fontSize);

  matrixStreams = [];
  for (let i = 0; i < columns; i++) {
    const len = LETTERS_LEN + Math.floor(Math.random() * 7);
    const chars = [];
    const startOffset = Math.floor(Math.random() * LETTERS_LEN);
    for (let j = 0; j < len; j++) {
      chars.push(LETTERS[(startOffset + len - 1 - j) % LETTERS_LEN]);
    }
    matrixStreams.push({
      y: Math.random() * -matrix.height,
      speed: 0.06 + Math.random() * 0.1,
      chars,
      length: len,
      startOffset,
      flashTimer: Math.random() * 100,
      _col: i
    });
  }
}

initMatrix();

function animateMatrix() {
  const isMobile = innerWidth < 768;
  mtx.fillStyle = `rgba(0, 0, 0, ${isMobile ? 0.12 : 0.08})`;
  mtx.fillRect(0, 0, matrix.width, matrix.height);

  mtx.font = "bold " + fontSize + "px monospace";

  matrixStreams.forEach((stream) => {
    const x = stream._col * fontSize;

    for (let i = 0; i < stream.length; i++) {
      const charY = stream.y - i * fontSize;
      if (charY < -fontSize || charY > matrix.height + fontSize) continue;

      stream.chars[i] = LETTERS[(stream.startOffset + stream.length - 1 - i) % LETTERS_LEN];

      if (i === 0) {
        stream.flashTimer--;
        if (stream.flashTimer <= 0) {
          mtx.fillStyle = "#ffffff";
          mtx.shadowColor = "#ff8ec1";
          mtx.shadowBlur = isMobile ? 6 : 12;
          stream.flashTimer = 30 + Math.random() * 60;
        } else {
          mtx.fillStyle = "#ffffff";
          mtx.shadowColor = "#ff8ec1";
          mtx.shadowBlur = isMobile ? 3 : 6;
        }
      } else if (i < LETTERS_LEN) {
        const intensity = 1 - (i / LETTERS_LEN) * 0.65;
        const r = 255;
        const g = Math.round(180 - (i / LETTERS_LEN) * 150);
        const b = Math.round(200 - (i / LETTERS_LEN) * 150);
        const glow = Math.max(0, 6 - i * 0.5);
        mtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;
        mtx.shadowColor = "#ff8ec1";
        mtx.shadowBlur = isMobile ? Math.min(4, glow) : glow;
      } else {
        const fade = (1 - (i / stream.length)) * 0.3;
        mtx.fillStyle = `rgba(80, 0, 30, ${fade})`;
        mtx.shadowBlur = 0;
      }

      mtx.fillText(stream.chars[i], x, charY);
    }

    stream.y += stream.speed * fontSize;

    if (stream.y - stream.length * fontSize > matrix.height) {
      stream.y = Math.random() * -100;
      stream.length = LETTERS_LEN + Math.floor(Math.random() * 7);
      stream.startOffset = Math.floor(Math.random() * LETTERS_LEN);
      stream.chars.length = stream.length;
      for (let j = 0; j < stream.length; j++) {
        stream.chars[j] = LETTERS[(stream.startOffset + stream.length - 1 - j) % LETTERS_LEN];
      }
    }

    mtx.shadowBlur = 0;
  });

  requestAnimationFrame(animateMatrix);
}

animateMatrix();

// ===== DOT COUNTDOWN =====
const dotCanvas = document.getElementById("dotCanvas");
const ctx = dotCanvas.getContext("2d");
dotCanvas.width = innerWidth;
dotCanvas.height = innerHeight;

function drawDotText(text){
  ctx.clearRect(0,0,dotCanvas.width,dotCanvas.height);

  const temp = document.createElement("canvas");
  const tctx = temp.getContext("2d");

  temp.width = dotCanvas.width;
  temp.height = dotCanvas.height;

  tctx.fillStyle="#fff";
  tctx.font="bold 140px Orbitron";
  tctx.textAlign="center";
  tctx.fillText(text, temp.width/2, temp.height/2);

  const data = tctx.getImageData(0,0,temp.width,temp.height).data;
  const gap = 4;

  for(let y=0;y<temp.height;y+=gap){
    for(let x=0;x<temp.width;x+=gap){
      const idx = (y*temp.width + x)*4;
      if(data[idx+3]>150){
        ctx.fillStyle="#fff";
        ctx.shadowColor="#ff2e88";
        ctx.shadowBlur=30;
        ctx.beginPath();
        ctx.arc(x,y,4,0,Math.PI*2);
        ctx.fill();
      }
    }
  }
  ctx.shadowBlur=0;
}

const sequence = ["3","2","1","HAPPY","BIRTHDAY","TO","AULIA ❤️"];
let seqIndex = 0;

function next(){
  drawDotText(sequence[seqIndex]);
  seqIndex++;
  if(seqIndex<sequence.length) setTimeout(next,900);
  else setTimeout(showLove,1200);
}
next();

// ===== HEART =====
const loveCanvas = document.getElementById("loveCanvas");
const lctx = loveCanvas.getContext("2d");
loveCanvas.width = innerWidth;
loveCanvas.height = innerHeight;

let heartParticles = [];

function createHeartParticles(){
  heartParticles = [];
  const density = 0.02;
  const size = 12;
  const scale = Math.min(innerWidth, innerHeight)/40;

  for(let t=0;t<Math.PI*2;t+=density){
    let x = 16*Math.pow(Math.sin(t),3);
    let y = 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);

    for(let i=0;i<2;i++){
      heartParticles.push({
        x: Math.random()*innerWidth,
        y: Math.random()*innerHeight,
        targetX: innerWidth/2 + x*scale + (Math.random()-0.5)*8,
        targetY: innerHeight/2 - y*scale + (Math.random()-0.5)*8,
        size: size,
        alpha: 0,
        floatOffset: Math.random()*Math.PI*2
      });
    }
  }
}

function animateHeart(){
  lctx.clearRect(0,0,loveCanvas.width,loveCanvas.height);
  heartParticles.forEach(p=>{
    p.x += (p.targetX - p.x)*0.08;
    p.y += (p.targetY - p.y)*0.08;
    p.alpha += (1 - p.alpha)*0.05;

    let floatY = Math.sin(Date.now()*0.002 + p.floatOffset)*4;

    lctx.globalAlpha = p.alpha;
    lctx.shadowColor="#ff2e88";
    lctx.shadowBlur=8;
    lctx.fillStyle="#ff2e88";
    lctx.fillRect(p.x-p.size/2,p.y-p.size/2+floatY,p.size,p.size);
  });

  lctx.globalAlpha=1;
  lctx.shadowBlur=0;
  requestAnimationFrame(animateHeart);
}

function showLove(){
  dotCanvas.style.display="none";
  createHeartParticles();
  animateHeart();
  setTimeout(showFinalPage,3500);
}

// ===== FINAL PAGE =====
function showFinalPage(){
  loveCanvas.style.display = "none";
  const final = document.getElementById("finalPage");
  final.style.display = "flex";
  setTimeout(()=> final.classList.add("show"), 50); // fade in smooth
  startAutoSlider();

  heartsActive = true;

  // play audio
  const audio = document.getElementById("finalAudio");
  audio.currentTime = 0; // mulai dari awal
  audio.play().catch(e=>{
    console.log("Audio tidak bisa auto play, mungkin perlu interaksi user.", e);
  });
}
// ===== AUTO SLIDER =====
let index=0;
const totalSlides=5;

function startAutoSlider(){
  const slides=document.getElementById("slides");
  const dotsContainer=document.getElementById("dots");
  dotsContainer.innerHTML="";

  for(let i=0;i<totalSlides;i++){
    let dot=document.createElement("div");
    dot.classList.add("dot");
    if(i===0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }

  function updateSlider(){
    slides.style.transform=`translateX(-${index*100}%)`;
    document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===index));
  }

  function nextSlide(){
    index++;
    updateSlider();
    if(index<totalSlides) setTimeout(nextSlide,2000);
    else setTimeout(startPhotoLove,800);
  }

  setTimeout(nextSlide,1500);
}

// ===== PHOTO → LOVE =====
const photoLove=document.getElementById("photoLove");
const plctx=photoLove.getContext("2d");
photoLove.width=innerWidth;
photoLove.height=innerHeight;

const imgs=[];
["foto1.jpeg","foto2.jpeg","foto3.jpeg","foto4.jpeg"].forEach(src=>{
  let img=new Image();
  img.src=src;
  imgs.push(img);
});

function startPhotoLove() {
  document.getElementById("finalPage").style.display = "none";
  photoLove.style.display = "block";

  photoLove.width = innerWidth;
  photoLove.height = innerHeight;

  let particles = [];
  const isMobile = innerWidth < 768;
  const screenScale = Math.min(innerWidth, innerHeight) / 30;
  const density = isMobile ? 0.15 : 0.1;
  const floatAmplitude = 4;

  let t = 0;
  const spawnInterval = isMobile ? 80 : 60;

  function spawnParticle() {
      if (t >= Math.PI * 2) return;

      particles.push({
          x: innerWidth / 2,
          y: innerHeight / 2,
          t: t,
          img: imgs[Math.floor(Math.random() * imgs.length)],
          alpha: 0,
          scale: 0,
          floatOffset: Math.random() * Math.PI * 2
      });
      t += density;
      setTimeout(spawnParticle, spawnInterval);
  }
  spawnParticle();

  let globalRotation = 0;
  let canMove = false;
  const totalSpawnTime = (Math.PI * 2 / density) * spawnInterval;
  setTimeout(() => { canMove = true; }, totalSpawnTime + 1500);

  let time = 0;
  function animatePhotoLove() {
      plctx.clearRect(0, 0, photoLove.width, photoLove.height);
      time += 0.02;

      if (canMove) globalRotation += 0.005;

      particles.forEach(p => {
          const angle = p.t + globalRotation;
          const hx = 16 * Math.pow(Math.sin(angle), 3);
          const hy = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);

          const targetX = innerWidth / 2 + hx * screenScale;
          const targetY = innerHeight / 2 - hy * screenScale;

          const lerp = canMove ? 0.15 : 0.06;
          p.x += (targetX - p.x) * lerp;
          p.y += (targetY - p.y) * lerp;

          p.alpha += (1 - p.alpha) * 0.05;
          p.scale += (1 - p.scale) * 0.05;

          const floatY = Math.sin(time + p.floatOffset) * floatAmplitude;

          const ratio = p.img.width / p.img.height;
          let size = screenScale * 4 * p.scale;
          let w = size;
          let h = size;
          if (ratio > 1) h = w / ratio;
          else w = h * ratio;

          plctx.globalAlpha = p.alpha;
          plctx.shadowColor = "#ff2e88";
          plctx.shadowBlur = isMobile ? 5 : 10;
          plctx.drawImage(p.img, p.x - w / 2, p.y - h / 2 + floatY, w, h);
      });

      plctx.globalAlpha = 1;
      plctx.shadowBlur = 0;

      requestAnimationFrame(animatePhotoLove);
  }
  animatePhotoLove();
}
// resize canvas saat orientasi HP berubah
window.addEventListener('resize', () => {
  photoLove.width = innerWidth;
  photoLove.height = innerHeight;
  initMatrix();
});

// ===== LOVE BURST ON TAP/CLICK =====
const heartsContainer = document.getElementById("hearts-container");
let heartsActive = false;

function burstHearts(e) {
  const x = e.clientX ?? e.touches?.[0]?.clientX ?? innerWidth / 2;
  const y = e.clientY ?? e.touches?.[0]?.clientY ?? innerHeight / 2;
  const emojis = ["❤️", "💖", "💗", "💕", "✨"];
  const count = 12 + Math.floor(Math.random() * 6);

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "heart-particle";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 120;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--dx", dx + "px");
    el.style.setProperty("--dy", dy + "px");
    el.style.fontSize = (14 + Math.random() * 22) + "px";

    heartsContainer.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

document.addEventListener("click", e => { if (heartsActive) burstHearts(e); });
document.addEventListener("touchstart", e => { if (heartsActive) burstHearts(e); });