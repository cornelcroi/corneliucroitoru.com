// `when` sits next to the role; `links` is the row of links under the text; `short` is the home page line;
// `proof` is the one line of evidence shown in bold on the home page card.
export const BUILDING = [
  {
    name: "StreetLens",
    url: "https://streetlensapp.com",
    when: "live since April 2026",
    links: [
      { label: "streetlensapp.com", url: "https://streetlensapp.com" },
      { label: "App Store", url: "https://apps.apple.com/app/id6756893250" },
      { label: "how it works", url: "https://streetlensapp.com/technology/" },
    ],
    line: "GPS audio guides · 6 cities · 8 languages · on the App Store",
    short: "Hear the story of the places around you, as you walk. An LLM pipeline researches, writes and checks every story.",
    proof: "6 cities · 8 languages · on the App Store",
    text: "Hear the story of the places around you, in your language. You search for what you like, \"Emily in Paris filming spots\" or \"buildings by I.M. Pei\", and it builds a walking tour on the fly. Behind every story, a multi-step LLM pipeline researches sources, extracts the facts, writes the story from them and checks every line against those facts. What fails is repaired, 90–95% of it automatically. Then text-to-speech turns it into audio in 8 languages. A new city in days.",
    role: "Co-founder",
    image: { bare: true, src: "/img/projects/streetlens.jpg", alt: "StreetLens on iPhone: searching Honfleur, a story of Notre-Dame in Japanese, and the lock screen playing", width: 1400, height: 900 },
  },
  {
    name: "Back From My Trip",
    url: "https://www.backfrommytrip.com",
    when: "live since August 2026",
    links: [{ label: "BackFromMyTrip.com", url: "https://www.backfrommytrip.com" }],
    line: "Trip reports · one verdict: would I go back?",
    short: "Trip reports that end with one question: would I go back? LLMs moderate every report and find the places. They never write a word.",
    proof: "Live since August 2026 · 6 articles on how it's built",
    text: "Travellers write trip reports that end with one question: would I go back? LLMs work in the background. They moderate every report, find the places it mentions and check the photos. When they are not sure, a person decides. They never write a word of the story.",
    role: "Co-founder",
    series: "Building Back From My Trip",
    image: { src: "/img/projects/backfrommytrip.jpg", alt: "The Back From My Trip home page: the trip report of the week, its verdict and its verified badge", width: 1280, height: 680 },
  },
  {
    name: "BandBike",
    // Closed; the name links to the 20 Minutes article, the widest coverage it had.
    url: "https://www.20minutes.fr/societe/1474223-20141104-bandbike-comment-louer-velo-particulier",
    when: "2014 – 2016, closed",
    links: [
      { label: "20 Minutes", url: "https://www.20minutes.fr/societe/1474223-20141104-bandbike-comment-louer-velo-particulier" },
      { label: "Le Coin des Voyageurs", url: "https://lecoindesvoyageurs.fr/2014/11/b-and-bike-une-start-up-de-location-de-velos-tres-tendance.html" },
      { label: "Citycle", url: "https://www.citycle.com/17846-b-and-bike-le-service-de-location-velo-pour-les-particuliers/" },
    ],
    line: "Peer-to-peer bike rental · France · national press",
    text: "One of the first peer-to-peer bike rental sites in France, launched in July 2014: owners list their bikes, every listing is checked by hand before it goes live, riders search by city and find one nearby. I built the platform and took it to production, alongside a full-time job. 100+ bikes listed in under 4 months. Covered by 20 Minutes (France's free national daily, 15.5 million readers a month in 2014, print and web) and the cycling press.",
    role: "Co-founder",
    image: { clipping: true, src: "/img/projects/bandbike-20minutes.jpg", alt: "20 Minutes, 4 November 2014: BandBike ou comment louer un vélo à un particulier", width: 1400, height: 1171 },
  },
];

