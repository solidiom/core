import { createRenderEffect as e, flatten as t, sharedConfig as n } from "solid-js";
//#region ../../node_modules/.pnpm/@solidjs+web@2.0.0-beta.21_solid-js@2.0.0-beta.21/node_modules/@solidjs/web/dist/web.js
var r = /*#__PURE__*/ Symbol("slot"), i = /*#__PURE__*/ Symbol("host"), a = {
	transparent: !0,
	sync: !0
}, o = (t, n, r) => e(t, n, r ? {
	sync: !0,
	...r,
	transparent: !r.scope
} : a);
function s(e, t, n, i) {
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
var c = {};
function l(e, t, n) {
	let r = document.createElement("template");
	return r.innerHTML = e, n === 2 ? r.content.firstChild.firstChild : r.content.firstChild;
}
function u(e, t) {
	let n;
	return t === 1 ? (r) => document.importNode(n ||= l(e, r, t), !0) : (r) => (n ||= l(e, r, t)).cloneNode(!0);
}
var d = { scope: !0 }, f = null;
function p(e, t, n, r, i) {
	let a = n !== void 0, s = i && i.host;
	if (a && !r && (r = []), f !== null && (r = f.claimInitial(e, a, r)), typeof t != "function" && (t = g(t, r, a, !0), typeof t != "function")) {
		h(e, t, r, n), s && _(t, s);
		return;
	}
	if (a && r.length === 0) {
		let t = document.createTextNode("");
		e.insertBefore(t, n), r = [t];
	}
	let l = r;
	o((r) => {
		f !== null && (l = f.reclaimRegion(l, e, n));
		let u = g(t(), l, a, !0);
		return typeof u == "function" ? (o(() => (f !== null && (l = f.reclaimRegion(l, e, n)), g(u, l, a)), (t) => {
			h(e, t, l, n), l = t, s && _(l, s);
		}, r !== void 0 && !(i && i.schedule) ? {
			...i,
			schedule: !0
		} : i), c) : u;
	}, (t) => {
		t !== c && (h(e, t, l, n), l = t, s && _(l, s));
	}, t.$s ? i ? {
		...i,
		scope: !0
	} : d : i);
}
function m(e) {
	return n.hydrating && (!e || e.isConnected);
}
function h(e, t, n, i) {
	if (f !== null && m(e) || t === n) return;
	let a = typeof t, o = i !== void 0;
	if (a === "string" || a === "number") {
		let r = typeof n;
		r === "string" || r === "number" ? e.firstChild.data = t : y(e, n) ? e.textContent = t : (b(e, n), e.insertBefore(document.createTextNode(t), e.firstChild));
	} else if (t === void 0) x(e, n, i);
	else if (t.nodeType) Array.isArray(n) ? x(e, n, o ? i : null, t) : n && n.nodeType ? n.parentNode === e ? e.replaceChild(t, n) : e.appendChild(t) : n && e.firstChild ? e.replaceChild(t, e.firstChild) : e.appendChild(t), i && (t[r] = i);
	else if (Array.isArray(t)) {
		let r = n && Array.isArray(n);
		t.length === 0 ? x(e, n, i) : r ? n.length === 0 ? v(e, t, i) : s(e, n, t, i) : (n && x(e, n), v(e, t));
	}
}
function g(e, r, i, a) {
	if (e = t(e, {
		skipNonRendered: !0,
		doNotUnwrap: a
	}), a && typeof e == "function") return e;
	if (i && !Array.isArray(e) && (e = [e ?? ""]), Array.isArray(e)) for (let t = 0, i = e.length; t < i; t++) {
		let i = e[t], a = r && r[t], o = typeof i;
		(o === "string" || o === "number") && (e[t] = a && a.nodeType === 3 && (n.hydrating || a.data === "" + i) ? a : document.createTextNode(i));
	}
	return e;
}
function _(e, t) {
	if (Array.isArray(e)) for (let n = 0, r = e.length; n < r; n++) _(e[n], t);
	else e && e.nodeType && e[i] !== t && (e[i] = t, Object.defineProperty(e, "_$host", {
		get: t,
		configurable: !0
	}));
}
function v(e, t, n = null) {
	for (let i = 0, a = t.length; i < a; i++) {
		let a = t[i];
		e.insertBefore(a, n), n && (a[r] = n);
	}
}
function y(e, t) {
	if (t == null) return !0;
	if (Array.isArray(t)) return t.length ? e.firstChild === t[0] && e.lastChild === t[t.length - 1] : e.firstChild === null;
	if (t === "") return e.firstChild === null;
	if (t.nodeType) return e.firstChild === t && e.lastChild === t;
	let n = e.firstChild;
	return n !== null && n.nodeType === 3 && e.lastChild === n;
}
function b(e, t) {
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
function x(e, t, n, i) {
	if (n === void 0) return y(e, t) ? e.textContent = "" : b(e, t);
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
var S = Symbol.for("solid.ResponseEnvelope"), C = class {
	constructor(e, t) {
		this.response = e, this.value = t;
	}
};
C.prototype[S] = !0;
//#endregion
//#region src/index.tsx
var w = /* @__PURE__ */ u("<div data-scope=probe data-part=root>"), T = (e) => {
	var t = w();
	return p(t, () => e.label ?? "probe"), t;
};
//#endregion
export { T as Probe };

//# sourceMappingURL=index.js.map