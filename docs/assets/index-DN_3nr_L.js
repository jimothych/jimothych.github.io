var re=Object.defineProperty;var ae=(e,t,n)=>t in e?re(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var C=(e,t,n)=>ae(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();function g(){}function ee(e){return e()}function V(){return Object.create(null)}function $(e){e.forEach(ee)}function te(e){return typeof e=="function"}function F(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function oe(e){return Object.keys(e).length===0}function p(e,t){e.appendChild(t)}function x(e,t,n){e.insertBefore(t,n||null)}function k(e){e.parentNode&&e.parentNode.removeChild(e)}function ie(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function d(e){return document.createElement(e)}function H(e){return document.createTextNode(e)}function ne(){return H(" ")}function A(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function le(e){return function(t){return t.preventDefault(),e.call(this,t)}}function w(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function ue(e){return Array.from(e.childNodes)}function D(e,t){e.value=t??""}function S(e,t,n,s){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,"")}let q;function I(e){q=e}const v=[],U=[];let _=[];const Y=[],ce=Promise.resolve();let P=!1;function fe(){P||(P=!0,ce.then(se))}function j(e){_.push(e)}const T=new Set;let b=0;function se(){if(b!==0)return;const e=q;do{try{for(;b<v.length;){const t=v[b];b++,I(t),he(t.$$)}}catch(t){throw v.length=0,b=0,t}for(I(null),v.length=0,b=0;U.length;)U.pop()();for(let t=0;t<_.length;t+=1){const n=_[t];T.has(n)||(T.add(n),n())}_.length=0}while(v.length);for(;Y.length;)Y.pop()();P=!1,T.clear(),I(e)}function he(e){if(e.fragment!==null){e.update(),$(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(j)}}function de(e){const t=[],n=[];_.forEach(s=>e.indexOf(s)===-1?t.push(s):n.push(s)),n.forEach(s=>s()),_=t}const L=new Set;let me;function N(e,t){e&&e.i&&(L.delete(e),e.i(t))}function K(e,t,n,s){if(e&&e.o){if(L.has(e))return;L.add(e),me.c.push(()=>{L.delete(e)}),e.o(t)}}function R(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function W(e){e&&e.c()}function B(e,t,n){const{fragment:s,after_update:o}=e.$$;s&&s.m(t,n),j(()=>{const r=e.$$.on_mount.map(ee).filter(te);e.$$.on_destroy?e.$$.on_destroy.push(...r):$(r),e.$$.on_mount=[]}),o.forEach(j)}function M(e,t){const n=e.$$;n.fragment!==null&&(de(n.after_update),$(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function pe(e,t){e.$$.dirty[0]===-1&&(v.push(e),fe(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function J(e,t,n,s,o,r,i=null,a=[-1]){const l=q;I(e);const c=e.$$={fragment:null,ctx:[],props:r,update:g,not_equal:o,bound:V(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(l?l.$$.context:[])),callbacks:V(),dirty:a,skip_bound:!1,root:t.target||l.$$.root};i&&i(c.root);let u=!1;if(c.ctx=n?n(e,t.props||{},(f,E,...O)=>{const m=O.length?O[0]:E;return c.ctx&&o(c.ctx[f],c.ctx[f]=m)&&(!c.skip_bound&&c.bound[f]&&c.bound[f](m),u&&pe(e,f)),E}):[],c.update(),u=!0,$(c.before_update),c.fragment=s?s(c.ctx):!1,t.target){if(t.hydrate){const f=ue(t.target);c.fragment&&c.fragment.l(f),f.forEach(k)}else c.fragment&&c.fragment.c();t.intro&&N(e.$$.fragment),B(e,t.target,t.anchor),se()}I(l)}class z{constructor(){C(this,"$$");C(this,"$$set")}$destroy(){M(this,1),this.$destroy=g}$on(t,n){if(!te(n))return g;const s=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return s.push(n),()=>{const o=s.indexOf(n);o!==-1&&s.splice(o,1)}}$set(t){this.$$set&&!oe(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ge="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ge);function we(e){let t;return{c(){t=d("div"),t.innerHTML='<div class="buttons-absolute svelte-1ve164l"><div class="button red svelte-1ve164l"></div> <div class="button yellow svelte-1ve164l"></div> <div class="button green svelte-1ve164l"></div></div> <div class="github-link" style="color: #898989;"><a href="https://github.com/jimothych" target="_blank" style="text-decoration: none;"><i class="fa-brands fa-github" style="color: #898989;"></i> github.com/jimothych</a></div>',w(t,"class","header svelte-1ve164l")},m(n,s){x(n,t,s)},p:g,i:g,o:g,d(n){n&&k(t)}}}class ye extends z{constructor(t){super(),J(this,t,null,we,F,{})}}const be=[{name:"horace1-14",content:`<span style="white-space: pre-wrap">
  my translation of Horace's <em>Carmina</em> (Odes) 1.14

  <em>O thankless ship, the morning tide takes you back to sea.
  O where do you go? Come home to port.
  See not how your sides 
  are stripped bare of oars,

  how the swift Southerly wind splits open your mast;
  how your sailyard groans by the keel,
  and without lash or rigging dares not harden
  ‘gainst the ruling waters?

  Your canvased sails hang rent and low;
  no gods, for want of voice, press its malady.
  And though you are daughter of Pontic trees,
  of noble woodland air,

  boasting name and lineage – madly blind –
  lo! can painted timbers quell a seaman's fear?
  Beware the wind that
  makes you its mock and jeer!

  Your stature late made sick this heart of mine,
  and still I love you thoroughly:
  O shun the sea, which thickly pours 
  its shining entrails through the Cyclades.
  </em>
</span>`},{name:"horace1-22",content:`<span style="white-space: pre-wrap">
  my translation of Horace's <em>Carmina</em> (Odes) 1.22

  <em>Dear my Fuscus,

  He who has lived a full life 
  has no need for Maurian spear, nor bow, 
  nor quiver of poisoned arrows,

  whether he cross through
  sweltering Syrtes or the bitter Caucuses
  or even those forlorn places where 
  the Hydaspes sweeps.

  For a wolf, while I was singing of my Lalage
  and wandering aimlessly beyond my cares,
  fled from me, 
  though I was unarmed.

  It was a horrid monster, that which even
  fierce Daunia in her broad oaks
  could not nurture,
  nor arid Juba, land of lions.

  Put me in a faded field
  where no tree is felt by summer breeze,
  in a broad world of evil and fog
  where Jupiter looms;

  put me under the chariot of the sun
  in a land without houses:
  still will I love my Lalage,
  sweetly laughing, sweetly talking.
  </em>
</span>`},{name:"catullus70",content:`<span style="white-space: pre-wrap">
  my translation of Catullus 70

  <em>My woman says she would not choose Jove over me,
  not even if he himself would fly to her.
  Thus she says; but what a woman says to her arduous lover
  ought to be written in the wind and the flowing water.
  </em>
</span>`},{name:"personal1",content:`<span style="white-space: pre-wrap">
  written 9/2/23

  <em>At the height of my delusion
  I discovered a stain the color of burnt umber
  nested clever on the shoulder-crease
  of my two-buttoned shirt.
  I saw it clearly then, and knew it to be yours.
  So the white light came out to inspect
  and found nothing where it stained my brain.
  Off with the light then,
  for I fed the stain anew with my eyes,
  and sprayed it and rubbed it and
  let it bathe in baths of salt for weeks and change.
  
  Ordeal's end: out came the shirt, stains 'n all;
  I knew nothing but nonsense
  for eight days after the fact.
  </em>
</span>`},{name:"personal2",content:`<span style="white-space: pre-wrap">
  written 9/2/23

  <em>Here the waters gather in small pools
  along the dip and dale of concrete pavement.
  Here the leaves fall onto each other
  in their premeditated spots, making happy the passing day -
  O, the clouds have fled at last!
  And the grey of the earth will turn flush with flaxen sunlight,
  the porcelain berries to glisten a brilliant blue,
  and from my spot at the top of the cobbled stairs
  I will listen to the sweating trees,
  I will watch the hills dry by their sides.
  Now a hanging fir will make me duck as I ramble,
  the squirrels will go a-waltzing at my feet,
  and I will hear the percolating steam,
  the eastern winds that rush the hemlocks,
  the scarlet oaks that dance in threes and fours
  to the sound of sifting hair.
  You sang in the wind once,
  and now it sings you back to me,
  a butterfly amid the wheat-ears, the poppy and the sea.
  </em>
</span>`},{name:"personal3",content:`<span style="white-space: pre-wrap">
  written 9/15/23

  <em>Newly woken from quiet sleep
  he finds himself alone on the shore.
  Here he stands awhile.
  The stars tread slowly abreast;
  twice the cockerels sing.
  The waves tug and ease...

  He has looked for so long at ebbing sea
  he feels himself piddling,
  waning out and in as the salt waves toy
  at the sand beneath his feet.
  Not much longer can he stand here:
  before dawn he'll fall into the current,
  dashed headlong onto the pumice stones.
  </em>
</span>`}];function h(e){return new Promise(t=>setTimeout(t,e))}function ve(e){return e=e.trim(),e?e==="help"?`<p style="white-space:pre-wrap">
pseudo-shell (psh), version 0.1.6

hi visitor! if you'd like to read some of my poems you can &#96;ls&#96; to find my poems stored in this directory.
use &#96;cat [FILENAME]&#96; to read the poems, e.g. &#96;cat personal2.txt&#96;. 
below are a few other commands you can run to learn more about me!

usage:
${y("whoami","who i am and what i do")}
${y("projects","what i've been up to")}
${y("socials","my socials")}
${y("ls","list directory contents")}
${y("cat [FILENAME]","print file contents to output, e.g. &#96;cat horace1-14.txt&#96;")}
${y("clear","clear terminal")}
${y("sudo reboot","makes the earth spin a bit faster")}

</p>`:e==="whoami"?`<br>
            &emsp;Hi! I'm James, a Computer Engineer, aspiring Latinist, and poet studying at Boston University.
            <br><br>
            &emsp;I am a pragmatic engineer who values honesty in communication and simplicity in solutions.
            <br> 
            &emsp;At the moment my primary interest lies in embedded systems programming. 
            <br>
            &emsp;Please feel free to contact me anytime at jameschang2005@icloud.com
            <br>&emsp;`:e==="projects"?`<br>
            &emsp;<a href="https://github.com/SaveTubaTeam/saveTuba" target="_blank"><strong>Save Tuba</strong></a>
            <br>
            <span>&emsp;&emsp;a gamified educational platform for environmental sustainability education in Kazakhstan</span>
            <br><br>
            &emsp;<a><strong>Boston University Mars Rover</strong></a>
            <br>
            <span>&emsp;&emsp;building embedded software for robotic arm and 6-wheel drive train</span>
            <br><br>
            &emsp;<a><strong>Compiler</strong></a>
            <br>
            <span>&emsp;&emsp;building a compiler for the Jack programming language following Nand2Tetris</span>
            <br>&emsp;
            `:e==="socials"?`
            &emsp;<a href="https://github.com/jimothych" target="_blank"><strong>GitHub</strong></a>
            <br>
            &emsp;<a href="https://www.linkedin.com/in/james-chang-881115202/" target="_blank"><strong>LinkedIn</strong></a>
            `:e==="ls"?"horace1-14.txt&emsp;horace1-22.txt&emsp;catullus70.txt&emsp;personal1.txt&emsp;personal2.txt&emsp;personal3.txt":e.includes("cat")?_e(e):e==="clear"?"clear":e==="sudo reboot"?"reboot":`psh: command not found: ${e}`:null}function y(e,t){return`${`  ${e.padEnd(20)}`} ${t}`}function _e(e){const t=e.trim().split(" ");if(t.length>2)return`psh: command not found: ${e}`;if(t[0]!="cat")return`psh: command not found: ${e}`;for(const n of be)if(t[1].includes(n.name))return n.content}function G(e,t,n){const s=e.slice();return s[11]=t[n],s}function Q(e){let t,n=e[11].message+"";return{c(){t=d("p")},m(s,o){x(s,t,o),t.innerHTML=n},p(s,o){o&1&&n!==(n=s[11].message+"")&&(t.innerHTML=n)},d(s){s&&k(t)}}}function X(e){let t,n,s,o,r,i,a,l,c;return{c(){t=d("form"),n=d("p"),s=d("span"),s.textContent="user",o=H(`@weewaa-land-352
      `),r=d("span"),r.textContent="~/jameschang ",i=H(`›
      `),a=d("input"),S(s,"color","#F28B50"),S(r,"color","#898989"),w(a,"spellcheck","false"),w(a,"type","text"),S(a,"display","inline"),w(a,"id","mainInput"),w(t,"autocomplete","off"),w(t,"name","mainForm")},m(u,f){x(u,t,f),p(t,n),p(n,s),p(n,o),p(n,r),p(n,i),p(n,a),D(a,e[1]),l||(c=[A(a,"input",e[4]),A(t,"submit",le(e[3]))],l=!0)},p(u,f){f&2&&a.value!==u[1]&&D(a,u[1])},d(u){u&&k(t),l=!1,$(c)}}}function $e(e){let t,n,s,o,r=R(e[0]),i=[];for(let l=0;l<r.length;l+=1)i[l]=Q(G(e,r,l));let a=e[2]&&X(e);return{c(){t=d("div");for(let l=0;l<i.length;l+=1)i[l].c();n=ne(),a&&a.c(),w(t,"class","terminal-interface svelte-g5mbzd")},m(l,c){x(l,t,c);for(let u=0;u<i.length;u+=1)i[u]&&i[u].m(t,null);p(t,n),a&&a.m(t,null),s||(o=[A(t,"click",Z),A(t,"mouseover",Z)],s=!0)},p(l,[c]){if(c&1){r=R(l[0]);let u;for(u=0;u<r.length;u+=1){const f=G(l,r,u);i[u]?i[u].p(f,c):(i[u]=Q(f),i[u].c(),i[u].m(t,n))}for(;u<i.length;u+=1)i[u].d(1);i.length=r.length}l[2]?a?a.p(l,c):(a=X(l),a.c(),a.m(t,null)):a&&(a.d(1),a=null)},i:g,o:g,d(l){l&&k(t),ie(i,l),a&&a.d(),s=!1,$(o)}}}function Z(e){try{e.currentTarget.querySelector("input").focus()}catch{}}function ke(e,t,n){let s=[];function o(m){n(0,s=[...s,m])}let r="",i=null,a=!1;async function l(){await h(100),o({message:"<em>salvete amici!</em>"}),await h(1e3),o({message:"Booting environment..."}),await h(1300),n(2,a=!0),c()}async function c(){await h(0),document.getElementById("mainInput").focus(),await h(150),n(1,r="h"),await h(121),n(1,r="he"),await h(154),n(1,r="hel"),await h(101),n(1,r="help"),await h(174),await u()}async function u(){console.log(r),i=r,n(1,r=""),n(2,a=!1);const m=ve(i);if(o({message:`<span style="color: #F28B50">user</span>@weewaa-land-352
            <span style="color: #898989"> ~/jameschang <span>
            <span style="color: #d3b0c3">› ${i}</span>`}),m){if(m==="reboot"&&window.location.reload(),m==="clear"){E();return}o({message:m})}await f()}async function f(){await h(0),n(2,a=!0),await h(0),document.getElementById("mainInput").focus()}async function E(){n(0,s=[]),n(0,s),await f()}l();function O(){r=this.value,n(1,r)}return[s,r,a,u,O]}class Ie extends z{constructor(t){super(),J(this,t,ke,$e,F,{})}}function xe(e){let t,n,s,o,r,i;return s=new ye({}),r=new Ie({}),{c(){t=d("main"),n=d("div"),W(s.$$.fragment),o=ne(),W(r.$$.fragment),w(n,"class","main-container svelte-kseypu")},m(a,l){x(a,t,l),p(t,n),B(s,n,null),p(n,o),B(r,n,null),i=!0},p:g,i(a){i||(N(s.$$.fragment,a),N(r.$$.fragment,a),i=!0)},o(a){K(s.$$.fragment,a),K(r.$$.fragment,a),i=!1},d(a){a&&k(t),M(s),M(r)}}}class Ee extends z{constructor(t){super(),J(this,t,null,xe,F,{})}}new Ee({target:document.getElementById("app")});
