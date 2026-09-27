export const BUILDING = [
  {
    name: "StreetLens",
    url: "https://streetlensapp.com",
    line: "GPS audio guides · 6 cities · 8 languages · an LLM pipeline writes every story",
    text: "Hear the story of the places around you, in your language. Behind it, an LLM pipeline: it extracts facts from sources, writes each story from those facts only, checks it against them, then voices it in 8 languages. A new city in days.",
    role: "Co-founder",
    image: { src: "/img/projects/streetlens.jpg", alt: "StreetLens on iPhone: searching Honfleur, a story of Notre-Dame in Japanese, and the lock screen playing", width: 1400, height: 900 },
  },
  {
    name: "Back From My Trip",
    url: "https://www.backfrommytrip.com",
    line: "Trip reports. Would I go back? · LLMs moderate, extract, verify",
    text: "Travellers write trip reports that end with one question: would I go back? Behind it, LLMs moderate every report, pull out the places it mentions and check the photos. They never write a word of the story.",
    role: "Co-founder",
    image: { src: "/img/projects/backfrommytrip.jpg", alt: "The Back From My Trip home page: the trip report of the week, its verdict and its verified badge", width: 1280, height: 680 },
  },
];

export const AGENT_SQUAD = {
  name: "Agent Squad",
  url: "https://github.com/2fastlabs/agent-squad",
  line: "Multi-agent orchestration · 7.7k stars",
  text: "Routes each request to the right agent and keeps the conversation across them. Python and TypeScript, plus a Swift runtime that runs entirely on the device. Includes GroundedAgent: the agent that calls the tools never writes the reply. Started at AWS Labs as Multi-Agent Orchestrator.",
  role: "Co-author, lead maintainer",
};

export const CONTEXT_LENS = {
  name: "Context Lens",
  url: "https://github.com/cornelcroi/context-lens",
  text: "An MCP server for semantic search over local files and GitHub repositories. Think of it as SQLite for AI embeddings.",
  role: "Author",
};

// Small experiments, one idea each: a short list, never full entries.
export const EXPERIMENTS = [
  { name: "Ask James", url: "https://github.com/cornelcroi/ask-james", text: "a second opinion from another LLM, inside your assistant" },
  { name: "Data Lens", url: "https://github.com/cornelcroi/data-lens", text: "ask questions about spreadsheets in plain English" },
  { name: "Bookmark Lens", url: "https://github.com/cornelcroi/bookmark-lens", text: "your bookmarks, searchable by meaning" },
];

export const BUILT_AT_AWS = [
  {
    name: "Food Analyzer (FoodLens)",
    url: "https://github.com/aws-samples/serverless-genai-food-analyzer-app",
    architecture: "https://github.com/aws-samples/serverless-genai-food-analyzer-app#architecture",
    role: "Co-creator",
    text: "A serverless GenAI web app for shopping and cooking, on Amazon Bedrock with Claude Haiku and Sonnet. Born at an internal AWS hackathon, which it won. I then rebuilt the UI and the UX so a demo would feel like a real product. Shown at more than 10 AWS Summits.",
  },
  {
    name: "Secure Media Delivery at the Edge",
    url: "https://github.com/aws-solutions-library-samples/secure-media-delivery-at-the-edge-on-aws",
    architecture: "https://github.com/aws-solutions-library-samples/secure-media-delivery-at-the-edge-on-aws#architecture-overview",
    role: "Sole developer",
    text: "Protects premium video delivered through CloudFront. Now maintained by the AWS Solutions team.",
  },
  {
    name: "A/B Testing at the Edge",
    url: "https://github.com/aws-samples/ab-testing-at-edge",
    architecture: "https://github.com/aws-samples/ab-testing-at-edge#architecture",
    role: "Owner, maintainer",
    text: "A/B testing on CloudFront with Lambda@Edge, CloudFront Functions and KeyValueStore. Comes with an AWS workshop.",
  },
  {
    name: "CloudFront Hosting Toolkit",
    url: "https://github.com/awslabs/cloudfront-hosting-toolkit",
    architecture: "https://awslabs.github.io/cloudfront-hosting-toolkit/architecture/overview",
    role: "Main maintainer",
    text: "A CLI that builds a full frontend deployment pipeline on S3 and CloudFront in two commands.",
  },
];
