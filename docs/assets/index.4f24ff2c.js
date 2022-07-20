var M=Object.defineProperty;var b=(t,e,n)=>e in t?M(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var a=(t,e,n)=>(b(t,typeof e!="symbol"?e+"":e,n),n);const F=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}};F();const p=(t,e)=>({name:"position",data:{x:t,y:e}}),f=(t,e=!1)=>({name:"mass",data:{mass:t,stationary:e}}),y=t=>({name:"radius",data:t}),g=(t,e)=>({name:"velocity",data:{x:t,y:e}}),c={add:(t,e)=>({x:t.x+e.x,y:t.y+e.y}),sub:(t,e)=>({x:t.x-e.x,y:t.y-e.y}),magnitude:t=>Math.sqrt(t.x*t.x+t.y*t.y),scale:(t,e)=>({x:t.x*e,y:t.y*e}),unit:t=>c.scale(t,1/c.magnitude(t))},T=({getEntities:t,timeDelta:e})=>{let n=t("position","velocity","mass");n.filter(i=>!i.components.mass.data.stationary).forEach(i=>{const s=i.components.position,o=i.components.velocity;n.filter(r=>r!==i).forEach(r=>{const u=r.components.mass.data.mass,v=r.components.position,h=c.sub(v.data,s.data),x=c.magnitude(h),S=u/Math.pow(x,2),E=c.scale(c.unit(h),S);o.data=c.add(o.data,c.scale(E,e))}),s.data=c.add(s.data,c.scale(o.data,e))})},q=t=>({getEntities:e})=>{const n=e("position","radius");t.clearRect(0,0,t.canvas.width,t.canvas.height),n.forEach(i=>{const s=i.components.position,o=i.components.radius;t.beginPath(),t.arc(s.data.x,s.data.y,o.data,0,2*Math.PI),t.fillStyle="#000",t.fill()})},A=(t,e,n)=>{var s;const i=(s=n.get(t))!=null?s:new Set;i.add(e),n.set(t,i)},m=(t,e,n)=>{var s;const i=(s=n.get(t))!=null?s:new Set;i.delete(e),n.set(t,i)};class L{constructor(){a(this,"_nextId",0);a(this,"_entities",new Map);a(this,"_components",new Map);a(this,"_systems",[]);a(this,"_paused",!1);a(this,"_previousTime");a(this,"entity",e=>{const n=this._entities.get(e);if(!n)return;const i={insert:s=>(n.components[s.name]=s,A(s.name,e,this._components),i),remove:s=>(delete n.components[s],m(s,e,this._components),i),despawn:()=>{this._entities.delete(e),Object.keys(n.components).forEach(s=>{m(s,e,this._components)})}};return i});a(this,"spawn",()=>{const e={id:this._nextId++,components:{}};return this._entities.set(e.id,e),this.entity(e.id)});a(this,"addSystem",e=>(this._systems.push(e),this));a(this,"onNewFrame",e=>{const n=(...i)=>{if(i.length===0)return this._entities.values();let s;return i.forEach(o=>{var r;if(!s){s=Array.from((r=this._components.get(o))!=null?r:new Set).map(u=>this._entities.get(u));return}s=s.filter(u=>!!u.components[o])}),s!=null?s:[]};this._systems.forEach(i=>{i({engine:this,timeDelta:e,getEntities:n})})});a(this,"run",()=>{const e=n=>{var s;this._previousTime=(s=this._previousTime)!=null?s:n;const i=n-this._previousTime;this._previousTime=n,this.onNewFrame(i),!this._paused&&requestAnimationFrame(e)};requestAnimationFrame(e)});a(this,"pause",()=>this._paused=!0);a(this,"resume",()=>{this._paused=!1,this.run()})}}const d=document.querySelector("canvas");if(!d)throw new Error("Canvas not found");const w=d.getContext("2d");if(!w)throw new Error("Unable to initialise canvas context!");d.height=window.innerHeight;d.width=window.innerWidth;const _=Math.min(d.width,d.height),l=new L,O=q(w);l.addSystem(T).addSystem(O);l.spawn().insert(p(d.width/2,d.height/2-150)).insert(y(_*.02)).insert(g(.5,0)).insert(f(20));l.spawn().insert(p(d.width/2,d.height/2)).insert(y(_*.1)).insert(g(0,0)).insert(f(40,!0));l.run();
