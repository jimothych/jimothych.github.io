///--------------------------------------------------------------------------------
/// WIKTIONARY HTML PARSING & FORMATTING TO JSON
///--------------------------------------------------------------------------------

// INPUT: raw HTML string from /api/rest_v1/page/html/{title}
// The REST API wraps each language block in a flat <section data-mw-section-id="N">
// directly inside <body>. Each language section contains an <h2 id="Language"> and
// nested <section> elements for each subsection (Etymology, Pronunciation, Noun, etc.).
//
// Abbreviated example for "amor" Latin section (data-mw-section-id="48"):
//   <section data-mw-section-id="48">
//     <h2 id="Latin">Latin</h2>
//     <section data-mw-section-id="49">
//       <h3 id="Pronunciation_6">Pronunciation</h3>
//       <ul>...</ul>
//     </section>
//     <section data-mw-section-id="50">
//       <h3 id="Etymology_1">Etymology 1</h3>
//       <p>amō + -or ...</p>
//       <section data-mw-section-id="51">
//         <h4 id="Alternative_forms">Alternative forms</h4>
//         <ul>...</ul>
//       </section>
//       <section data-mw-section-id="52">
//         <h4 id="Noun_10">Noun</h4>
//         <p><strong class="Latn headword">amor</strong> m (genitive amōris) ...</p>
//         <ol><li>love, affection...</li></ol>
//         <section data-mw-section-id="53">
//           <h5 id="Declension_2">Declension</h5>
//           <div class="inflection-table-wrapper">
//             <table class="inflection-table inflection-table-la">...</table>
//           </div>
//         </section>
//         <section data-mw-section-id="54">
//           <h5 id="Descendants">Descendants</h5>
//           <div class="columns-bg">...</div>
//         </section>
//       </section>
//     </section>
//   </section>
//
// Links use href="./word#Language" format, e.g.:
//   <a rel="mw:WikiLink" href="./amor#Latin">amōrem</a>
//   <a rel="mw:WikiLink" href="./amor#English" class="mw-selflink-fragment">amor</a>
//   <a rel="mw:WikiLink" href="./Appendix:Glossary#inherited">Inherited</a>

