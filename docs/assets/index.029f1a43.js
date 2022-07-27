var b=Object.defineProperty;var A=(n,e,s)=>e in n?b(n,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[e]=s;var r=(n,e,s)=>(A(n,typeof e!="symbol"?e+"":e,s),s);const L=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}};L();const f=(n,e)=>({name:"position",x:n,y:e}),y=(n,e=!1)=>({name:"mass",value:n,stationary:e}),g=n=>({name:"radius",value:n}),w=(n,e)=>({name:"velocity",x:n,y:e}),c={add:(n,e)=>({x:n.x+e.x,y:n.y+e.y}),sub:(n,e)=>({x:n.x-e.x,y:n.y-e.y}),magnitude:n=>Math.sqrt(n.x*n.x+n.y*n.y),scale:(n,e)=>({x:n.x*e,y:n.y*e}),unit:n=>c.scale(n,1/c.magnitude(n))},O=(n,{timeDelta:e})=>{const s=n.required("position","velocity","mass");s.filter(i=>!i.components.mass.stationary).forEach(i=>{const t=i.components.position,o=i.components.velocity;s.filter(u=>u!==i).forEach(u=>{const x=u.components.mass.value,S=u.components.position,h=c.sub(S,t),q=c.magnitude(h),E=x/Math.pow(q,2),M=c.scale(c.unit(h),E),{x:F,y:T}=c.add(o,c.scale(M,e));o.x=F,o.y=T});const{x:d,y:l}=c.add(t,c.scale(o,e));t.x=d,t.y=l})},P=n=>e=>{const s=e.required("position","radius");n.clearRect(0,0,n.canvas.width,n.canvas.height),s.forEach(i=>{const t=i.components.position,o=i.components.radius;n.beginPath(),n.arc(t.x,t.y,o.value,0,2*Math.PI),n.fillStyle="#000",n.fill()})},N=(n,e,s)=>{var t;const i=(t=s.get(n))!=null?t:new Set;i.add(e),s.set(n,i)},p=(n,e,s)=>{var t;const i=(t=s.get(n))!=null?t:new Set;i.delete(e),s.set(n,i)};class C{constructor(){r(this,"_nextId",0);r(this,"_entities",new Map);r(this,"_components",new Map);r(this,"_systems",[]);r(this,"_previousTime");r(this,"entity",e=>{const s=this._entities.get(e);if(!s)return;const i={entity:s,insert:t=>(s.components[t.name]=t,N(t.name,e,this._components),i),remove:t=>(delete s.components[t],p(t,e,this._components),i),despawn:()=>{this._entities.delete(e),Object.keys(s.components).forEach(t=>{p(t,e,this._components)})}};return i});r(this,"spawn",()=>{const e={id:this._nextId++,components:{}};return this._entities.set(e.id,e),this.entity(e.id)});r(this,"addSystem",e=>(this._systems.push(e),this));r(this,"onNewFrame",e=>{const s={required:(...i)=>{if(i.length===0)return this._entities.values();let t;return i.forEach(o=>{var d;if(!t){t=Array.from((d=this._components.get(o))!=null?d:new Set).map(l=>this._entities.get(l));return}t=t.filter(l=>!!l.components[o])}),t!=null?t:[]},optional:()=>[],entities:()=>[]};this._systems.forEach(i=>{i(s,{engine:this,timeDelta:e})})});r(this,"run",()=>{const e=s=>{var t;this._previousTime=(t=this._previousTime)!=null?t:s;const i=s-this._previousTime;this._previousTime=s,this.onNewFrame(i),requestAnimationFrame(e)};requestAnimationFrame(e)})}}const a=document.querySelector("canvas");if(!a)throw new Error("Canvas not found");const _=a.getContext("2d");if(!_)throw new Error("Unable to initialise canvas context!");a.height=window.innerHeight;a.width=window.innerWidth;const v=Math.min(a.width,a.height),m=new C,R=P(_);m.addSystem(O).addSystem(R);m.spawn().insert(f(a.width/2,a.height/2-150)).insert(g(v*.02)).insert(w(.5,0)).insert(y(20));m.spawn().insert(f(a.width/2,a.height/2)).insert(g(v*.1)).insert(w(0,0)).insert(y(40,!0));m.run();
