import demystified_terminal_labeled from "../../../assets/demystified_terminal_labeled.webp"

export const CONTENT = `
<h2>Some DOM Trickery in the Terminal</h2>
<p>
The following is a behind-the-scenes look at how this website's terminal simulator works:
</p><br>

<p>
The position of the terminal's cursor is determined by an auto-focused input box without coloring. When you press submit, the input box is unmounted and the contents in the box are copied verbatim back to a master log. This master log is just an array of <span class="markdown">&lt;p&gt;</span> tags rendered as a column.
</p><br>

<p>
After the new entry is added the input box is cleared and remounted at its position below the master log.
</p>

<div class="img-container">
  <img class="img" src="${demystified_terminal_labeled}" loading="lazy" style="height: 400px;">
</div>

<p>
This illusion is broken somewhat if you enter too many characters into the input box. The entire element will move down a line instead of wrapping.
</p><br>

<p>
Staying in the terminal for a second, you might've also noticed the <i>"booting environment"</i> message when you first opened this website. I must confess: the terminal doesn't actually do any work while it's "booting" on initial mount. It's a fake boot simulated by a one-second sleep 😅. 
</p><br>

<p>
After this sleep, the <span class="markdown">help</span> command is auto-typed via a Svelte binding to an <span class="markdown">&lt;input&gt;</span> tag:
</p><br>

<p class="markdown multi-line"><span style="color: var(--light-grey)">// terminalInputStore.value is bound to the input box in Terminal.svelte:</span>
&lt;input
    bind:value={terminalInputStore.value}
&gt;

<span style="color: var(--light-grey)">// elsewhere, the following function is called on mount</span>
async function bootTerminal(): Promise&lt;void&gt; {
    log.add("<em>salvē amīce!</em>");
    await sleep(700);
    log.add("booting environment...");
    await sleep(1000);  <span style="color: var(--light-grey)">// the aforementioned one-second sleep</span>

    <span style="color: var(--light-grey)">// this function directly modifies terminalInputStore.value</span>
    await terminalInputStore.simulateTyping('help');
}
</p>

<h2>HTML Magic</h2>
<p>
Much of the rest of the magic of this site is thanks to Svelte's <span class="markdown">@html</span> template tag. I'm currently writing this blog as stringified HTML!
</p>

<p class="markdown multi-line"><span style="color: var(--light-grey);">// breaking the fourth wall for a second</span>
export const CONTENT = &#96;

&lt;h2&gt;HTML Magic&lt;/h2&gt;
&lt;p&gt;
Much of the rest of the magic of this site is thanks to Svelte's 
&lt;span class="markdown"&gt;@html&lt;/span&gt; template tag. 
I'm currently writing this blog as stringified HTML!
&lt;/p&gt;

&#96;;

<span style="color: var(--light-grey);">// elsewhere in Blog.svelte, I pass CONTENT into @html</span>
</p>

<p>
And that's about all the interesting stuff. Source code is <a href="https://github.com/jimothych/jimothych.github.io" target="_blank">linked here</a> if you want to see more.
</p><br>

<h2>On the Niceties of Svelte and Why I'm Never Going Back to React</h2>
<p>
One of the main selling points of React over other frontend frameworks is its vast ecosystem of open-source libraries. Have we ever stopped to ask <i>why</i> React has so many libraries??
</p><br>

<p>
In my opinion, the fact of the matter is simply that making things with React is really really freaking hard, and as such it takes massive amounts of collective effort to curb these difficulties. So we end up with lots of little libraries for things like animations and dropdowns and modals and popups and draggables etc. etc. etc.
</p><br>

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
</p><br>

<p>
With Svelte on the other hand, the provided tools are already flexible and powerful such that it's fairly straightforward to implement most any idea from scratch. I cannot emphasize the creative relief that comes with shifting from a mindset of limitations and the burden of a thousand transient npm dependencies to <i>wow I can really do this myself</i>.
</p>

<h2>Epilogue</h2>
<p>
I'm so glad that in 2023 I stumbled upon Rich Harris' now famous <a href="https://www.youtube.com/watch?v=AdNJ3fydeao" target="_blank">rethinking reactivity</a> talk. This was the talk that introduced me to Svelte.
</p><br>

<p>
Having used Svelte for quite a while now, I feel that it has fundamentally shifted the way I think about making things. At the core of Svelte's philosophy is the idea that your tools should be tools without limitations; in this manner I've found my newfound tools to have enabled me to do whatever I want.
</p>
`;