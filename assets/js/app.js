/* Gracie Humaitá Valencia — renders content.js into the page.
   You shouldn't need to edit this file to change text or times. */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) {
    document.body.insertAdjacentHTML("afterbegin",
      '<p style="position:fixed;top:0;left:0;right:0;z-index:999;background:#d8432f;color:#fff;padding:16px 20px;margin:0;font:600 16px/1.4 system-ui">' +
      "content.js has a mistake in it (usually a missing quote mark or comma). Undo your last edit.</p>");
    return;
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var accent = function (t) { return esc(t).replace(/\*(.+?)\*/g, '<span class="accent">$1</span>'); };
  var get = function (path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, S); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- time + day parsing ---------- */
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAY_NAMES = { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };
  var WEEK_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // anything in content.js we couldn't read gets listed above the schedule,
  // so whoever edited it notices straight away
  var problems = [];
  function problem(where, what) {
    problems.push(where + ": couldn't read the " + what);
    console.warn("content.js — " + where + ": couldn't read the " + what);
  }

  function normDay(tok) {
    var k = String(tok).trim().slice(0, 3).toLowerCase();
    for (var i = 0; i < DAYS.length; i++) if (DAYS[i].toLowerCase() === k) return DAYS[i];
    return null;
  }

  function parseDays(str, ctx) {
    var out = [];
    String(str || "").split(/[\s,\/&]+/).filter(Boolean).forEach(function (tok) {
      var parts = tok.split(/[-–—]/);
      var a = normDay(parts[0]), b = parts[1] ? normDay(parts[1]) : null;
      if (!a || (parts[1] && !b)) { problem(ctx, 'day "' + tok + '"'); return; }
      if (!b) { out.push(a); return; }
      var i = WEEK_ORDER.indexOf(a), j = WEEK_ORDER.indexOf(b);
      for (var n = i; n <= j; n++) out.push(WEEK_ORDER[n]);
    });
    return out;
  }

  // "4:30pm" -> { h, m, mer }
  function parseClock(t) {
    t = String(t).trim().toLowerCase();
    if (t === "noon") return { h: 12, m: 0, mer: "p" };
    if (t === "midnight") return { h: 12, m: 0, mer: "a" };
    var m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])?\.?m?\.?$/i);
    if (!m) return null;
    return { h: +m[1], m: +(m[2] || 0), mer: m[3] ? m[3].toLowerCase() : null };
  }
  function toMinutes(c, mer) {
    var h = c.h % 12;
    if ((c.mer || mer) === "p") h += 12;
    return h * 60 + c.m;
  }
  // "4:30pm - 5:00pm" -> { start, end } in minutes after midnight
  function parseRange(str, ctx) {
    var parts = String(str || "").split(/\s*(?:-|–|—|\bto\b)\s*/i);
    var a = parseClock(parts[0] || ""), b = parseClock(parts[1] || "");
    if (!a || !b || !(a.mer || b.mer)) { problem(ctx, 'time "' + str + '"'); return null; }
    var start = toMinutes(a, b.mer), end = toMinutes(b, a.mer);
    return { start: start, end: end };
  }

  function hm(mins) {
    var h = Math.floor(mins / 60) % 24, m = mins % 60, h12 = h % 12 || 12;
    return h12 + (m ? ":" + (m < 10 ? "0" : "") + m : "");
  }
  function mer(mins) { return Math.floor(mins / 60) % 24 < 12 ? "AM" : "PM"; }
  function formatRange(s, e) {
    return mer(s) === mer(e) ? hm(s) + "–" + hm(e) + " " + mer(e) : hm(s) + " " + mer(s) + " – " + hm(e) + " " + mer(e);
  }
  function formatDays(list) {
    var idx = list.map(function (d) { return WEEK_ORDER.indexOf(d); }).sort(function (a, b) { return a - b; });
    var runs = [], cur = [idx[0]];
    for (var i = 1; i < idx.length; i++) {
      if (idx[i] === idx[i - 1] + 1) cur.push(idx[i]); else { runs.push(cur); cur = [idx[i]]; }
    }
    runs.push(cur);
    return runs.map(function (r) {
      if (r.length >= 3) return WEEK_ORDER[r[0]] + "–" + WEEK_ORDER[r[r.length - 1]];
      return r.map(function (i) { return WEEK_ORDER[i]; }).join(", ");
    }).join(", ");
  }

  function nowAtGym() {
    var parts = {};
    try {
      new Intl.DateTimeFormat("en-US", {
        timeZone: S.gym.timeZone || "America/Los_Angeles", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
      }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) {
      var d = new Date();
      parts = { weekday: DAYS[d.getDay()], hour: d.getHours(), minute: d.getMinutes() };
    }
    return { day: parts.weekday, mins: (+parts.hour % 24) * 60 + (+parts.minute) };
  }

  /* ---------- build the list of sessions ---------- */
  var classes = (S.schedule && S.schedule.classes) || [];
  var sessions = [];
  classes.forEach(function (c) {
    var r = parseRange(c.time, c.name);
    if (!r) return;
    c._range = r;
    c._days = parseDays(c.days, c.name);
    c._days.forEach(function (d) {
      sessions.push({ day: d, start: r.start, end: r.end, name: c.name, type: c.type || "", note: c.note || "" });
    });
  });
  sessions.sort(function (a, b) { return a.start - b.start; });
  var scheduleDays = WEEK_ORDER.filter(function (d) {
    return d !== "Sun" || sessions.some(function (s) { return s.day === "Sun"; });
  });

  /* ---------- simple text bindings ---------- */
  $$("[data-text]").forEach(function (el) { el.textContent = get(el.getAttribute("data-text")) || ""; });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- hero ---------- */
  $("#hero-headline").innerHTML = accent(S.hero.headline);
  if (S.hero.image) $("#hero-img").src = S.hero.image;
  else $("#hero-figure").remove();

  function renderNextClass() {
    var el = $("#next-class");
    if (!sessions.length) { el.hidden = true; return; }
    var now = nowAtGym(), today = WEEK_ORDER.indexOf(now.day), found = null;
    for (var off = 0; off < 8 && !found; off++) {
      var day = WEEK_ORDER[(today + off) % 7];
      var list = sessions.filter(function (s) { return s.day === day; });
      for (var i = 0; i < list.length; i++) {
        var s = list[i];
        if (off === 0 && s.start <= now.mins && now.mins < s.end) { found = { s: s, live: true, off: 0 }; break; }
        if (off > 0 || s.start > now.mins) { found = { s: s, live: false, off: off }; break; }
      }
    }
    if (!found) { el.hidden = true; return; }
    var when = found.off === 0 ? "Today" : found.off === 1 ? "Tomorrow" : DAY_NAMES[found.s.day];
    el.classList.toggle("is-live", found.live);
    el.innerHTML = '<span class="pulse" aria-hidden="true"></span><span>' +
      "<small>" + (found.live ? "On the mat now" : "Next class") + "</small>" +
      "<strong>" + esc(found.s.name) + " · " +
      (found.live ? "until " + hm(found.s.end) + " " + mer(found.s.end) : when + " " + hm(found.s.start) + " " + mer(found.s.start)) +
      "</strong></span>";
    el.hidden = false;
  }

  /* ---------- stats ---------- */
  $("#stats").innerHTML = (S.stats || []).map(function (s) {
    return '<div class="stat"><strong>' + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></div>";
  }).join("");

  /* ---------- schedule ---------- */
  var state = { filter: "all", day: null };
  var mobileQuery = window.matchMedia("(max-width: 960px)");

  function sessionHTML(s, now) {
    var isToday = s.day === now.day;
    var live = isToday && s.start <= now.mins && now.mins < s.end;
    var past = isToday && now.mins >= s.end;
    return '<div class="session' + (live ? " is-live" : "") + (past ? " is-past" : "") + '" data-type="' + esc(s.type) + '">' +
      '<span class="time">' + formatRange(s.start, s.end) + "</span>" +
      '<span class="name">' + esc(s.name) + "</span>" +
      (s.note ? '<span class="note">' + esc(s.note) + "</span>" : "") +
      (live ? '<span class="live-badge">Happening now</span>' : "") +
      "</div>";
  }

  function renderFilters() {
    var types = S.classTypes || {};
    $("#schedule-filters").innerHTML =
      '<button type="button" class="chip is-active" data-filter="all" aria-pressed="true">All classes</button>' +
      Object.keys(types).map(function (k) {
        return '<button type="button" class="chip" data-filter="' + esc(k) + '" data-type="' + esc(k) + '" aria-pressed="false">' +
          '<i class="dot" aria-hidden="true"></i>' + esc(types[k]) + "</button>";
      }).join("");
  }

  function renderProblems() {
    if (!problems.length) return;
    var box = document.createElement("div");
    box.className = "content-problems";
    box.setAttribute("role", "status");
    box.innerHTML = "<strong>Some classes in content.js couldn't be shown:</strong><ul>" +
      problems.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
      '</ul><span>Times look like "4:30pm - 5:00pm". Days look like "Mon Wed Fri" or "Mon-Thu".</span>';
    $("#week").parentNode.insertBefore(box, $("#schedule-filters"));
  }

  function renderWeek() {
    var now = nowAtGym();
    if (!state.day) state.day = scheduleDays.indexOf(now.day) >= 0 ? now.day : scheduleDays[0];
    var week = $("#week");
    week.style.setProperty("--days", scheduleDays.length);
    week.innerHTML = scheduleDays.map(function (d) {
      var list = sessions.filter(function (s) { return s.day === d; });
      var isToday = d === now.day;
      return '<div class="day' + (isToday ? " is-today" : "") + '" data-day="' + d + '" role="tabpanel" aria-label="' + DAY_NAMES[d] + '">' +
        '<div class="day-head"><h3>' + DAY_NAMES[d] + "</h3>" + (isToday ? '<span class="today-badge">Today</span>' : "") + "</div>" +
        list.map(function (s) { return sessionHTML(s, now); }).join("") +
        '<p class="day-empty" hidden>No classes for this filter.</p></div>';
    }).join("");
    $("#day-tabs").innerHTML = scheduleDays.map(function (d) {
      return '<button type="button" class="day-tab" role="tab" data-day="' + d + '">' + d +
        (d === now.day ? "<small>Today</small>" : "") + "</button>";
    }).join("");
    applySchedule();
  }

  function applySchedule() {
    $$(".chip").forEach(function (c) {
      var on = c.getAttribute("data-filter") === state.filter;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", on);
    });
    $$(".day").forEach(function (day) {
      var visible = 0;
      $$(".session", day).forEach(function (s) {
        var show = state.filter === "all" || s.getAttribute("data-type") === state.filter;
        s.hidden = !show;
        if (show) visible++;
      });
      $(".day-empty", day).hidden = visible > 0;
      day.classList.toggle("is-active", day.getAttribute("data-day") === state.day);
      var tab = $('.day-tab[data-day="' + day.getAttribute("data-day") + '"]');
      if (tab) {
        var on = tab.getAttribute("data-day") === state.day;
        tab.classList.toggle("is-active", on);
        tab.classList.toggle("is-empty", visible === 0);
        tab.setAttribute("aria-selected", on);
      }
    });
  }

  // on phones, jump to the next day that actually has a class of this type
  function firstDayWith(type) {
    var now = nowAtGym(), start = Math.max(0, WEEK_ORDER.indexOf(now.day));
    for (var off = 0; off < 7; off++) {
      var d = WEEK_ORDER[(start + off) % 7];
      if (scheduleDays.indexOf(d) < 0) continue;
      if (sessions.some(function (s) { return s.day === d && (type === "all" || s.type === type); })) return d;
    }
    return state.day;
  }

  function setFilter(type) {
    state.filter = type;
    if (mobileQuery.matches) state.day = firstDayWith(type);
    applySchedule();
  }

  $("#schedule-filters").addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (chip) setFilter(chip.getAttribute("data-filter"));
  });
  $("#day-tabs").addEventListener("click", function (e) {
    var tab = e.target.closest(".day-tab");
    if (!tab) return;
    state.day = tab.getAttribute("data-day");
    applySchedule();
  });

  /* ---------- programs ---------- */

  function programTimes(type) {
    if (!type) return "";
    var groups = {}, order = [];
    classes.forEach(function (c) {
      if (c.type !== type || !c._range || !c._days.length) return;
      if (!groups[c.name]) { groups[c.name] = []; order.push(c.name); }
      groups[c.name].push(formatDays(c._days) + " · " + formatRange(c._range.start, c._range.end));
    });
    if (!order.length) return "";
    return '<ul class="times">' + order.map(function (name) {
      return '<li><span class="t-name">' + esc(name) + "</span>" +
        groups[name].map(function (slot) { return '<span class="t-slot">' + esc(slot) + "</span>"; }).join("") + "</li>";
    }).join("") + "</ul>";
  }

  $("#program-grid").innerHTML = (S.programs || []).map(function (p) {
    var media = p.image
      ? '<div class="program-media"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + ' class" loading="lazy"></div>'
      : '<div class="program-media is-plain"><img src="assets/img/logo-large.png" alt="" loading="lazy"></div>';
    var action = p.type
      ? '<button type="button" class="link-btn" data-show="' + esc(p.type) + '">See class times →</button>'
      : '<a class="link-btn" href="#visit">Ask about availability →</a>';
    return '<article class="program reveal">' + media +
      '<div class="program-body"><span class="tag" data-type="' + esc(p.type) + '"><i class="dot" aria-hidden="true"></i>' + esc(p.ages) + "</span>" +
      "<h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p>" + programTimes(p.type) + action + "</div></article>";
  }).join("");

  $("#program-grid").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-show]");
    if (!btn) return;
    setFilter(btn.getAttribute("data-show"));
    $("#schedule").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- master ---------- */
  var P = S.master || {};
  if (P.image) { $("#master-img").src = P.image; $("#master-img").alt = P.name || ""; }
  $("#master-bio").innerHTML = (P.bio || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
  $("#master-creds").innerHTML = (P.credentials || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
  $("#master-chain").innerHTML = (P.lineage || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

  /* ---------- lineage ---------- */
  $("#lineage-track").innerHTML = (S.lineage || []).map(function (m) {
    return '<figure class="moment"><img src="' + esc(m.image) + '" alt="' + esc(m.title) + '" loading="lazy">' +
      '<figcaption><span class="label">' + esc(m.label) + "</span><h3>" + esc(m.title) + "</h3><p>" + esc(m.text) + "</p></figcaption></figure>";
  }).join("");
  $$("[data-scroll]").forEach(function (b) {
    b.addEventListener("click", function () {
      var track = $("#lineage-track"), card = $(".moment", track);
      var step = card ? card.getBoundingClientRect().width + 18 : 300;
      track.scrollBy({ left: step * +b.getAttribute("data-scroll"), behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- reviews ---------- */
  var R = S.reviews || {};
  R.items = R.items || [];
  var yelpUrl = S.gym.yelp || "https://www.yelp.com";

  var rating = $("#rating");
  if (R.rating) {
    rating.href = yelpUrl;
    $("#rating-value").textContent = R.rating;
    $("#rating-count").textContent = (R.count ? R.count + " reviews" : "Reviews") + " on Yelp";
    rating.setAttribute("aria-label", R.rating + " out of 5 stars on Yelp" + (R.count ? ", " + R.count + " reviews" : ""));
  } else rating.remove();

  $("#yelp-all").href = yelpUrl;
  $("#yelp-award").textContent = R.badge || "";

  // Yelp's official review embed: the review itself loads from Yelp.
  // Until it loads (or if Yelp is unreachable) each card is a plain link to the review.
  var yelpReviews = R.yelp || [];
  $("#yelp-grid").innerHTML = yelpReviews.map(function (r) {
    var link = yelpUrl + "?hrid=" + encodeURIComponent(r.id);
    return '<div class="yelp-card reveal"><span class="yelp-review" data-review-id="' + esc(r.id) + '" data-hostname="www.yelp.com">' +
      'Read <a href="' + esc(link) + '" rel="nofollow noopener" target="_blank">' + esc(r.name || "a student") + "\u2019s review</a> of " +
      esc(S.gym.name) + ' on <a href="https://www.yelp.com" rel="nofollow noopener" target="_blank">Yelp</a></span></div>';
  }).join("");
  if (yelpReviews.length) {
    var ys = document.createElement("script");
    ys.async = true;
    ys.src = "https://www.yelp.com/embed/widgets.js";
    document.body.appendChild(ys);
  }

  var slideIndex = 0, timer = null;
  if (R.items.length) $("#carousel").hidden = false;
  $("#slides").innerHTML = R.items.map(function (r, i) {
    return '<figure class="slide' + (i === 0 ? " is-active" : "") + '" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + R.items.length + '">' +
      "<blockquote>" + esc(r.quote) + "</blockquote><figcaption>— " + esc(r.name) + "</figcaption></figure>";
  }).join("");
  $("#dots").innerHTML = R.items.map(function (_, i) {
    return '<button type="button" aria-label="Show testimonial ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + "></button>";
  }).join("");

  function showSlide(i) {
    var n = R.items.length;
    if (!n) return;
    slideIndex = (i + n) % n;
    $$(".slide").forEach(function (s, j) { s.classList.toggle("is-active", j === slideIndex); });
    $$("#dots button").forEach(function (d, j) {
      if (j === slideIndex) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
  }
  function startAuto() { if (!reduceMotion && R.items.length > 1) { stopAuto(); timer = setInterval(function () { showSlide(slideIndex + 1); }, 7000); } }
  function stopAuto() { clearInterval(timer); }
  $("#prev-slide").addEventListener("click", function () { showSlide(slideIndex - 1); startAuto(); });
  $("#next-slide").addEventListener("click", function () { showSlide(slideIndex + 1); startAuto(); });
  $("#dots").addEventListener("click", function (e) {
    var i = $$("#dots button").indexOf(e.target);
    if (i >= 0) { showSlide(i); startAuto(); }
  });
  var carousel = $("#carousel");
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);
  carousel.addEventListener("focusin", stopAuto);
  carousel.addEventListener("focusout", startAuto);
  startAuto();

  /* ---------- FAQ ---------- */
  $("#faq-list").innerHTML = (S.faq || []).map(function (f) {
    var paras = Array.isArray(f.a) ? f.a : [f.a];
    return "<details><summary>" + esc(f.q) + '</summary><div class="faq-answer">' +
      paras.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div></details>";
  }).join("");

  /* ---------- visit / contact ---------- */
  var G = S.gym;
  var digits = String(G.phone || "").replace(/[^\d+]/g, "");
  var tel = "tel:" + (digits.charAt(0) === "+" ? digits : "+1" + digits);
  var fullAddress = G.street + ", " + G.cityStateZip;
  $("#call-link").href = tel;
  $("#call-link").textContent = "Call " + G.phone;
  $("#bar-call").href = tel;
  $("#text-link").href = "sms:" + (digits.charAt(0) === "+" ? digits : "+1" + digits);
  $("#email-link").href = "mailto:" + G.email;
  $("#directions-link").href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(fullAddress);
  $("#map").src = "https://www.google.com/maps?q=" + encodeURIComponent(G.name + ", " + fullAddress) + "&output=embed";

  var IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
  $("#socials").innerHTML = (G.instagram || []).map(function (s) {
    return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + IG + esc(s.handle) + "</a></li>";
  }).join("") + (G.yelp ? '<li><a href="' + esc(G.yelp) + '" target="_blank" rel="noopener">' + STAR + "Reviews on Yelp</a></li>" : "");

  // booking form: builds an email to the gym (no server needed)
  $("#program-select").innerHTML = (S.programs || []).map(function (p) {
    return "<option>" + esc(p.title) + "</option>";
  }).join("") + "<option>Not sure yet</option>";

  $("#book-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, ok = true;
    ["name", "contact"].forEach(function (n) {
      var bad = !f[n].value.trim();
      f[n].classList.toggle("is-invalid", bad);
      if (bad && ok) { f[n].focus(); ok = false; }
    });
    if (!ok) return;
    var body = [
      "Hi Master Mario,", "",
      "I'd like to book a free intro class.", "",
      "Name: " + f.name.value.trim(),
      "Phone/email: " + f.contact.value.trim(),
      "Who's training: " + f.program.value,
      "Best day: " + f.day.value,
      f.message.value.trim() ? "\n" + f.message.value.trim() : "",
    ].join("\n");
    window.location.href = "mailto:" + G.email + "?subject=" + encodeURIComponent("Free intro class request") + "&body=" + encodeURIComponent(body);
    var note = $("#form-note");
    note.textContent = "Your email app should open with the message ready. Nothing happened? Call or text " + G.phone + ".";
    note.classList.add("is-success");
  });
  $("#book-form").addEventListener("input", function (e) { e.target.classList.remove("is-invalid"); });

  /* ---------- header, menu, action bar ---------- */
  var header = $(".site-header"), toggle = $(".nav-toggle"), bar = $(".action-bar");
  function setMenu(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  }
  toggle.addEventListener("click", function () { setMenu(!header.classList.contains("is-open")); });
  $$("#site-nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    var visit = $("#visit").getBoundingClientRect();
    bar.classList.toggle("is-visible", y > window.innerHeight * 0.6 && visit.top > window.innerHeight * 0.5);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- search engines: business details ---------- */
  var ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: G.name,
    telephone: G.phone,
    email: G.email,
    image: new URL("assets/img/kids-class.jpg", location.href).href,
    address: { "@type": "PostalAddress", streetAddress: G.street, addressLocality: "Santa Clarita", addressRegion: "CA", postalCode: (G.cityStateZip.match(/\d{5}/) || [""])[0], addressCountry: "US" },
    sameAs: (G.instagram || []).map(function (s) { return s.url; }).concat(G.yelp ? [G.yelp] : []),
  });
  document.head.appendChild(ld);

  /* ---------- go ---------- */
  renderFilters();
  renderProblems();
  renderWeek();
  renderNextClass();
  // keep "next class" / "happening now" current while the page is open
  setInterval(function () { renderWeek(); renderNextClass(); }, 60 * 1000);
})();
