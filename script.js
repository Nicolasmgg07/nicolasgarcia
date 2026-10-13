// ===== Ano no rodapé =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Navbar: estado ao rolar + link ativo =====
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav__links a[href^='#']:not(.btn)");
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));

const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 20);
  const pos = window.scrollY + window.innerHeight * 0.35;
  sections.forEach((sec, i) => {
    if (!sec) return;
    const active = pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight;
    navLinks[i].classList.toggle("is-active", active);
  });
};
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
  "Desenvolvedor de Sistemas",
  "Criador de plataformas SaaS",
  "Entusiasta de IA & Automação",
  "Estudante de Eng. de Software",
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

// ===== Reveal ao rolar =====
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  // pequeno escalonamento para itens em grade
  const parent = el.parentElement;
  const idx = [...parent.children].indexOf(el);
  if (parent.matches(".tech-grid, .projects")) el.style.transitionDelay = `${(idx % 6) * 60}ms`;
  io.observe(el);
});

// ===== Contadores =====
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1400;
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

// ===== Filtro de projetos =====
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    projects.forEach((p) => {
      const show = f === "all" || p.dataset.cat === f;
      p.classList.toggle("is-hidden", !show);
      if (show) {
        p.animate(
          [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
          { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      }
    });
  })
);

// ===== Brilho que segue o mouse (fundo + cards) =====
const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (e) => {
  glow.style.setProperty("--mx", e.clientX + "px");
  glow.style.setProperty("--my", e.clientY + "px");
}, { passive: true });

document.querySelectorAll(".card-spot").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", e.clientX - r.left + "px");
    card.style.setProperty("--y", e.clientY - r.top + "px");
  });
});
