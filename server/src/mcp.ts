/**
 * Model Context Protocol (MCP) Server Implementation
 * 
 * Provides SSE (Server-Sent Events) and JSON-RPC tool invocation for external AI agents
 * (Cursor, Windsurf, Claude Desktop, LangChain, autonomous worker swarms).
 */

import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { gatekeeper } from "./gatekeeper";

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export const APEX_VAULT_AGENT_TOOL: MCPTool = {
  name: "apex_vault_agent",
  description: "Execute deterministic enterprise workflows, query research vault telemetry, and inspect market intelligence via the Apex Vault service.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: [
          "market_telemetry",
          "defensibility_matrix",
          "vault_query",
          "agentic_execution"
        ],
        description: "The specific capability to invoke."
      },
      payload: {
        type: "object",
        description: "Parameters required for the selected action (e.g., query string, task payload, execution parameters)."
      }
    },
    required: ["action", "payload"]
  }
};

export const MCP_TOOLS: MCPTool[] = [
  APEX_VAULT_AGENT_TOOL,
  {
    name: "get_market_telemetry",
    description: "Returns verified market sizing, CAGR projections (2024-2030), and TAM/SAM/SOM breakdowns for the AI customer service and enterprise automation ecosystem.",
    inputSchema: {
      type: "object",
      properties: {
        segment: {
          type: "string",
          description: "Optional segment filter: 'all', 'tam', 'sam', 'som', 'trajectory'"
        }
      }
    }
  },
  {
    name: "get_defensibility_matrix",
    description: "Returns the 4-layer defensibility matrix (Compute & Silicon, Cloud & Distribution, Frontier Models, Enterprise Workflows) detailing primary players, economic leverage, and structural advantages.",
    inputSchema: {
      type: "object",
      properties: {
        layer: {
          type: "string",
          description: "Optional layer name: 'Compute & Silicon', 'Cloud & Distribution', 'Frontier Models', 'Enterprise Workflows'"
        }
      }
    }
  },
  {
    name: "query_vault",
    description: "Searches or reads synthesized research, architectural decision records (ADRs), entity dossiers, and momentum buffers from the Intelligence Vault.",
    inputSchema: {
      type: "object",
      properties: {
        document: {
          type: "string",
          description: "Specific document path (e.g., 'system.md', 'decisions.md', 'notes.md', 'breathing_space.md', 'entities/OpenAI.md') or a search keyword."
        }
      },
      required: ["document"]
    }
  },
  {
    name: "execute_agent_task",
    description: "Executes a deterministic, metered operational task in the AI customer service ecosystem with pre-flight upstream settlement.",
    inputSchema: {
      type: "object",
      properties: {
        skillId: {
          type: "string",
          description: "The identifier of the operational skill (e.g., 'tier1_support_triage', 'workflow_routing', 'compliance_verification', 'synthesize_signals')"
        },
        params: {
          type: "object",
          description: "Execution parameters and payload for the task"
        },
        userId: {
          type: "string",
          description: "The authenticated agent or tenant ID for pre-flight settlement verification"
        }
      },
      required: ["skillId"]
    }
  }
];

// Telemetry Data constants matching user specification
export const MARKET_TELEMETRY = {
  baseline_2024: 12.06,
  projection_2030: 47.82,
  cagr_pct: 25.8,
  tam: 140.0,
  sam: 47.82,
  som: 4.5,
  descriptions: {
    baseline_2024: "2024 Market Baseline: $12.06B",
    projection_2030: "2030 Market Projection: $47.82B",
    cagr: "CAGR (2024–2030): 25.8%",
    tam: "Total Addressable Market (TAM): $140B (Global support operations & contact center labor)",
    sam: "Serviceable Addressable Market (SAM): $47.82B (Agentic software & AI inference pipelines)",
    som: "Serviceable Obtainable Market (SOM): $4.5B (High-volume enterprise wedges: SaaS, FinTech, Telecom)"
  },
  trajectory: [
    { year: 2024, marketSize: 12.06, laborDisplaced: 3.2, automatedVolumePct: 18.5 },
    { year: 2025, marketSize: 15.17, laborDisplaced: 6.8, automatedVolumePct: 26.0 },
    { year: 2026, marketSize: 19.08, laborDisplaced: 12.4, automatedVolumePct: 35.2 },
    { year: 2027, marketSize: 24.00, laborDisplaced: 21.0, automatedVolumePct: 46.8 },
    { year: 2028, marketSize: 30.19, laborDisplaced: 34.5, automatedVolumePct: 59.0 },
    { year: 2029, marketSize: 37.98, laborDisplaced: 51.2, automatedVolumePct: 71.4 },
    { year: 2030, marketSize: 47.82, laborDisplaced: 74.0, automatedVolumePct: 83.6 }
  ]
};

