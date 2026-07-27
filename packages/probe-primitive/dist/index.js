import { createRenderEffect as e, flatten as t, sharedConfig as n } from "solid-js";
//#region ../../node_modules/.pnpm/@solidjs+web@2.0.0-beta.24_solid-js@2.0.0-beta.24/node_modules/@solidjs/web/dist/web.js
var r = /*#__PURE__*/ Symbol("slot"), i = /*#__PURE__*/ Symbol("host"), a = /*#__PURE__*/ Symbol.for("dom-expressions.frame"), o = {
	transparent: !0,
	sync: !0
}, s = (t, n, r) => e(t, n, r ? {
	sync: !0,
	...r,
	transparent: !r.scope
} : o);
function c(e, t, n, i) {
	let a = n.length, o = t.length, s = a, c = 0, l = 0, u = t[o - 1], d = u[r], f = u.parentNode === e && (!d || d === i) ? u.nextSibling : i || null, p = null, m, h;
	for (; c < o || l < s;) {
		if (t[c] === n[l]) {
			c++, l++;
			continue;
		}
		for (; t[o - 1] === n[s - 1];) o--, s--;
		if (o === c) {
			let t;
			if (s < a) if (l) {
				let a = n[l - 1], o = a[r];
				t = a.parentNode === e && (!o || o === i) ? a.nextSibling : f;
			} else t = n[s - l];
			else t = f;
			for (; l < s;) {
				let a = n[l++];
				e.insertBefore(a, t), i && (a[r] = i);
			}
		} else if (s === l) for (; c < o;) {
			let n = t[c++];
			if (!p || !p.has(n)) {
				let t = n[r];
				n.parentNode === e && (!t || t === i) && n.remove();
			}
		}
		else if ((m = t[c]) === n[s - 1] && n[l] === t[o - 1] && m.parentNode === e && (!(h = m[r]) || h === i)) if (i) do {
			let n = t[--o];
			if (e.insertBefore(n, m), n[r] = i, l++, c >= o - 1 || l >= s) break;
		} while (t[c] === n[s - 1] && n[l] === t[o - 1]);
		else do
			if (e.insertBefore(t[--o], m), l++, c >= o - 1 || l >= s) break;
		while (t[c] === n[s - 1] && n[l] === t[o - 1]);
		else {
			if (!p) {
				p = /* @__PURE__ */ new Map();
				let e = l;
				for (; e < s;) p.set(n[e], e++);
			}
			let a = p.get(t[c]);
			if (a != null) if (l < a && a < s) {
				let u = c, d = 1, m;
				for (; ++u < o && u < s && !((m = p.get(t[u])) == null || m !== a + d);) d++;
				if (d > a - l) {
					let o = t[c], s = o[r], u = o.parentNode === e && (!s || s === i) ? o : f;
					for (; l < a;) {
						let t = n[l++];
						e.insertBefore(t, u), i && (t[r] = i);
					}
				} else {
					let a = t[c++], o = n[l++], s = a[r];
					a.parentNode === e && (!s || s === i) ? e.replaceChild(o, a) : e.insertBefore(o, f), i && (o[r] = i);
				}
			} else c++;
			else {
				let n = t[c++], a = n[r];
				n.parentNode === e && (!a || a === i) && n.remove();
			}
		}
	}
}
var l = {};
function u(e, t, n) {
	let r = document.createElement("template");
	return r.innerHTML = e, n === 2 ? r.content.firstChild.firstChild : r.content.firstChild;
}
function d(e, t) {
	let n;
	return t === 1 ? (r) => document.importNode(n ||= u(e, r, t), !0) : (r) => (n ||= u(e, r, t)).cloneNode(!0);
}
var f = { scope: !0 }, p = null;
function m(e, t, n, r, i) {
	let a = n !== void 0, o = i && i.host;
	if (a && !r && (r = []), p !== null && (r = p.claimInitial(e, a, r)), typeof t != "function" && (t = _(t, r, a, !0), typeof t != "function")) {
		g(e, t, r, n), o && v(t, o);
		return;
	}
	if (a && r.length === 0) {
		let t = document.createTextNode("");
		e.insertBefore(t, n), r = [t];
	}
	let c = r;
	s((r) => {
		p !== null && (c = p.reclaimRegion(c, e, n));
		let u = _(t(), c, a, !0);
		return typeof u == "function" ? (s(() => (p !== null && (c = p.reclaimRegion(c, e, n)), _(u, c, a)), (t) => {
			g(e, t, c, n), c = t, o && v(c, o);
		}, r !== void 0 && !(i && i.schedule) ? {
			...i,
			schedule: !0
		} : i), l) : u;
	}, (t) => {
		t !== l && (g(e, t, c, n), c = t, o && v(c, o));
	}, t.$s ? i ? {
		...i,
		scope: !0
	} : f : i);
}
function h(e) {
	return n.hydrating && (!e || e.isConnected);
}
function g(e, t, n, i) {
	if (p !== null && h(e) || t === n) return;
	let o = typeof t, s = i !== void 0;
	if (o === "string" || o === "number") {
		let r = typeof n;
		r === "string" || r === "number" ? e.firstChild.data = t : b(e, n) ? e.textContent = t : (x(e, n), e.insertBefore(document.createTextNode(t), e.firstChild));
	} else if (t === void 0) S(e, n, i);
	else if (t.nodeType) Array.isArray(n) ? S(e, n, s ? i : null, t) : n && n.nodeType ? n.parentNode === e ? e.replaceChild(t, n) : e.appendChild(t) : n && e.firstChild ? e.replaceChild(t, e.firstChild) : e.appendChild(t), i && (t[r] = i);
	else if (t[a]) n && S(e, Array.isArray(n) ? n : [n], s ? i : null), t[a](e, s ? i : null);
	else if (Array.isArray(t)) {
		let r = n && Array.isArray(n);
		t.length === 0 ? S(e, n, i) : r ? n.length === 0 ? y(e, t, i) : c(e, n, t, i) : (n && S(e, n), y(e, t));
	}
}
function _(e, r, i, o) {
	if (e = t(e, {
		skipNonRendered: !0,
		doNotUnwrap: o
	}), o && typeof e == "function" || e != null && e[a]) return e;
	if (i && !Array.isArray(e) && (e = [e ?? ""]), Array.isArray(e)) for (let t = 0, i = e.length; t < i; t++) {
		let i = e[t], a = r && r[t], o = typeof i;
		(o === "string" || o === "number") && (e[t] = a && a.nodeType === 3 && (n.hydrating || a.data === "" + i) ? a : document.createTextNode(i));
	}
	return e;
}
function v(e, t) {
	if (Array.isArray(e)) for (let n = 0, r = e.length; n < r; n++) v(e[n], t);
	else e && e.nodeType && e[i] !== t && (e[i] = t, Object.defineProperty(e, "_$host", {
		get: t,
		configurable: !0
	}));
}
function y(e, t, n = null) {
	for (let i = 0, a = t.length; i < a; i++) {
		let a = t[i];
		e.insertBefore(a, n), n && (a[r] = n);
	}
}
function b(e, t) {
	if (t == null) return !0;
	if (Array.isArray(t)) return t.length ? e.firstChild === t[0] && e.lastChild === t[t.length - 1] : e.firstChild === null;
	if (t === "") return e.firstChild === null;
	if (t.nodeType) return e.firstChild === t && e.lastChild === t;
	let n = e.firstChild;
	return n !== null && n.nodeType === 3 && e.lastChild === n;
}
function x(e, t) {
	if (Array.isArray(t)) for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.parentNode === e && r.remove();
	}
	else if (t.nodeType) t.parentNode === e && t.remove();
	else {
		let t = e.firstChild;
		t && t.nodeType === 3 && t.remove();
	}
}
function S(e, t, n, i) {
	if (n === void 0) return b(e, t) ? e.textContent = "" : x(e, t);
	if (t.length) {
		let a = !1;
		for (let o = t.length - 1; o >= 0; o--) {
			let s = t[o];
			if (i !== s) {
				let t = s[r], c = s.parentNode === e && (!t || t === n);
				i && !a && !o ? c ? e.replaceChild(i, s) : e.insertBefore(i, n) : c && s.remove();
			} else a = !0;
		}
	} else i && e.insertBefore(i, n);
	i && n && (i[r] = n);
}
var C = Symbol.for("solid.ResponseEnvelope"), w = class {
	constructor(e, t) {
		this.response = e, this.value = t;
	}
};
w.prototype[C] = !0;
//#endregion
//#region src/index.tsx
var T = /* @__PURE__ */ d("<div data-scope=probe data-part=root>"), E = (e) => {
	var t = T();
	return m(t, () => e.label ?? "probe"), t;
};
//#endregion
export { E as Probe };

//# sourceMappingURL=index.js.map