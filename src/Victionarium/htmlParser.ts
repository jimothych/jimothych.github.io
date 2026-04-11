///--------------------------------------------------------------------------------
/// WIKTIONARY HTML PARSING & FORMATTING TO JSON
///--------------------------------------------------------------------------------

function extractLatinSection(html: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const latinHeading = doc.querySelector('h2#Latin');
  if(!latinHeading) { throw new Error("no latin heading found :("); }

  const latinSection = latinHeading.closest('section');
  if(!latinSection) { throw new Error("no latin section found :("); }

  // remove pronunciation sections but preserve their children
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
  const headings = Array.from(latinSection.querySelectorAll('h3, h4, h5'));
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const text = heading.textContent?.trim();

    if(text === 'Descendants' || text === 'Borrowings') {
      const level = parseInt(heading.tagName[1]); // h3 → 3, etc.
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

  // strip #Latin fragments
  latinSection.querySelectorAll('a[href]').forEach((a: Element) => {
    const href = a.getAttribute('href') ?? '';
    if(href.startsWith('./Appendix:')) return;
    if(href.startsWith('http')) return;

    const i = href.indexOf('#');
    if(i !== -1) { a.setAttribute('href', href.slice(0, i)); }
  });

  return latinSection;
}

type SidebarContent = {
  title: string;
  hash: string;
  level: number;
  children: SidebarContent[];
};
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

type DictionaryEntryContent = {
  title: string | null;
  hash: string | null;
  content: string;
  children: DictionaryEntryContent[];
};
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
    content: contentNodes.join(''),
    children: Array.from(childSections).map(sectionToJSON)
  };
}

function extractLatinDictionaryEntryContent(latinSection: HTMLElement, title: string): DictionaryEntryContent {
  const entry = sectionToJSON(latinSection);
  return { ...entry, title: title };
}


///--------------------------------------------------------------------------------
/// DICTIONARY ENTRY HTML NODE GENERATION
///--------------------------------------------------------------------------------

type RenderedNode =
  | { type: 'heading'; id: string; text: string; level: number }
  | { type: 'html'; html: string }
  | { type: 'table'; rows: RenderedTableRow[] };
type RenderedTableRow = {
  cells: { html: string; isHeader: boolean; colspan?: number; rowspan?: number }[];
};

function rowToRenderedRow(row: Element): RenderedTableRow {
  const cells = Array.from(row.querySelectorAll(':scope > th, :scope > td')).map(cell => ({
    html: cell.innerHTML,
    isHeader: cell.tagName.toLowerCase() === 'th',
    colspan: cell.hasAttribute('colspan') ? parseInt(cell.getAttribute('colspan')!) : undefined,
    rowspan: cell.hasAttribute('rowspan') ? parseInt(cell.getAttribute('rowspan')!) : undefined,
  }));
  return { cells };
}

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
        const rows = Array.from(innerTable.querySelectorAll('tr')).map(rowToRenderedRow);
        nodes.push({ type: 'table', rows });
        continue;
      }
    }
    nodes.push({ type: 'html', html: child.outerHTML });
  }
  return nodes;
}

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
export type { SidebarContent, DictionaryEntryContent }
