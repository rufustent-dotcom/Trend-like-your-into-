import { StrategicPattern, StrategicSignal, ActiveProject, VaultNode, IntelligenceVault, ProducerProfile, Sale } from "./types";

export const initialPatterns: StrategicPattern[] = [
  {
    id: "pat-1",
    title: "AI Compresses Time",
    strength: "8/8",
    impact: "High",
    observation: "Tasks that previously required multiple hours now require minutes to execute with modern contextual AI intelligence.",
    implication: "Iterative execution and delivery velocity become a team's primary competitive advantage over static optimization.",
    opportunity: "Disproportionately empower modular, generalist developers and small teams with systemic automation, making execution loops near-instant.",
    connectedSignalIds: ["sig-1", "sig-2", "sig-3", "sig-4", "sig-5", "sig-6", "sig-7", "sig-8"]
  },
  {
    id: "pat-2",
    title: "Automation Replaces Repetition",
    strength: "7/8",
    impact: "High",
    observation: "Highly repetitive cognitive labor shifts continuously from direct human execution to supervisory agentic orchestrators.",
    implication: "Pure operational speed and cognitive endurance shift. Human inputs transfer to debugging, system audit, and design constraints.",
    opportunity: "Construct hyper-custom strategic capture layers that process raw inputs automatically into multi-layered records.",
    connectedSignalIds: ["sig-1", "sig-2", "sig-3", "sig-5", "sig-6", "sig-7", "sig-8"]
  },
  {
    id: "pat-3",
    title: "Systems Scale Better Than Manual Effort",
    strength: "7/8",
    impact: "High",
    observation: "Manual custom interventions degrade in consistency and raise operational costs exponentially relative to systemic scale.",
    implication: "Design a foundational asset structure once, validate constraints, and benefit infinitely. Avoid point-in-time handcrafting.",
    opportunity: "Invest strictly in robust, structured schemas (e.g. strict JSON configurations, templated Obsidian environments) that avoid human entropy.",
    connectedSignalIds: ["sig-2", "sig-4", "sig-5", "sig-6", "sig-7", "sig-8", "sig-1"]
  },
  {
    id: "pat-4",
    title: "Information Becomes Infrastructure",
    strength: "6/8",
    impact: "High",
    observation: "Organized, highly-linked information compounds in value and usability, while siloed unorganized notes degrade into static clutter.",
    implication: "A dynamic knowledge system is not a visual scrapbook; it is an executive workspace and operating system.",
    opportunity: "Synthesize research files directly into connected active strategic graphs using structured relationships.",
    connectedSignalIds: ["sig-1", "sig-3", "sig-5", "sig-6", "sig-7", "sig-4"]
  },
  {
    id: "pat-5",
    title: "Leverage Multiplies Output",
    strength: "6/8",
    impact: "High",
    observation: "Outscaled outcomes are driven by asymmetrical high-leverage points rather than uniform incremental human labor.",
    implication: "Small teams can bypass extensive layers of operational overhead by integrating serverless micro-backends.",
    opportunity: "Focus heavily on software vehicles, dynamic pipelines, and system configurations with compounding advantage.",
    connectedSignalIds: ["sig-2", "sig-3", "sig-5", "sig-6", "sig-7", "sig-8"]
  },
  {
    id: "pat-6",
    title: "Clarity Creates Momentum",
    strength: "6/8",
    impact: "Medium",
    observation: "Cognitive hesitation and friction stem directly from fragmented directories, noisy environments, and vague goals.",
    implication: "Simpler, higher-contrast workspace interfaces translate to faster delivery cycles and improved mental health.",
    opportunity: "Strip away visual clutter, redundant sidebar tabs, and tech-larping logs in favor of highly focused clinical screens.",
    connectedSignalIds: ["sig-1", "sig-2", "sig-5", "sig-6", "sig-7", "sig-8"]
  },
  {
    id: "pat-7",
    title: "Adaptation Compounds Advantage",
    strength: "5/8",
    impact: "Medium",
    observation: "Static knowledge bases rapidly fossilize when market forces shifting at high velocity introduce fresh signals.",
    implication: "A successful strategy involves open feedback loops that continuously refine internal models.",
    opportunity: "Use edge AI translation layers to automatically ingest and categorize incoming trends, keeping the system dynamic.",
    connectedSignalIds: ["sig-3", "sig-4", "sig-5", "sig-6", "sig-8"]
  }
];

