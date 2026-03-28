import ky from "ky";

//https://en.wiktionary.org/wiki/Special:RestSandbox/wmf-restbase?doc#/Page%20content/get_page_html__title_
const WIKTIONARY_PAGE_API = "https://en.wiktionary.org/api/rest_v1/page/html";

async function getLatinLemmaHTMLByTitle(title: string): Promise<string> {
  const html = await ky.get(`${WIKTIONARY_PAGE_API}/${title}`).text(); //ky catches url redirection
  return html;
}

//https://en.wiktionary.org/w/api.php
const WIKTIONARY_ACTION_API = "https://en.wiktionary.org/w/api.php";
async function getRandomLatinLemmaHTML(): Promise<string> {
  const members = await ky.get(WIKTIONARY_ACTION_API, {
    searchParams: {
      action: "query",
      list: "categorymembers",
      cmtitle: "Category:Latin_verbs",
      cmlimit: 50,
      cmtype: "page",
      cmsort: "sortkey",
      cmstartsortkeyprefix: randomLetter(),
      format: "json",
      origin: "*",
    }
  }).json<any>().then(r => r.query.categorymembers);
  const title = members[Math.floor(Math.random() * members.length)].title;
  return getLatinLemmaHTMLByTitle(title);
}

function randomLetter(): string {
  return "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
}

export { getRandomLatinLemmaHTML, getLatinLemmaHTMLByTitle }