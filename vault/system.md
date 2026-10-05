# Apex Vault Agent — System Architecture & Collaboration Rules

## 1. Operating Principles

1. **Momentum Over Recursion**
   Simpler systems generate sustainable velocity; clarity scales better than complexity. Avoid multi-turn recursive loops where a deterministic linear pipeline produces verifiable results.

2. **Task Execution Over Q&A**
   Interface evolution moves from passive conversational search to deterministic, audit-ready operational labor. External agents invoke deterministic tools rather than unbounded chat prompts.

3. **Upstream Settlement**
   Zero compute executes without valid pre-flight authentication and active ledger verification. All transactions must be authorized, metered, and settled before compute allocation.

---

## 2. System Architecture

```
apex-vault-agent/
├── client/                     # React + Vite Analytics Dashboard
│   ├── public/
│   │   └── .well-known/
│   │       └── agent.json      # A2A agent discovery manifest
│   └── src/
│       ├── App.tsx             # Telemetry & analysis interface
│       └── main.tsx
├── server/                     # Interoperability & Monetization Gateway
│   └── src/
│       ├── gatekeeper.ts       # Upstream pre-execution metering hook
│       ├── mcp.ts              # Model Context Protocol (MCP) tool server
│       └── index.ts            # Server entry point
├── vault/                      # Synthesized Research & Decision Vault
│   ├── system.md               # Production architecture & collaboration rules
│   ├── decisions.md            # Immutable decision & trade-off logs
│   ├── notes.md                # Raw thought intake & momentum buffers
│   ├── breathing_space.md      # Noise reduction and complexity control
│   └── entities/               # Entity profile links
│       └── OpenAI.md           # Entity mapping & thesis signals
└── package.json                # Monorepo workspace configuration
```

---

## 3. Communication Protocols

- **Agent-to-Agent (A2A) Discovery:** Hosted at `/.well-known/agent.json` conforming to machine-readable agent specification cards.
- **Model Context Protocol (MCP):** Server-Sent Events (SSE) stream at `/mcp/sse` and message bus at `/mcp/message`.
- **Pre-execution Gatekeeper:** Enforces ledger balance verification or active subscription check prior to triggering model execution.
- **Audit Logging:** Every execution emits structured logs with timestamp, skillId, cost, and balance status.
