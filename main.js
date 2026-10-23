const STUDIO = {
  name: "Tattoo Villa",
  city: "Kuta",
  cityRu: "Кута",
  cityRuIn: "Куте",
  whatsapp: "6285156101469",
  instagram: "tattoovillabali",
  telegram: "",
  email: "",
};

const MSG = {
  en: {
    filter: "Filter works",
    need: "Add your name, a way to reach you, and the idea.",
    copied: "Copied. Paste it into WhatsApp once the studio number is connected.",
    copyFail: "The note is selected below — copy it from there.",
    popup: "The note is copied. The browser did not open WhatsApp — paste it into a chat.",
    opened: "WhatsApp is open with your note.",
    title: (name) => `${name} Bali — tattoo studio in Kuta`,
    desc: () =>
      "Tattoo Villa Bali. Realism, blackwork, Japanese, piercing, masterclasses and tattoo tours in Kuta. Free consultation.",
  },
  ru: {
    filter: "Фильтр работ",
    need: "Добавьте имя, как с вами связаться, и идею.",
    copied: "Заявка скопирована. Вставьте её в WhatsApp, когда номер студии будет подключён.",
    copyFail: "Заявка выделена ниже — скопируйте её оттуда.",
    popup: "Заявка скопирована. Браузер не открыл WhatsApp — вставьте текст в чат.",
    opened: "WhatsApp открыт, заявка уже в сообщении.",
    title: (name) => `${name} Bali — тату-студия в Куте`,
    desc: () =>
      "Tattoo Villa Bali. Реализм, блэкворк, японский стиль, пирсинг, мастер-классы и тату-туры в Куте. Бесплатная консультация.",
  },
};

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const mobile = document.getElementById("mobile-nav");
const dialog = document.getElementById("lightbox");
const form = document.getElementById("book-form");
const statusEl = document.getElementById("form-status");
const preview = document.getElementById("note-preview");
let statusKey = "";

function lang() {
  return document.documentElement.lang === "ru" ? "ru" : "en";
}

function phone() {
  return String(STUDIO.whatsapp || "").replace(/\D/g, "");
}

function applyBind() {
  const map = {
    name: STUDIO.name || "Sable",
    city: STUDIO.city || "Kuta",
    cityRu: STUDIO.cityRu || STUDIO.city || "Кута",
    cityRuIn: STUDIO.cityRuIn || "Куте",
  };
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const value = map[el.getAttribute("data-bind")];
    if (value) el.textContent = value;
  });
}

function applyLang() {
  const l = lang();
  document.documentElement.lang = l;
  const copy = MSG[l];

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === l));
  });

  document.querySelectorAll("[data-ph-en]").forEach((el) => {
    el.placeholder = el.getAttribute(l === "ru" ? "data-ph-ru" : "data-ph-en") || "";
  });

  document.querySelectorAll("select").forEach((sel) => {
    Array.from(sel.options).forEach((opt) => {
      const text = opt.getAttribute(l === "ru" ? "data-ru" : "data-en");
      if (text) opt.textContent = text;
    });
  });

  const filters = document.getElementById("filters");
  if (filters) filters.setAttribute("aria-label", copy.filter);

  document.title = copy.title(STUDIO.name || "Sable");
  const desc = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const description = copy.desc();
  document.querySelectorAll("[data-alt-en]").forEach((img) => {
    img.alt = img.getAttribute(l === "ru" ? "data-alt-ru" : "data-alt-en") || "";
  });
  if (desc) desc.setAttribute("content", description);
  if (ogTitle) ogTitle.setAttribute("content", document.title);
  if (ogDesc) ogDesc.setAttribute("content", description);

  const hasWa = Boolean(phone());
  document.querySelectorAll(".when-wa").forEach((el) => {
    el.hidden = !hasWa;
  });
  document.querySelectorAll(".when-copy").forEach((el) => {
    el.hidden = hasWa;
  });

  applyBind();
  if (statusKey) setStatus(statusKey, statusEl.classList.contains("is-ok"));
  if (preview && !preview.hidden && val("guest") && val("handle") && val("idea")) {
    preview.textContent = compose();
  }
}

function setLang(next) {
  document.documentElement.lang = next === "ru" ? "ru" : "en";
  try {
    localStorage.setItem("villa-lang", document.documentElement.lang);
  } catch (err) {
    /* приватный режим */
  }
  try {
    const url = new URL(location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      history.replaceState(null, "", url);
    }
  } catch (err) {
    /* file:// */
  }
  applyLang();
}

function onScroll() {
  const menuOpen = mobile && !mobile.hidden;
  header.classList.toggle("is-solid", window.scrollY > 8 || menuOpen);
}

function closeMenu() {
  if (!mobile || !toggle) return;
  mobile.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
  onScroll();
}

function val(id) {
  return document.getElementById(id).value.trim();
}

