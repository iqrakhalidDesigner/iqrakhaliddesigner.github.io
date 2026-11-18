const { projects, email } = window.portfolio;
const grid = document.querySelector("#project-grid");
const filters = document.querySelector("#filters");
const galleryPagination = document.querySelector(".gallery-pagination");
const showProjects = document.querySelector("#show-projects");
const projectsPerPage = 9;
let shownCount = projectsPerPage;
const dialog = document.querySelector("#case-study");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 820px)");
const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const target = entry.target;
    revealObserver.unobserve(target);
    if (reducedMotion.matches || target.contains(document.activeElement)) continue;
    const distance = Math.min(window.innerWidth * .03, window.innerWidth <= 980 ? 22 : 48);
    const offset = target.dataset.revealSide === "left" ? -distance : distance;
    const start = mobile.matches
      ? { opacity: .85, translate: "0 6px" }
      : { opacity: .45, translate: offset + "px 0" };
    target.animate([start, { opacity: 1, translate: "0 0" }], {
      duration: mobile.matches ? 220 : 480,
      delay: mobile.matches ? 0 : Number(target.dataset.revealDelay || 0),
      easing: "ease-out"
    });
  }
}, { threshold: .08 });
function observeReveal(target, index) {
  target.dataset.revealSide = index % 2 === 0 ? "left" : "right";
  revealObserver.observe(target);
}
let activeFilter = "All";
let visibleProjects = [];
let caseIndex = 0;

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.textContent = content;
  return node;
}

function showCase(index) {
  caseIndex = (index + visibleProjects.length) % visibleProjects.length;
  const project = visibleProjects[caseIndex];
  const image = document.querySelector("#case-image");
  image.hidden = true;
  image.removeAttribute("src");
  image.alt = project.imageAlt || "";
  if (project.image) image.src = project.image;
  document.querySelector("#case-category").textContent = project.category;
  document.querySelector("#case-title").textContent = project.title;
  document.querySelector("#case-description").textContent = project.description;
  const details = Object.entries(project.details ?? {}).map(([label, value]) => {
    const row = element("div");
    row.append(element("dt", "", label), element("dd", "", value));
    return row;
  });
  document.querySelector("#case-details").replaceChildren(...details);
  const link = document.querySelector("#case-link");
  link.href = project.link;
  document.querySelector(".case-navigation").hidden = visibleProjects.length < 2;
  document.querySelector("#case-position").textContent = (caseIndex + 1) + " / " + visibleProjects.length;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  if (!reducedMotion.matches) {
    document.querySelector(".case-copy").animate(
      [{ opacity: .5, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
      { duration: 240, easing: "ease-out" }
    );
  }
}

document.querySelector("#case-image").addEventListener("load", event => {
  event.currentTarget.hidden = false;
});
document.querySelector("#case-prev").addEventListener("click", () => showCase(caseIndex - 1));
document.querySelector("#case-next").addEventListener("click", () => showCase(caseIndex + 1));
dialog.addEventListener("keydown", event => {
  if (visibleProjects.length < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showCase(caseIndex + (event.key === "ArrowLeft" ? -1 : 1));
  }
});

function createCard(project, index) {
  const card = element("article", "project");
  card.dataset.revealDelay = (index % 3) * 55;
  observeReveal(card, index);
  const art = element("div", "project-art " + (project.theme || "project-neutral"));
  const fallback = element("div", "project-fallback", project.mark);
  fallback.setAttribute("aria-hidden", "true");
  art.append(fallback);
  const image = element("img");
  image.alt = project.imageAlt;
  if (project.image) {
    image.addEventListener("load", () => { image.hidden = false; }, { once: true });
    image.src = project.image;
    image.hidden = !image.complete || !image.naturalWidth;
    art.append(image);
  }

  const caption = element("div", "project-caption");
  const title = element("h3");
  const button = element("button", "project-link", project.title);
  button.type = "button";
  const arrow = element("span", "project-arrow", "↗");
  arrow.setAttribute("aria-hidden", "true");
  button.append(arrow);
  button.addEventListener("click", () => showCase(index));
  title.append(button);
  caption.append(element("p", "eyebrow", project.category), title);
  card.append(art, caption);
  return card;
}

function renderProjects() {
  for (const card of grid.children) revealObserver.unobserve(card);
  visibleProjects = projects.filter(project => activeFilter === "All" || project.category === activeFilter);
  grid.replaceChildren(...visibleProjects.slice(0, shownCount).map(createCard));
  updateProjectCount();
}

function updateProjectCount() {
  const total = visibleProjects.length;
  const count = "Showing " + Math.min(shownCount, total) + " of " + total + (total === 1 ? " project" : " projects");
  document.querySelector("#project-status").textContent = count;
  document.querySelector("#project-count").textContent = count;
  galleryPagination.hidden = projects.length <= projectsPerPage;
  showProjects.hidden = shownCount >= total;
}

showProjects.addEventListener("click", () => {
  const start = shownCount;
  shownCount += projectsPerPage;
  grid.append(...visibleProjects.slice(start, shownCount).map((project, index) => createCard(project, start + index)));
  grid.children[start]?.querySelector(".project-link").focus();
  updateProjectCount();
});

const categories = ["All", ...new Set(projects.map(project => project.category))];
for (const category of categories) {
  const button = element("button", "filter", category);
  button.type = "button";
  button.setAttribute("aria-pressed", String(category === activeFilter));
  button.addEventListener("click", () => {
    if (category === activeFilter) return;
    filters.querySelector('[aria-pressed="true"]').setAttribute("aria-pressed", "false");
    activeFilter = category;
    shownCount = projectsPerPage;
    button.setAttribute("aria-pressed", "true");
    renderProjects();
  });
  filters.append(button);
}
renderProjects();

const viewToggle = document.querySelector("#view-toggle");
viewToggle.hidden = false;
viewToggle.addEventListener("click", () => {
  const isList = grid.classList.toggle("is-list");
  viewToggle.setAttribute("aria-pressed", String(isList));
  renderProjects();
});

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const header = menu.closest("header");
function setMenu(open) {
  menu.hidden = !mobile.matches;
  menu.setAttribute("aria-expanded", String(open));
  nav.hidden = mobile.matches && !open;
}
setMenu(false);
mobile.addEventListener("change", () => {
  const restoreFocus = mobile.matches && nav.contains(document.activeElement);
  setMenu(false);
  if (restoreFocus) menu.focus();
});
menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") === "false"));
header.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link || menu.getAttribute("aria-expanded") !== "true") return;
  setMenu(false);
  if (!link.getAttribute("href").startsWith("#")) {
    menu.focus();
    return;
  }
  const target = document.getElementById(link.hash.slice(1));
  if (!nav.contains(link)) return;
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});
header.addEventListener("keydown", event => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menu.focus();
  }
});

