var re=Object.defineProperty;var ae=(e,t,n)=>t in e?re(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var A=(e,t,n)=>ae(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();function p(){}function ee(e){return e()}function V(){return Object.create(null)}function _(e){e.forEach(ee)}function te(e){return typeof e=="function"}function M(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function oe(e){return Object.keys(e).length===0}function m(e,t){e.appendChild(t)}function I(e,t,n){e.insertBefore(t,n||null)}function $(e){e.parentNode&&e.parentNode.removeChild(e)}function ie(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function d(e){return document.createElement(e)}function T(e){return document.createTextNode(e)}function ne(){return T(" ")}function L(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function le(e){return function(t){return t.preventDefault(),e.call(this,t)}}function w(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function ue(e){return Array.from(e.childNodes)}function D(e,t){e.value=t??""}function C(e,t,n,s){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,"")}let F;function x(e){F=e}const b=[],U=[];let v=[];const Y=[],ce=Promise.resolve();let P=!1;function fe(){P||(P=!0,ce.then(se))}function j(e){v.push(e)}const S=new Set;let y=0;function se(){if(y!==0)return;const e=F;do{try{for(;y<b.length;){const t=b[y];y++,x(t),de(t.$$)}}catch(t){throw b.length=0,y=0,t}for(x(null),b.length=0,y=0;U.length;)U.pop()();for(let t=0;t<v.length;t+=1){const n=v[t];S.has(n)||(S.add(n),n())}v.length=0}while(b.length);for(;Y.length;)Y.pop()();P=!1,S.clear(),x(e)}function de(e){if(e.fragment!==null){e.update(),_(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(j)}}function he(e){const t=[],n=[];v.forEach(s=>e.indexOf(s)===-1?t.push(s):n.push(s)),n.forEach(s=>s()),v=t}const O=new Set;let me;function H(e,t){e&&e.i&&(O.delete(e),e.i(t))}function K(e,t,n,s){if(e&&e.o){if(O.has(e))return;O.add(e),me.c.push(()=>{O.delete(e)}),e.o(t)}}function R(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function W(e){e&&e.c()}function N(e,t,n){const{fragment:s,after_update:a}=e.$$;s&&s.m(t,n),j(()=>{const o=e.$$.on_mount.map(ee).filter(te);e.$$.on_destroy?e.$$.on_destroy.push(...o):_(o),e.$$.on_mount=[]}),a.forEach(j)}function B(e,t){const n=e.$$;n.fragment!==null&&(he(n.after_update),_(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function pe(e,t){e.$$.dirty[0]===-1&&(b.push(e),fe(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function q(e,t,n,s,a,o,l=null,r=[-1]){const i=F;x(e);const c=e.$$={fragment:null,ctx:[],props:o,update:p,not_equal:a,bound:V(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(i?i.$$.context:[])),callbacks:V(),dirty:r,skip_bound:!1,root:t.target||i.$$.root};l&&l(c.root);let u=!1;if(c.ctx=n?n(e,t.props||{},(f,E,...h)=>{const z=h.length?h[0]:E;return c.ctx&&a(c.ctx[f],c.ctx[f]=z)&&(!c.skip_bound&&c.bound[f]&&c.bound[f](z),u&&pe(e,f)),E}):[],c.update(),u=!0,_(c.before_update),c.fragment=s?s(c.ctx):!1,t.target){if(t.hydrate){const f=ue(t.target);c.fragment&&c.fragment.l(f),f.forEach($)}else c.fragment&&c.fragment.c();t.intro&&H(e.$$.fragment),N(e,t.target,t.anchor),se()}x(i)}class J{constructor(){A(this,"$$");A(this,"$$set")}$destroy(){B(this,1),this.$destroy=p}$on(t,n){if(!te(n))return p;const s=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return s.push(n),()=>{const a=s.indexOf(n);a!==-1&&s.splice(a,1)}}$set(t){this.$$set&&!oe(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ge="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ge);function we(e){let t;return{c(){t=d("div"),t.innerHTML='<div class="buttons-absolute svelte-1ve164l"><div class="button red svelte-1ve164l"></div> <div class="button yellow svelte-1ve164l"></div> <div class="button green svelte-1ve164l"></div></div> <div class="github-link" style="color: #898989;"><a href="https://github.com/jimothych" target="_blank" style="text-decoration: none;"><i class="fa-brands fa-github" style="color: #898989;"></i> github.com/jimothych</a></div>',w(t,"class","header svelte-1ve164l")},m(n,s){I(n,t,s)},p,i:p,o:p,d(n){n&&$(t)}}}class ye extends J{constructor(t){super(),q(this,t,null,we,M,{})}}const be=[{name:"horace1-14",content:`<span style="white-space: pre-wrap">
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
  or even those places where 
  the forlorn Hydaspes sweeps.

  For a wolf, while I sang of my Lalage
  and wandered aimlessly beyond my cares,
  fled from me, 
  though I was unarmed.

  It was a horrid monster, which even
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
  not even if he flew to her.
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
</span>`}];function k(e){return new Promise(t=>setTimeout(t,e))}function ve(e){return e?e==="help"?`<p style="white-space:pre-wrap">
pseudo-shell (psh), version 0.1.3

hi visitor! if you'd like to read some of my poems you can &#96;ls&#96; to find my poems in this directory.
use &#96;cat [FILENAME]&#96; to read the poems, e.g. &#96;cat personal2.txt&#96;.
below are a few other commands you can run.

usage:
${g("whoami","who i am and what i do")}
${g("projects","what i've been up to")}
${g("socials","my socials")}
${g("ls","list directory contents")}
${g("cat [FILENAME]","print file contents to output, e.g. &#96;cat horace1-14.txt&#96;")}
${g("clear","clear terminal")}
${g("sudo reboot","makes the earth spin a bit faster")}

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
            `:e==="ls"?"horace1-14.txt&emsp;horace1-22.txt&emsp;catullus70.txt&emsp;personal1.txt&emsp;personal2.txt&emsp;personal3.txt":e.includes("cat")?_e(e):e==="clear"?"clear":e==="sudo reboot"?"reboot":`psh: command not found: ${e}`:null}function g(e,t){return`${`  ${e.padEnd(20)}`} ${t}`}function _e(e){const t=e.trim().split(" ");if(t.length>2)return`psh: command not found: ${e}`;if(t[0]!="cat")return`psh: command not found: ${e}`;for(const n of be)if(t[1].includes(n.name))return n.content}function G(e,t,n){const s=e.slice();return s[10]=t[n],s}function Q(e){let t,n=e[10].message+"";return{c(){t=d("p")},m(s,a){I(s,t,a),t.innerHTML=n},p(s,a){a&1&&n!==(n=s[10].message+"")&&(t.innerHTML=n)},d(s){s&&$(t)}}}function X(e){let t,n,s,a,o,l,r,i,c;return{c(){t=d("form"),n=d("p"),s=d("span"),s.textContent="user",a=T(`@weewaa-land-352
      `),o=d("span"),o.textContent="~/jameschang ",l=T(`›
      `),r=d("input"),C(s,"color","#F28B50"),C(o,"color","#898989"),w(r,"spellcheck","false"),w(r,"type","text"),C(r,"display","inline"),w(r,"id","mainInput"),w(t,"autocomplete","off")},m(u,f){I(u,t,f),m(t,n),m(n,s),m(n,a),m(n,o),m(n,l),m(n,r),D(r,e[2]),i||(c=[L(r,"input",e[4]),L(t,"submit",le(e[3]))],i=!0)},p(u,f){f&4&&r.value!==u[2]&&D(r,u[2])},d(u){u&&$(t),i=!1,_(c)}}}function $e(e){let t,n,s,a,o=R(e[0]),l=[];for(let i=0;i<o.length;i+=1)l[i]=Q(G(e,o,i));let r=e[1]&&X(e);return{c(){t=d("div");for(let i=0;i<l.length;i+=1)l[i].c();n=ne(),r&&r.c(),w(t,"class","terminal-interface svelte-g5mbzd")},m(i,c){I(i,t,c);for(let u=0;u<l.length;u+=1)l[u]&&l[u].m(t,null);m(t,n),r&&r.m(t,null),s||(a=[L(t,"click",Z),L(t,"mouseover",Z)],s=!0)},p(i,[c]){if(c&1){o=R(i[0]);let u;for(u=0;u<o.length;u+=1){const f=G(i,o,u);l[u]?l[u].p(f,c):(l[u]=Q(f),l[u].c(),l[u].m(t,n))}for(;u<l.length;u+=1)l[u].d(1);l.length=o.length}i[1]?r?r.p(i,c):(r=X(i),r.c(),r.m(t,null)):r&&(r.d(1),r=null)},i:p,o:p,d(i){i&&$(t),ie(l,i),r&&r.d(),s=!1,_(a)}}}function Z(e){try{e.currentTarget.querySelector("input").focus()}catch{}}function ke(e,t,n){let s=[];function a(h){n(0,s=[...s,h])}let o=!1;async function l(){await k(100),a({message:"<em>salvete amici!</em>"}),await k(1e3),a({message:"Booting environment..."}),await k(1300),n(1,o=!0)}let r="",i=null;async function c(){console.log(r),i=r,n(2,r=""),n(1,o=!1);const h=ve(i);if(a({message:`<span style="color: #F28B50">user</span>@weewaa-land-352
            <span style="color: #898989"> ~/jameschang <span>
            <span style="color: #d3b0c3">› ${i}</span>`}),h){if(h==="reboot"&&window.location.reload(),h==="clear"){f();return}a({message:h})}await u()}async function u(){await k(100),n(1,o=!0),await k(0),document.getElementById("mainInput").focus()}async function f(){n(0,s=[]),n(0,s),await u()}l();function E(){r=this.value,n(2,r)}return[s,o,r,c,E]}class xe extends J{constructor(t){super(),q(this,t,ke,$e,M,{})}}function Ie(e){let t,n,s,a,o,l;return s=new ye({}),o=new xe({}),{c(){t=d("main"),n=d("div"),W(s.$$.fragment),a=ne(),W(o.$$.fragment),w(n,"class","main-container svelte-kseypu")},m(r,i){I(r,t,i),m(t,n),N(s,n,null),m(n,a),N(o,n,null),l=!0},p,i(r){l||(H(s.$$.fragment,r),H(o.$$.fragment,r),l=!0)},o(r){K(s.$$.fragment,r),K(o.$$.fragment,r),l=!1},d(r){r&&$(t),B(s),B(o)}}}class Ee extends J{constructor(t){super(),q(this,t,null,Ie,M,{})}}new Ee({target:document.getElementById("app")});
