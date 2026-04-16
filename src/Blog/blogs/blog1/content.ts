import demystified_terminal_labeled from "../../../assets/demystified_terminal_labeled.webp"

export const CONTENT = `
<p>
The following is a behind-the-scenes look at how this website works.
</p>

<h3>Some DOM Trickery in the Terminal</h3>

<p>
The position of the terminal's cursor is determined by an auto-focused input box. When you press submit, the input box is unmounted and the contents in the box are echoed to a master log. This master log is just an array of <span class="markdown">&lt;p&gt;</span> tags rendered as a column.
</p>

<p>
After the new entry is added, the input box is cleared and remounted at its position below the master log.
</p>

<div class="img-container">
  <img class="img" src="${demystified_terminal_labeled}" loading="lazy" style="height: 400px;">
</div>

<p>
The illusion is broken somewhat if you enter too many characters into the input box. The entire element will move down a line instead of wrapping.
</p>

<p>
Staying in the terminal for a second, you might've also noticed the <i>"booting environment"</i> message when you first opened the website. I must confess: the terminal doesn't actually do any work while it's "booting" on initial mount. It's a fake boot simulated by a one-second sleep 😅. 
</p>

<p>
After this sleep, the <span class="markdown">help</span> command is auto-typed via a Svelte binding to an <span class="markdown">&lt;input&gt;</span> tag:
</p>

<p class="markdown multi-line"><span class="comment">//  the terminalInputStore.value variable is reactively 
//  bound to the input box in Terminal.svelte:</span>
&lt;input
        bind:value={terminalInputStore.value}
&gt;

<span class="comment">//  elsewhere, the following function is called on mount</span>
async function bootTerminal(): Promise&lt;void&gt; {
        log.add("<em>salvē amīce!</em>");
        await sleep(700);
        log.add("booting environment...");
        await sleep(1000);  <span class="comment">//  the aforementioned one-second sleep</span>

        <span class="comment">//  this function directly modifies terminalInputStore.value</span>
        await terminalInputStore.simulateTyping('help');
}
</p>

<h3>Idiomatic State Management</h3>
<p>
The Svelte documentation has a small section on
<a href="https://svelte.dev/docs/svelte/$state#Classes" target="_blank">
idiomatic usage of the <span class="markdown">$state</span> rune</a>. 
Here's how I've implemented the terminal's master log following this pattern:
</p>

<p class="markdown multi-line">class Log {
        entries = $state&lt;string[]&gt;([]);

        add(message: string): void { 
                this.entries = [...this.entries, message];
        }

        clear(): void { this.entries = []; }
}

let log = new Log();
export { log }  <span class="comment">//  for use elsewhere</span>
</p>

<p>
In keeping with the above, all reactive elements on this website have logical wirings handled by a singleton JavaScript class. This includes URL navigation, tab navigation, and window management. 
</p>

<p>
Before you say anything -- I know there are many who will gag at the mere mention of singletons and global state -- the pattern works miracles here; give it a try and compare it to those popular React libraries like Redux and React Router, or even some entirely other UI paradigm like MVC. You will see how much less overhead there is.
</p>

<h3>HTML Magic</h3>
<p>
The rest of this site's magic is thanks to Svelte's <span class="markdown">@html</span> template tag. I'm currently writing this blog as stringified HTML!
</p>

<p class="markdown multi-line"><span class="comment">//  breaking the fourth wall for a second</span>
&lt;h3&gt;HTML Magic&lt;/h3&gt;
&lt;p&gt;
The rest of this site's magic is thanks to Svelte's 
&lt;span class="markdown"&gt;@html&lt;/span&gt; template tag. 
I'm currently writing this blog as stringified HTML!
&lt;/p&gt;
</p>

<p>
And that's about all the interesting stuff. Source code is <a href="https://github.com/jimothych/jimothych.github.io" target="_blank">linked here</a> if you want to see more.
</p>

<h3>On the Niceties of Svelte and Why I'm Never Going Back to React</h3>
<p>
One of the main selling points of React over other frontend frameworks is its vast ecosystem of open-source libraries. Have we ever even stopped to ask <i>why</i> React has so many libraries??
</p>

<p>
In my opinion, the fact of the matter is simply that making things with React is really really freaking hard, and as such it takes massive amounts of collective effort to curb these difficulties. So we end up with lots of little libraries for things like animations and dropdowns and modals and popups and draggables etc. etc. etc.
</p>

<p>
A common workflow when developing with React is the following:
</p>
<p class="markdown multi-line">-->  come up with an idea
-->  realize the idea is too costly to implement from scratch
-->  search online for a library that hopefully does something similar
-->  npm install and tweak imported component to conform to original idea 
-->  maintainer stops maintaining library 
-->  search for new library
</p>
<p>
And the cycle continues.
</p>

<p>
With Svelte on the other hand, the provided tools are already flexible and powerful such that it's fairly straightforward to implement most any idea from scratch. I cannot emphasize the creative relief that comes with shifting from a mindset of limitations and the burden of a thousand transient npm dependencies to 
<i>wow I can really do this myself</i>
<sup>
  <a 
    href="#fn1" 
    id="ref1" 
    onclick="event.preventDefault(); document.getElementById('fn1').scrollIntoView();"
  >
    1
  </a>
</sup>
.
</p>

<h3>Epilogue</h3>
<p>
I'm so glad that in 2023 I stumbled upon Rich Harris' now famous <a href="https://www.youtube.com/watch?v=AdNJ3fydeao" target="_blank">rethinking reactivity</a> talk. This was the talk that introduced me to Svelte.
</p>

<p>
Having used Svelte for a short while now, I feel that it has fundamentally shifted the way I think about making things. At the core of Svelte's philosophy is the idea that your tools should be tools without limitations; in this manner I've found my newfound tools to have enabled me to do whatever I want.
</p>

<br>
<br>
<br>
<br>
<div class="break"></div>

<p class="footnote">
<a 
  href="#ref1" 
  id="fn1" 
  onclick="event.preventDefault(); document.getElementById('ref1').scrollIntoView();"
>
  1.
</a>
  This website has but two runtime dependencies: <b>interactjs</b> to make windows draggable and resizable and <b>@lottiefiles/dotlottie-web</b> to run that nice victionarium loading animation.
</p>
`;