export const initialSignals: StrategicSignal[] = [
  {
    id: "sig-1",
    title: "AI Customer Service Expansion",
    impact: "High",
    stage: "Acceleration",
    description: "AI conversational agents replace standard tier-1 support operations universally across business units.",
    whyItMatters: "Support labor shifts directly away from live messaging queues towards strategic escalation workflows.",
    implication: "Customer service cost structures contract by 85%, freeing up executive attention for key integrations.",
    opportunity: "Build specialized middleware that links agent conversation models to back-office operational controls."
  },
  {
    id: "sig-2",
    title: "Enterprise Copilot Adoption",
    impact: "High",
    stage: "Acceleration",
    description: "Productivity-boosting coding assistants and co-pilots scale aggressively across mid-to-large institutions.",
    whyItMatters: "The cost per line of reliable software drops towards zero, emphasizing architecture and validation.",
    implication: "Generalist programmers who understand state management and architecture outperform legacy specialist silos.",
    opportunity: "Deploy full-stack interactive dashboards with native AI translation layers that bypass rigid old tools."
  },
  {
    id: "sig-3",
    title: "GPU & Infrastructure Investment",
    impact: "High",
    stage: "Acceleration",
    description: "Global capital investment in compute infrastructure and gigawatt-scale data centers explodes.",
    whyItMatters: "High demand is driving severe pricing pressures. System optimization is critical to control overhead.",
    implication: "Local lightweight architectures or V8 edge runtime optimization become prized competitive advantages.",
    opportunity: "Optimize real-time state systems using strict schemas to minimize expensive model token sizes."
  },
  {
    id: "sig-4",
    title: "Open-Source LLM Competition",
    impact: "High",
    stage: "Acceleration",
    description: "Open weights and customizable models improve significantly, matching frontier proprietary performance thresholds.",
    whyItMatters: "Bypasses vendor lock-in risk. High-tier intelligence becomes a commoditized public utility.",
    implication: "Value transfers completely away from foundation model access to proprietary state networks and custom workspaces.",
    opportunity: "Build offline-compatible semantic graphs that easily switch underlying language models."
  },
  {
    id: "sig-5",
    title: "AI Automation Platforms Scale",
    impact: "High",
    stage: "Consolidation",
    description: "End-to-end orchestration platforms and workflows dominate mid-market business administration.",
    whyItMatters: "Fragmented standalone tools are being aggressively consolidated by all-in-one workspaces.",
    implication: "Direct API connections outmuscle traditional user interfaces when carrying out manual operations.",
    opportunity: "Create full-stack automation pipelines that consolidate daily operational inputs into unified vaults."
  },
  {
    id: "sig-6",
    title: "AI Agent Frameworks Growth",
    impact: "High",
    stage: "Acceleration",
    description: "Multi-agent frameworks, task delegation systems, and strict communication syntaxes mature.",
    whyItMatters: "Shift from passive text boxes to active agent collectives that autonomously perform complex multi-step cycles.",
    implication: "Reliable agent systems depend entirely on deterministic constraints, state tracking, and clean API models.",
    opportunity: "Incorporate strict JSON schema validation pipelines (Vercel/OpenAI Edge style) in system-to-system integrations."
  },
  {
    id: "sig-7",
    title: "Enterprise AI Budget Expansion",
    impact: "High",
    stage: "Acceleration",
    description: "Institutional capital allocation transfers aggressively away from legacy cloud software to generative AI channels.",
    whyItMatters: "A historic re-routing of technology expenditure. Capital goes where immediate compression is demonstrated.",
    implication: "Traditional SaaS platforms that do not implement deep operational compression are purged from systems.",
    opportunity: "Present clear financial impact metrics (time saved, operational velocity) directly on current workspace dashboards."
  },
  {
    id: "sig-8",
    title: "Regulation & Governance Increase",
    impact: "Medium",
    stage: "Acceleration",
    description: "National states expand safety checks, sovereign compute mandates, and strict algorithmic transparency models.",
    whyItMatters: "Adds regulatory weight. Private, zero-telemetry LocalStorage and server-side secret architectures are essential.",
    implication: "Compliance audits force software to hide key tokens from client bundles and perform logic strictly behind proxies.",
    opportunity: "Strictly isolate sensitive third-party API configurations behind secure, server-side API proxy environments."
  }
];

