// Source: the about-corneliu career record (LinkedIn export Sep 2026 + CVs). Customer names are
// confidential: industries only. Betclic lines are the public LinkedIn ones, no internal numbers.

export const EXPERIENCE = [
  {
    org: "Betclic",
    role: "Staff GenAI Solutions Architect",
    period: "Sep 2025 – now",
    place: "Paris",
    summary: "Deputy to the head of the GenAI Center of Excellence. He takes care of the business side and the other teams. I take care of the tech: best practices, how to do it and how not to do it.",
    points: [
      "Leads the adoption of MCP across the company: guidelines used by every squad, reference patterns for agentic apps.",
      "Reviews and approves GenAI projects: the architecture, the implementation choices, how they will be evaluated. Always looking for the simpler and more efficient way.",
      "Builds production-ready GenAI prototypes with product teams, including agentic apps for data aggregation and semantic search.",
    ],
  },
  {
    org: "Amazon Web Services",
    role: "Senior GenAI Prototyping Architect",
    period: "Apr 2021 – Aug 2025",
    place: "Paris",
    summary: "Designed and built 30+ production-ready prototypes for AWS customers across EMEA, 2 to 6 weeks each, in GenAI, serverless and media streaming. Only GenAI after ChatGPT came out.",
    points: [
      "Many hats on each engagement. Scoped the use case with the customer and proposed the architecture, then ran the project. Split the tasks between me and their team, built with them and taught them along the way, so at the end they could take the prototype to production alone.",
      "Customers in banking, manufacturing, business information, media and sports streaming, online classifieds and e-commerce.",
      "Co-created Agent Squad (then Multi-Agent Orchestrator) from a customer need, then open-sourced it: one of the top AWS Labs repositories, and one of the four options in the AWS Guidance for Multi-Agent Orchestration.",
      "Built Secure Media Delivery at the Edge to scale my work with media customers; AWS made it an official AWS Solution.",
      "Presented AI architectures to C-level leaders. Led developer workshops where teams built their first enterprise AI applications.",
    ],
  },
  {
    org: "Amazon Web Services",
    role: "Solutions Architect",
    period: "Jul 2018 – Apr 2021",
    place: "Paris",
    summary: "Pre-sales, on the technical side of the account team. Hundreds of customers, first enterprise, then digital natives, then startups.",
    points: [
      "Understood each customer's business problem, designed the AWS architecture for it, and helped their teams adopt it.",
      "Architecture reviews for reliability, security and cost. Presented the architectures to C-level leaders and supported the deals to closing.",
      "Monthly office hours with early-stage startups: 30 minutes each to find the real problem and propose a solution.",
      "Member of the AWS Serverless and Edge specialty groups.",
    ],
  },
  {
    org: "Euler Hermes",
    role: "Freelance Tech Lead, AWS Solution Architect",
    period: "Feb 2018 – Jun 2018",
    place: "Paris",
    summary: "New internal APIs, serverless on AWS. Half tech lead in the API team, half in the architecture team.",
    points: [
      "Defined the API architecture with AWS Lambda, API Gateway and Kinesis, following Euler Hermes' own standards.",
      "Led the team building it.",
      "In the architecture team: AWS best practices for the whole company.",
    ],
  },
  {
    org: "La Centrale (CarBoat Media)",
    role: "Senior Software Engineer",
    period: "Dec 2012 – Jul 2017",
    place: "Paris",
    summary: "Java backend engineer at first, then the migration to AWS.",
    points: [
      "Java and Spring Boot backend services.",
      "Designed and built the migration to AWS with Lambda, API Gateway and CloudFront.",
      "Optimized SQL queries on Oracle.",
      "Led the migration to a new version of the platform: optimized the code, isolated components, upgraded the stack.",
    ],
  },
  {
    org: "Consultant",
    role: "Backend engineer, then technical lead",
    label: "Consultant: backend engineer, then technical lead",
    period: "Jul 2003 – Dec 2012",
    place: "Paris",
    summary: "Client missions in banking and insurance: Société Générale CIB, BNP Paribas CIB, BNP Paribas Cardif, BNP Paribas retail. Also Karavel and Française des Jeux.",
    points: [
      "Java/J2EE backend services on Oracle.",
      "Optimized SQL queries and batch jobs on Oracle, from hours to minutes.",
      "Grid computing for heavy calculations in investment banking.",
    ],
  },
];

export const SIDE_PROJECTS = [
  {
    name: "StreetLens",
    url: "https://streetlensapp.com",
    role: "Co-founder",
    period: "Live since April 2026",
    text: "GPS audio guides on the App Store, 6 cities, 8 languages. You search in plain words and it builds a walking tour on the fly. Behind it, a multi-step LLM pipeline researches sources, extracts the facts, writes the narration from them, checks every line against those facts so what people hear is accurate, then turns it into audio with text-to-speech. Pipeline and API built with my co-founder. On the iOS app I pushed hard on the design and the UX. I care about beautiful apps, and we went over it many times until it felt right.",
  },
  {
    name: "Back From My Trip",
    url: "https://www.backfrommytrip.com",
    role: "Co-founder",
    period: "Live since August 2026",
    text: "Trip reports with one verdict: would I go back? LLMs work in the background. They moderate reports, extract places and check photos. When they are not sure, a person decides. They never write a word of the story.",
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
  { area: "Product", items: "Prototyping, UX and design, from the first sketch to the finished product" },
];

export const CERTIFICATIONS = [
  "AWS Certified Solutions Architect – Professional",
  "AWS Certified Security – Specialty",
  "AWS Certified AI Practitioner",
];

export const LANGUAGES = "French (bilingual), English (fluent), Romanian (native), German (basic)";

export const EDUCATION = {
  degree: "Engineer's Degree (Diplôme d'Ingénieur), Computer Science and Automation",
  school: "Dunărea de Jos University of Galați, 1998 – 2003",
};