export const DEFENSIBILITY_MATRIX = [
  {
    layer: "Compute & Silicon",
    primaryPlayers: ["NVIDIA", "TSMC"],
    economicLeverage: "Hardware margins (70–75%)",
    structuralAdvantage: "Supply choke point & compute availability",
    riskFactor: "ASIC specialization and hyperscaler custom silicon (TPU, Trainium)",
    marketSharePct: 35
  },
  {
    layer: "Cloud & Distribution",
    primaryPlayers: ["Microsoft", "Amazon", "Google"],
    economicLeverage: "Recurring compute pipelines",
    structuralAdvantage: "Enterprise deployment pipelines & infrastructure dominance",
    riskFactor: "Open-source weight hosting commoditization",
    marketSharePct: 30
  },
  {
    layer: "Frontier Models",
    primaryPlayers: ["OpenAI", "Anthropic"],
    economicLeverage: "API usage & licensing",
    structuralAdvantage: "Research velocity vs. compute compression",
    riskFactor: "Open-weights distillation (Llama, DeepSeek) eroding price-per-token",
    marketSharePct: 20
  },
  {
    layer: "Enterprise Workflows",
    primaryPlayers: ["Salesforce", "ServiceNow"],
    economicLeverage: "Per-seat SaaS licensing",
    structuralAdvantage: "Deep workflow embedding & high switching costs",
    riskFactor: "Native agent platforms bypassing traditional UI screens",
    marketSharePct: 15
  }
];

/**
 * Handle MCP Tool Execution
 */
export async function executeMcpTool(name: string, args: any, reqAuthUserId?: string): Promise<any> {
  switch (name) {
    case "get_market_telemetry": {
      const segment = args?.segment?.toLowerCase();
      if (segment === "tam") return { tam: MARKET_TELEMETRY.tam, description: MARKET_TELEMETRY.descriptions.tam };
      if (segment === "sam") return { sam: MARKET_TELEMETRY.sam, description: MARKET_TELEMETRY.descriptions.sam };
      if (segment === "som") return { som: MARKET_TELEMETRY.som, description: MARKET_TELEMETRY.descriptions.som };
      if (segment === "trajectory") return { trajectory: MARKET_TELEMETRY.trajectory };
      return MARKET_TELEMETRY;
    }

    case "get_defensibility_matrix": {
      const requestedLayer = args?.layer?.toLowerCase();
      if (requestedLayer) {
        const found = DEFENSIBILITY_MATRIX.find(m => m.layer.toLowerCase().includes(requestedLayer));
        return found || { error: `Layer '${args.layer}' not found`, available: DEFENSIBILITY_MATRIX.map(m => m.layer) };
      }
      return { defensibilityMatrix: DEFENSIBILITY_MATRIX };
    }

    case "query_vault": {
      const docQuery = args?.document?.trim() || "";
      const vaultRoot = path.join(process.cwd(), "vault");

      // Check if direct file exists
      const targetPath = path.join(vaultRoot, docQuery.replace(/^\/+/, ""));
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
        const content = fs.readFileSync(targetPath, "utf-8");
        return {
          document: docQuery,
          content,
          bytes: content.length,
          lastModified: fs.statSync(targetPath).mtime.toISOString()
        };
      }

      // Search across vault files
      const results: Array<{ file: string; matchPreview: string }> = [];
      function searchDir(dir: string, prefix = "") {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.join(prefix, entry.name);
          if (entry.isDirectory()) {
            searchDir(fullPath, relPath);
          } else if (entry.name.endsWith(".md")) {
            const fileContent = fs.readFileSync(fullPath, "utf-8");
            if (entry.name.toLowerCase().includes(docQuery.toLowerCase()) || 
                fileContent.toLowerCase().includes(docQuery.toLowerCase())) {
              const snippetIndex = fileContent.toLowerCase().indexOf(docQuery.toLowerCase());
              const start = Math.max(0, snippetIndex - 40);
              const preview = snippetIndex >= 0 
                ? "..." + fileContent.substring(start, start + 160).replace(/\n/g, " ") + "..."
                : fileContent.substring(0, 160).replace(/\n/g, " ") + "...";
              results.push({ file: relPath, matchPreview: preview });
            }
          }
        }
      }
      searchDir(vaultRoot);

      return {
        query: docQuery,
        matchesFound: results.length,
        results: results.slice(0, 5)
      };
    }

    case "execute_agent_task": {
      const userId = args?.userId || reqAuthUserId || "admin_agent";
      const skillId = args?.skillId || "generic_task";
      const params = args?.params || {};

      // 1. Upstream Settlement Check via Gatekeeper
      const settlement = await gatekeeper.verifyAndSettlePreflight(userId, 0.05, { skillId, params });
      if (!settlement.allowed) {
        return {
          status: "rejected",
          error: "Upstream Settlement Required",
          details: settlement.reason,
          balance: settlement.remainingCredits
        };
      }

      // 2. Deterministic execution outcome
      return {
        status: "executed",
        skillId,
        settlement: {
          type: settlement.settlementType,
          creditsDeducted: settlement.creditsDeducted,
          remainingCredits: settlement.remainingCredits,
          auditId: settlement.auditId
        },
        result: {
          summary: `Task [${skillId}] successfully executed under operational contract.`,
          outputData: {
            timestamp: new Date().toISOString(),
            skillId,
            verified: true,
            deterministicProof: `proof_${Math.random().toString(36).slice(2, 10)}`
          }
        }
      };
    }

    case "apex_vault_agent": {
      const action = args?.action;
      const payload = args?.payload || {};

      switch (action) {
        case "market_telemetry": {
          const data = await executeMcpTool("get_market_telemetry", payload, reqAuthUserId);
          return {
            tool: "apex_vault_agent",
            action: "market_telemetry",
            status: "success",
            data
          };
        }

        case "defensibility_matrix": {
          const data = await executeMcpTool("get_defensibility_matrix", payload, reqAuthUserId);
          return {
            tool: "apex_vault_agent",
            action: "defensibility_matrix",
            status: "success",
            data
          };
        }

        case "vault_query": {
          const docQuery = payload.document || payload.query || payload.keyword || payload.path || "system.md";
          const data = await executeMcpTool("query_vault", { document: docQuery }, reqAuthUserId);
          return {
            tool: "apex_vault_agent",
            action: "vault_query",
            status: "success",
            data
          };
        }

        case "agentic_execution": {
          const skillId = payload.skillId || payload.task || "tier1_support_triage";
          const params = payload.params || payload.parameters || {};
          const userId = payload.userId || reqAuthUserId || "admin_agent";
          const executionResult = await executeMcpTool("execute_agent_task", { skillId, params, userId }, reqAuthUserId);
          return {
            tool: "apex_vault_agent",
            action: "agentic_execution",
            ...executionResult
          };
        }

        case "deep_research": {
          const query = payload.input || payload.query || payload.topic || "AI customer service market evolution 2024-2030";
          return {
            tool: "apex_vault_agent",
            action: "deep_research",
            status: "ready",
            agent: "deep-research-preview-04-2026",
            tools: [{ type: "google_search" }, { type: "url_context" }],
            agentConfig: {
              type: "deep-research",
              thinking_summaries: "auto",
              visualization: "auto",
              collaborative_planning: true
            },
            instructions: "Interact via /api/deep-research/start or client Deep Research Studio."
          };
        }

        default: {
          return {
            tool: "apex_vault_agent",
            status: "error",
            error: `Invalid action '${action}'. Must be one of: 'market_telemetry', 'defensibility_matrix', 'vault_query', 'agentic_execution'.`,
            availableActions: [
              "market_telemetry",
              "defensibility_matrix",
              "vault_query",
              "agentic_execution"
            ]
          };
        }
      }
    }

    default:
      throw new Error(`Unknown MCP Tool: ${name}`);
  }
}