function extractLatinSection(html: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // doc.body contains flat <section> children, one per language
  // e.g. <section data-mw-section-id="1"> for English,
  //      <section data-mw-section-id="48"> for Latin, etc.
  const latinHeading = doc.querySelector('h2#Latin');
  if(!latinHeading) { throw new Error("no latin heading found :("); }

  // latinSection: the <section data-mw-section-id="N"> wrapping the Latin block
  // e.g. <section data-mw-section-id="48">
  const latinSection = latinHeading.closest('section');
  if(!latinSection) { throw new Error("no latin section found :("); }

  // remove pronunciation sections but preserve their children
  // Pronunciation sections look like:
  //   <section data-mw-section-id="49">
  //     <h3 id="Pronunciation_6">Pronunciation</h3>
  //     <ul><li>IPA: [ˈa.mɔr]</li>...</ul>
  //   </section>
  latinSection.querySelectorAll('section').forEach((section: Element) => {
    const heading = section.querySelector('h3, h4');
    if(!heading || !heading.textContent?.trim().startsWith('Pronunciation')) return;

    const parent = section.parentElement;
    if(!parent) return;

    section.querySelectorAll(':scope > section').forEach((child: Element) => {
      parent.insertBefore(child, section);
    });

    section.remove();
  });

  // remove links that point to English definitions
  // REST API hrefs use the format "./word#Language", e.g.:
  //   href="./amor#English"  → link to the English section of another entry (remove)
  //   href="./amor#Latin"    → link to another entry's Latin section (keep)
  //   href="./Appendix:..."  → appendix reference (keep)
  //   href="./Wiktionary:..."→ meta page (keep)
  // The selector 'a[href$="#English"]' catches "./word#English"
  // The selector 'a[href^="./"]' catches all relative entry links
  latinSection.querySelectorAll('a[href$="#English"], a[href^="./"]').forEach((a: Element) => {
    const href = a.getAttribute('href') ?? '';
    if(
      href.includes('#') && 
      !href.endsWith('#English') && 
      !href.startsWith('./Appendix:') &&
      !href.startsWith('./Wiktionary')
    ) { return; }
    a.replaceWith(document.createTextNode(a.textContent ?? ''));
  });

  // REMOVE RANGE-BASED SUBSECTIONS
  // Descendants and Borrowings sections are sometimes not wrapped in their own <section>
  // but appear as a heading followed by sibling elements. Walk forward from the heading
  // and remove until hitting a heading of equal or higher level.
  //
  // Example of what gets removed (from amor Latin section):
  //   <h5 id="Descendants">Descendants</h5>
  //   <div class="columns-bg ul-column-count">
  //     <ul><li>Italo-Dalmatian: ...</li>...</ul>
  //   </div>
  const headings = Array.from(latinSection.querySelectorAll('h3, h4, h5'));
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const text = heading.textContent?.trim();

    if(text === 'Descendants' || text === 'Borrowings') {
      const level = parseInt(heading.tagName[1]); // h3 → 3, h4 → 4, h5 → 5
      let current: Element | null = heading;

      while(current) {
        const next: Element | null = current.nextElementSibling;
        current.remove();
        if(!next) break;

        if(/^H[1-6]$/.test(next.tagName)) {
          const nextLevel = parseInt(next.tagName[1]);
          if(nextLevel <= level) break;
        }
        current = next;
      }
    }
  }

  // strip in-page fragment suffixes from hrefs
  // REST API hrefs like "./amoris#Latin" become "./amoris"
  // so rendered links navigate to the entry page, not a specific language anchor.
  // Appendix: and http links are kept as-is.
  latinSection.querySelectorAll('a[href]').forEach((a: Element) => {
    const href = a.getAttribute('href') ?? '';
    if(href.startsWith('./Appendix:')) return;
    if(href.startsWith('http')) return;

    const i = href.indexOf('#');
    if(i !== -1) { a.setAttribute('href', href.slice(0, i)); }
  });

  // OUTPUT: HTMLElement — the Latin <section data-mw-section-id="N"> with:
  //   - Pronunciation subsections removed (their content hoisted if needed)
  //   - English-definition links replaced with plain text
  //   - Descendants/Borrowings headings and their content removed
  //   - Fragment suffixes stripped from internal hrefs
  //
  // Abbreviated shape after cleaning (amor example):
  //   <section data-mw-section-id="48">
  //     <h2 id="Latin">Latin</h2>
  //     <section data-mw-section-id="50">
  //       <h3 id="Etymology_1">Etymology 1</h3>
  //       <p>amō + -or ...</p>
  //       <section data-mw-section-id="51">
  //         <h4 id="Alternative_forms">Alternative forms</h4>
  //         <ul><li>Amor</li></ul>
  //       </section>
  //       <section data-mw-section-id="52">
  //         <h4 id="Noun_10">Noun</h4>
  //         <p><strong class="Latn headword">amor</strong> m (genitive amōris) ...</p>
  //         <ol><li>love, affection...</li></ol>
  //         <section data-mw-section-id="53">
  //           <h5 id="Declension_2">Declension</h5>
  //           <div class="inflection-table-wrapper"><table>...</table></div>
  //         </section>
  //       </section>
  //     </section>
  //     <section data-mw-section-id="55">
  //       <h3 id="Etymology_2_2">Etymology 2</h3>
  //       ...
  //     </section>
  //   </section>
  return latinSection;
}

// SidebarContent: a tree of heading entries for the sidebar nav
// title: display text, e.g. "amor", "Etymology 1", "Noun", "Declension"
// hash:  "#id" for anchor linking, e.g. "#Etymology_1", "#Noun_10", "#Declension_2"
// level: heading depth from the HTML tag number (h3=3, h4=4, h5=5)
//        the root entry is injected at level 3
// children: nested subheadings
type SidebarContent = {
  title: string;
  hash: string;
  level: number;
  children: SidebarContent[];
};

