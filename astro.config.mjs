import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://corneliucroitoru.com",
  integrations: [sitemap()],
  markdown: { shikiConfig: { theme: "github-light" } },
});
