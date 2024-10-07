let F = {};
function D(t = {}) {
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
    ...t
  };
}
function h(t) {
  return t ? F[t] : F;
}
function W(t, n, e, o) {
  return (t /= o / 2) < 1 ? e / 2 * t * t + n : -e / 2 * (--t * (t - 2) - 1) + n;
}
function J(t) {
  const n = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
  return t.flatMap((e) => {
    const o = e.matches(n), a = Array.from(e.querySelectorAll(n));
    return [...o ? [e] : [], ...a];
  }).filter((e) => getComputedStyle(e).pointerEvents !== "none" && ae(e));
}
function U(t) {
  if (!t || le(t))
    return;
  const n = h("smoothScroll");
  t.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !n || ce(t) ? "auto" : "smooth",
    inline: "center",
    block: "center"
  });
}
function ce(t) {
  if (!t || !t.parentElement)
    return;
  const n = t.parentElement;
  return n.scrollHeight > n.clientHeight;
}
function le(t) {
  const n = t.getBoundingClientRect();
  return n.top >= 0 && n.left >= 0 && n.bottom <= (window.innerHeight || document.documentElement.clientHeight) && n.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function ae(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function de(t) {
  const n = (d, v, c, u, y = 1, p = 1) => (i) => i.reduce(
    (s, f, l) => (s.push(...f.map((g, m) => ({
      ind: l,
      type: m,
      [v]: g[d],
      [u]: g[c],
      length: m === 0 ? f[
        1
        /* CLOSING */
      ][c] - g[c] : g[c] - f[
        0
        /* OPENING */
      ][c]
    }))), s),
    []
  ).sort(
    (s, f) => p * (s[u] - f[u])
  ).sort(
    (s, f) => y * (s[v] - f[v])
  ), e = n(0, "x", 1, "y", 1, 1)(t), o = n(1, "y", 0, "x", 1, 1)(t);
  let a = [];
  a[e[0].ind] = !0;
  let r = [];
  for (let d = 0; d < e.length - 1; d++) {
    const v = e[d];
    a[v.ind] = v.type === 0;
    const c = e[d + 1];
    if (!(c && c.x - v.x))
      continue;
    let y = 0;
    const p = v.x, i = c.x;
    let s, f;
    for (let l = 0; l < o.length; l++) {
      const g = o[l];
      if (a[o[l].ind])
        if (g.type === 0)
          y++, y === 1 && (s = g.y);
        else {
          y--;
          let m = 1, x = o[l + m];
          for (; l + m < o.length && !a[o[l + m].ind]; )
            m++, x = o[l + m];
          (!x || y === 0 && x.y !== g.y) && (f = g.y, r.push([
            [p, s],
            [i, f]
          ]));
        }
    }
  }
  return r;
}
function pe(t) {
  const n = /* @__PURE__ */ new Set();
  t.forEach((i) => {
    [
      [i[
        0
        /* OPENING */
      ][
        0
        /* X */
      ], i[
        0
        /* OPENING */
      ][
        1
        /* Y */
      ]],
      [i[
        1
        /* CLOSING */
      ][
        0
        /* X */
      ], i[
        0
        /* OPENING */
      ][
        1
        /* Y */
      ]],
      [i[
        1
        /* CLOSING */
      ][
        0
        /* X */
      ], i[
        1
        /* CLOSING */
      ][
        1
        /* Y */
      ]],
      [i[
        0
        /* OPENING */
      ][
        0
        /* X */
      ], i[
        1
        /* CLOSING */
      ][
        1
        /* Y */
      ]]
    ].forEach((f) => {
      const l = f.join(",");
      n.has(l) ? n.delete(l) : n.add(l);
    });
  });
  const e = [...n].map((i) => i.split(",").map((s) => +s)), o = (i, s) => i[0] < s[0] || i[0] == s[0] && i[1] < s[1] ? -1 : 1, a = (i, s) => i[1] < s[1] || i[1] == s[1] && i[0] < s[0] ? -1 : 1, r = [...e].sort(o), d = [...e].sort(a), v = {}, c = {};
  let u = 0;
  for (; u < e.length; ) {
    const i = d[u][1];
    for (; u < e.length && d[u][1] === i; )
      v[d[u].toString()] = d[u + 1], v[d[u + 1].toString()] = d[u], u += 2;
  }
  for (u = 0; u < e.length; ) {
    const i = r[u][0];
    for (; u < e.length && r[u][0] === i; )
      c[r[u].toString()] = r[u + 1], c[r[u + 1].toString()] = r[u], u += 2;
  }
  let y = [], p;
  for (; (p = Object.keys(v)).length; ) {
    const [i] = p, s = [...v[i]], f = [[s, 0]];
    for (delete v[i]; ; ) {
      const [l, g] = f[f.length - 1];
      let m;
      if (g === 0 ? (m = c[l.toString()], f.push([m, 1]), delete c[l.toString()]) : (m = v[l.toString()], f.push([m, 0]), delete v[l.toString()]), !m || m.join(",") === s.join(",")) {
        f.pop();
        break;
      }
    }
    for (let l of f) {
      const g = l[0];
      delete c[g.toString()], delete v[g.toString()];
    }
    f && f[0] && f[0][0] && y.push(f.map((l) => l[0]));
  }
  return y;
}
function K(t, n) {
  return +(+t).toFixed(n).replace(/\.?0+$/, "");
}
function ue(t, n) {
  if (!t)
    return;
  let e = t.split(/[a-zA-Z]/).reduce(function(a, r) {
    var d = r.match(/(-?[\d]+(\.\d+)?)/g);
    return d && a.push({
      x: +d[0],
      y: +d[1]
    }), a;
  }, []).filter((a, r, d) => {
    const v = d[r === 0 ? d.length - 1 : r - 1];
    return a.x !== v.x || a.y !== v.y;
  });
  const o = [];
  for (let a = 0; a < e.length; a++) {
    const r = (a + 1) % e.length, d = (a + 2) % e.length, v = e[a], c = e[r], u = e[d], y = v.x - c.x, p = v.y - c.y, i = u.x - c.x, s = u.y - c.y, f = Math.abs(Math.atan2(
      y * s - p * i,
      y * i + p * s
    )), l = Math.hypot(y, p) / 2, g = Math.hypot(i, s) / 2, m = Math.min(n, l, g), x = 4 / 3 * Math.tan(
      Math.PI / (2 * (2 * Math.PI / f))
    ) * m * (f < Math.PI / 2 ? 1 + Math.cos(f) : 1);
    let k = {
      x: c.x + y * m / l / 2,
      y: c.y + p * m / l / 2
    }, P = {
      x: c.x + y * (m - x) / l / 2,
      y: c.y + p * (m - x) / l / 2
    }, b = {
      x: c.x + i * m / g / 2,
      y: c.y + s * m / g / 2
    }, C = {
      x: c.x + i * (m - x) / g / 2,
      y: c.y + s * (m - x) / g / 2
    };
    const S = (E) => ({
      x: K(E.x, 3),
      y: K(E.y, 3)
    });
    k = S(k), P = S(P), b = S(b), C = S(C), a === e.length - 1 && o.unshift("M" + b.x + " " + b.y), o.push("L" + k.x + " " + k.y), o.push("C" + P.x + " " + P.y + "," + C.x + " " + C.y + "," + b.x + " " + b.y);
  }
  return o.push("Z"), o.join(" ");
}
let O = {};
function _(t, n) {
  O[t] = n;
}
function w(t) {
  return t ? O[t] : O;
}
function X() {
  O = {};
}
let R = {};
function N(t, n) {
  R[t] = n;
}
function L(t) {
  var n;
  (n = R[t]) == null || n.call(R);
}
function ve() {
  R = {};
}
function he(t, n, e, o) {
  let a = w("__activeStagePosition");
  const r = a || e.getBoundingClientRect(), d = o.getBoundingClientRect(), v = W(t, r.x, d.x - r.x, n), c = W(t, r.y, d.y - r.y, n), u = W(t, r.width, d.width - r.width, n), y = W(t, r.height, d.height - r.height, n);
  a = {
    x: v,
    y: c,
    width: u,
    height: y
  }, z([a]), _("__activeStagePosition", a);
}
function ee(t, n) {
  if (!t && !n)
    return;
  const e = t.getBoundingClientRect(), o = {
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height
  };
  if (_("__activeStagePosition", o), !n)
    z([o]);
  else {
    const a = Array.from(n).map((r) => {
      const d = r.getBoundingClientRect();
      return {
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height
      };
    });
    z([...a]);
  }
}
function fe() {
  const t = w("__activeStagePosition"), n = w("__overlaySvg");
  if (!t)
    return;
  if (!n) {
    console.warn("No stage svg found.");
    return;
  }
  const e = window.innerWidth, o = window.innerHeight;
  n.setAttribute("viewBox", `0 0 ${e} ${o}`);
}
function ge(t) {
  const n = we(t);
  document.body.appendChild(n), oe(n, (e) => {
    e.target.tagName === "path" && L("overlayClick");
  }), _("__overlaySvg", n);
}
function z(t) {
  const n = w("__overlaySvg");
  if (!n) {
    ge(t);
    return;
  }
  const e = n.firstElementChild;
  if ((e == null ? void 0 : e.tagName) !== "path")
    throw new Error("no path element found in stage svg");
  e.setAttribute("d", te(t));
}
function we(t) {
  const n = window.innerWidth, e = window.innerHeight, o = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  o.classList.add("driver-overlay", "driver-overlay-animated"), o.setAttribute("viewBox", `0 0 ${n} ${e}`), o.setAttribute("xmlSpace", "preserve"), o.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink"), o.setAttribute("version", "1.1"), o.setAttribute("preserveAspectRatio", "xMinYMin slice"), o.style.fillRule = "evenodd", o.style.clipRule = "evenodd", o.style.strokeLinejoin = "round", o.style.strokeMiterlimit = "2", o.style.zIndex = "10000", o.style.position = "fixed", o.style.top = "0", o.style.left = "0", o.style.width = "100%", o.style.height = "100%";
  const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return a.setAttribute("d", te(t)), a.style.fill = h("overlayColor") || "rgb(0,0,0)", a.style.opacity = `${h("overlayOpacity")}`, a.style.pointerEvents = "auto", a.style.cursor = "auto", o.appendChild(a), o;
}
function te(t) {
  const n = window.innerWidth, e = window.innerHeight;
  let o = `M${n},0L0,0L0,${e}L${n},${e}L${n},0Z `;
  const a = h("stagePadding") || 0, r = h("stageRadius") || 0, d = pe(de(t.map((v) => [[v.x - a, v.y - a], [v.x + v.width + a, v.y + v.height + a]]))).map(
    (v) => ue(
      // Non rounded path to be rounded
      v.map(
        (c, u) => `${u === 0 ? "M" : "L"}${c.join(" ")}${u === v.length - 1 ? "z" : ""}`
      ).join(
        " "
      ),
      r * 2
    )
  ).join(" ");
  return o + " " + d;
}
function ye() {
  const t = w("__overlaySvg");
  t && t.remove();
}
function me() {
  const t = document.getElementById("driver-dummy-element");
  if (t)
    return t;
  let n = document.createElement("div");
  return n.id = "driver-dummy-element", n.style.width = "0", n.style.height = "0", n.style.pointerEvents = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.top = "50%", n.style.left = "50%", document.body.appendChild(n), n;
}
function Y(t) {
  const { element: n, highlightElements: e } = t;
  let o = typeof n == "string" ? document.querySelector(n) : n, a = e ? document.querySelectorAll(e) : void 0;
  o || (o = me()), be(o, a, t);
}
function xe() {
  const t = w("__activeElement"), n = w("__activeStep"), e = w("activeHighlighedElements");
  t && (ee(t, e), fe(), re(t, n));
}
function be(t, n, e) {
  const a = Date.now(), r = w("__activeStep"), d = w("__activeElement") || t, v = !d || d === t, c = t.id === "driver-dummy-element", u = d.id === "driver-dummy-element", y = h("animate"), p = e.onHighlightStarted || h("onHighlightStarted"), i = (e == null ? void 0 : e.onHighlighted) || h("onHighlighted"), s = (r == null ? void 0 : r.onDeselected) || h("onDeselected"), f = h(), l = w();
  !v && s && s(u ? void 0 : d, r, {
    config: f,
    state: l
  }), p && p(c ? void 0 : t, e, {
    config: f,
    state: l
  });
  const g = !v && y;
  let m = !1;
  ke(), _("previousStep", r), _("previousElement", d), _("activeStep", e), _("activeElement", t), _("activeHighlighedElements", n);
  const x = () => {
    if (w("__transitionCallback") !== x)
      return;
    const b = Date.now() - a, S = 400 - b <= 400 / 2;
    e.popover && S && !m && g && (Z(t, e), m = !0), h("animate") && b < 400 ? he(b, 400, d, t) : (ee(t, n), i && i(c ? void 0 : t, e, {
      config: h(),
      state: w()
    }), _("__transitionCallback", void 0), _("__previousStep", r), _("__previousElement", d), _("__activeStep", e), _("__activeElement", t)), window.requestAnimationFrame(x);
  };
  _("__transitionCallback", x), window.requestAnimationFrame(x), U(t), !g && e.popover && Z(t, e), d.classList.remove("driver-active-element", "driver-no-interaction"), d.removeAttribute("aria-haspopup"), d.removeAttribute("aria-expanded"), d.removeAttribute("aria-controls"), h("disableActiveInteraction") && t.classList.add("driver-no-interaction"), t.classList.add("driver-active-element"), t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "true"), t.setAttribute("aria-controls", "driver-popover-content");
}
function Ce() {
  var t;
  (t = document.getElementById("driver-dummy-element")) == null || t.remove(), document.querySelectorAll(".driver-active-element").forEach((n) => {
    n.classList.remove("driver-active-element", "driver-no-interaction"), n.removeAttribute("aria-haspopup"), n.removeAttribute("aria-expanded"), n.removeAttribute("aria-controls");
  });
}
function $() {
  const t = w("__resizeTimeout");
  t && window.cancelAnimationFrame(t), _("__resizeTimeout", window.requestAnimationFrame(xe));
}
function _e(t) {
  var c;
  if (!w("isInitialized") || !(t.key === "Tab" || t.keyCode === 9))
    return;
  const o = w("__activeElement"), a = (c = w("popover")) == null ? void 0 : c.wrapper, r = J([
    ...a ? [a] : [],
    ...o ? [o] : []
  ]), d = r[0], v = r[r.length - 1];
  if (t.preventDefault(), t.shiftKey) {
    const u = r[r.indexOf(document.activeElement) - 1] || v;
    u == null || u.focus();
  } else {
    const u = r[r.indexOf(document.activeElement) + 1] || d;
    u == null || u.focus();
  }
}
function ne(t) {
  var e;
  ((e = h("allowKeyboardControl")) == null || e) && (t.key === "Escape" ? L("escapePress") : t.key === "ArrowRight" ? L("arrowRightPress") : t.key === "ArrowLeft" && L("arrowLeftPress"));
}
function oe(t, n, e) {
  const o = (r, d) => {
    const v = r.target;
    t.contains(v) && ((!e || e(v)) && (r.preventDefault(), r.stopPropagation(), r.stopImmediatePropagation()), d == null || d(r));
  };
  document.addEventListener("pointerdown", o, !0), document.addEventListener("mousedown", o, !0), document.addEventListener("pointerup", o, !0), document.addEventListener("mouseup", o, !0), document.addEventListener(
    "click",
    (r) => {
      o(r, n);
    },
    !0
  );
}
function Pe() {
  window.addEventListener("keyup", ne, !1), window.addEventListener("keydown", _e, !1), window.addEventListener("resize", $), window.addEventListener("scroll", $);
}
function Se() {
  window.removeEventListener("keyup", ne), window.removeEventListener("resize", $), window.removeEventListener("scroll", $);
}
function ke() {
  const t = w("popover");
  t && (t.wrapper.style.display = "none");
}
function Z(t, n) {
  var b, C;
  let e = w("popover");
  e && document.body.removeChild(e.wrapper), e = Le(), document.body.appendChild(e.wrapper);
  const {
    title: o,
    description: a,
    showButtons: r,
    disableButtons: d,
    showProgress: v,
    nextBtnText: c = h("nextBtnText") || "Next &rarr;",
    prevBtnText: u = h("prevBtnText") || "&larr; Previous",
    progressText: y = h("progressText") || "{current} of {total}"
  } = n.popover || {};
  e.nextButton.innerHTML = c, e.previousButton.innerHTML = u, e.progress.innerHTML = y, o ? (e.title.innerHTML = o, e.title.style.display = "block") : e.title.style.display = "none", a ? (e.description.innerHTML = a, e.description.style.display = "block") : e.description.style.display = "none";
  const p = r || h("showButtons"), i = v || h("showProgress") || !1, s = (p == null ? void 0 : p.includes("next")) || (p == null ? void 0 : p.includes("previous")) || i;
  e.closeButton.style.display = p.includes("close") ? "block" : "none", s ? (e.footer.style.display = "flex", e.progress.style.display = i ? "block" : "none", e.nextButton.style.display = p.includes("next") ? "block" : "none", e.previousButton.style.display = p.includes("previous") ? "block" : "none") : e.footer.style.display = "none";
  const f = d || h("disableButtons") || [];
  f != null && f.includes("next") && (e.nextButton.disabled = !0, e.nextButton.classList.add("driver-popover-btn-disabled")), f != null && f.includes("previous") && (e.previousButton.disabled = !0, e.previousButton.classList.add("driver-popover-btn-disabled")), f != null && f.includes("close") && (e.closeButton.disabled = !0, e.closeButton.classList.add("driver-popover-btn-disabled"));
  const l = e.wrapper;
  l.style.display = "block", l.style.left = "", l.style.top = "", l.style.bottom = "", l.style.right = "", l.id = "driver-popover-content", l.setAttribute("role", "dialog"), l.setAttribute("aria-labelledby", "driver-popover-title"), l.setAttribute("aria-describedby", "driver-popover-description");
  const g = e.arrow;
  g.className = "driver-popover-arrow";
  const m = ((b = n.popover) == null ? void 0 : b.popoverClass) || h("popoverClass") || "";
  l.className = `driver-popover ${m}`.trim(), oe(
    e.wrapper,
    (S) => {
      var B, M, I;
      const E = S.target, T = ((B = n.popover) == null ? void 0 : B.onNextClick) || h("onNextClick"), A = ((M = n.popover) == null ? void 0 : M.onPrevClick) || h("onPrevClick"), H = ((I = n.popover) == null ? void 0 : I.onCloseClick) || h("onCloseClick");
      if (E.classList.contains("driver-popover-next-btn"))
        return T ? T(t, n, {
          config: h(),
          state: w()
        }) : L("nextClick");
      if (E.classList.contains("driver-popover-prev-btn"))
        return A ? A(t, n, {
          config: h(),
          state: w()
        }) : L("prevClick");
      if (E.classList.contains("driver-popover-close-btn"))
        return H ? H(t, n, {
          config: h(),
          state: w()
        }) : L("closeClick");
    },
    (S) => !(e != null && e.description.contains(S)) && !(e != null && e.title.contains(S)) && typeof S.className == "string" && S.className.includes("driver-popover")
  ), _("popover", e);
  const x = ((C = n.popover) == null ? void 0 : C.onPopoverRender) || h("onPopoverRender");
  x && x(e, {
    config: h(),
    state: w()
  }), re(t, n), U(l);
  const k = t.classList.contains("driver-dummy-element"), P = J([l, ...k ? [] : [t]]);
  P.length > 0 && P[0].focus();
}
function ie() {
  const t = w("popover");
  if (!(t != null && t.wrapper))
    return;
  const n = t.wrapper.getBoundingClientRect(), e = h("stagePadding") || 0, o = h("popoverOffset") || 0;
  return {
    width: n.width + e + o,
    height: n.height + e + o,
    realWidth: n.width,
    realHeight: n.height
  };
}
function Q(t, n) {
  const { elementDimensions: e, popoverDimensions: o, popoverPadding: a, popoverArrowDimensions: r } = n;
  return t === "start" ? Math.max(
    Math.min(
      e.top - a,
      window.innerHeight - o.realHeight - r.width
    ),
    r.width
  ) : t === "end" ? Math.max(
    Math.min(
      e.top - (o == null ? void 0 : o.realHeight) + e.height + a,
      window.innerHeight - (o == null ? void 0 : o.realHeight) - r.width
    ),
    r.width
  ) : t === "center" ? Math.max(
    Math.min(
      e.top + e.height / 2 - (o == null ? void 0 : o.realHeight) / 2,
      window.innerHeight - (o == null ? void 0 : o.realHeight) - r.width
    ),
    r.width
  ) : 0;
}
function G(t, n) {
  const { elementDimensions: e, popoverDimensions: o, popoverPadding: a, popoverArrowDimensions: r } = n;
  return t === "start" ? Math.max(
    Math.min(
      e.left - a,
      window.innerWidth - o.realWidth - r.width
    ),
    r.width
  ) : t === "end" ? Math.max(
    Math.min(
      e.left - (o == null ? void 0 : o.realWidth) + e.width + a,
      window.innerWidth - (o == null ? void 0 : o.realWidth) - r.width
    ),
    r.width
  ) : t === "center" ? Math.max(
    Math.min(
      e.left + e.width / 2 - (o == null ? void 0 : o.realWidth) / 2,
      window.innerWidth - (o == null ? void 0 : o.realWidth) - r.width
    ),
    r.width
  ) : 0;
}
function re(t, n) {
  const e = w("popover");
  if (!e)
    return;
  const { align: o = "start", side: a = "left" } = (n == null ? void 0 : n.popover) || {}, r = o, d = t.id === "driver-dummy-element" ? "over" : a, v = h("stagePadding") || 0, c = ie(), u = e.arrow.getBoundingClientRect(), y = t.getBoundingClientRect(), p = y.top - c.height;
  let i = p >= 0;
  const s = window.innerHeight - (y.bottom + c.height);
  let f = s >= 0;
  const l = y.left - c.width;
  let g = l >= 0;
  const m = window.innerWidth - (y.right + c.width);
  let x = m >= 0;
  const k = !i && !f && !g && !x;
  let P = d;
  if (d === "top" && i ? x = g = f = !1 : d === "bottom" && f ? x = g = i = !1 : d === "left" && g ? x = i = f = !1 : d === "right" && x && (g = i = f = !1), d === "over") {
    const b = window.innerWidth / 2 - c.realWidth / 2, C = window.innerHeight / 2 - c.realHeight / 2;
    e.wrapper.style.left = `${b}px`, e.wrapper.style.right = "auto", e.wrapper.style.top = `${C}px`, e.wrapper.style.bottom = "auto";
  } else if (k) {
    const b = window.innerWidth / 2 - (c == null ? void 0 : c.realWidth) / 2, C = 10;
    e.wrapper.style.left = `${b}px`, e.wrapper.style.right = "auto", e.wrapper.style.bottom = `${C}px`, e.wrapper.style.top = "auto";
  } else if (g) {
    const b = Math.min(
      l,
      window.innerWidth - (c == null ? void 0 : c.realWidth) - u.width
    ), C = Q(r, {
      elementDimensions: y,
      popoverDimensions: c,
      popoverPadding: v,
      popoverArrowDimensions: u
    });
    e.wrapper.style.left = `${b}px`, e.wrapper.style.top = `${C}px`, e.wrapper.style.bottom = "auto", e.wrapper.style.right = "auto", P = "left";
  } else if (x) {
    const b = Math.min(
      m,
      window.innerWidth - (c == null ? void 0 : c.realWidth) - u.width
    ), C = Q(r, {
      elementDimensions: y,
      popoverDimensions: c,
      popoverPadding: v,
      popoverArrowDimensions: u
    });
    e.wrapper.style.right = `${b}px`, e.wrapper.style.top = `${C}px`, e.wrapper.style.bottom = "auto", e.wrapper.style.left = "auto", P = "right";
  } else if (i) {
    const b = Math.min(
      p,
      window.innerHeight - c.realHeight - u.width
    );
    let C = G(r, {
      elementDimensions: y,
      popoverDimensions: c,
      popoverPadding: v,
      popoverArrowDimensions: u
    });
    e.wrapper.style.top = `${b}px`, e.wrapper.style.left = `${C}px`, e.wrapper.style.bottom = "auto", e.wrapper.style.right = "auto", P = "top";
  } else if (f) {
    const b = Math.min(
      s,
      window.innerHeight - (c == null ? void 0 : c.realHeight) - u.width
    );
    let C = G(r, {
      elementDimensions: y,
      popoverDimensions: c,
      popoverPadding: v,
      popoverArrowDimensions: u
    });
    e.wrapper.style.left = `${C}px`, e.wrapper.style.bottom = `${b}px`, e.wrapper.style.top = "auto", e.wrapper.style.right = "auto", P = "bottom";
  }
  k ? e.arrow.classList.add("driver-popover-arrow-none") : Ee(r, P, t);
}
function Ee(t, n, e) {
  const o = w("popover");
  if (!o)
    return;
  const a = e.getBoundingClientRect(), r = ie(), d = o.arrow, v = r.width, c = window.innerWidth, u = a.width, y = a.left, p = r.height, i = window.innerHeight, s = a.top, f = a.height;
  d.className = "driver-popover-arrow";
  let l = n, g = t;
  n === "top" ? (y + u <= 0 ? (l = "right", g = "end") : y + u - v <= 0 && (l = "top", g = "start"), y >= c ? (l = "left", g = "end") : y + v >= c && (l = "top", g = "end")) : n === "bottom" ? (y + u <= 0 ? (l = "right", g = "start") : y + u - v <= 0 && (l = "bottom", g = "start"), y >= c ? (l = "left", g = "start") : y + v >= c && (l = "bottom", g = "end")) : n === "left" ? (s + f <= 0 ? (l = "bottom", g = "end") : s + f - p <= 0 && (l = "left", g = "start"), s >= i ? (l = "top", g = "end") : s + p >= i && (l = "left", g = "end")) : n === "right" && (s + f <= 0 ? (l = "bottom", g = "start") : s + f - p <= 0 && (l = "right", g = "start"), s >= i ? (l = "top", g = "start") : s + p >= i && (l = "right", g = "end")), l ? (d.classList.add(`driver-popover-arrow-side-${l}`), d.classList.add(`driver-popover-arrow-align-${g}`)) : d.classList.add("driver-popover-arrow-none");
}
function Le() {
  const t = document.createElement("div");
  t.classList.add("driver-popover");
  const n = document.createElement("div");
  n.classList.add("driver-popover-arrow");
  const e = document.createElement("header");
  e.id = "driver-popover-title", e.classList.add("driver-popover-title"), e.style.display = "none", e.innerText = "Popover Title";
  const o = document.createElement("div");
  o.id = "driver-popover-description", o.classList.add("driver-popover-description"), o.style.display = "none", o.innerText = "Popover description is here";
  const a = document.createElement("button");
  a.type = "button", a.classList.add("driver-popover-close-btn"), a.setAttribute("aria-label", "Close"), a.innerHTML = "&times;";
  const r = document.createElement("footer");
  r.classList.add("driver-popover-footer");
  const d = document.createElement("span");
  d.classList.add("driver-popover-progress-text"), d.innerText = "";
  const v = document.createElement("span");
  v.classList.add("driver-popover-navigation-btns");
  const c = document.createElement("button");
  c.type = "button", c.classList.add("driver-popover-prev-btn"), c.innerHTML = "&larr; Previous";
  const u = document.createElement("button");
  return u.type = "button", u.classList.add("driver-popover-next-btn"), u.innerHTML = "Next &rarr;", v.appendChild(c), v.appendChild(u), r.appendChild(d), r.appendChild(v), t.appendChild(a), t.appendChild(n), t.appendChild(e), t.appendChild(o), t.appendChild(r), {
    wrapper: t,
    arrow: n,
    title: e,
    description: o,
    footer: r,
    previousButton: c,
    nextButton: u,
    closeButton: a,
    footerButtons: v,
    progress: d
  };
}
function Te() {
  var n;
  const t = w("popover");
  t && ((n = t.wrapper.parentElement) == null || n.removeChild(t.wrapper));
}
function Ae(t = {}) {
  D(t);
  function n() {
    h("allowClose") && y();
  }
  function e() {
    const p = h("overlayClickBehavior");
    if (h("allowClose") && p === "close") {
      y();
      return;
    }
    p === "nextStep" && o();
  }
  function o() {
    const p = w("activeIndex"), i = h("steps") || [];
    if (typeof p == "undefined")
      return;
    const s = p + 1;
    i[s] ? u(s) : y();
  }
  function a() {
    const p = w("activeIndex"), i = h("steps") || [];
    if (typeof p == "undefined")
      return;
    const s = p - 1;
    i[s] ? u(s) : y();
  }
  function r(p) {
    (h("steps") || [])[p] ? u(p) : y();
  }
  function d() {
    var m;
    if (w("__transitionCallback"))
      return;
    const i = w("activeIndex"), s = w("__activeStep"), f = w("__activeElement");
    if (typeof i == "undefined" || typeof s == "undefined" || typeof w("activeIndex") == "undefined")
      return;
    const g = ((m = s.popover) == null ? void 0 : m.onPrevClick) || h("onPrevClick");
    if (g)
      return g(f, s, {
        config: h(),
        state: w()
      });
    a();
  }
  function v() {
    var g;
    if (w("__transitionCallback"))
      return;
    const i = w("activeIndex"), s = w("__activeStep"), f = w("__activeElement");
    if (typeof i == "undefined" || typeof s == "undefined")
      return;
    const l = ((g = s.popover) == null ? void 0 : g.onNextClick) || h("onNextClick");
    if (l)
      return l(f, s, {
        config: h(),
        state: w()
      });
    o();
  }
  function c() {
    w("isInitialized") || (_("isInitialized", !0), document.body.classList.add("driver-active", h("animate") ? "driver-fade" : "driver-simple"), Pe(), N("overlayClick", e), N("escapePress", n), N("arrowLeftPress", d), N("arrowRightPress", v));
  }
  function u(p = 0) {
    var A, H, B, M, I, q, V, j;
    const i = h("steps");
    if (!i) {
      console.error("No steps to drive through"), y();
      return;
    }
    if (!i[p]) {
      y();
      return;
    }
    _("__activeOnDestroyed", document.activeElement), _("activeIndex", p);
    const s = i[p], f = i[p + 1], l = i[p - 1], g = ((A = s.popover) == null ? void 0 : A.doneBtnText) || h("doneBtnText") || "Done", m = h("allowClose"), x = typeof ((H = s.popover) == null ? void 0 : H.showProgress) != "undefined" ? (B = s.popover) == null ? void 0 : B.showProgress : h("showProgress"), P = (((M = s.popover) == null ? void 0 : M.progressText) || h("progressText") || "{{current}} of {{total}}").replace("{{current}}", `${p + 1}`).replace("{{total}}", `${i.length}`), b = ((I = s.popover) == null ? void 0 : I.showButtons) || h("showButtons"), C = [
      "next",
      "previous",
      ...m ? ["close"] : []
    ].filter((se) => !(b != null && b.length) || b.includes(se)), S = ((q = s.popover) == null ? void 0 : q.onNextClick) || h("onNextClick"), E = ((V = s.popover) == null ? void 0 : V.onPrevClick) || h("onPrevClick"), T = ((j = s.popover) == null ? void 0 : j.onCloseClick) || h("onCloseClick");
    Y({
      ...s,
      popover: {
        showButtons: C,
        nextBtnText: f ? void 0 : g,
        disableButtons: [...l ? [] : ["previous"]],
        showProgress: x,
        progressText: P,
        onNextClick: S || (() => {
          f ? u(p + 1) : y();
        }),
        onPrevClick: E || (() => {
          u(p - 1);
        }),
        onCloseClick: T || (() => {
          y();
        }),
        ...(s == null ? void 0 : s.popover) || {}
      }
    });
  }
  function y(p = !0) {
    const i = w("__activeElement"), s = w("__activeStep"), f = w("__activeOnDestroyed"), l = h("onDestroyStarted");
    if (p && l) {
      const x = !i || (i == null ? void 0 : i.id) === "driver-dummy-element";
      l(x ? void 0 : i, s, {
        config: h(),
        state: w()
      });
      return;
    }
    const g = (s == null ? void 0 : s.onDeselected) || h("onDeselected"), m = h("onDestroyed");
    if (document.body.classList.remove("driver-active", "driver-fade", "driver-simple"), Se(), Te(), Ce(), ye(), ve(), X(), i && s) {
      const x = i.id === "driver-dummy-element";
      g && g(x ? void 0 : i, s, {
        config: h(),
        state: w()
      }), m && m(x ? void 0 : i, s, {
        config: h(),
        state: w()
      });
    }
    f && f.focus();
  }
  return {
    isActive: () => w("isInitialized") || !1,
    refresh: $,
    drive: (p = 0) => {
      c(), u(p);
    },
    setConfig: D,
    setSteps: (p) => {
      X(), D({
        ...h(),
        steps: p
      });
    },
    getConfig: h,
    getState: w,
    getActiveIndex: () => w("activeIndex"),
    isFirstStep: () => w("activeIndex") === 0,
    isLastStep: () => {
      const p = h("steps") || [], i = w("activeIndex");
      return i !== void 0 && i === p.length - 1;
    },
    getActiveStep: () => w("activeStep"),
    getActiveElement: () => w("activeElement"),
    getPreviousElement: () => w("previousElement"),
    getPreviousStep: () => w("previousStep"),
    moveNext: o,
    movePrevious: a,
    moveTo: r,
    hasNextStep: () => {
      const p = h("steps") || [], i = w("activeIndex");
      return i !== void 0 && p[i + 1];
    },
    hasPreviousStep: () => {
      const p = h("steps") || [], i = w("activeIndex");
      return i !== void 0 && p[i - 1];
    },
    highlight: (p) => {
      c(), Y({
        ...p,
        popover: p.popover ? {
          showButtons: [],
          showProgress: !1,
          progressText: "",
          ...p.popover
        } : void 0
      });
    },
    destroy: () => {
      y(!1);
    }
  };
}
export {
  Ae as driver
};
