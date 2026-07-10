// Source reference: https://docs.google.com/document/d/1LJ7jrk3BrQ_4wdoJ32TfMGYelLZ8jQJo/edit?usp=drivesdk

/**
 * Trending topics and market signals curated for the AI Strategic Intelligence Vault.
 * Each entry represents a high-signal area gaining momentum in the current AI landscape.
 */
export const trends = [
  {
    id: "trend-1",
    title: "Agentic AI Workflows",
    category: "AI Infrastructure",
    momentum: "High",
    description: "Multi-step autonomous agent pipelines that plan, execute, and self-correct without human intervention at each stage.",
    signals: ["sig-6"],
    lastUpdated: "2026-06-01"
  },
  {
    id: "trend-2",
    title: "On-Device AI Inference",
    category: "AI Infrastructure",
    momentum: "High",
    description: "Local model execution on consumer hardware reducing latency, cost, and dependency on cloud API providers.",
    signals: ["sig-4"],
    lastUpdated: "2026-06-01"
  },
  {
    id: "trend-3",
    title: "AI-Native SaaS Platforms",
    category: "Enterprise Software",
    momentum: "High",
    description: "Business software rebuilt from the ground up with AI as a core primitive rather than a bolt-on feature.",
    signals: ["sig-5", "sig-7"],
    lastUpdated: "2026-05-28"
  },
  {
    id: "trend-4",
    title: "Structured Output Standards",
    category: "Developer Tooling",
    momentum: "Medium",
    description: "JSON Schema and typed response formats becoming the default protocol for reliable AI-to-system communication.",
    signals: ["sig-6"],
    lastUpdated: "2026-05-25"
  },
  {
    id: "trend-5",
    title: "Sovereign Compute Mandates",
    category: "Regulation & Policy",
    momentum: "Medium",
    description: "Governments requiring data and AI workloads to remain within national borders, reshaping cloud infrastructure strategies.",
    signals: ["sig-8", "sig-3"],
    lastUpdated: "2026-05-20"
  },
  {
    id: "trend-6",
    title: "AI Music & Content Generation",
    category: "Creative Industry",
    momentum: "High",
    description: "Generative models reshaping music production, visual content, and audio post-production workflows at scale.",
    signals: ["sig-1", "sig-2"],
    lastUpdated: "2026-06-05"
  }
];

export default trends;
