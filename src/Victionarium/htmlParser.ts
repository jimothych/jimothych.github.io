function extractLatinSection(html: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const latinHeading = doc.querySelector('h2#Latin');
  if(!latinHeading) { throw new Error("no latin heading found :("); }

  const latinSection = latinHeading.closest('section');
  if(!latinSection) { throw new Error("no latin section found :("); }

  // remove pronunciation sections
  latinSection.querySelectorAll('section').forEach((section: Element) => {
    const heading = section.querySelector('h3, h4');
    if (heading && heading.textContent?.trim().startsWith('Pronunciation')) {
      section.remove();
    }
  });

  // remove links that point to English definitions (href ending in #English)
  latinSection.querySelectorAll('a[href$="#English"]').forEach((a: Element) => {
    a.replaceWith(document.createTextNode(a.textContent ?? ''));
  });

  return latinSection;
}

type SidebarContent = {
  title: string;
  hash: string;
  level: number;
  children: SidebarContent[];
};
function extractLatinSidebarContent(latinSection: HTMLElement): SidebarContent[] {
  const flat: SidebarContent[] = [];

  latinSection.querySelectorAll('h3, h4, h5').forEach((heading: Element) => {
    const id = heading.id;
    if(!id) return;

    const level = parseInt(heading.tagName[1]);
    flat.push({
      title: heading.textContent?.trim() ?? '',
      hash: `#${id}`,
      level,
      children: []
    });
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

function extractLatinDictionaryEntryContent(latinSection: HTMLElement): DictionaryEntryContent {
  return sectionToJSON(latinSection);
}

export { extractLatinSection, extractLatinSidebarContent, extractLatinDictionaryEntryContent };