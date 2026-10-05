import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Shield, 
  Cpu, 
  Cloud, 
  BrainCircuit, 
  Workflow, 
  Terminal, 
  Activity, 
  Zap, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  Play, 
  Database,
  Layers,
  FileCode2,
  DollarSign
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

// Market Trajectory 2024-2030 Data
const MARKET_TRAJECTORY = [
  { year: "2024", marketSize: 12.06, laborDisplaced: 3.2, automatedVolume: 18.5, growthRate: 0 },
  { year: "2025", marketSize: 15.17, laborDisplaced: 6.8, automatedVolume: 26.0, growthRate: 25.8 },
  { year: "2026", marketSize: 19.08, laborDisplaced: 12.4, automatedVolume: 35.2, growthRate: 25.8 },
  { year: "2027", marketSize: 24.00, laborDisplaced: 21.0, automatedVolume: 46.8, growthRate: 25.8 },
  { year: "2028", marketSize: 30.19, laborDisplaced: 34.5, automatedVolume: 59.0, growthRate: 25.8 },
  { year: "2029", marketSize: 37.98, laborDisplaced: 51.2, automatedVolume: 71.4, growthRate: 25.8 },
  { year: "2030", marketSize: 47.82, laborDisplaced: 74.0, automatedVolume: 83.6, growthRate: 25.8 }
];

// TAM / SAM / SOM Breakdown Data
const MARKET_SEGMENTS = [
  { 
    name: "TAM", 
    value: 140.0, 
    label: "Total Addressable Market", 
    subtitle: "Global support operations & contact center labor",
    color: "#3b82f6",
    share: "100%"
  },
  { 
    name: "SAM", 
    value: 47.82, 
    label: "Serviceable Addressable Market", 
    subtitle: "Agentic software & AI inference pipelines (2030)",
    color: "#00f5d4",
    share: "34.2%"
  },
  { 
    name: "SOM", 
    value: 4.50, 
    label: "Serviceable Obtainable Market", 
    subtitle: "High-volume enterprise wedges: SaaS, FinTech, Telecom",
    color: "#a855f7",
    share: "3.2%"
  }
];

// Value Capture & Defensibility Matrix Data
const DEFENSIBILITY_MATRIX = [
  {
    id: "layer-silicon",
    layer: "Compute & Silicon",
    icon: Cpu,
    primaryPlayers: ["NVIDIA", "TSMC"],
    economicLeverage: "Hardware gross margins (70–75%)",
    structuralAdvantage: "Supply choke point & compute availability",
    riskFactor: "Hyperscaler custom ASICs (Google TPU, AWS Trainium)",
    marketSharePct: 35,
    deepInsight: "Value concentrates upstream where physical silicon limits and advanced packaging (TSMC CoWoS) dictate inference capacity. High pricing power allows capturing up to 40% of all infrastructure spend.",
    color: "from-amber-500/20 to-amber-950/40",
    border: "border-amber-500/40",
    badge: "Hardware Monopolies"
  },
  {
    id: "layer-cloud",
    layer: "Cloud & Distribution",
    icon: Cloud,
    primaryPlayers: ["Microsoft", "Amazon", "Google"],
    economicLeverage: "Recurring compute pipelines",
    structuralAdvantage: "Enterprise deployment pipelines & infrastructure dominance",
    riskFactor: "Open-source weight hosting price wars",
    marketSharePct: 30,
    deepInsight: "Hyperscalers leverage existing master services agreements (MSAs) and sovereign cloud security compliance (FedRAMP, HIPAA) to distribute models with zero marginal customer acquisition friction.",
    color: "from-blue-500/20 to-blue-950/40",
    border: "border-blue-500/40",
    badge: "Distribution Rails"
  },
  {
    id: "layer-models",
    layer: "Frontier Models",
    icon: BrainCircuit,
    primaryPlayers: ["OpenAI", "Anthropic"],
    economicLeverage: "API usage & licensing",
    structuralAdvantage: "Research velocity vs. compute compression",
    riskFactor: "Open-weights distillation (Llama, DeepSeek) eroding per-token pricing",
    marketSharePct: 20,
    deepInsight: "Frontier labs face perpetual margin compression as open models match reasoning thresholds within 9 months. Defense requires verticalizing into agentic execution and native computer-use tools.",
    color: "from-emerald-500/20 to-emerald-950/40",
    border: "border-emerald-500/40",
    badge: "Cognitive Inference"
  },
  {
    id: "layer-workflows",
    layer: "Enterprise Workflows",
    icon: Workflow,
    primaryPlayers: ["Salesforce", "ServiceNow"],
    economicLeverage: "Per-seat SaaS licensing & $2/convo consumption",
    structuralAdvantage: "Deep workflow embedding & high switching costs",
    riskFactor: "Autonomous native agents bypassing traditional UI screens",
    marketSharePct: 15,
    deepInsight: "The definitive defensibility moat in 2026. Systems of record (CRM, ERP, ticketing) hold the authoritative customer data and API permissions necessary for agents to perform real economic work without hallucination.",
    color: "from-purple-500/20 to-purple-950/40",
    border: "border-purple-500/40",
    badge: "System of Record"
  }
];