function setStatus(key, ok) {
  statusKey = key || "";
  if (!statusEl) return;
  statusEl.classList.toggle("is-ok", Boolean(ok));
  statusEl.textContent = key ? MSG[lang()][key] : "";
}

function selectPreview() {
  const range = document.createRange();
  range.selectNodeContents(preview);
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

function setInvalid(id, on) {
  const el = document.getElementById(id);
  if (on) el.setAttribute("aria-invalid", "true");
  else el.removeAttribute("aria-invalid");
}

function optionText(id) {
  const el = document.getElementById(id);
  return el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : "";
}

function compose() {
  const l = lang();
  const name = STUDIO.name || "Sable";
  if (l === "ru") {
    return [
      `Здравствуйте, ${name}. Хочу записаться на тату.`,
      "",
      `Имя: ${val("guest")}`,
      `Связь (${optionText("channel")}): ${val("handle")}`,
      `Место: ${val("placement") || "—"}`,
      `Размер: ${optionText("size")}`,
      `Когда: ${optionText("when")}`,
      `Идея: ${val("idea")}`,
    ].join("\n");
  }
  return [
    `Hello ${name} — I would like to book a tattoo.`,
    "",
    `Name: ${val("guest")}`,
    `Contact (${optionText("channel")}): ${val("handle")}`,
    `Placement: ${val("placement") || "—"}`,
    `Size: ${optionText("size")}`,
    `When: ${optionText("when")}`,
    `Idea: ${val("idea")}`,
  ].join("\n");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

function renderSocials() {
  const box = document.getElementById("footer-social");
  if (!box) return;
  box.replaceChildren();

  const ig = String(STUDIO.instagram || "").replace(/^@/, "").trim();
  const tg = String(STUDIO.telegram || "").replace(/^@/, "").trim();
  const email = String(STUDIO.email || "").trim();

  function add(href, text, external) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    if (external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    box.appendChild(a);
  }

  if (ig) add(`https://instagram.com/${encodeURIComponent(ig)}`, "Instagram", true);
  if (tg) add(`https://t.me/${encodeURIComponent(tg)}`, "Telegram", true);
  if (email) add(`mailto:${email}`, email, false);
}

function markCurrent() {
  const links = document.querySelectorAll(".desk-nav a, #mobile-nav a");
  const sections = document.querySelectorAll("main section[id]");
  if (!("IntersectionObserver" in window)) return;
  const watcher = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((a) => {
          if (a.getAttribute("href") === id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach((section) => watcher.observe(section));
}

document.querySelectorAll(".lang-switch button").forEach((btn) => {
  btn.addEventListener("click", () => setLang(btn.dataset.lang));
});

if (toggle && mobile) {
  toggle.addEventListener("click", () => {
    const willOpen = mobile.hidden;
    mobile.hidden = !willOpen;
    toggle.setAttribute("aria-expanded", String(willOpen));
    onScroll();
    if (willOpen) {
      const first = mobile.querySelector("a");
      if (first) first.focus();
    }
  });
  mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobile && !mobile.hidden) {
    closeMenu();
    toggle.focus();
  }
});

window.addEventListener("scroll", onScroll, { passive: true });

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === btn));
    });
    document.querySelectorAll(".piece").forEach((piece) => {
      const show = cat === "all" || piece.dataset.cat === cat;
      piece.classList.toggle("is-out", !show);
    });
  });
});

document.querySelectorAll(".piece-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const art = btn.querySelector(".piece-art");
    const meta = btn.querySelector(".piece-meta");
    document.getElementById("lightbox-art").innerHTML = art ? art.innerHTML : "";
    document.getElementById("lightbox-cap").innerHTML = meta ? meta.innerHTML : "";
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
  });
});

if (dialog) {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  const closeBtn = document.getElementById("lightbox-close");
  if (closeBtn) closeBtn.addEventListener("click", () => dialog.close());
}

["guest", "handle", "idea"].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", () => setInvalid(id, false));
});

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const copy = MSG[lang()];
    const guestOk = Boolean(val("guest"));
    const handleOk = Boolean(val("handle"));
    const ideaOk = Boolean(val("idea"));
    setInvalid("guest", !guestOk);
    setInvalid("handle", !handleOk);
    setInvalid("idea", !ideaOk);
    if (!guestOk || !handleOk || !ideaOk) {
      setStatus("need", false);
      const firstId = !guestOk ? "guest" : !handleOk ? "handle" : "idea";
      document.getElementById(firstId).focus();
      return;
    }

    const message = compose();
    preview.hidden = false;
    preview.textContent = message;

    const number = phone();
    if (!number) {
      const ok = await copyText(message);
      if (!ok) selectPreview();
      setStatus(ok ? "copied" : "copyFail", ok);
      return;
    }

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      const ok = await copyText(message);
      if (!ok) selectPreview();
      setStatus(ok ? "popup" : "copyFail", ok);
      return;
    }
    setStatus("opened", true);
  });
}

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

applyLang();
renderSocials();
onScroll();
markCurrent();