export const initialProjects: ActiveProject[] = [
  {
    id: "proj-1",
    title: "Project Intrepid",
    status: "Active",
    objective: "Build a highly responsive strategic intelligence system capable of capturing, grouping, and operationalizing market signals.",
    market: "AI-assisted strategic operations and modular developer workspace infrastructures.",
    aiUsage: "Continuous research synthesis, high-impact pattern matching, semantic linking, and dynamic workspace generation.",
    revenuePotential: "$15K - $40K Monthly recurring through high-leverage consulting, developer licenses, and premium configurations.",
    nextStep: "Fully connect the visual Patterns <=> Signals graph back to active workspace nodes to enable real-time state changes.",
    lastUpdated: "2026-05-23"
  },
  {
    id: "proj-2",
    title: "Jamf Now Enterprise Mac Deployments",
    status: "Active",
    objective: "Implement a standardized, highly reliable system Blueprint to upload and deploy verified enterprise Mac packages (.pkg).",
    market: "Managed service providers, scale-ups, and corporate IT operations.",
    aiUsage: "Script generation, permission audits, package configuration checks, and standard operating procedures (SOP).",
    revenuePotential: "High operational savings by compressing device onboarding from 3 days down to 22 minutes.",
    nextStep: "Audit distribution package signatures and set up custom uninstaller files to prevent storage bloat.",
    lastUpdated: "2026-05-23"
  },
  {
    id: "proj-3",
    title: "Autonomous Arbitrage Scanners",
    status: "Future",
    objective: "Construct edge scanners that monitor API price streams and trigger immediate execution when margins exceed limits.",
    market: "FinTech, algorithmic arbitrage pipelines, and decentralized systems.",
    aiUsage: "Risk evaluations, high-frequency signal checks, and automated decision-making.",
    revenuePotential: "High delta-neutral margin capture.",
    nextStep: "Isolate execution logic on lightweight Node V8 isolates to maintain optimal speed and connection strength.",
    lastUpdated: "2026-05-21"
  }
];

