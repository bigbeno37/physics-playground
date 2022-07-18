const q=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}};q();const g=(t,n)=>({name:"position",data:{x:t,y:n}}),y=t=>({name:"mass",data:t}),w=t=>({name:"radius",data:t}),F=(t,n)=>({name:"velocity",data:{x:t,y:n}}),p=t=>t.name==="position",L=t=>t.name==="radius",V=t=>t.name==="velocity",x=t=>t.name==="mass",O=t=>{const n=Math.min(t.width,t.height),r={components:[g(t.width/2,t.height/2),w(n*.1),y(n*.5)]},i={components:[g(t.width/2,t.height/2-300),w(n*.02),F(.5,0),y(n*2e-4)]},e=[r,i],o=e.reduce((s,l)=>(l.components.forEach(m=>{var f;const u=(f=s.get(m.name))!=null?f:[];u.push(l),s.set(m.name,u)}),s),new Map);return{entities:e,components:o}},a={add:(t,n)=>({x:t.x+n.x,y:t.y+n.y}),sub:(t,n)=>({x:t.x-n.x,y:t.y-n.y}),magnitude:t=>Math.sqrt(t.x*t.x+t.y*t.y),scale:(t,n)=>({x:t.x*n,y:t.y*n}),unit:t=>a.scale(t,1/a.magnitude(t))},v=(t,n,r)=>{const i=t.components.find(p),e=t.components.find(V),o=t.components.find(x);if(!i)throw new Error("Position component required when using Velocity!");o&&n.filter(s=>s!==t).forEach(s=>{const l=s.components.find(x);if(!l)return;const m=s.components.find(p),u=a.sub(m.data,i.data),f=a.magnitude(u),P=o.data*l.data/(f*f),b=a.scale(a.unit(u),P);e.data=a.add(e.data,a.scale(b,r))}),i.data=a.add(i.data,a.scale(e.data,r))},c=document.querySelector("canvas");if(!c)throw new Error("Canvas not found");const d=c.getContext("2d");if(!d)throw new Error("Unable to initialise canvas context!");c.height=window.innerHeight;c.width=window.innerWidth;const{entities:A,components:E}=O(c);let h;const M=t=>{var r;h||(h=t);const n=t-h;h=t,d.clearRect(0,0,c.width,c.height),E.forEach((i,e)=>{switch(e){case"velocity":i.forEach(o=>v(o,A,n));break}}),(r=E.get("position"))==null||r.forEach(i=>{const e=i.components.find(p),o=i.components.find(L);if(!e||!o)throw new Error("Missing position or radius component!");d.beginPath(),d.arc(e.data.x,e.data.y,o.data,0,2*Math.PI),d.fillStyle="#000",d.fill()}),requestAnimationFrame(M)};requestAnimationFrame(M);