export default function TelemetryDashboard() {
  const [selectedLayer, setSelectedLayer] = useState<string>("layer-workflows");
  const [chartMetric, setChartMetric] = useState<"marketSize" | "automatedVolume" | "laborDisplaced">("marketSize");
  const [activeMcpTool, setActiveMcpTool] = useState<string>("apex_vault_agent");
  const [mcpToolArg, setMcpToolArg] = useState<string>(
    JSON.stringify({ action: "market_telemetry", payload: { segment: "all" } }, null, 2)
  );
  const [mcpResponse, setMcpResponse] = useState<any>(null);
  const [loadingMcp, setLoadingMcp] = useState<boolean>(false);
  const [accountStatus, setAccountStatus] = useState<any>({
    credits: 25.00,
    subscription: { isActive: true, tier: "Enterprise Operator" }
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load account status and audit trail
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/gatekeeper/audit?userId=admin_agent");
      if (res.ok) {
        const data = await res.json();
        if (data.adminAccount) {
          setAccountStatus(data.adminAccount);
        }
        if (data.auditLog) {
          setAuditLogs(data.auditLog);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchStatus();
    // Run initial tool call preview
    runMcpTool("apex_vault_agent", { action: "market_telemetry", payload: { segment: "all" } });
  }, []);

  const runMcpTool = async (toolName: string, args: any) => {
    setLoadingMcp(true);
    try {
      const res = await fetch("/mcp/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer admin_agent"
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: `req_${Date.now()}`,
          method: "tools/call",
          params: {
            name: toolName,
            arguments: args
          }
        })
      });
      const data = await res.json();
      setMcpResponse(data?.result?.content?.[0]?.text ? JSON.parse(data.result.content[0].text) : data);
      await fetchStatus();
    } catch (err: any) {
      setMcpResponse({ error: err.message || "Failed to execute MCP tool" });
    } finally {
      setLoadingMcp(false);
    }
  };

  const handleToolRun = () => {
    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(mcpToolArg || "{}");
    } catch {
      parsedArgs = { query: mcpToolArg };
    }
    runMcpTool(activeMcpTool, parsedArgs);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentLayer = DEFENSIBILITY_MATRIX.find(m => m.id === selectedLayer) || DEFENSIBILITY_MATRIX[0];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-950 text-slate-200 max-w-7xl mx-auto font-sans">
      
      {/* --- HERO / OPERATIONAL ANCHOR HEADER --- */}
      <div className="border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-950 to-zinc-900/90 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f5d4]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                Live Operational Telemetry
              </span>
              <span className="text-[10px] font-mono text-slate-500">2024–2030 Strategic Horizon</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Apex Vault Agent</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-slate-300 font-mono font-normal">v1.0.0</span>
            </h1>
            
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Operational market intelligence engine, research vault, and agentic execution service for the global AI customer service and enterprise automation ecosystem.
            </p>
          </div>

          {/* Quick Interop Badges */}
          <div className="flex flex-wrap lg:flex-col gap-2 font-mono text-xs w-full lg:w-auto">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 flex items-center justify-between gap-3 text-left">
              <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00f5d4]" />
                <span>MCP Endpoint:</span>
              </span>
              <span className="text-white font-bold text-[11px]">/mcp/sse</span>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 flex items-center justify-between gap-3 text-left">
              <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>A2A Discovery:</span>
              </span>
              <span className="text-white font-bold text-[11px]">/.well-known/agent.json</span>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 flex items-center justify-between gap-3 text-left">
              <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>Gatekeeper Check:</span>
              </span>
              <span className="text-emerald-400 font-bold text-[11px]">Upstream Pre-Flight Active</span>
            </div>
          </div>
        </div>

        {/* Operating Principles Strip */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-left font-mono">
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-[#00f5d4] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">Momentum Over Recursion</div>
              <div className="text-[10px] text-slate-500">Simpler systems generate sustainable velocity; clarity scales better than complexity.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Activity className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">Task Execution Over Q&A</div>
              <div className="text-[10px] text-slate-500">Interface evolution moves from passive prompts to deterministic, audit-ready operational labor.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">Upstream Settlement</div>
              <div className="text-[10px] text-slate-500">Zero compute executes without valid pre-flight authentication and active ledger verification.</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: MARKET SIZING & STRATEGIC ANCHORS (2024-2030) --- */}
      <div className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00f5d4]" />
              Market Sizing & Strategic Anchors (2024–2030)
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous task execution transition metrics across global enterprise support operations.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 font-mono text-xs">
            <button
              onClick={() => setChartMetric("marketSize")}
              className={`px-3 py-1 rounded transition ${chartMetric === "marketSize" ? "bg-[#00f5d4] text-zinc-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Market Size ($B)
            </button>
            <button
              onClick={() => setChartMetric("automatedVolume")}
              className={`px-3 py-1 rounded transition ${chartMetric === "automatedVolume" ? "bg-[#00f5d4] text-zinc-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Automated Volume (%)
            </button>
            <button
              onClick={() => setChartMetric("laborDisplaced")}
              className={`px-3 py-1 rounded transition ${chartMetric === "laborDisplaced" ? "bg-[#00f5d4] text-zinc-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Labor Shift ($B)
            </button>
          </div>
        </div>

        {/* 6 Metric Anchors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">2024 Baseline</span>
            <span className="text-2xl font-black text-white">$12.06B</span>
            <span className="text-[10px] text-slate-400 block">Initial foundation</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">2030 Projection</span>
            <span className="text-2xl font-black text-[#00f5d4]">$47.82B</span>
            <span className="text-[10px] text-emerald-400 block">+296% Expansion</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">CAGR (2024–30)</span>
            <span className="text-2xl font-black text-blue-400">25.8%</span>
            <span className="text-[10px] text-slate-400 block">Annual trajectory</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Global TAM</span>
            <span className="text-2xl font-black text-purple-400">$140B</span>
            <span className="text-[10px] text-slate-400 block">Contact center labor</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target SAM</span>
            <span className="text-2xl font-black text-yellow-400">$47.82B</span>
            <span className="text-[10px] text-slate-400 block">Agentic pipelines</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target SOM</span>
            <span className="text-2xl font-black text-cyan-400">$4.5B</span>
            <span className="text-[10px] text-slate-400 block">SaaS / FinTech / Telecom</span>
          </div>
        </div>

        {/* Growth Trajectory Chart */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f5d4]" />
              <span>
                {chartMetric === "marketSize" && "Annual Market Size Projection ($ Billions)"}
                {chartMetric === "automatedVolume" && "Percentage of Enterprise Inquiries Handled Autonomously (%)"}
                {chartMetric === "laborDisplaced" && "Direct Operational Labor Transferred to Automated Inference ($ Billions)"}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Compound Annual Growth: 25.8%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MARKET_TRAJECTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="telemetryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f5d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#71717a" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px" }}
                  formatter={(value: any) => [
                    chartMetric === "automatedVolume" ? `${value}%` : `$${value}B`,
                    chartMetric === "marketSize" ? "Market Size" : chartMetric === "automatedVolume" ? "Autonomous Resolution" : "Labor Displaced"
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMetric} 
                  stroke="#00f5d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#telemetryGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TAM / SAM / SOM Breakdown Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MARKET_SEGMENTS.map((seg) => (
            <div key={seg.name} className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2 py-0.5 rounded" style={{ backgroundColor: `${seg.color}20`, color: seg.color }}>
                  {seg.name}
                </span>
                <span className="text-xs text-slate-500 font-bold">{seg.share} of TAM</span>
              </div>

              <div>
                <div className="text-3xl font-black text-white">${seg.value}B</div>
                <div className="text-xs font-bold text-slate-200 mt-1">{seg.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{seg.subtitle}</div>
              </div>

              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: seg.name === "TAM" ? "100%" : seg.name === "SAM" ? "34.2%" : "3.2%", backgroundColor: seg.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 2: VALUE CAPTURE & DEFENSIBILITY MATRIX --- */}
      <div className="space-y-4 text-left">
        <div className="border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Value Capture & Defensibility Matrix (2024–2030)
          </h2>
          <p className="text-xs text-slate-400">
            Economic leverage, structural advantages, and defensibility across the 4 core ecosystem layers.
          </p>
        </div>

        {/* 4 Layers Interactive Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {DEFENSIBILITY_MATRIX.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedLayer === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedLayer(item.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 relative ${
                  isSelected 
                    ? `bg-zinc-900 border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.15)]` 
                    : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-zinc-800 ${isSelected ? "text-[#00f5d4]" : "text-slate-400"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-slate-400 uppercase tracking-widest font-mono">
                    {item.badge}
                  </span>
                </div>

                <div className="text-sm font-bold text-white">{item.layer}</div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {item.primaryPlayers.join(", ")}
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Economic Share:</span>
                  <span className="text-[#00f5d4] font-bold">{item.marketSharePct}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Deep Dive Slate */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-6 font-mono text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-[#00f5d4] uppercase tracking-widest font-bold">Layer Deep-Dive</span>
              <h3 className="text-xl font-bold text-white">{currentLayer.layer}</h3>
              <p className="text-xs text-slate-400">Primary Market Dominators: <span className="text-white font-bold">{currentLayer.primaryPlayers.join(" & ")}</span></p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-center">
                <span className="text-[9px] text-slate-500 uppercase block">Est. Margin</span>
                <span className="text-xs font-bold text-emerald-400">{currentLayer.economicLeverage}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 text-xs">
            <div className="space-y-1.5">
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Structural Advantage</span>
              <p className="text-slate-200 leading-relaxed font-sans">{currentLayer.structuralAdvantage}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Primary Risk Factor</span>
              <p className="text-amber-400/90 leading-relaxed font-sans">{currentLayer.riskFactor}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Strategic Analysis</span>
              <p className="text-slate-300 leading-relaxed font-sans">{currentLayer.deepInsight}</p>
            </div>
          </div>
        </div>

        {/* Full Defensibility Matrix Table */}
        <div className="border border-zinc-800 rounded-xl overflow-x-auto bg-zinc-900/20 font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Layer</th>
                <th className="py-3 px-4">Primary Players</th>
                <th className="py-3 px-4">Economic Leverage</th>
                <th className="py-3 px-4">Structural Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {DEFENSIBILITY_MATRIX.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-zinc-900/40 transition cursor-pointer ${selectedLayer === row.id ? "bg-zinc-900/60" : ""}`}
                  onClick={() => setSelectedLayer(row.id)}
                >
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" />
                    {row.layer}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{row.primaryPlayers.join(", ")}</td>
                  <td className="py-3.5 px-4 text-emerald-400">{row.economicLeverage}</td>
                  <td className="py-3.5 px-4 text-slate-400">{row.structuralAdvantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECTION 3: EXTERNAL AGENT INTEROPERABILITY & MCP SANDBOX --- */}
      <div className="space-y-4 text-left">
        <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              External Agent Interoperability & Model Context Protocol (MCP)
            </h2>
            <p className="text-xs text-slate-400">
              Live testing sandbox for external AI agents querying market telemetry and executing metered operational skills.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/.well-known/agent.json"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300 hover:text-[#00f5d4] px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5"
            >
              <span>A2A Discovery Card</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Tool Invocation Console */}
          <div className="lg:col-span-7 border border-zinc-800 bg-zinc-900/50 rounded-xl p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#00f5d4]" />
                MCP Tool Execution Testbench
              </span>
              <span className="text-[10px] text-slate-500">JSON-RPC 2.0 / SSE</span>
            </div>

            {/* Select Tool */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 block font-bold">Select MCP Tool:</label>
              <select
                value={activeMcpTool}
                onChange={(e) => {
                  const tool = e.target.value;
                  setActiveMcpTool(tool);
                  if (tool === "apex_vault_agent") {
                    setMcpToolArg(JSON.stringify({ action: "market_telemetry", payload: { segment: "all" } }, null, 2));
                  }
                  if (tool === "get_market_telemetry") setMcpToolArg('{"segment": "all"}');
                  if (tool === "get_defensibility_matrix") setMcpToolArg('{"layer": "Enterprise Workflows"}');
                  if (tool === "query_vault") setMcpToolArg('{"document": "system.md"}');
                  if (tool === "execute_agent_task") setMcpToolArg('{"skillId": "tier1_support_triage", "params": {"ticket": "Password reset request for user #402"}}');
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
              >
                <option value="apex_vault_agent">apex_vault_agent — Unified Service (market_telemetry, defensibility_matrix, vault_query, agentic_execution)</option>
                <option value="get_market_telemetry">get_market_telemetry — Market Sizing & CAGR 2024–2030</option>
                <option value="get_defensibility_matrix">get_defensibility_matrix — 4-Layer Defensibility Matrix</option>
                <option value="query_vault">query_vault — Query Intelligence Vault Markdown Files</option>
                <option value="execute_agent_task">execute_agent_task — Deterministic Metered Execution</option>
              </select>
            </div>

            {/* Quick action presets for apex_vault_agent */}
            {activeMcpTool === "apex_vault_agent" && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Action Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMcpToolArg(JSON.stringify({ action: "market_telemetry", payload: { segment: "all" } }, null, 2))}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-[#00f5d4]/40 rounded text-[11px] text-slate-300 hover:text-[#00f5d4] transition"
                  >
                    market_telemetry
                  </button>
                  <button
                    type="button"
                    onClick={() => setMcpToolArg(JSON.stringify({ action: "defensibility_matrix", payload: { layer: "Enterprise Workflows" } }, null, 2))}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-[#00f5d4]/40 rounded text-[11px] text-slate-300 hover:text-[#00f5d4] transition"
                  >
                    defensibility_matrix
                  </button>
                  <button
                    type="button"
                    onClick={() => setMcpToolArg(JSON.stringify({ action: "vault_query", payload: { document: "system.md" } }, null, 2))}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-[#00f5d4]/40 rounded text-[11px] text-slate-300 hover:text-[#00f5d4] transition"
                  >
                    vault_query
                  </button>
                  <button
                    type="button"
                    onClick={() => setMcpToolArg(JSON.stringify({ action: "agentic_execution", payload: { skillId: "tier1_support_triage", params: { ticket: "Password reset request for user #402" } } }, null, 2))}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-[#00f5d4]/40 rounded text-[11px] text-slate-300 hover:text-[#00f5d4] transition"
                  >
                    agentic_execution
                  </button>
                </div>
              </div>
            )}

            {/* Tool Arguments */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 block font-bold">Tool Arguments (JSON):</label>
              <textarea
                rows={3}
                value={mcpToolArg}
                onChange={(e) => setMcpToolArg(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00f5d4] resize-none font-mono"
              />
            </div>

            {/* Execution Trigger */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <div className="text-[10px] text-slate-500">
                Authorized as: <span className="text-[#00f5d4]">admin_agent</span> (Upstream Settle Active)
              </div>
              <button
                onClick={handleToolRun}
                disabled={loadingMcp}
                className="bg-[#00f5d4] hover:bg-[#00e0c2] text-zinc-950 font-bold px-4 py-2 rounded text-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {loadingMcp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Invoke Tool</span>
              </button>
            </div>

            {/* Response Preview */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Output Response Payload:</span>
                {mcpResponse && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(mcpResponse, null, 2), "mcp-resp")}
                    className="hover:text-white flex items-center gap-1 text-[10px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === "mcp-resp" ? "Copied" : "Copy JSON"}</span>
                  </button>
                )}
              </div>
              <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 text-[11px] text-[#00f5d4] max-h-56 overflow-y-auto leading-relaxed">
                {mcpResponse ? JSON.stringify(mcpResponse, null, 2) : "// Run a tool to inspect JSON output..."}
              </pre>
            </div>
          </div>

          {/* Right Column: Upstream Gatekeeper & Ledger Status */}
          <div className="lg:col-span-5 space-y-4 font-mono">
            {/* Account Card */}
            <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  Upstream Gatekeeper Ledger
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[10px] text-slate-500 uppercase block">Available Balance</span>
                  <span className="text-xl font-bold text-white">${Number(accountStatus.credits || 0).toFixed(2)}</span>
                  <span className="text-[9px] text-slate-400 block">$0.05 / metered run</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[10px] text-slate-500 uppercase block">Subscription</span>
                  <span className="text-xs font-bold text-[#00f5d4] truncate block mt-1">
                    {accountStatus.subscription?.tier || "Enterprise Operator"}
                  </span>
                  <span className="text-[9px] text-emerald-400 block">Pre-flight Authorized</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 leading-relaxed bg-zinc-950/60 p-2.5 rounded border border-zinc-800/80">
                <strong>Enforcement Contract:</strong> "Zero compute executes without valid pre-flight authentication and active ledger verification."
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-zinc-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00f5d4]" />
                  Recent Settlement Audit Events
                </span>
                <button onClick={fetchStatus} className="hover:text-white" title="Refresh Audit Log">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {auditLogs.slice(0, 5).map((log, idx) => (
                  <div key={log.id || idx} className="bg-zinc-950 p-2 rounded border border-zinc-850 text-[10px] flex items-center justify-between">
                    <div>
                      <span className={`font-bold ${log.action.includes('authorized') ? 'text-emerald-400' : log.action.includes('deducted') ? 'text-yellow-400' : 'text-slate-300'}`}>
                        {log.action}
                      </span>
                      <span className="text-slate-500 ml-2">user: {log.userId}</span>
                    </div>
                    <span className="text-slate-500 text-[9px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}

                {auditLogs.length === 0 && (
                  <div className="text-center py-4 text-[10px] text-slate-600">
                    No audit records recorded in this session.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