const sectionLinks = [...header.querySelectorAll('a[href^="#"]:not(.signature)')];
const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1)));
let currentLink;
let navigationFrame = 0;
function updateCurrentSection() {
  navigationFrame = 0;
  const activationLine = header.getBoundingClientRect().bottom + 24;
  let nextLink;
  for (const [index, section] of sections.entries()) {
    if (section.getBoundingClientRect().top <= activationLine) nextLink = sectionLinks[index];
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    nextLink = sectionLinks.at(-1);
  }
  if (nextLink === currentLink) return;
  currentLink?.removeAttribute("aria-current");
  nextLink?.setAttribute("aria-current", "location");
  currentLink = nextLink;
}
function scheduleNavigationUpdate() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateCurrentSection);
}
window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleNavigationUpdate);
window.addEventListener("pageshow", scheduleNavigationUpdate);
scheduleNavigationUpdate();

document.querySelectorAll(".section-heading, .notes-grid details, .skills-grid details, .tool-grid li, .timeline > div, .education-card, .footer-content > h2, .contact-form").forEach(observeReveal);

const phrase = document.querySelector("#creative-phrase");
const phraseToggle = document.querySelector(".creative-toggle");
const phrases = ["love.", "remember.", "trust.", "enjoy."];
let phraseIndex = 0;
let phraseTimer;
let phrasePaused = false;
let typedLength = phrases[0].length;
let erasing = true;
function typePhrase() {
  const word = phrases[phraseIndex];
  typedLength += erasing ? -1 : 1;
  phrase.textContent = word.slice(0, typedLength);
  let delay = erasing ? 65 : 115;
  if (typedLength === 0) {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    erasing = false;
    delay = 230;
  } else if (typedLength === word.length) {
    erasing = true;
    delay = 1750;
  }
  phraseTimer = setTimeout(typePhrase, delay);
}
function syncPhraseLoop() {
  clearTimeout(phraseTimer);
  phraseToggle.hidden = reducedMotion.matches;
  if (reducedMotion.matches) {
    phraseIndex = 0;
    typedLength = phrases[0].length;
    phrase.textContent = phrases[0];
    erasing = true;
  }
  const running = !reducedMotion.matches && !phrasePaused && !document.hidden;
  phrase.classList.toggle("is-typing", running);
  if (!running) return;
  phraseTimer = setTimeout(typePhrase, erasing && typedLength === phrases[phraseIndex].length ? 1750 : 115);
}
phraseToggle.addEventListener("click", () => {
  phrasePaused = !phrasePaused;
  phraseToggle.textContent = phrasePaused ? "Play" : "Pause";
  phraseToggle.setAttribute("aria-label", phrasePaused ? "Play rotating text" : "Pause rotating text");
  syncPhraseLoop();
});
reducedMotion.addEventListener("change", syncPhraseLoop);
document.addEventListener("visibilitychange", syncPhraseLoop);
syncPhraseLoop();

if (email) {
  const link = document.querySelector("#email-link");
  link.href = "mailto:" + email;
  link.hidden = false;
}

const noteControls = document.querySelector(".note-controls");
const notes = document.querySelectorAll("[data-note]");
noteControls.hidden = false;
noteControls.addEventListener("click", event => {
  const filter = event.target.closest("[data-note-filter]");
  if (!filter || filter.getAttribute("aria-pressed") === "true") return;
  noteControls.querySelector('[aria-pressed="true"]').setAttribute("aria-pressed", "false");
  filter.setAttribute("aria-pressed", "true");
  for (const note of notes) {
    note.hidden = filter.dataset.noteFilter !== "all" && note.dataset.note !== filter.dataset.noteFilter;
  }
});

const contactForm = document.querySelector("#contact-form");
contactForm.hidden = false;
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  const message = [fields.get("message").trim(), fields.get("name").trim(), fields.get("email").trim()].join("\n\n");
  const draft = document.querySelector("#message-draft");
  const output = document.querySelector("#message-output");
  output.value = message;
  draft.hidden = false;
  output.focus();
  output.select();
  if (email) {
    const link = document.querySelector("#email-link");
    link.href = "mailto:" + email + "?subject=" + encodeURIComponent("Portfolio inquiry") + "&body=" + encodeURIComponent(message);
  }
});

const guide = document.querySelector(".portfolio-guide");
guide.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  guide.open = false;
  const target = document.getElementById(link.hash.slice(1));
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});
guide.addEventListener("keydown", event => {
  if (event.key !== "Escape" || !guide.open) return;
  guide.open = false;
  guide.querySelector("summary").focus();
});
