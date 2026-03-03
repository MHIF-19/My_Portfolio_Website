
// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
});
function animRing() {
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

// ===== LOADER =====
const loader = document.getElementById('loader');
const loaderPct = document.getElementById('loader-pct');
let pct = 0;
const pctInterval = setInterval(() => {
  pct = Math.min(pct + Math.random() * 8, 99);
  loaderPct.textContent = Math.floor(pct) + '%';
  if (pct >= 99) clearInterval(pctInterval);
}, 80);
window.addEventListener('load', () => {
  setTimeout(() => {
    loaderPct.textContent = '100%';
    setTimeout(() => loader.classList.add('hidden'), 400);
  }, 2000);
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.a = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#00f5ff' : Math.random() > 0.5 ? '#7c3aed' : '#a78bfa';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist/100) * 0.06;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animParticles);
}
animParticles();

// ===== TYPING ANIMATION =====
const roles = ['CS Undergraduate','Data Scientist', 'ML Engineer', 'Deep Learning Enthusiast', 'Computer Vision Explorer', ];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');
function type() {
  const cur = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++charIdx);
    if (charIdx === cur.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = cur.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx+1) % roles.length; }
  }
  setTimeout(type, deleting ? 60 : 90);
}
setTimeout(type, 2500);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = ['hero','about','projects','experience','skills-viz','contact'];
  let active = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) active = id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + active);
  });
}

// ===== HAMBURGER =====
const hbg = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
hbg.addEventListener('click', () => mob.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));

// ===== BACK TO TOP =====
document.getElementById('back-top').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars
      e.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animate'));
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.section-label, .section-title, .reveal, .reveal-up, .reveal-left, .reveal-right, .timeline-item, .project-card, .contact-card, .about-text-content, .skills-content').forEach(el => {
  revealObs.observe(el);
});

// Tech pills staggered reveal
const pillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.tech-pill').forEach((p, i) => {
        setTimeout(() => p.classList.add('visible'), i * 60);
      });
      pillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
const cloud = document.getElementById('tech-cloud');
if (cloud) pillObs.observe(cloud);

// ===== PROJECT SPOTLIGHT (mouse parallax) =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100 + '%';
    const my = ((e.clientY - r.top) / r.height) * 100 + '%';
    card.querySelector('.project-spotlight').style.setProperty('--mx', mx);
    card.querySelector('.project-spotlight').style.setProperty('--my', my);
  });
});

// ===== 3D TILT =====
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fname');
  const email = document.getElementById('femail');
  const msg = document.getElementById('fmsg');
  let valid = true;

  [name, email, msg].forEach(f => { f.classList.remove('error'); });
  document.querySelectorAll('.form-error').forEach(e => e.classList.remove('show'));

  if (!name.value.trim()) { name.classList.add('error'); document.getElementById('fname-err').classList.add('show'); valid = false; }
  if (!email.value.trim() || !email.value.includes('@')) { email.classList.add('error'); document.getElementById('femail-err').classList.add('show'); valid = false; }
  if (!msg.value.trim()) { msg.classList.add('error'); document.getElementById('fmsg-err').classList.add('show'); valid = false; }

  if (!valid) return;

  const btn = document.getElementById('submit-btn');
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    document.getElementById('success-msg').classList.add('show');
    form.reset();
    setTimeout(() => document.getElementById('success-msg').classList.remove('show'), 4000);
  }, 1800);
});

// ===== RESUME BUTTON =====
// Link uses the native download attribute; no JS action required.
// keep the listener stub in case additional logic is needed later.
// document.getElementById('resume-btn').addEventListener('click', e => {
//   e.preventDefault();
//   // window.location.href = 'Resume_Muhammad Hammad.pdf';
// });

// ===== SMOOTH ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});