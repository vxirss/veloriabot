// Gwiazdy
const canvas = document.querySelector('.stars');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
canvas.width = w; canvas.height = h;
const stars = Array.from({length: 140}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 1.7 + 0.7,
  o: Math.random() * 0.5 + 0.5,
  dx: (Math.random() - 0.5) * 0.13,
  dy: (Math.random() - 0.5) * 0.13
}));
function drawStars() {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    s.x += s.dx; s.y += s.dy;
    if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
    if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
    ctx.globalAlpha = s.o;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawStars);
}
drawStars();
window.addEventListener('resize', () => {
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w; canvas.height = h;
});

// Planety (animowane okręgi)
const planetCanvas = document.querySelector('.planets');
const planetCtx = planetCanvas.getContext('2d');
planetCanvas.width = w; planetCanvas.height = h;
const planets = [
  { x: w*0.18, y: h*0.82, r: 34, color: '#6f00ff', dx: 0.09, dy: 0.07, a: 0.7 },
  { x: w*0.82, y: h*0.18, r: 22, color: '#00cfff', dx: -0.07, dy: 0.09, a: 0.5 },
  { x: w*0.7, y: h*0.7, r: 14, color: '#fff', dx: 0.05, dy: -0.06, a: 0.25 }
];
function drawPlanets() {
  planetCtx.clearRect(0, 0, w, h);
  for (const p of planets) {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
    planetCtx.globalAlpha = p.a;
    planetCtx.beginPath();
    planetCtx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    planetCtx.fillStyle = p.color;
    planetCtx.shadowColor = p.color;
    planetCtx.shadowBlur = 18;
    planetCtx.fill();
    planetCtx.shadowBlur = 0;
  }
  planetCtx.globalAlpha = 1;
  requestAnimationFrame(drawPlanets);
}
drawPlanets();
window.addEventListener('resize', () => {
  w = window.innerWidth; h = window.innerHeight;
  planetCanvas.width = w; planetCanvas.height = h;
});