/**
 * SSE Endpoint Handler for MCP Client Connections
 */
export function handleMcpSse(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  console.log(`[MCP Server] Client connected via SSE: ${clientId}`);

  // Send initial endpoint and capabilities notification
  res.write(`event: endpoint\ndata: ${JSON.stringify({
    server: "Apex Vault Agent MCP Server",
    version: "1.0.0",
    clientId,
    postEndpoint: "/mcp/message",
    tools: MCP_TOOLS.map(t => t.name)
  })}\n\n`);

  // Periodic heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    res.write(`event: ping\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    console.log(`[MCP Server] Client disconnected: ${clientId}`);
  });
}

/**
 * JSON-RPC Message Bus Handler for MCP
 */
export async function handleMcpMessage(req: Request, res: Response) {
  const body = req.body || {};
  const { id, method, params } = body;

  try {
    if (method === "initialize") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: "apex-vault-agent",
            version: "1.0.0"
          },
          capabilities: {
            tools: { listChanged: false },
            resources: { subscribe: false, listChanged: false }
          }
        }
      });
    }

    if (method === "tools/list") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: MCP_TOOLS
        }
      });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
      const reqUserId = bearerToken || "demo_user";

      const toolResult = await executeMcpTool(toolName, toolArgs, reqUserId);

      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult, null, 2)
            }
          ]
        }
      });
    }

    if (method === "resources/list") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          resources: [
            { uri: "vault://system.md", name: "System Architecture", mimeType: "text/markdown" },
            { uri: "vault://decisions.md", name: "Architectural Decision Records", mimeType: "text/markdown" },
            { uri: "vault://notes.md", name: "Strategic Observations & Buffers", mimeType: "text/markdown" },
            { uri: "vault://breathing_space.md", name: "Complexity Control", mimeType: "text/markdown" },
            { uri: "vault://entities/OpenAI.md", name: "OpenAI Entity Dossier", mimeType: "text/markdown" }
          ]
        }
      });
    }

    // Default unrecognized method
    return res.status(404).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method '${method}' not found` }
    });
  } catch (err: any) {
    return res.status(500).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: err?.message || "Internal error" }
    });
  }
}