export const AGENT_SQUAD = {
  name: "Agent Squad",
  url: "https://github.com/2fastlabs/agent-squad",
  when: "2024 – now",
  line: "Multi-agent orchestration · 7.7k stars",
  short: "Open source. It sends each request to the right AI agent and keeps the conversation across them. Born from a customer need at AWS.",
  proof: "7.7k stars · in AWS's official Guidance for Multi-Agent Orchestration",
  image: { src: "/img/projects/agent-squad.jpg", alt: "Agent Squad: the classifier picks the right agent for each request and keeps the conversation history", width: 1099, height: 421 },
  text: "Routes each request to the right agent and keeps the conversation across them. Python and TypeScript, plus a Swift runtime that runs entirely on the device. Includes GroundedAgent: the agent that calls the tools never writes the reply. Born from a customer need at AWS, open-sourced as Multi-Agent Orchestrator. AWS lists it in its official Guidance for Multi-Agent Orchestration, next to Amazon Bedrock AgentCore and LangGraph.",
  links: [{ label: "GitHub", url: "https://github.com/2fastlabs/agent-squad" }, { label: "AWS Guidance", url: "https://docs.aws.amazon.com/solutions/multi-agent-orchestration-on-aws/" }],
  role: "Co-creator, lead maintainer",
};

export const CONTEXT_LENS = {
  name: "Context Lens",
  url: "https://github.com/cornelcroi/context-lens",
  when: "2025",
  text: "An MCP server for semantic search over local files and GitHub repositories. Think of it as SQLite for AI embeddings.",
  role: "Author",
};

// Small prototypes, one idea each: a short list, never full entries. Their articles are under « Prototypes » on the Writing page.
export const PROTOTYPES = [
  { name: "Garage & Route", url: "https://cornelcroi.github.io/how-a-car-works/", text: "A 3D car to see how a car works, and how to park it", thumb: "/img/projects/garage-and-route-thumb.jpg", thumbAlt: "The car parking between two others, seen from above, with its tyre tracks" },
  { name: "Tonight", url: "/writing/search-grammar-pattern/", text: "A film search: ask in plain words, across the 14 streaming services we pay for at home", thumb: "/img/projects/tonight-thumb.jpg", thumbAlt: "Tonight on the TV: a film page with the service to open it in" },
];

// Small MCP servers. Listed under Open source, next to Context Lens.
export const MCP_SERVERS = [
  { name: "Ask James", url: "https://github.com/cornelcroi/ask-james", text: "a second opinion from another LLM, inside your assistant" },
  { name: "Data Lens", url: "https://github.com/cornelcroi/data-lens", text: "ask questions about spreadsheets in plain English" },
  { name: "Bookmark Lens", url: "https://github.com/cornelcroi/bookmark-lens", text: "your bookmarks, searchable by meaning" },
];

// Strongest first; the list ends on something that still stands.
export const BUILT_AT_AWS = [
  {
    name: "Secure Media Delivery at the Edge",
    url: "https://docs.aws.amazon.com/solutions/secure-media-delivery-at-the-edge-on-aws/",
    links: [{ label: "architecture", url: "https://github.com/aws-solutions-library-samples/secure-media-delivery-at-the-edge-on-aws#architecture-overview" }],
    role: "Sole developer",
    when: "2021",
    text: "Stops piracy of live and on-demand video: every viewer gets their own token, checked at the edge, and shared sessions get blocked. I built it to scale my work with media customers. AWS made it an official AWS Solution, now maintained by the AWS Solutions team.",
  },
  {
    name: "Food Analyzer (FoodLens)",
    url: "https://github.com/aws-samples/serverless-genai-food-analyzer-app",
    links: [{ label: "architecture", url: "https://github.com/aws-samples/serverless-genai-food-analyzer-app#architecture" }],
    role: "Co-creator",
    when: "2024",
    text: "A serverless GenAI web app for shopping and cooking, on Amazon Bedrock with Claude Haiku and Sonnet. Born at an internal AWS hackathon, which it won. I then rebuilt the UI and the UX so a demo would feel like a real product. Shown at more than 10 AWS Summits.",
  },
  {
    name: "A/B Testing at the Edge",
    url: "https://github.com/aws-samples/ab-testing-at-edge",
    links: [{ label: "architecture", url: "https://github.com/aws-samples/ab-testing-at-edge#architecture" }],
    role: "Owner, maintainer",
    when: "2021, updated 2024",
    text: "A/B routing decided at the edge, before the request reaches the origin, with a split you change live, without a redeploy. Built as a new AWS workshop for customer enablement.",
  },
];