// INPUT: cleaned latinSection HTMLElement + the lemma title string (e.g. "amor")
// OUTPUT: SidebarContent[] — a nested tree rooted at the lemma title
//
// Intermediate flat array before nesting (amor example):
//   [
//     { title: "amor",          hash: "#amor",          level: 3 },
//     { title: "Pronunciation", hash: "#Pronunciation_6", level: 3 },  ← removed by cleaning
//     { title: "Etymology 1",   hash: "#Etymology_1",   level: 3 },
//     { title: "Alternative forms", hash: "#Alternative_forms", level: 4 },
//     { title: "Noun",          hash: "#Noun_10",        level: 4 },
//     { title: "Declension",    hash: "#Declension_2",   level: 5 },
//     { title: "Etymology 2",   hash: "#Etymology_2_2",  level: 3 },
//     { title: "Verb",          hash: "#Verb",           level: 4 },
//   ]
//
// After nesting:
//   [
//     { title: "amor", hash: "#amor", level: 3, children: [
//       { title: "Etymology 1", hash: "#Etymology_1", level: 3, children: [
//         { title: "Alternative forms", hash: "#Alternative_forms", level: 4, children: [] },
//         { title: "Noun", hash: "#Noun_10", level: 4, children: [
//           { title: "Declension", hash: "#Declension_2", level: 5, children: [] }
//         ]}
//       ]},
//       { title: "Etymology 2", hash: "#Etymology_2_2", level: 3, children: [
//         { title: "Verb", hash: "#Verb", level: 4, children: [] }
//       ]}
//     ]}
//   ]
function extractLatinSidebarContent(latinSection: HTMLElement, title: string): SidebarContent[] {
  const flat: SidebarContent[] = [];

  flat.push({ title: title, hash: `#${title}`, level: 3, children: [] });

  latinSection.querySelectorAll('h3, h4, h5').forEach((heading: Element) => {
    const id = heading.id;
    if(!id) return;

    const level = parseInt(heading.tagName[1]);
    flat.push({ title: heading.textContent?.trim() ?? '', hash: `#${id}`, level: level, children: [] });
  });

  // nest children under parents based on level
  const result: SidebarContent[] = [];
  const stack: SidebarContent[] = [];

  for(const entry of flat) {
    while (stack.length > 0 && stack[stack.length - 1].level >= entry.level) {
      stack.pop();
    }
    if(stack.length === 0) {
      result.push(entry);
    } else {
      stack[stack.length - 1].children.push(entry);
    }
    stack.push(entry);
  }

  return result;
}

// DictionaryEntryContent: recursive tree mirroring the <section> nesting
// title:    heading text, e.g. "Noun", "Declension" (null at root before override)
// hash:     "#id" of the heading, e.g. "#Noun_10" (null at root)
// content:  concatenated outerHTML of all non-section, non-heading direct children —
//           the actual lexical content of that section (paragraphs, lists, tables, etc.)
// children: DictionaryEntryContent[] for each nested <section>
type DictionaryEntryContent = {
  title: string | null;
  hash: string | null;
  content: string;
  children: DictionaryEntryContent[];
};

// INPUT: a single <section> Element
// OUTPUT: DictionaryEntryContent for that section
//
// Example — for the Noun section of amor:
//   <section data-mw-section-id="52">
//     <h4 id="Noun_10">Noun</h4>
//     <p><strong class="Latn headword">amor</strong> m ...</p>
//     <ol><li>love, affection...</li></ol>
//     <section data-mw-section-id="53">...</section>
//   </section>
//
// Produces:
//   {
//     title: "Noun",
//     hash: "#Noun_10",
//     content: '<p><strong class="Latn headword">amor</strong> m ...</p><ol><li>love...</li></ol>',
//     children: [
//       { title: "Declension", hash: "#Declension_2", content: '<div class="inflection-table-wrapper">...</div>', children: [] }
//     ]
//   }
function sectionToJSON(section: Element): DictionaryEntryContent {
  const heading = section.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > h5');
  const contentNodes: string[] = [];
  for(const child of Array.from(section.children)) {
    if(child.tagName.toLowerCase() === 'section') continue;
    if(child === heading) continue;
    contentNodes.push(child.outerHTML);
  }
  const childSections = section.querySelectorAll(':scope > section');
  return {
    title: heading?.textContent?.trim() ?? null,
    hash: heading?.id ? `#${heading.id}` : null,
    content: contentNodes.join(''),  // raw HTML string of non-heading, non-section direct children
    children: Array.from(childSections).map(sectionToJSON)
  };
}

