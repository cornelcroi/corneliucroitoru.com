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
      "Reviews and approves every new GenAI project: architecture, implementation choices, how it will be evaluated.",
      "Builds production-ready GenAI prototypes with product teams, including agentic apps for data aggregation and semantic search.",
      "Trains the teams: technical workshops and developer guidance.",
    ],
  },
  {
    org: "Amazon Web Services",
    role: "Senior GenAI Prototyping Architect",
    period: "Apr 2021 – Aug 2025",
    place: "Paris",
    summary: "Designed and delivered 30+ production-ready prototypes, 2 to 6 weeks each, for AWS customers across EMEA: GenAI, serverless and media streaming. GenAI-only after ChatGPT launched.",
    points: [
      "Each time me and the customer's team: I proposed the architecture, split the work and kept everyone moving, built in their own AWS account, then handed it over to their team.",
      "Banking, manufacturing, business information, media and sports streaming, online classifieds, e-commerce.",
      "Co-created Agent Squad (then Multi-Agent Orchestrator) from a customer need, then open-sourced it: one of the top AWS Labs repositories, and one of the four options in the AWS Guidance for Multi-Agent Orchestration.",
      "Built Secure Media Delivery at the Edge to scale my work with media customers; AWS made it an official AWS Solution.",
      "Presented AI architectures to C-level leaders. Led developer workshops building first enterprise AI applications.",
    ],
  },
  {
    org: "Amazon Web Services",
    role: "Solutions Architect",
    period: "Jul 2018 – Apr 2021",
    place: "Paris",
    summary: "Hundreds of customers, from large companies to startups.",
    points: [
      "Monthly office hours with early-stage startups: 30 minutes each to find the real problem and propose a solution.",
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
    label: "Consultant: software engineer, then technical lead",
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
    period: "Live since April 2026",
    text: "GPS audio guides, 6 cities, 8 languages, on the App Store. Search in plain words and it builds a walking tour on the fly. A multi-step LLM pipeline researches sources, extracts facts, writes the narration from them only, then evaluates it against those facts and repairs what fails (90–95% fixed automatically) before voicing it. Pipeline and API built with my co-founder Anthony Bernabeu; the iOS app and the design are his.",
  },
  {
    name: "Back From My Trip",
    url: "https://www.backfrommytrip.com",
    role: "Co-founder",
    period: "Live since August 2026",
    text: "Trip reports with one verdict: would I go back? LLMs work in the background: they moderate reports, extract places and check photos. Anything uncertain goes to a person. They never write a word of the story.",
  },
  {
    name: "BandBike",
    url: undefined,
    role: "Co-founder",
    period: "2014 – 2016",
    text: "One of the first peer-to-peer bike rental sites in France, launched in July 2014: owners list their bikes, every listing is checked by hand before it goes live, riders search by city and find one nearby. I built the platform and took it to production, alongside a full-time job. 100+ bikes listed in under 4 months. Covered by 20 Minutes (national daily, 15.5M readers a month) and the cycling press.",
  },
];

export const SKILLS = [
  { area: "GenAI", items: "LLM pipelines, agents and multi-agent orchestration, MCP, RAG, evaluation, prompt and context engineering" },
  { area: "Cloud", items: "AWS serverless, event-driven and edge architectures, Step Functions, Bedrock, Supabase" },
  { area: "Programming", items: "Python, TypeScript, Java, Swift, SQL" },
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