export const initialVaultNodes: Record<string, VaultNode> = {
  // Directories
  "dir-root": { id: "dir-root", name: "Vault", path: "/", type: "directory", category: "Root", children: ["dir-inbox", "dir-projects", "dir-research", "dir-ai", "dir-content", "dir-finance", "dir-learning", "dir-archive", "dir-system", "file-thesis", "file-patterns", "file-systems", "file-decision", "file-breathing"] },
  "dir-inbox": { id: "dir-inbox", name: "00_Inbox", path: "/00_Inbox", type: "directory", category: "Inbox", children: ["file-jamf-now", "file-tiktok-inspo", "file-arbitrage-raw"] },
  "dir-projects": { id: "dir-projects", name: "01_Projects", path: "/01_Projects", type: "directory", category: "Projects", children: ["file-intrepid", "file-workspace-obsidian", "file-customer-agent"] },
  "dir-research": { id: "dir-research", name: "02_Research", path: "/02_Research", type: "directory", category: "Research", children: ["file-labor-restructuring", "file-psych-attention", "file-system-dynamics"] },
  "dir-ai": { id: "dir-ai", name: "03_AI", path: "/03_AI", type: "directory", category: "AI", children: ["file-prompts-master", "file-agent-anatomy", "file-lrm-benchmark"] },
  "dir-content": { id: "dir-content", name: "04_Content", path: "/04_Content", type: "directory", category: "Content", children: ["file-script-lever", "file-post-drafts"] },
  "dir-finance": { id: "dir-finance", name: "05_Finance", path: "/05_Finance", type: "directory", category: "Finance", children: ["file-finance-thesis", "file-investments-tracker"] },
  "dir-learning": { id: "dir-learning", name: "06_Learning", path: "/06_Learning", type: "directory", category: "Learning", children: ["file-learning-coding", "file-learning-systems"] },
  "dir-archive": { id: "dir-archive", name: "07_Archive", path: "/07_Archive", type: "directory", category: "Archive", children: ["file-archive-outdated"] },
  "dir-system": { id: "dir-system", name: "99_System", path: "/99_System", type: "directory", category: "System", children: ["file-sys-templates", "file-sys-configs"] },

  // Inbox Files
  "file-jamf-now": {
    id: "file-jamf-now",
    name: "Deploying Mac Packages with Jamf Now.md",
    path: "/00_Inbox/Deploying Mac Packages with Jamf Now.md",
    type: "file",
    category: "Inbox",
    content: `# Deploying Mac Packages with Jamf Now
Based on official Jamf Now documentation, here is a professional guide on how to upload and deploy custom Mac packages (.pkg files) to your managed devices.

## 1. Core Requirements
Before attempting to upload a package, ensure it meets the following technical specifications:
* **Signed and Built**: Packages must be digitally signed and built as a **distribution package**.
* **Size Limit**: The maximum file size for any single package is **20 GB**.
* **Support Contact**: If you encounter issues, email support at support@jamfnow.com.

## 2. Step-by-Step Upload Process
Follow these steps to add your custom application to the Jamf Now portal:
1. Log in to your Jamf Now account.
2. Navigate to the **Apps** section in the left sidebar.
3. Click the **Add an App** button on the top right.
4. Select the **Upload Your App** option.
5. Drag and drop your **.pkg** file onto the upload area, or click **Browse** to select it.

Once the upload is complete, the application will appear in your Apps list and will be ready for deployment to devices via a **Blueprint**.

## 3. Important Considerations
* **Uninstallation**: Jamf Now does *not* support automatic uninstallation of Mac packages. To remove an app, use the developer's specific uninstaller or deploy that separate package script.
* **Developer Accounts**: For advanced signing, you may require an Apple Developer Program account.

## Summary Matrix
| Action | Supported | Note |
|---|---|---|
| Upload .pkg | Yes | Must be a distribution package |
| Deploy via Blueprint | Yes | Standard deployment method |
| Automatic Uninstall | No | Requires manual uninstaller package |
| Max File Size | 20 GB | Large enough for most enterprise apps |`
  },
  "file-tiktok-inspo": {
    id: "file-tiktok-inspo",
    name: "TikTok AI Campaign.md",
    path: "/00_Inbox/TikTok AI Campaign.md",
    type: "file",
    category: "Inbox",
    content: `# TikTok AI Campaign & Visual Asset Strategy
Captured from video assets @joseph.spivey2 showing top tier execution visual motifs:

## Aesthetic Themes
- High-contrast clinical tech-minimalism
- Slate colors (#0c0c0e) and neon turquoise accents (#00f5d4)
- Elegant workspace corridors, representing hyper-structure walking loops.
- Core focus on structured execution rather than messy desks.

## Opportunities
Develop visually striking short-form content that maps patterns <=> signals in real time to capture developer mindshare.`
  },
  "file-arbitrage-raw": {
    id: "file-arbitrage-raw",
    name: "Market Arbitrage Signals.md",
    path: "/00_Inbox/Market Arbitrage Signals.md",
    type: "file",
    category: "Inbox",
    content: `# Market Arbitrage Signals
Raw signals on regional price misalignments in cloud compute instances:
- US-East vs EU-West spot instance rates show a temporary spread of 23% during peak hours.
- Automatic routing systems can reduce compute expenditure dynamically.
- Integration opportunity: Build automated script to redeploy servers asynchronously.`
  },

  // Projects Files
  "file-intrepid": {
    id: "file-intrepid",
    name: "Project Intrepid.md",
    path: "/01_Projects/Project Intrepid.md",
    type: "file",
    category: "Projects",
    content: `# PROJECT INTREPID

## Purpose
Build an adaptive intelligence system capable of organizing signals, patterns, strategic opportunities, and operational knowledge into one unified canvas.

## Core Principles
* **Structure over chaos**: Keep folders clean and schemas strict.
* **Adaptation over rigidity**: Continually integrate new market signals.
* **Clarity over noise**: Keep UI clinical, highly focused, and actionable.
* **Execution over accumulation**: Strategic research is useless without actionable outputs.

## Objectives
- Increase decision velocity by 300%.
- Track emerging high-impact patterns automatically of market leaders.
- Keep a real-time ledger of strategic investments and tasks.`
  },
  "file-workspace-obsidian": {
    id: "file-workspace-obsidian",
    name: "AI Strategic Intelligence Vault.md",
    path: "/01_Projects/AI Strategic Intelligence Vault.md",
    type: "file",
    category: "Projects",
    content: `# AI Strategic Intelligence Vault
Active workspace targeting high-leverage execution.

## Objective
Implement a multi-tier connected structure mapping signals on the left to core strategic principles on the right.

## System Metrics
- Complete coverage of top 8 global signals.
- Automatic synthesis using Gemini backend API routes.
- Fully localized fallback storage for absolute security/offline operations.`
  },
  "file-customer-agent": {
    id: "file-customer-agent",
    name: "SaaS support automation specs.md",
    path: "/01_Projects/SaaS support automation specs.md",
    type: "file",
    category: "Projects",
    content: `# SaaS Support Automation Specifications
Translates **Signal: AI Customer Service Expansion** into local delivery.

## Product Features
1. Multi-tenant support queues parsed directly by LLM.
2. Escalation hooks configured with strict triggers.
3. Unified visual status matrix showing live queue stats.`
  },

  // Research Files
  "file-labor-restructuring": {
    id: "file-labor-restructuring",
    name: "AI Restructuring of Labor.md",
    path: "/02_Research/AI Restructuring of Labor.md",
    type: "file",
    category: "Research",
    content: `# AI Restructuring of Labor
## Primary Observation
Traditional cognitive labor structures (writing copies, basic bug isolation, customer service queues) are collapsing into single-prompt automated executions.

## Strategic Position
Position downstream of these automations as a **System Architect**. Rather than writing individual components, specialize on connected pipelines and strict configuration rules.`
  },
  "file-psych-attention": {
    id: "file-psych-attention",
    name: "Psychology of Attention.md",
    path: "/02_Research/Psychology of Attention.md",
    type: "file",
    category: "Research",
    content: `# Psychology of Attention in Workspace design
## Principles
- Visual clutter (e.g. 50 folders, excessive nested tagging, custom neon buttons everywhere) induces decision paralyzing fatigue.
- Deep focus is enabled strictly by **clinical off-whites**, **deep charcoal grays**, clear typography and generous white spaces.`
  },
  "file-system-dynamics": {
    id: "file-system-dynamics",
    name: "Systems Dynamics & Scaling.md",
    path: "/02_Research/Systems Dynamics & Scaling.md",
    type: "file",
    category: "Research",
    content: `# Systems Dynamics & Scaling
## Thesis
Systems scale linearly when custom logic is removed. Build standard interfaces with strict validation boundaries.`
  },

  // AI Files
  "file-prompts-master": {
    id: "file-prompts-master",
    name: "Prompts Collection.md",
    path: "/03_AI/Prompts Collection.md",
    type: "file",
    category: "AI",
    content: `# Prompts Master Collection
- **Structured Synthesis Prompt**: Used for Edge Routes configuration outputting JSON format.
- **Strategic Advisory Prompt**: Used to guide multi-tier project architectures with strict criteria.`
  },
  "file-agent-anatomy": {
    id: "file-agent-anatomy",
    name: "Agent Architectures.md",
    path: "/03_AI/Agent Architectures.md",
    type: "file",
    category: "AI",
    content: `# Agent Architectures
- Orchestrator/Workers pattern reduces agent drift.
- Define explicit validation boundaries at each transition, ensuring accurate state flows.`
  },
  "file-lrm-benchmark": {
    id: "file-lrm-benchmark",
    name: "Large Reasoning Models.md",
    path: "/03_AI/Large Reasoning Models.md",
    type: "file",
    category: "AI",
    content: `# Large Reasoning Models (LRMs) Study
- LRMs demonstrate high latency but exceptionally high adherence to structured constraints.
- Always use server-side proxies to prevent client-side execution timeouts on isolates.`
  },

  // Content Files
  "file-script-lever": {
    id: "file-script-lever",
    name: "Video Scripts - Automation Lever.md",
    path: "/04_Content/Video Scripts - Automation Lever.md",
    type: "file",
    category: "Content",
    content: `# Video Script: The Automation Lever
- **Aesthetic**: Minimalist workspace background, clean slate.
- **Hook**: "Most developers work 10 hours to build what a unified system produces in 12 seconds."
- **Core message**: Shift from typing to architecting. Demonstrate dynamic pattern signal maps.`
  },
  "file-post-drafts": {
    id: "file-post-drafts",
    name: "Social Media Posts Drafts.md",
    path: "/04_Content/Social Media Posts Drafts.md",
    type: "file",
    category: "Content",
    content: `# Social Post Drafts
- "Value doesn't come from stored knowledge anymore; it comes from structured intelligence."`
  },

  // Finance Files
  "file-finance-thesis": {
    id: "file-finance-thesis",
    name: "Investments Thesis.md",
    path: "/05_Finance/Investments Thesis.md",
    type: "file",
    category: "Finance",
    content: `# Financial Strategy & Capital Flow
## Target Sector allocation
- 40% Frontier AI Infrastructure & Computing Units
- 30% Specialized N8N & Automation Pipelines
- 30% Hard, sovereign, non-inflated assets`
  },
  "file-investments-tracker": {
    id: "file-investments-tracker",
    name: "Active Investments Ledger.md",
    path: "/05_Finance/Active Investments Ledger.md",
    type: "file",
    category: "Finance",
    content: `# Active Investments Ledger
- Cloud GPU Node Leasing: Active (ROI: 18%)
- Automation Agency: Active (Growth: 24% MoM)`
  },

  // Learning Files
  "file-learning-coding": {
    id: "file-learning-coding",
    name: "Modern Coding Trends.md",
    path: "/06_Learning/Modern Coding Trends.md",
    type: "file",
    category: "Learning",
    content: `# Modern Coding Trends
- TypeScript type-stripping support in native environments.
- High speed systems built using Vite + React 19 + Tailwind v4.`
  },
  "file-learning-systems": {
    id: "file-learning-systems",
    name: "Systems Thinking Deep Dive.md",
    path: "/06_Learning/Systems Thinking Deep Dive.md",
    type: "file",
    category: "Learning",
    content: `# Systems Thinking Deep Dive
- Understanding feedback loops, systemic delay and dynamic leverage points.`
  },

  // Archive Files
  "file-archive-outdated": {
    id: "file-archive-outdated",
    name: "Outdated Drafts 2024.md",
    path: "/07_Archive/Outdated Drafts 2024.md",
    type: "file",
    category: "Archive",
    content: `# Archived Strategy Ledger 2024
Outdated plans before real-time agent models surfaced. Left in storage for trend audits.`
  },

  // System Files
  "file-sys-templates": {
    id: "file-sys-templates",
    name: "Markdown Templates.md",
    path: "/99_System/Markdown Templates.md",
    type: "file",
    category: "System",
    content: `# Markdown Template: Signal Update
Use this format for recording fresh strategic signals:
\`\`\`md
# SIGNAL: [NAME]
- Stage: [Exploration | Acceleration | Consolidation]
- Impact: [High | Medium | Low]
- Why it matters: [Text]
- Opportunity: [Text]
\`\`\`
`
  },
  "file-sys-configs": {
    id: "file-sys-configs",
    name: "Dashboard Configuration.json",
    path: "/99_System/Dashboard Configuration.json",
    type: "file",
    category: "System",
    content: `# Dashboard Configuration
{
  "theme": "clinical-charcoal",
  "defaultView": "patterns-map",
  "allowCloudSync": false
}`
  },

  // Core Files (Root)
  "file-thesis": {
    id: "file-thesis",
    name: "CORE_THESIS.md",
    path: "/CORE_THESIS.md",
    type: "file",
    category: "Root",
    content: `# CORE THESIS - STRATEGIC DIRECTIVE

## Primary Thesis
AI will restructure knowledge work, economic leverage, and organizational control systems faster than traditional institutions can adapt.

## Supporting Assumptions
1. AI capabilities improve exponentially faster than regulatory guidelines.
2. Cognitive labor is vastly easier to automate at zero raw unit cost than physical labor.
3. Organizations resist structural shifts aggressively until financial pressure becomes unavoidable.
4. Individuals using AI systems strategically achieve disproportionate output over legacy developer silos.
5. Structured knowledge, automation, and system integration are the core infrastructure assets of 2026.

## Major Implications
- Traditional human-intensive programming compresses into clinical architecture oversight.
- Operational delay collapses, shifting value to rapid, verified execution.
- High-contrast clinical intelligence dashboards become mandatory command centers.`
  },
  "file-patterns": {
    id: "file-patterns",
    name: "CORE_PATTERNS.md",
    path: "/CORE_PATTERNS.md",
    type: "file",
    category: "Root",
    content: `# CORE PATTERNS SPECIFICATION

1. **Automation Reduces Repetition**: Focus strictly on repeating bottlenecks and scale modular orchestrations.
2. **AI Compresses Time**: Execution speed is absolute. Speed is momentum; scale happens downstream.
3. **Information is Infrastructure**: Notes should not be dead text files; they must represent connected executive data pipelines.
4. **Systems Scale Better Than Individuals**: Scale by writing strict state rules rather than relying on inconsistent human inputs.`
  },
  "file-systems": {
    id: "file-systems",
    name: "SYSTEMS.md",
    path: "/SYSTEMS.md",
    type: "file",
    category: "Root",
    content: `# WORKSPACE SYSTEMS TOPOLOGY

- **Knowledge Intake**: Raw inputs enter *00_Inbox* first. Files are preserved as clean markdown drafts.
- **Synthesis Pipeline**: Raw inputs undergo Edge AI analysis to link signals directly to foundational patterns.
- **Decision Matrix**: All emerging active projects undergo evaluation against strict filters.
- **Archive Routine**: Unused or stale records are immediately filed to *07_Archive* weekly to keep active channels clean.`
  },
  "file-decision": {
    id: "file-decision",
    name: "DECISION_FILTER.md",
    path: "/DECISION_FILTER.md",
    type: "file",
    category: "Root",
    content: `# STRATEGIC FILTER CRITERIA
Before dedicating resources to any emerging project, evaluate strictly:
1. Does it create systemic capital leverage?
2. Does it automate repeating operational bottlenecks?
3. Does it scale without a linear increase in manual hours?
4. Does it align directly with our primary AI Restructuring Thesis?
5. Does it produce reusable software, template, or framework assets?`
  },
  "file-breathing": {
    id: "file-breathing",
    name: "BREATHING_SPACE.md",
    path: "/BREATHING_SPACE.md",
    type: "file",
    category: "Root",
    content: `# BREATHING SPACE SECTION
Continuous intake without structure generates cognitive overload and choice paralyzing fragmentation.

## Reduction Rules
- Pause informational intake cycles for 48 hours every fortnight.
- Purge duplicate entries and overextended abstractions.
- Isolate the single most valuable action item each day.`
  }
};

