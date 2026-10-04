import { SITE } from "../site";

// Structured data (schema.org JSON-LD). Search engines read it to know who the site is about
// and to connect it to the same person on LinkedIn, GitHub and elsewhere (`sameAs`).
export const PERSON_ID = `${SITE.url}/#person`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}${SITE.shareImage}`,
  jobTitle: SITE.role,
  worksFor: { "@type": "Organization", name: "Betclic", url: "https://www.betclic.com" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Dunărea de Jos University of Galați" },
  address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
  knowsAbout: [
    "Generative AI", "Large language models", "AI agents", "Model Context Protocol",
    "LLM evaluation", "AWS", "Serverless architecture", "Product design", "Photography",
  ],
  knowsLanguage: ["en", "fr", "ro"],
  sameAs: [SITE.links.linkedin, SITE.links.github, SITE.links.devto],
};

export const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE.url,
  name: SITE.name,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": [website, person, ...nodes] };
}
