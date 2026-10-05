# Apex Vault Agent — Architectural Decision Records (ADRs)

## ADR-001: Upstream Settlement Gatekeeper
* **Status:** Accepted
* **Context:** Pay-as-you-go AI agent workloads risk unbounded GPU inference abuse without pre-flight payment settlement.
* **Decision:** Implement strict pre-execution ledger checks in `gatekeeper.ts`. No task runs without either an active subscription or atomic reservation of credits ($0.05/invocation) with automatic refund on execution failure.
* **Consequences:** Eliminates bad-debt exposure and prevents DDoS compute drains.

---

## ADR-002: Model Context Protocol (MCP) Standard for Agent Interop
* **Status:** Accepted
* **Context:** External autonomous agents (Cursor, Windsurf, LangChain, Claude Desktop) need structured, standardized tool discovery.
* **Decision:** Implement an MCP Server over Server-Sent Events (SSE) exposing:
  1. `get_market_telemetry`
  2. `get_defensibility_matrix`
  3. `query_vault`
  4. `execute_agent_task`
* **Consequences:** Enables seamless integration with IDEs and multi-agent frameworks without custom SDK requirements.

---

## ADR-003: 2024–2030 Market Anchors
* **Status:** Accepted
* **Context:** Market analysis requires stable, verified analytical benchmarks for AI customer service & enterprise automation.
* **Decision:** Anchor telemetry to:
  * 2024 Baseline: **$12.06B**
  * 2030 Projection: **$47.82B**
  * CAGR (2024–2030): **25.8%**
  * TAM: **$140B** (Support operations & contact center labor)
  * SAM: **$47.82B** (Agentic software & inference pipelines)
  * SOM: **$4.5B** (High-volume enterprise wedges: SaaS, FinTech, Telecom)
* **Consequences:** Provides consistent financial models across dashboard visualizers and external agent telemetry queries.

---

## ADR-004: Decoupled Value Capture Matrix
* **Status:** Accepted
* **Context:** AI value is concentrating non-uniformly across the stack.
* **Decision:** Segment competitive landscape into 4 distinct defensibility layers:
  1. Compute & Silicon (Hardware margins, supply choke point)
  2. Cloud & Distribution (Recurring pipelines, infrastructure dominance)
  3. Frontier Models (API usage, research velocity vs. compute compression)
  4. Enterprise Workflows (Per-seat SaaS, deep workflow embedding & high switching costs)
* **Consequences:** Clarifies investment wedges and risk surfaces for enterprise deployments.