// INPUT: cleaned latinSection HTMLElement + lemma title string (e.g. "amor")
// OUTPUT: DictionaryEntryContent tree for the full Latin entry
//
// sectionToJSON on the root latinSection produces title: "Latin" (from the <h2>).
// We override title to the lemma title so callers see "amor" not "Latin".
//
// Root shape (amor example):
//   {
//     title: "amor",   ← overridden from "Latin"
//     hash: null,      ← h2 has no id in REST API HTML
//     content: "",     ← root section has no direct non-heading non-section children
//     children: [
//       { title: "Etymology 1", hash: "#Etymology_1", content: "<p>amō + -or...</p>", children: [
//         { title: "Alternative forms", hash: "#Alternative_forms", content: "<ul>...</ul>", children: [] },
//         { title: "Noun", hash: "#Noun_10", content: "<p>...</p><ol>...</ol>", children: [
//           { title: "Declension", hash: "#Declension_2", content: "<div>...</div>", children: [] }
//         ]}
//       ]},
//       { title: "Etymology 2", hash: "#Etymology_2_2", content: "<p>...</p>", children: [
//         { title: "Verb", hash: "#Verb", content: "<p>...</p><ol>...</ol>", children: [] }
//       ]}
//     ]
//   }
function extractLatinDictionaryEntryContent(latinSection: HTMLElement, title: string): DictionaryEntryContent {
  const entry = sectionToJSON(latinSection);
  return { ...entry, title: title };
}


///--------------------------------------------------------------------------------
/// DICTIONARY ENTRY HTML NODE GENERATION
///--------------------------------------------------------------------------------

// RenderedNode: discriminated union of display-ready content units
// 'heading': a section heading
//   id:    the heading's element id, e.g. "Noun_10", "Declension_2"
//   text:  display text, e.g. "Noun", "Declension"
//   level: 1 = lemma title (injected), 2 = h3 subsection, 3 = h4, 4 = h5
// 'html':  an arbitrary HTML block passed through as-is (p, ul, ol, dl, figure, etc.)
// 'table': a parsed declension/conjugation table with typed rows
type RenderedNode =
  | { type: 'heading'; id: string; text: string; level: number }
  | { type: 'html'; html: string }
  | { type: 'table'; rows: RenderedTableRow[] };

// RenderedTableRow: one <tr> from a table
// cells: array of typed cell objects
//   html:     innerHTML of the <th> or <td>
//   isHeader: true if <th>, false if <td>
//   colspan:  value of colspan attribute if present, else undefined
//   rowspan:  value of rowspan attribute if present, else undefined
//
// Example row from the Latin amor declension table:
//   <tr>
//     <th>nominative</th>
//     <td>amor</td>
//     <td>amōrēs</td>
//   </tr>
// Produces:
//   { cells: [
//     { html: "nominative", isHeader: true },
//     { html: '<span class="Latn form-of ...">amor</span>', isHeader: false },
//     { html: '<span class="Latn form-of ...">amōrēs</span>', isHeader: false }
//   ]}
type RenderedTableRow = {
  cells: { html: string; isHeader: boolean; colspan?: number; rowspan?: number }[];
};

// INPUT: a <tr> Element
// OUTPUT: RenderedTableRow with all direct <th>/<td> children mapped to typed cells
function rowToRenderedRow(row: Element): RenderedTableRow {
  const cells = Array.from(row.querySelectorAll(':scope > th, :scope > td')).map(cell => ({
    html: cell.innerHTML,
    isHeader: cell.tagName.toLowerCase() === 'th',
    colspan: cell.hasAttribute('colspan') ? parseInt(cell.getAttribute('colspan')!) : undefined,
    rowspan: cell.hasAttribute('rowspan') ? parseInt(cell.getAttribute('rowspan')!) : undefined,
  }));
  return { cells };
}

// INPUT: the content string from a DictionaryEntryContent node
//   e.g. '<p><strong class="Latn headword">amor</strong> m ...</p><ol><li>love...</li></ol>'
//   or   '<div class="inflection-table-wrapper"><table>...</table></div>'
// OUTPUT: RenderedNode[] — typed nodes for rendering
//
// Wiktionary REST API content nodes include:
//   <p>       → headword line, etymology, usage notes
//   <ol>/<ul> → definition lists, derived terms
//   <dl>      → usage examples, quotations
//   <div class="inflection-table-wrapper"> → contains a <table> (declension)
//   <table>   → declension table directly
//   <style>/<link> → skipped
//
// Example: content = '<p>headword...</p><ol><li>love</li></ol>'
// Produces:
//   [
//     { type: 'html', html: '<p>headword...</p>' },
//     { type: 'html', html: '<ol><li>love</li></ol>' }
//   ]
//
// Example: content = '<div class="inflection-table-wrapper">...<table>...</table></div>'
// Produces:
//   [{ type: 'table', rows: [...] }]
function parseContentNodes(html: string): RenderedNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes: RenderedNode[] = [];
  for(const child of Array.from(doc.body.children)) {
    const tag = child.tagName.toLowerCase();
    if(['style', 'link', 'script'].includes(tag)) continue;
    if(tag === 'table') {
      const rows = Array.from(child.querySelectorAll('tr')).map(rowToRenderedRow);
      nodes.push({ type: 'table', rows });
      continue;
    }
    if(tag === 'div') {
      const innerTable = child.querySelector('table');
      if(innerTable) {
        // Wiktionary wraps inflection tables in <div class="inflection-table-wrapper">
        const rows = Array.from(innerTable.querySelectorAll('tr')).map(rowToRenderedRow);
        nodes.push({ type: 'table', rows });
        continue;
      }
    }
    nodes.push({ type: 'html', html: child.outerHTML });
  }
  return nodes;
}