export const initialCoreThesis = {
  primaryThesis: "AI will restructure knowledge work, economic leverage, and organizational control systems faster than traditional institutions can adapt.",
  supportingAssumptions: [
    "AI capabilities expand significantly faster than regulatory frameworks can update.",
    "Repetitive cognitive tasks can be automated at near-zero incremental unit cost.",
    "Traditional enterprise software is rapidly consolidated by focused, serverless platforms.",
    "Individuals utilizing structured workspace systems gain massive outsized leverage."
  ],
  majorImplications: [
    "Software cost structure drops to zero, emphasizing solid architecture, schemas, and design pairing.",
    "Small teams run full-scale systems serving millions of users with negligible operations overhead.",
    "Siloed specialists lose strategic leverage to broad Generalists who orchestrate processes."
  ],
  longTermPredictions: [
    "90% of current back-office administration is operated by custom multi-agent lattices.",
    "Corporate relevance depends entirely on system optimization, decision speed, and clean state data."
  ],
  opportunityAreas: [
    "Workspace Systems & Custom Intelligence Command Dashboards",
    "Serverless micro-backends and direct API orchestration streams",
    "Strict schema validation tools that bypass runtime drift"
  ]
};

export const initialDecisionFilter = [
  "Does it generate immediate system-level leverage?",
  "Does it scale without a linear increase in human labor?",
  "Does it directly target and compress an operational bottleneck?",
  "Does it align with the core AI-restructuring thesis?",
  "Does it build a reusable long-term structural asset?"
];

