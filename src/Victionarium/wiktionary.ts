import ky from "ky";

type LemmaResult = { html: string; title: string };

//https://en.wiktionary.org/wiki/Special:RestSandbox/wmf-restbase?doc#/Page%20content/get_page_html__title_
const WIKTIONARY_PAGE_API = "https://en.wiktionary.org/api/rest_v1/page/html";
async function getLatinLemmaHTMLByTitle(title: string): Promise<LemmaResult> {
  const html = await ky.get(`${WIKTIONARY_PAGE_API}/${title}`).text(); //ky catches url redirection
  return { html: html, title: title };
}

//https://en.wiktionary.org/w/api.php
const WIKTIONARY_ACTION_API = "https://en.wiktionary.org/w/api.php";
async function getRandomLatinLemmaHTML(): Promise<LemmaResult> {
  const members = await ky.get(WIKTIONARY_ACTION_API, {
    searchParams: {
      action: "query",
      list: "categorymembers",
      cmtitle: "Category:Latin_lemmas",
      cmlimit: 500,
      cmtype: "page",
      cmsort: "sortkey",
      cmstartsortkeyprefix: randomLetter(),
      format: "json",
      origin: "*",
    }
  }).json<any>().then(r => r.query.categorymembers);
  const filtered = members.filter((m: any) => {
    return (m.ns === 0) && (/^[a-zA-Z\s\-]+$/.test(m.title));
  }); //filtering out reconstructed & non-alphabetic
  const title = filtered[Math.floor(Math.random() * filtered.length)].title;
  const { html } = await getLatinLemmaHTMLByTitle(title);
  return { html: html, title: title };
}

function randomLetter(): string {
  return "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
}

export { getRandomLatinLemmaHTML, getLatinLemmaHTMLByTitle }