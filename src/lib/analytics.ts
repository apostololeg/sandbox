import { debounce } from 'uilib';

const isLocalhost = /^localhost|^127\.0\.0\.1/.test(location.host);
const projectId =
  typeof STATS_PROJECT_ID !== 'undefined' ? STATS_PROJECT_ID || '' : '';

if (isLocalhost || !projectId) {
  window.statsSDK = {
    report: () => {},
    reportPage: () => {},
  };
} else {
  // prettier-ignore
  (function (t) { const e = "stats-token"; function n() { return ( ( "undefined" != typeof Intl && Intl.DateTimeFormat?.().resolvedOptions?.() )?.timeZone ?? "" ); } function o(t, n) { const o = "undefined" != typeof localStorage ? localStorage.getItem(e + "-" + t) : null, a = { pid: t, ...n }; (o && (a.token = o), fetch("https://stats.apostol.space/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a), }) .then((t) => t.text()) .then((n) => { let o = {}; if (n) try { o = JSON.parse(n); } catch (t) {} o.token && "undefined" != typeof localStorage && localStorage.setItem(e + "-" + t, o.token); })); } let a = location.pathname; const r = { reportPage(e) { o(t, { page: e || location.pathname, timeZone: n() }); }, reportEvent(e) { o(t, { event: e }); }, }; ((function (t) { const e = history.pushState, n = history.replaceState; ((history.pushState = function (...t) { return ( window.dispatchEvent( new CustomEvent("pushstate", { detail: { state: t[0], url: t[2] }, }), ), e.apply(history, t) ); }), (history.replaceState = function (...t) { return ( window.dispatchEvent( new CustomEvent("replacestate", { detail: { state: t[0], url: t[2] }, }), ), n.apply(history, t) ); }), window.addEventListener("pushstate", t), window.addEventListener("replacestate", t), window.addEventListener("popstate", () => t({ detail: { url: location.pathname } }), )); })((e) => { let r = ((e && e.detail && e.detail.url) || location.pathname).split( "?", )[0]; ("" === r && (r = "/"), r !== a && ((a = r), o(t, { page: a, timeZone: n() }))); }), r.reportPage(), (window.statsSDK = { report: (t) => t && r.reportEvent(t), reportPage: () => r.reportPage() })); })(projectId);
}

export const reportEvent = (event: string) => {
  window.statsSDK?.report(event);
};

export const createDebouncedReported = (event: string) =>
  debounce(() => reportEvent(event), 1000);