export const initialDailyReviewLogs = [
  {
    date: "May 23, 2026",
    inputs: [
      "Reviewed TikTok video assets on clinic modern workspace corridor design dynamics.",
      "Audited Jamf Now .pkg upload specifications for Distribution Packages."
    ],
    signals: [
      "AI Automation platforms are scaling rapidly, outcompeting point solution SaaS models."
    ],
    patterns: [
      "AI Compresses Time - Execution speed validated as our absolute primary advantage."
    ],
    actions: [
      "Created dynamic Strategy & Patterns Dashboard.",
      "Fully structured the Obsidian intelligence folders ledger."
    ]
  },
  {
    date: "May 22, 2026",
    inputs: [
      "Read research signals regarding massive corporate capital redirects to custom LLM pipelines."
    ],
    signals: [
      "Enterprise AI budgets expanding intensely into local agent infrastructures."
    ],
    patterns: [
      "Information Becomes Infrastructure - Refined Obsidian vault hierarchy."
    ],
    actions: [
      "Drafted active investment blueprint parameters."
    ]
  }
];

export const initialProducers: ProducerProfile[] = [
  {
    id: "prod-1",
    name: "Joseph Spivey",
    genre: "Music & Digital Media Production",
    experienceYears: 12,
    bio: "Pioneering creative director and audio engineer specializing in high-contrast visual rhythm, clinical tech-minimalist sound structures, and modern social video soundtracks.",
    showcase: [
      {
        id: "show-1-1",
        title: "Corridor Dreams (Synthwave Track)",
        type: "Song",
        url: "https://soundcloud.com/josephspivey/corridor-dreams",
        description: "An elegant, clinical synth atmosphere paired with deep sub-bass and crisp high-hat loops, designed as the ultimate soundtrack for focused walking loops."
      },
      {
        id: "show-1-2",
        title: "TikTok Corridor Walks (Visual Loop Campaign)",
        type: "Film",
        url: "https://tiktok.com/@joseph.spivey2/video/1",
        description: "A highly acclaimed viral campaign utilizing clinical tech aesthetics, walking loops, and custom AI-synthesized backing tracks."
      }
    ],
    reviews: [
      {
        id: "rev-1-1",
        reviewerName: "Alex Mercer",
        rating: 5,
        comment: "Excellent high-contrast beats. Joseph elevated our promotional campaign with an absolutely outstanding audio template.",
        projectName: "Synthwave Campaign Promo",
        date: "2026-05-15"
      },
      {
        id: "rev-1-2",
        reviewerName: "Sarah Connor",
        rating: 4,
        comment: "Very professional sound designer. Easy to work with and responded well to edits.",
        projectName: "Social Video Teasers",
        date: "2026-05-28"
      }
    ],
    availability: "Available"
  },
  {
    id: "prod-2",
    name: "Elena Rostova",
    genre: "Cinematic Sound Design & Game Audio",
    experienceYears: 8,
    bio: "Focuses on procedural audio scaling, organic field recording, and cinematic orchestration for immersive virtual reality environments and modular games.",
    showcase: [
      {
        id: "show-2-1",
        title: "Shattered Grid OST",
        type: "Song",
        url: "https://bandcamp.com/elena-rostova/shattered-grid",
        description: "Interactive ambient soundscape that adapts dynamically to real-time rendering state parameters."
      },
      {
        id: "show-2-2",
        title: "Real-time Spatial Ambience (Unity Project)",
        type: "Project",
        url: "https://github.com/elena-audio/spatial-unity",
        description: "An open-source asset pack mapping procedural high-frequency signals directly to 3D virtual coordinates."
      }
    ],
    reviews: [
      {
        id: "rev-2-1",
        reviewerName: "Hideo Kojima",
        rating: 5,
        comment: "Elena's spatial soundscapes are highly immersive. She possesses a sublime understanding of 3D acoustics.",
        projectName: "Shattered Grid Audio",
        date: "2026-04-10"
      }
    ],
    availability: "Available"
  },
  {
    id: "prod-3",
    name: "Marcus Chen",
    genre: "Interactive Film & Real-time Visuals",
    experienceYears: 15,
    bio: "Award-winning filmmaker leveraging real-time 3D rendering engines and edge generative AI tools to compress video production timelines and create hyper-realistic visuals.",
    showcase: [
      {
        id: "show-3-1",
        title: "The Automation Paradox (Sci-Fi Short Film)",
        type: "Film",
        url: "https://youtube.com/marcus-chen/automation-paradox",
        description: "A high-concept 5-minute sci-fi piece analyzing the human cost of rapid technological shifts, rendered entirely in real-time."
      },
      {
        id: "show-3-2",
        title: "Real-time Unreal Scene Forge",
        type: "Project",
        url: "https://github.com/marcus-visuals/scene-forge",
        description: "A direct workspace translation library syncing live text directions to high-tier Unreal Engine scene shaders."
      }
    ],
    reviews: [
      {
        id: "rev-3-1",
        reviewerName: "Christopher Nolan",
        rating: 5,
        comment: "Outstanding Unreal Engine rendering pipeline control. Saved us weeks of post-production.",
        projectName: "The Automation Paradox Production",
        date: "2026-03-22"
      }
    ],
    availability: "Available"
  }
];

export const initialSales: Sale[] = [
  { id: "sale-1", amount: 5000, status: "Closed", representative: "Alice", region: "North", date: "2026-06-01" },
  { id: "sale-2", amount: 7500, status: "Closed", representative: "Bob", region: "East", date: "2026-06-05" },
  { id: "sale-3", amount: 2000, status: "Open", representative: "Alice", region: "West", date: "2026-06-10" },
  { id: "sale-4", amount: 10000, status: "Closed", representative: "Charlie", region: "South", date: "2026-06-15" },
];

export const initialVaultState: IntelligenceVault = {
  nodes: initialVaultNodes,
  patterns: initialPatterns,
  signals: initialSignals,
  projects: initialProjects,
  producers: initialProducers,
  sales: initialSales,
  coreThesis: initialCoreThesis,
  decisionFilter: initialDecisionFilter,
  dailyReviewLogs: initialDailyReviewLogs
};
