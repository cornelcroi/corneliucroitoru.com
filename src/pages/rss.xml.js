import rss from "@astrojs/rss";
import { SITE } from "../site";
import { getArticles } from "../lib/content";

export async function GET(context) {
  const articles = await getArticles();
  return rss({
    title: SITE.name,
    description: "Patterns from building with AI.",
    site: context.site,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.date,
      link: `/writing/${a.id}/`,
    })),
  });
}
