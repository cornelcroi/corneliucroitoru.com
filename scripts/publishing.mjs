// The articles' publishing state, and scheduling one. No dependency.
//   node scripts/publishing.mjs status                     a table: live, scheduled (with the day), draft
//   node scripts/publishing.mjs schedule <slug> <date>     removes draft: true, sets date: <date> (YYYY-MM-DD)
// The GitHub Action "Deploy" runs both; the site shows a scheduled article from its date (daily build).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/content/writing";
const today = new Date().toISOString().slice(0, 10);

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error("no front matter");
  return m[1];
}
const field = (fm, key) => (fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m")) || [])[1]?.replace(/^"|"$/g, "");

function articles() {
  return readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => {
    const fm = frontMatter(readFileSync(join(DIR, f), "utf8"));
    const date = field(fm, "date");
    const draft = field(fm, "draft") === "true";
    const state = draft ? "draft" : date && date > today ? "scheduled" : "live";
    return { slug: f.replace(/\.md$/, ""), title: field(fm, "title"), date: date || "", state };
  });
}

function status() {
  const order = { scheduled: 0, draft: 1, live: 2 };
  const rows = articles().sort((a, b) => order[a.state] - order[b.state] || b.date.localeCompare(a.date));
  console.log(`### Articles on ${today}\n\n| State | Date | Article | Slug |\n|---|---|---|---|`);
  for (const a of rows) console.log(`| ${a.state} | ${a.date || "—"} | ${a.title} | \`${a.slug}\` |`);
}

function schedule(slug, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) throw new Error(`date must be YYYY-MM-DD, got "${date}"`);
  const file = join(DIR, `${slug}.md`);
  let text;
  try { text = readFileSync(file, "utf8"); } catch { throw new Error(`no article "${slug}" in ${DIR}`); }
  const fm = frontMatter(text);
  let next = fm.replace(/^draft:.*\n?/m, "");
  next = /^date:/m.test(next) ? next.replace(/^date:.*$/m, `date: ${date}`) : next.replace(/^(title:.*)$/m, `$1\ndate: ${date}`);
  writeFileSync(file, text.replace(fm, next));
  console.log(`${slug}: ${date > today ? `scheduled for ${date}` : `live from ${date}`}`);
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === "status") status();
  else if (cmd === "schedule") schedule(...args);
  else throw new Error("usage: status | schedule <slug> <YYYY-MM-DD>");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
