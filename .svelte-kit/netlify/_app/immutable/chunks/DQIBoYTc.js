function q(){}const X=t=>t;function P(t,n){for(const e in n)t[e]=n[e];return t}function B(t){return t()}function Y(){return Object.create(null)}function L(t){t.forEach(B)}function Z(t){return typeof t=="function"}function $(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let h;function tt(t,n){return t===n?!0:(h||(h=document.createElement("a")),h.href=n,t===h.href)}function nt(t){return Object.keys(t).length===0}function O(t,...n){if(t==null){for(const i of n)i(void 0);return q}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function et(t,n,e){t.$$.on_destroy.push(O(n,e))}function it(t,n,e,i){if(t){const c=k(t,n,e,i);return t[0](c)}}function k(t,n,e,i){return t[1]&&i?P(e.ctx.slice(),t[1](i(n))):e.ctx}function rt(t,n,e,i){return t[2],n.dirty}function ct(t,n,e,i,c,o){if(c){const r=k(n,e,i,o);t.p(r,c)}}function lt(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let i=0;i<e;i++)n[i]=-1;return n}return-1}function st(t){const n=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return n?[parseFloat(n[1]),n[2]||"px"]:[t,"px"]}let p=!1;function ot(){p=!0}function ut(){p=!1}function T(t,n,e,i){for(;t<n;){const c=t+(n-t>>1);e(c)<=i?t=c+1:n=c}return t}function F(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let u=0;u<n.length;u++){const a=n[u];a.claim_order!==void 0&&l.push(a)}n=l}const e=new Int32Array(n.length+1),i=new Int32Array(n.length);e[0]=-1;let c=0;for(let l=0;l<n.length;l++){const u=n[l].claim_order,a=(c>0&&n[e[c]].claim_order<=u?c+1:T(1,c,D=>n[e[D]].claim_order,u))-1;i[l]=e[a]+1;const w=a+1;e[w]=l,c=Math.max(w,c)}const o=[],r=[];let s=n.length-1;for(let l=e[c]+1;l!=0;l=i[l-1]){for(o.push(n[l-1]);s>=l;s--)r.push(n[s]);s--}for(;s>=0;s--)r.push(n[s]);o.reverse(),r.sort((l,u)=>l.claim_order-u.claim_order);for(let l=0,u=0;l<r.length;l++){for(;u<o.length&&r[l].claim_order>=o[u].claim_order;)u++;const a=u<o.length?o[u]:null;t.insertBefore(r[l],a)}}function H(t,n){t.appendChild(n)}function I(t){if(!t)return document;const n=t.getRootNode?t.getRootNode():t.ownerDocument;return n&&n.host?n:t.ownerDocument}function at(t){const n=A("style");return n.textContent="/* empty */",M(I(t),n),n.sheet}function M(t,n){return H(t.head||t,n),n.sheet}function R(t,n){if(p){for(F(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?(n.claim_order!==void 0||n.parentNode!==t)&&t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else(n.parentNode!==t||n.nextSibling!==null)&&t.appendChild(n)}function ft(t,n,e){p&&!e?R(t,n):(n.parentNode!==t||n.nextSibling!=e)&&t.insertBefore(n,e||null)}function _t(t){t.parentNode&&t.parentNode.removeChild(t)}function dt(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function A(t){return document.createElement(t)}function z(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function v(t){return document.createTextNode(t)}function ht(){return v(" ")}function mt(){return v("")}function pt(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function yt(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function bt(t){return t.dataset.svelteH}function gt(t){return t===""?null:+t}function xt(t){return Array.from(t.childNodes)}function U(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function j(t,n,e,i,c=!1){U(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const s=t[r];if(n(s)){const l=e(s);return l===void 0?t.splice(r,1):t[r]=l,c||(t.claim_info.last_index=r),s}}for(let r=t.claim_info.last_index-1;r>=0;r--){const s=t[r];if(n(s)){const l=e(s);return l===void 0?t.splice(r,1):t[r]=l,c?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,s}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function C(t,n,e,i){return j(t,c=>c.nodeName===n,c=>{const o=[];for(let r=0;r<c.attributes.length;r++){const s=c.attributes[r];e[s.name]||o.push(s.name)}o.forEach(r=>c.removeAttribute(r))},()=>i(n))}function vt(t,n,e){return C(t,n,e,A)}function wt(t,n,e){return C(t,n,e,z)}function W(t,n){return j(t,e=>e.nodeType===3,e=>{const i=""+n;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>v(n),!0)}function Et(t){return W(t," ")}function Nt(t,n){n=""+n,t.data!==n&&(t.data=n)}function kt(t,n){t.value=n??""}function At(t,n,e,i){e==null?t.style.removeProperty(n):t.style.setProperty(n,e,"")}function jt(t,n,e){t.classList.toggle(n,!!e)}function G(t,n,{bubbles:e=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:n,bubbles:e,cancelable:i})}function Ct(t,n){return new t(n)}let m;function b(t){m=t}function y(){if(!m)throw new Error("Function called outside component initialization");return m}function St(t){y().$$.on_mount.push(t)}function Dt(t){y().$$.after_update.push(t)}function qt(t){y().$$.on_destroy.push(t)}function Pt(){const t=y();return(n,e,{cancelable:i=!1}={})=>{const c=t.$$.callbacks[n];if(c){const o=G(n,e,{cancelable:i});return c.slice().forEach(r=>{r.call(t,o)}),!o.defaultPrevented}return!0}}const d=[],E=[];let _=[];const N=[],S=Promise.resolve();let x=!1;function J(){x||(x=!0,S.then(Q))}function Bt(){return J(),S}function K(t){_.push(t)}const g=new Set;let f=0;function Q(){if(f!==0)return;const t=m;do{try{for(;f<d.length;){const n=d[f];f++,b(n),V(n.$$)}}catch(n){throw d.length=0,f=0,n}for(b(null),d.length=0,f=0;E.length;)E.pop()();for(let n=0;n<_.length;n+=1){const e=_[n];g.has(e)||(g.add(e),e())}_.length=0}while(d.length);for(;N.length;)N.pop()();x=!1,g.clear(),b(t)}function V(t){if(t.fragment!==null){t.update(),L(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(K)}}function Lt(t){const n=[],e=[];_.forEach(i=>t.indexOf(i)===-1?n.push(i):e.push(i)),e.forEach(i=>i()),_=n}export{P as $,L as A,kt as B,gt as C,wt as D,z as E,it as F,ct as G,lt as H,rt as I,I as J,at as K,Z as L,X as M,K as N,G as O,nt as P,m as Q,Y as R,Q as S,b as T,Lt as U,B as V,ot as W,ut as X,d as Y,J as Z,st as _,Nt as a,jt as a0,Pt as a1,qt as a2,R as b,vt as c,_t as d,xt as e,W as f,Et as g,A as h,ft as i,ht as j,et as k,yt as l,bt as m,q as n,St as o,dt as p,tt as q,pt as r,$ as s,v as t,mt as u,Dt as v,Bt as w,Ct as x,At as y,E as z};
