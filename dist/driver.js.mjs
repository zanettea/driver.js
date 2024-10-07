let F = {};
function D(e = {}) {
  F = {
    animate: !0,
    allowClose: !0,
    overlayClickBehavior: "close",
    overlayOpacity: 0.7,
    smoothScroll: !1,
    disableActiveInteraction: !1,
    showProgress: !1,
    stagePadding: 10,
    stageRadius: 5,
    popoverOffset: 10,
    showButtons: ["next", "previous", "close"],
    disableButtons: [],
    overlayColor: "#000",
    ...e
  };
}
function r(e) {
  return e ? F[e] : F;
}
function W(e, o, t, i) {
  return (e /= i / 2) < 1 ? t / 2 * e * e + o : -t / 2 * (--e * (e - 2) - 1) + o;
}
function G(e) {
  const o = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
  return e.flatMap((t) => {
    const i = t.matches(o), c = Array.from(t.querySelectorAll(o));
    return [...i ? [t] : [], ...c];
  }).filter((t) => getComputedStyle(t).pointerEvents !== "none" && ce(t));
}
function J(e) {
  if (!e || ae(e))
    return;
  const o = r("smoothScroll");
  e.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !o || se(e) ? "auto" : "smooth",
    inline: "center",
    block: "center"
  });
}
function se(e) {
  if (!e || !e.parentElement)
    return;
  const o = e.parentElement;
  return o.scrollHeight > o.clientHeight;
}
function ae(e) {
  const o = e.getBoundingClientRect();
  return o.top >= 0 && o.left >= 0 && o.bottom <= (window.innerHeight || document.documentElement.clientHeight) && o.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function ce(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
let O = {};
function b(e, o) {
  O[e] = o;
}
function a(e) {
  return e ? O[e] : O;
}
function X() {
  O = {};
}
let M = {};
function N(e, o) {
  M[e] = o;
}
function _(e) {
  var o;
  (o = M[e]) == null || o.call(M);
}
function le() {
  M = {};
}
function de(e, o, t, i) {
  let c = a("__activeStagePosition");
  const n = c || t.getBoundingClientRect(), u = i.getBoundingClientRect(), m = W(e, n.x, u.x - n.x, o), v = W(e, n.y, u.y - n.y, o), f = W(e, n.width, u.width - n.width, o), l = W(e, n.height, u.height - n.height, o);
  c = {
    x: m,
    y: v,
    width: f,
    height: l
  }, z([c]), b("__activeStagePosition", c);
}
function U(e, o) {
  if (!e && !o)
    return;
  const t = e.getBoundingClientRect(), i = {
    x: t.x,
    y: t.y,
    width: t.width,
    height: t.height
  };
  if (b("__activeStagePosition", i), !o)
    z([i]);
  else {
    const c = Array.from(o).map((n) => {
      const u = n.getBoundingClientRect();
      return {
        x: u.x,
        y: u.y,
        width: u.width,
        height: u.height
      };
    });
    z([...c]);
  }
}
function pe() {
  const e = a("__activeStagePosition"), o = a("__overlaySvg");
  if (!e)
    return;
  if (!o) {
    console.warn("No stage svg found.");
    return;
  }
  const t = window.innerWidth, i = window.innerHeight;
  o.setAttribute("viewBox", `0 0 ${t} ${i}`);
}
function ue(e) {
  const o = ve(e);
  document.body.appendChild(o), oe(o, (t) => {
    t.target.tagName === "path" && _("overlayClick");
  }), b("__overlaySvg", o);
}
function z(e) {
  const o = a("__overlaySvg");
  if (!o) {
    ue(e);
    return;
  }
  const t = o.firstElementChild;
  if ((t == null ? void 0 : t.tagName) !== "path")
    throw new Error("no path element found in stage svg");
  t.setAttribute("d", ee(e));
}
function ve(e) {
  const o = window.innerWidth, t = window.innerHeight, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.classList.add("driver-overlay", "driver-overlay-animated"), i.setAttribute("viewBox", `0 0 ${o} ${t}`), i.setAttribute("xmlSpace", "preserve"), i.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink"), i.setAttribute("version", "1.1"), i.setAttribute("preserveAspectRatio", "xMinYMin slice"), i.style.fillRule = "evenodd", i.style.clipRule = "evenodd", i.style.strokeLinejoin = "round", i.style.strokeMiterlimit = "2", i.style.zIndex = "10000", i.style.position = "fixed", i.style.top = "0", i.style.left = "0", i.style.width = "100%", i.style.height = "100%";
  const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return c.setAttribute("d", ee(e)), c.style.fill = r("overlayColor") || "rgb(0,0,0)", c.style.opacity = `${r("overlayOpacity")}`, c.style.pointerEvents = "auto", c.style.cursor = "auto", i.appendChild(c), i;
}
function ee(e) {
  const o = window.innerWidth, t = window.innerHeight;
  let i = `M${o},0L0,0L0,${t}L${o},${t}L${o},0Z `;
  for (let c of e) {
    const n = r("stagePadding") || 0, u = r("stageRadius") || 0, m = c.width + n * 2, v = c.height + n * 2, f = Math.min(u, m / 2, v / 2), l = Math.floor(Math.max(f, 0)), s = c.x - n + l, d = c.y - n, p = m - l * 2, w = v - l * 2;
    i += ` M${s},${d} h${p} a${l},${l} 0 0 1 ${l},${l} v${w} a${l},${l} 0 0 1 -${l},${l} h-${p} a${l},${l} 0 0 1 -${l},-${l} v-${w} a${l},${l} 0 0 1 ${l},-${l} z`;
  }
  return i;
}
function he() {
  const e = a("__overlaySvg");
  e && e.remove();
}
function fe() {
  const e = document.getElementById("driver-dummy-element");
  if (e)
    return e;
  let o = document.createElement("div");
  return o.id = "driver-dummy-element", o.style.width = "0", o.style.height = "0", o.style.pointerEvents = "none", o.style.opacity = "0", o.style.position = "fixed", o.style.top = "50%", o.style.left = "50%", document.body.appendChild(o), o;
}
function Y(e) {
  const { element: o, elements: t } = e;
  let i = typeof o == "string" ? document.querySelector(o) : o, c = t ? document.querySelectorAll(t) : void 0;
  i || (i = fe()), we(i, c, e);
}
function ge() {
  const e = a("__activeElement"), o = a("__activeStep"), t = a("activeHighlighedElements");
  e && (U(e, t), pe(), ne(e, o));
}
function we(e, o, t) {
  const c = Date.now(), n = a("__activeStep"), u = a("__activeElement") || e, m = !u || u === e, v = e.id === "driver-dummy-element", f = u.id === "driver-dummy-element", l = r("animate"), s = t.onHighlightStarted || r("onHighlightStarted"), d = (t == null ? void 0 : t.onHighlighted) || r("onHighlighted"), p = (n == null ? void 0 : n.onDeselected) || r("onDeselected"), w = r(), h = a();
  !m && p && p(f ? void 0 : u, n, {
    config: w,
    state: h
  }), s && s(v ? void 0 : e, t, {
    config: w,
    state: h
  });
  const g = !m && l;
  let k = !1;
  Ce(), b("previousStep", n), b("previousElement", u), b("activeStep", t), b("activeElement", e), b("activeHighlighedElements", o);
  const x = () => {
    if (a("__transitionCallback") !== x)
      return;
    const y = Date.now() - c, S = 400 - y <= 400 / 2;
    t.popover && S && !k && g && (Q(e, t), k = !0), r("animate") && y < 400 ? de(y, 400, u, e) : (U(e, o), d && d(v ? void 0 : e, t, {
      config: r(),
      state: a()
    }), b("__transitionCallback", void 0), b("__previousStep", n), b("__previousElement", u), b("__activeStep", t), b("__activeElement", e)), window.requestAnimationFrame(x);
  };
  b("__transitionCallback", x), window.requestAnimationFrame(x), J(e), !g && t.popover && Q(e, t), u.classList.remove("driver-active-element", "driver-no-interaction"), u.removeAttribute("aria-haspopup"), u.removeAttribute("aria-expanded"), u.removeAttribute("aria-controls"), r("disableActiveInteraction") && e.classList.add("driver-no-interaction"), e.classList.add("driver-active-element"), e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "true"), e.setAttribute("aria-controls", "driver-popover-content");
}
function me() {
  var e;
  (e = document.getElementById("driver-dummy-element")) == null || e.remove(), document.querySelectorAll(".driver-active-element").forEach((o) => {
    o.classList.remove("driver-active-element", "driver-no-interaction"), o.removeAttribute("aria-haspopup"), o.removeAttribute("aria-expanded"), o.removeAttribute("aria-controls");
  });
}
function I() {
  const e = a("__resizeTimeout");
  e && window.cancelAnimationFrame(e), b("__resizeTimeout", window.requestAnimationFrame(ge));
}
function ye(e) {
  var v;
  if (!a("isInitialized") || !(e.key === "Tab" || e.keyCode === 9))
    return;
  const i = a("__activeElement"), c = (v = a("popover")) == null ? void 0 : v.wrapper, n = G([
    ...c ? [c] : [],
    ...i ? [i] : []
  ]), u = n[0], m = n[n.length - 1];
  if (e.preventDefault(), e.shiftKey) {
    const f = n[n.indexOf(document.activeElement) - 1] || m;
    f == null || f.focus();
  } else {
    const f = n[n.indexOf(document.activeElement) + 1] || u;
    f == null || f.focus();
  }
}
function te(e) {
  var t;
  ((t = r("allowKeyboardControl")) == null || t) && (e.key === "Escape" ? _("escapePress") : e.key === "ArrowRight" ? _("arrowRightPress") : e.key === "ArrowLeft" && _("arrowLeftPress"));
}
function oe(e, o, t) {
  const i = (n, u) => {
    const m = n.target;
    e.contains(m) && ((!t || t(m)) && (n.preventDefault(), n.stopPropagation(), n.stopImmediatePropagation()), u == null || u(n));
  };
  document.addEventListener("pointerdown", i, !0), document.addEventListener("mousedown", i, !0), document.addEventListener("pointerup", i, !0), document.addEventListener("mouseup", i, !0), document.addEventListener(
    "click",
    (n) => {
      i(n, o);
    },
    !0
  );
}
function xe() {
  window.addEventListener("keyup", te, !1), window.addEventListener("keydown", ye, !1), window.addEventListener("resize", I), window.addEventListener("scroll", I);
}
function be() {
  window.removeEventListener("keyup", te), window.removeEventListener("resize", I), window.removeEventListener("scroll", I);
}
function Ce() {
  const e = a("popover");
  e && (e.wrapper.style.display = "none");
}
function Q(e, o) {
  var y, C;
  let t = a("popover");
  t && document.body.removeChild(t.wrapper), t = Pe(), document.body.appendChild(t.wrapper);
  const {
    title: i,
    description: c,
    showButtons: n,
    disableButtons: u,
    showProgress: m,
    nextBtnText: v = r("nextBtnText") || "Next &rarr;",
    prevBtnText: f = r("prevBtnText") || "&larr; Previous",
    progressText: l = r("progressText") || "{current} of {total}"
  } = o.popover || {};
  t.nextButton.innerHTML = v, t.previousButton.innerHTML = f, t.progress.innerHTML = l, i ? (t.title.innerHTML = i, t.title.style.display = "block") : t.title.style.display = "none", c ? (t.description.innerHTML = c, t.description.style.display = "block") : t.description.style.display = "none";
  const s = n || r("showButtons"), d = m || r("showProgress") || !1, p = (s == null ? void 0 : s.includes("next")) || (s == null ? void 0 : s.includes("previous")) || d;
  t.closeButton.style.display = s.includes("close") ? "block" : "none", p ? (t.footer.style.display = "flex", t.progress.style.display = d ? "block" : "none", t.nextButton.style.display = s.includes("next") ? "block" : "none", t.previousButton.style.display = s.includes("previous") ? "block" : "none") : t.footer.style.display = "none";
  const w = u || r("disableButtons") || [];
  w != null && w.includes("next") && (t.nextButton.disabled = !0, t.nextButton.classList.add("driver-popover-btn-disabled")), w != null && w.includes("previous") && (t.previousButton.disabled = !0, t.previousButton.classList.add("driver-popover-btn-disabled")), w != null && w.includes("close") && (t.closeButton.disabled = !0, t.closeButton.classList.add("driver-popover-btn-disabled"));
  const h = t.wrapper;
  h.style.display = "block", h.style.left = "", h.style.top = "", h.style.bottom = "", h.style.right = "", h.id = "driver-popover-content", h.setAttribute("role", "dialog"), h.setAttribute("aria-labelledby", "driver-popover-title"), h.setAttribute("aria-describedby", "driver-popover-description");
  const g = t.arrow;
  g.className = "driver-popover-arrow";
  const k = ((y = o.popover) == null ? void 0 : y.popoverClass) || r("popoverClass") || "";
  h.className = `driver-popover ${k}`.trim(), oe(
    t.wrapper,
    (S) => {
      var $, B, R;
      const E = S.target, A = (($ = o.popover) == null ? void 0 : $.onNextClick) || r("onNextClick"), T = ((B = o.popover) == null ? void 0 : B.onPrevClick) || r("onPrevClick"), H = ((R = o.popover) == null ? void 0 : R.onCloseClick) || r("onCloseClick");
      if (E.classList.contains("driver-popover-next-btn"))
        return A ? A(e, o, {
          config: r(),
          state: a()
        }) : _("nextClick");
      if (E.classList.contains("driver-popover-prev-btn"))
        return T ? T(e, o, {
          config: r(),
          state: a()
        }) : _("prevClick");
      if (E.classList.contains("driver-popover-close-btn"))
        return H ? H(e, o, {
          config: r(),
          state: a()
        }) : _("closeClick");
    },
    (S) => !(t != null && t.description.contains(S)) && !(t != null && t.title.contains(S)) && typeof S.className == "string" && S.className.includes("driver-popover")
  ), b("popover", t);
  const x = ((C = o.popover) == null ? void 0 : C.onPopoverRender) || r("onPopoverRender");
  x && x(t, {
    config: r(),
    state: a()
  }), ne(e, o), J(h);
  const L = e.classList.contains("driver-dummy-element"), P = G([h, ...L ? [] : [e]]);
  P.length > 0 && P[0].focus();
}
function ie() {
  const e = a("popover");
  if (!(e != null && e.wrapper))
    return;
  const o = e.wrapper.getBoundingClientRect(), t = r("stagePadding") || 0, i = r("popoverOffset") || 0;
  return {
    width: o.width + t + i,
    height: o.height + t + i,
    realWidth: o.width,
    realHeight: o.height
  };
}
function Z(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: c, popoverArrowDimensions: n } = o;
  return e === "start" ? Math.max(
    Math.min(
      t.top - c,
      window.innerHeight - i.realHeight - n.width
    ),
    n.width
  ) : e === "end" ? Math.max(
    Math.min(
      t.top - (i == null ? void 0 : i.realHeight) + t.height + c,
      window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
    ),
    n.width
  ) : e === "center" ? Math.max(
    Math.min(
      t.top + t.height / 2 - (i == null ? void 0 : i.realHeight) / 2,
      window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
    ),
    n.width
  ) : 0;
}
function j(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: c, popoverArrowDimensions: n } = o;
  return e === "start" ? Math.max(
    Math.min(
      t.left - c,
      window.innerWidth - i.realWidth - n.width
    ),
    n.width
  ) : e === "end" ? Math.max(
    Math.min(
      t.left - (i == null ? void 0 : i.realWidth) + t.width + c,
      window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
    ),
    n.width
  ) : e === "center" ? Math.max(
    Math.min(
      t.left + t.width / 2 - (i == null ? void 0 : i.realWidth) / 2,
      window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
    ),
    n.width
  ) : 0;
}
function ne(e, o) {
  const t = a("popover");
  if (!t)
    return;
  const { align: i = "start", side: c = "left" } = (o == null ? void 0 : o.popover) || {}, n = i, u = e.id === "driver-dummy-element" ? "over" : c, m = r("stagePadding") || 0, v = ie(), f = t.arrow.getBoundingClientRect(), l = e.getBoundingClientRect(), s = l.top - v.height;
  let d = s >= 0;
  const p = window.innerHeight - (l.bottom + v.height);
  let w = p >= 0;
  const h = l.left - v.width;
  let g = h >= 0;
  const k = window.innerWidth - (l.right + v.width);
  let x = k >= 0;
  const L = !d && !w && !g && !x;
  let P = u;
  if (u === "top" && d ? x = g = w = !1 : u === "bottom" && w ? x = g = d = !1 : u === "left" && g ? x = d = w = !1 : u === "right" && x && (g = d = w = !1), u === "over") {
    const y = window.innerWidth / 2 - v.realWidth / 2, C = window.innerHeight / 2 - v.realHeight / 2;
    t.wrapper.style.left = `${y}px`, t.wrapper.style.right = "auto", t.wrapper.style.top = `${C}px`, t.wrapper.style.bottom = "auto";
  } else if (L) {
    const y = window.innerWidth / 2 - (v == null ? void 0 : v.realWidth) / 2, C = 10;
    t.wrapper.style.left = `${y}px`, t.wrapper.style.right = "auto", t.wrapper.style.bottom = `${C}px`, t.wrapper.style.top = "auto";
  } else if (g) {
    const y = Math.min(
      h,
      window.innerWidth - (v == null ? void 0 : v.realWidth) - f.width
    ), C = Z(n, {
      elementDimensions: l,
      popoverDimensions: v,
      popoverPadding: m,
      popoverArrowDimensions: f
    });
    t.wrapper.style.left = `${y}px`, t.wrapper.style.top = `${C}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.right = "auto", P = "left";
  } else if (x) {
    const y = Math.min(
      k,
      window.innerWidth - (v == null ? void 0 : v.realWidth) - f.width
    ), C = Z(n, {
      elementDimensions: l,
      popoverDimensions: v,
      popoverPadding: m,
      popoverArrowDimensions: f
    });
    t.wrapper.style.right = `${y}px`, t.wrapper.style.top = `${C}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.left = "auto", P = "right";
  } else if (d) {
    const y = Math.min(
      s,
      window.innerHeight - v.realHeight - f.width
    );
    let C = j(n, {
      elementDimensions: l,
      popoverDimensions: v,
      popoverPadding: m,
      popoverArrowDimensions: f
    });
    t.wrapper.style.top = `${y}px`, t.wrapper.style.left = `${C}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.right = "auto", P = "top";
  } else if (w) {
    const y = Math.min(
      p,
      window.innerHeight - (v == null ? void 0 : v.realHeight) - f.width
    );
    let C = j(n, {
      elementDimensions: l,
      popoverDimensions: v,
      popoverPadding: m,
      popoverArrowDimensions: f
    });
    t.wrapper.style.left = `${C}px`, t.wrapper.style.bottom = `${y}px`, t.wrapper.style.top = "auto", t.wrapper.style.right = "auto", P = "bottom";
  }
  L ? t.arrow.classList.add("driver-popover-arrow-none") : ke(n, P, e);
}
function ke(e, o, t) {
  const i = a("popover");
  if (!i)
    return;
  const c = t.getBoundingClientRect(), n = ie(), u = i.arrow, m = n.width, v = window.innerWidth, f = c.width, l = c.left, s = n.height, d = window.innerHeight, p = c.top, w = c.height;
  u.className = "driver-popover-arrow";
  let h = o, g = e;
  o === "top" ? (l + f <= 0 ? (h = "right", g = "end") : l + f - m <= 0 && (h = "top", g = "start"), l >= v ? (h = "left", g = "end") : l + m >= v && (h = "top", g = "end")) : o === "bottom" ? (l + f <= 0 ? (h = "right", g = "start") : l + f - m <= 0 && (h = "bottom", g = "start"), l >= v ? (h = "left", g = "start") : l + m >= v && (h = "bottom", g = "end")) : o === "left" ? (p + w <= 0 ? (h = "bottom", g = "end") : p + w - s <= 0 && (h = "left", g = "start"), p >= d ? (h = "top", g = "end") : p + s >= d && (h = "left", g = "end")) : o === "right" && (p + w <= 0 ? (h = "bottom", g = "start") : p + w - s <= 0 && (h = "right", g = "start"), p >= d ? (h = "top", g = "start") : p + s >= d && (h = "right", g = "end")), h ? (u.classList.add(`driver-popover-arrow-side-${h}`), u.classList.add(`driver-popover-arrow-align-${g}`)) : u.classList.add("driver-popover-arrow-none");
}
function Pe() {
  const e = document.createElement("div");
  e.classList.add("driver-popover");
  const o = document.createElement("div");
  o.classList.add("driver-popover-arrow");
  const t = document.createElement("header");
  t.id = "driver-popover-title", t.classList.add("driver-popover-title"), t.style.display = "none", t.innerText = "Popover Title";
  const i = document.createElement("div");
  i.id = "driver-popover-description", i.classList.add("driver-popover-description"), i.style.display = "none", i.innerText = "Popover description is here";
  const c = document.createElement("button");
  c.type = "button", c.classList.add("driver-popover-close-btn"), c.setAttribute("aria-label", "Close"), c.innerHTML = "&times;";
  const n = document.createElement("footer");
  n.classList.add("driver-popover-footer");
  const u = document.createElement("span");
  u.classList.add("driver-popover-progress-text"), u.innerText = "";
  const m = document.createElement("span");
  m.classList.add("driver-popover-navigation-btns");
  const v = document.createElement("button");
  v.type = "button", v.classList.add("driver-popover-prev-btn"), v.innerHTML = "&larr; Previous";
  const f = document.createElement("button");
  return f.type = "button", f.classList.add("driver-popover-next-btn"), f.innerHTML = "Next &rarr;", m.appendChild(v), m.appendChild(f), n.appendChild(u), n.appendChild(m), e.appendChild(c), e.appendChild(o), e.appendChild(t), e.appendChild(i), e.appendChild(n), {
    wrapper: e,
    arrow: o,
    title: t,
    description: i,
    footer: n,
    previousButton: v,
    nextButton: f,
    closeButton: c,
    footerButtons: m,
    progress: u
  };
}
function Se() {
  var o;
  const e = a("popover");
  e && ((o = e.wrapper.parentElement) == null || o.removeChild(e.wrapper));
}
function _e(e = {}) {
  D(e);
  function o() {
    r("allowClose") && l();
  }
  function t() {
    const s = r("overlayClickBehavior");
    if (r("allowClose") && s === "close") {
      l();
      return;
    }
    s === "nextStep" && i();
  }
  function i() {
    const s = a("activeIndex"), d = r("steps") || [];
    if (typeof s == "undefined")
      return;
    const p = s + 1;
    d[p] ? f(p) : l();
  }
  function c() {
    const s = a("activeIndex"), d = r("steps") || [];
    if (typeof s == "undefined")
      return;
    const p = s - 1;
    d[p] ? f(p) : l();
  }
  function n(s) {
    (r("steps") || [])[s] ? f(s) : l();
  }
  function u() {
    var k;
    if (a("__transitionCallback"))
      return;
    const d = a("activeIndex"), p = a("__activeStep"), w = a("__activeElement");
    if (typeof d == "undefined" || typeof p == "undefined" || typeof a("activeIndex") == "undefined")
      return;
    const g = ((k = p.popover) == null ? void 0 : k.onPrevClick) || r("onPrevClick");
    if (g)
      return g(w, p, {
        config: r(),
        state: a()
      });
    c();
  }
  function m() {
    var g;
    if (a("__transitionCallback"))
      return;
    const d = a("activeIndex"), p = a("__activeStep"), w = a("__activeElement");
    if (typeof d == "undefined" || typeof p == "undefined")
      return;
    const h = ((g = p.popover) == null ? void 0 : g.onNextClick) || r("onNextClick");
    if (h)
      return h(w, p, {
        config: r(),
        state: a()
      });
    i();
  }
  function v() {
    a("isInitialized") || (b("isInitialized", !0), document.body.classList.add("driver-active", r("animate") ? "driver-fade" : "driver-simple"), xe(), N("overlayClick", t), N("escapePress", o), N("arrowLeftPress", u), N("arrowRightPress", m));
  }
  function f(s = 0) {
    var T, H, $, B, R, q, V, K;
    const d = r("steps");
    if (!d) {
      console.error("No steps to drive through"), l();
      return;
    }
    if (!d[s]) {
      l();
      return;
    }
    b("__activeOnDestroyed", document.activeElement), b("activeIndex", s);
    const p = d[s], w = d[s + 1], h = d[s - 1], g = ((T = p.popover) == null ? void 0 : T.doneBtnText) || r("doneBtnText") || "Done", k = r("allowClose"), x = typeof ((H = p.popover) == null ? void 0 : H.showProgress) != "undefined" ? ($ = p.popover) == null ? void 0 : $.showProgress : r("showProgress"), P = (((B = p.popover) == null ? void 0 : B.progressText) || r("progressText") || "{{current}} of {{total}}").replace("{{current}}", `${s + 1}`).replace("{{total}}", `${d.length}`), y = ((R = p.popover) == null ? void 0 : R.showButtons) || r("showButtons"), C = [
      "next",
      "previous",
      ...k ? ["close"] : []
    ].filter((re) => !(y != null && y.length) || y.includes(re)), S = ((q = p.popover) == null ? void 0 : q.onNextClick) || r("onNextClick"), E = ((V = p.popover) == null ? void 0 : V.onPrevClick) || r("onPrevClick"), A = ((K = p.popover) == null ? void 0 : K.onCloseClick) || r("onCloseClick");
    Y({
      ...p,
      popover: {
        showButtons: C,
        nextBtnText: w ? void 0 : g,
        disableButtons: [...h ? [] : ["previous"]],
        showProgress: x,
        progressText: P,
        onNextClick: S || (() => {
          w ? f(s + 1) : l();
        }),
        onPrevClick: E || (() => {
          f(s - 1);
        }),
        onCloseClick: A || (() => {
          l();
        }),
        ...(p == null ? void 0 : p.popover) || {}
      }
    });
  }
  function l(s = !0) {
    const d = a("__activeElement"), p = a("__activeStep"), w = a("__activeOnDestroyed"), h = r("onDestroyStarted");
    if (s && h) {
      const x = !d || (d == null ? void 0 : d.id) === "driver-dummy-element";
      h(x ? void 0 : d, p, {
        config: r(),
        state: a()
      });
      return;
    }
    const g = (p == null ? void 0 : p.onDeselected) || r("onDeselected"), k = r("onDestroyed");
    if (document.body.classList.remove("driver-active", "driver-fade", "driver-simple"), be(), Se(), me(), he(), le(), X(), d && p) {
      const x = d.id === "driver-dummy-element";
      g && g(x ? void 0 : d, p, {
        config: r(),
        state: a()
      }), k && k(x ? void 0 : d, p, {
        config: r(),
        state: a()
      });
    }
    w && w.focus();
  }
  return {
    isActive: () => a("isInitialized") || !1,
    refresh: I,
    drive: (s = 0) => {
      v(), f(s);
    },
    setConfig: D,
    setSteps: (s) => {
      X(), D({
        ...r(),
        steps: s
      });
    },
    getConfig: r,
    getState: a,
    getActiveIndex: () => a("activeIndex"),
    isFirstStep: () => a("activeIndex") === 0,
    isLastStep: () => {
      const s = r("steps") || [], d = a("activeIndex");
      return d !== void 0 && d === s.length - 1;
    },
    getActiveStep: () => a("activeStep"),
    getActiveElement: () => a("activeElement"),
    getPreviousElement: () => a("previousElement"),
    getPreviousStep: () => a("previousStep"),
    moveNext: i,
    movePrevious: c,
    moveTo: n,
    hasNextStep: () => {
      const s = r("steps") || [], d = a("activeIndex");
      return d !== void 0 && s[d + 1];
    },
    hasPreviousStep: () => {
      const s = r("steps") || [], d = a("activeIndex");
      return d !== void 0 && s[d - 1];
    },
    highlight: (s) => {
      v(), Y({
        ...s,
        popover: s.popover ? {
          showButtons: [],
          showProgress: !1,
          progressText: "",
          ...s.popover
        } : void 0
      });
    },
    destroy: () => {
      l(!1);
    }
  };
}
export {
  _e as driver
};
