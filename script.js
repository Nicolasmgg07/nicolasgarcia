// ===== Ano no rodapé =====
document.getElementById("year").textContent = new Date().getFullYear();

// =========================================================
// Roteador de telas (cada seção é uma "tela")
// =========================================================
const views = [...document.querySelectorAll(".view")];
const viewIds = views.map((v) => v.id);
const navLinks = document.querySelectorAll(".nav__links a[data-view]");
const nav = document.getElementById("nav");
const progress = document.getElementById("nav-progress");
const dotsEl = document.getElementById("dots");
const prevBtn = document.getElementById("pager-prev");
const nextBtn = document.getElementById("pager-next");
const countEl = document.getElementById("pager-count");
const pad = (n) => String(n).padStart(2, "0");

// Indicador lateral
views.forEach((v) => {
  const a = document.createElement("a");
  a.href = `#${v.id}`;
  a.dataset.label = v.dataset.title;
  a.setAttribute("aria-label", v.dataset.title);
  dotsEl.appendChild(a);
});
const dots = [...dotsEl.children];

let current = null;
let revealTimers = [];

function revealIn(view) {
  revealTimers.forEach(clearTimeout);
  revealTimers = [];
  const items = view.querySelectorAll(".reveal");
  items.forEach((el) => {
    el.classList.remove("is-visible");
    el.style.transitionDelay = "";
  });
  items.forEach((el, i) => {
    revealTimers.push(setTimeout(() => el.classList.add("is-visible"), 120 + Math.min(i, 14) * 70));
  });
  // contadores
  view.querySelectorAll("[data-count]").forEach(runCounter);
}

function show(id, { instant = false } = {}) {
  if (!viewIds.includes(id)) id = "inicio";
  if (id === current) return;
  const next = document.getElementById(id);
  const prev = current && document.getElementById(current);

  const activate = () => {
    views.forEach((v) => v !== next && v.classList.remove("is-active", "is-leaving"));
    next.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "instant" });
    revealIn(next);
  };

  if (prev && !instant) {
    prev.classList.add("is-leaving");
    prev.classList.remove("is-active");
    setTimeout(activate, 300);
  } else {
    activate();
  }

  current = id;
  const idx = viewIds.indexOf(id);

  navLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.view === id));
  dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  progress.style.width = `${((idx + 1) / viewIds.length) * 100}%`;
  countEl.textContent = `${pad(idx + 1)} / ${pad(viewIds.length)}`;
  document.title = idx === 0
    ? "Nicolas Garcia | Desenvolvedor de Software"
    : `${next.dataset.title} | Nicolas Garcia`;

  setPager(prevBtn, views[idx - 1]);
  setPager(nextBtn, views[idx + 1]);
}

function setPager(btn, view) {
  const label = btn.querySelector(".pager__label");
  if (view) {
    btn.href = `#${view.id}`;
    label.textContent = view.dataset.title;
    btn.classList.remove("is-disabled");
  } else {
    btn.href = "#";
    label.textContent = btn === nextBtn ? "Fim" : "Início";
    btn.classList.add("is-disabled");
  }
}

const fromHash = () => location.hash.replace("#", "") || "inicio";
window.addEventListener("hashchange", () => show(fromHash()));
show(fromHash(), { instant: true });

// Teclado: setas ← →
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, textarea")) return;
  const idx = viewIds.indexOf(current);
  if (e.key === "ArrowRight" && idx < viewIds.length - 1) location.hash = viewIds[idx + 1];
  if (e.key === "ArrowLeft" && idx > 0) location.hash = viewIds[idx - 1];
});

// Swipe no celular
let touchX = null, touchY = null;
document.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  touchX = null;
  if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  const idx = viewIds.indexOf(current);
  if (dx < 0 && idx < viewIds.length - 1) location.hash = viewIds[idx + 1];
  if (dx > 0 && idx > 0) location.hash = viewIds[idx - 1];
}, { passive: true });

// ===== Navbar: fundo ao rolar =====
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Menu mobile =====
const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-links");
const closeMenu = () => {
  toggle.classList.remove("is-open");
  menu.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
};
toggle.addEventListener("click", () => {
  const open = !menu.classList.contains("is-open");
  toggle.classList.toggle("is-open", open);
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

// ===== Efeito de digitação =====
const roles = [
  "Desenvolvedor de Software",
  "Criador de plataformas SaaS",
  "Entusiasta de IA & Automação",
  "Estudante de Engenharia de Software",
];
const typedEl = document.getElementById("typed");
let r = 0, c = 0, deleting = false;
(function type() {
  const word = roles[r];
  typedEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (deleting && c > 0) c--;
  else if (!deleting) { deleting = true; return setTimeout(type, 1800); }
  else { deleting = false; r = (r + 1) % roles.length; }
  setTimeout(type, deleting ? 40 : 80);
})();

// ===== Contadores =====
function runCounter(el) {
  const target = +el.dataset.count;
  const start = performance.now();
  const dur = 1400;
  const step = (t) => {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  el.textContent = "0";
  setTimeout(() => requestAnimationFrame(step), 300);
}

// ===== Filtro de projetos =====
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    projects.forEach((p) => {
      const showIt = f === "all" || p.dataset.cat === f;
      p.classList.toggle("is-hidden", !showIt);
      if (showIt) {
        p.animate(
          [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
          { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      }
    });
  })
);

// ===== Copiar e-mail =====
const copyBtn = document.getElementById("copy-email");
copyBtn.addEventListener("click", async () => {
  const label = copyBtn.querySelector("span");
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    label.textContent = "E-mail copiado!";
  } catch {
    label.textContent = copyBtn.dataset.email;
  }
  copyBtn.classList.add("is-copied");
  setTimeout(() => {
    label.textContent = "Copiar e-mail";
    copyBtn.classList.remove("is-copied");
  }, 2200);
});

// ===== Brilho que segue o mouse (fundo + cards) =====
const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (e) => {
  glow.style.setProperty("--mx", e.clientX + "px");
  glow.style.setProperty("--my", e.clientY + "px");
}, { passive: true });

document.querySelectorAll(".card-spot").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", e.clientX - rect.left + "px");
    card.style.setProperty("--y", e.clientY - rect.top + "px");
  });
});