// INPUT: DictionaryEntryContent tree + depth (0 = root call)
// OUTPUT: RenderedNode[] — flat list of nodes for sequential rendering
//
// depth 0 (root, the lemma entry):
//   emits { type: 'heading', level: 1, id: "amor", text: "amor" }
//   then recurses into children at depth 1
//
// depth 1 (h3-level sections like "Etymology 1", "Proper noun"):
//   emits { type: 'heading', level: 2, id: "Etymology_1", text: "Etymology 1" }
//   then content nodes from entry.content
//   then recurses into children at depth 2
//
// depth 2 (h4-level sections like "Noun", "Declension"):
//   emits { type: 'heading', level: 3, ... }
//   etc.
//
// Full output example for amor (abbreviated):
//   [
//     { type: 'heading', id: 'amor',         text: 'amor',         level: 1 },
//     { type: 'heading', id: 'Etymology_1',  text: 'Etymology 1',  level: 2 },
//     { type: 'html',    html: '<p>amō + -or...</p>' },
//     { type: 'heading', id: 'Alternative_forms', text: 'Alternative forms', level: 3 },
//     { type: 'html',    html: '<ul><li>Amor</li></ul>' },
//     { type: 'heading', id: 'Noun_10',      text: 'Noun',          level: 3 },
//     { type: 'html',    html: '<p><strong class="Latn headword">amor</strong>...</p>' },
//     { type: 'html',    html: '<ol><li>love, affection...</li></ol>' },
//     { type: 'heading', id: 'Declension_2', text: 'Declension',    level: 4 },
//     { type: 'table',   rows: [
//       { cells: [{ html: '', isHeader: true }, { html: 'singular', isHeader: true }, { html: 'plural', isHeader: true }] },
//       { cells: [{ html: 'nominative', isHeader: true }, { html: '...amor...', isHeader: false }, { html: '...amōrēs...', isHeader: false }] },
//       ...
//     ]},
//     { type: 'heading', id: 'Etymology_2_2', text: 'Etymology 2',  level: 2 },
//     { type: 'html',    html: '<p>From Proto-Italic...</p>' },
//     { type: 'heading', id: 'Verb',          text: 'Verb',          level: 3 },
//     { type: 'html',    html: '<p><strong class="Latn headword">amor</strong>...</p>' },
//     { type: 'html',    html: '<ol><li>first-person singular present passive...</li></ol>' }
//   ]
function renderDictionaryEntry(entry: DictionaryEntryContent, depth = 0): RenderedNode[] {
  if(depth === 0) {
    const nodes: RenderedNode[] = [];
    if(entry.title) {
      nodes.push({ type: 'heading', id: entry.title, text: entry.title, level: 1 });
    }
    nodes.push(...entry.children.flatMap(child => renderDictionaryEntry(child, 1)));
    return nodes;
  }
  const nodes: RenderedNode[] = [];
  if(entry.title && entry.hash) {
    nodes.push({
      type: 'heading',
      id: entry.hash.replace('#', ''),
      text: entry.title,
      level: depth + 1,
    });
  }
  if(entry.content) {
    nodes.push(...parseContentNodes(entry.content));
  }
  for(const child of entry.children) {
    nodes.push(...renderDictionaryEntry(child, depth + 1));
  }
  return nodes;
}

export { 
  extractLatinSection, 
  extractLatinSidebarContent, 
  extractLatinDictionaryEntryContent,
  renderDictionaryEntry,
}
export type { SidebarContent, DictionaryEntryContent, RenderedNode }