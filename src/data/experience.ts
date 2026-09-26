// Source: the about-corneliu career record (LinkedIn export Sep 2026 + CVs). Customer names are
// confidential: industries only. Betclic lines are the public LinkedIn ones, no internal numbers.

export const EXPERIENCE = [
  {
    org: "Betclic",
    role: "Staff GenAI Solutions Architect",
    period: "Sep 2025 – now",
    place: "Paris",
    summary: "Leads GenAI architecture across the company.",
    points: [
      "Leads the adoption of MCP: guidelines used by every squad, reference patterns for agentic apps.",
      "Technical advisor and gatekeeper for every new GenAI initiative: architecture reviews, implementation choices, evaluation frameworks.",
      "Builds production-ready GenAI prototypes with product teams, including agentic apps for data aggregation and semantic search.",
      "Runs GenAI enablement: technical workshops and developer guidance.",
    ],
  },
  {
    org: "Amazon Web Services",
    role: "Senior GenAI Prototyping Architect",
    period: "Apr 2021 – Aug 2025",
    place: "Paris",
    summary: "30+ prototypes for AWS customers across EMEA, 2 to 6 weeks each. GenAI only from the ChatGPT launch on.",
    points: [
      "Owned the full cycle: qualification, solution design, building inside the customer's own AWS accounts, then training their team to carry it forward.",
      "Banking, manufacturing, business information, media and sports streaming, online classifieds, e-commerce.",
      "Co-created Agent Squad (then Multi-Agent Orchestrator), one of the top AWS Labs repositories.",
      "Presented AI architectures to C-level leaders. Led developer workshops building first enterprise AI applications.",
    ],
  },
  {
    org: "Amazon Web Services",
    role: "Solutions Architect",
    period: "Jul 2018 – Apr 2021",
    place: "Paris",
    summary: "Hundreds of customers: enterprise, then digital natives, then startups.",
    points: [
      "Cloud architectures, architecture reviews for reliability and security, C-level presentations.",
      "Member of the AWS Serverless and Edge specialty groups.",
    ],
  },
  {
    org: "Euler Hermes",
    role: "Tech Lead, AWS Solution Architect",
    period: "Feb 2018 – Jun 2018",
    place: "Paris",
    summary: "Serverless APIs on AWS Lambda, API Gateway and Kinesis.",
    points: [],
  },
  {
    org: "Target2Sell",
    role: "Senior Software Engineer",
    period: "Aug 2017 – Jan 2018",
    place: "Paris",
    summary: "",
    points: [],
  },
  {
    org: "La Centrale (CarBoat Media)",
    role: "Senior Software Engineer, Product Owner",
    period: "Dec 2012 – Jul 2017",
    place: "Paris",
    summary: "Led the migration of legacy systems to AWS. Java and Spring Boot backend services. Managed a team of five engineers.",
    points: [],
  },
  {
    org: "Consultant",
    role: "Software engineer, then technical lead",
    period: "Jul 2003 – Dec 2012",
    place: "Paris",
    summary: "Client missions in banking and insurance: Société Générale CIB, BNP Paribas CIB, BNP Paribas Cardif, BNP Paribas retail. Also Karavel and Française des Jeux. Java/J2EE, Oracle, grid computing.",
    points: [],
  },
];

export const SIDE_PROJECTS = [
  {
    name: "StreetLens",
    url: "https://streetlensapp.com",
    role: "Co-founder",
    period: "2026 – now",
    text: "GPS audio guides, 6 cities, 8 languages, on the App Store. An LLM pipeline researches sources, extracts facts, writes the narration from them, validates and repairs it, then voices it. Pipeline and API built with my co-founder Anthony Bernabeu; the iOS app and the design are his.",
  },
  {
    name: "Back From My Trip",
    url: "https://www.backfrommytrip.com",
    role: "Co-founder",
    period: "2026 – now",
    text: "Trip reports with one verdict: would I go back? An LLM layer moderates reports, extracts places and verifies photos. It never touches the story.",
  },
  {
    name: "BandBike",
    url: undefined,
    role: "Co-founder",
    period: "2014 – 2016",
    text: "Peer-to-peer bike rental. Play Framework, Elasticsearch. Built alongside a full-time job.",
  },
];

export const SKILLS = [
  { area: "GenAI", items: "LLM pipelines, agents and multi-agent orchestration, MCP, RAG, evaluation, prompt and context engineering" },
  { area: "Cloud", items: "AWS serverless, event-driven and edge architectures, Step Functions, Bedrock, Supabase" },
  { area: "Languages", items: "Python, TypeScript, Java, Swift, SQL" },
  { area: "Product", items: "Prototyping, UX, design, from the first sketch to the thing people use" },
];

export const CERTIFICATIONS = [
  "AWS Certified Solutions Architect – Professional",
  "AWS Certified Security – Specialty",
  "AWS Certified AI Practitioner",
];

export const LANGUAGES = "French (fluent), English (fluent), Romanian (native), German (basic)";

export const EDUCATION = {
  degree: "Engineer's Degree (Diplôme d'Ingénieur), Computer Science and Automation",
  school: "Dunărea de Jos University of Galați, 1998 – 2003",
};
