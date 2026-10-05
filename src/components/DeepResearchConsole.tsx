import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Search, 
  Globe, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Save, 
  Layers, 
  Bot, 
  ArrowRight,
  Code2,
  Copy,
  SlidersHorizontal,
  Compass,
  Check
} from "lucide-react";

interface DeepResearchConsoleProps {
  onSavedToVault?: (fileName: string) => void;
}

export default function DeepResearchConsole({ onSavedToVault }: DeepResearchConsoleProps) {
  const [queryInput, setQueryInput] = useState("");
  const [collaborativePlanning, setCollaborativePlanning] = useState(true);
  const [visualization, setVisualization] = useState(true);
  const [currentInteractionId, setCurrentInteractionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "in_progress" | "completed" | "failed">("idle");
  const [pollingActive, setPollingActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [outputText, setOutputText] = useState("");
  const [steps, setSteps] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [savingToVault, setSavingToVault] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const pollIntervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  const PRESET_TOPICS = [
    {
      title: "Enterprise Contact Center TAM & Displaced Labor (2024–2030)",
      prompt: "Research the global AI customer service market shift from 2024 ($12.06B) to 2030 ($47.82B). Detail labor displacement vs automated volume, contact center operational costs, and value capture across CRM systems."
    },
    {
      title: "NVIDIA vs Custom Hyperscaler ASICs Defensibility",
      prompt: "Analyze the competitive defensibility of NVIDIA GPU hardware margins vs Google TPU, AWS Trainium, and Microsoft Maia chips. Detail supply chokepoint risks and TSMC CoWoS packaging capacity."
    },
    {
      title: "Frontier Models Margin Compression & Open-Weights Distillation",
      prompt: "Investigate reasoning frontier models (OpenAI, Anthropic) vs distilled open models (Llama, DeepSeek). Analyze the timeline for commoditization of token inference and strategies for vertical integration into enterprise workflows."
    },
    {
      title: "Autonomous Agent Interoperability: MCP & Upstream Settlement",
      prompt: "Research the emergence of Model Context Protocol (MCP) and Agent-to-Agent (A2A) standards. Focus on deterministic task execution, ledger pre-flight verification, and machine-to-machine micropayments."
    }
  ];

  // Elapsed timer when researching
  useEffect(() => {
    if (status === "in_progress" || status === "starting") {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [status]);

  // Polling loop
  useEffect(() => {
    if (!currentInteractionId || !pollingActive) {
      clearInterval(pollIntervalRef.current);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/deep-research/status/${currentInteractionId}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.status) {
          if (data.status === "completed") {
            setStatus("completed");
            setPollingActive(false);
            setOutputText(data.outputText || "");
            setSteps(data.steps || []);
          } else if (data.status === "failed") {
            setStatus("failed");
            setPollingActive(false);
            setErrorMsg(data.error || "Deep research interaction failed.");
          } else {
            setStatus("in_progress");
            if (data.outputText) {
              setOutputText(data.outputText);
            }
            if (data.steps) {
              setSteps(data.steps);
            }
          }
        }
      } catch (err: any) {
        console.error("Polling error:", err);
      }
    };

    // Immediate check + interval
    checkStatus();
    pollIntervalRef.current = setInterval(checkStatus, 8000);

    return () => clearInterval(pollIntervalRef.current);
  }, [currentInteractionId, pollingActive]);

  const handleStartResearch = async () => {
    if (!queryInput.trim()) return;
    setStatus("starting");
    setErrorMsg(null);
    setOutputText("");
    setSteps([]);
    setSavedSuccess(null);
    setElapsedSeconds(0);

    try {
      const res = await fetch("/api/deep-research/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: queryInput,
          collaborativePlanning,
          visualization
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start deep research interaction");
      }

      setCurrentInteractionId(data.interactionId);
      setStatus("in_progress");
      setPollingActive(true);
    } catch (err: any) {
      setStatus("failed");
      setErrorMsg(err.message || "Could not launch deep research agent.");
    }
  };

  const handleCollaborate = async (approve: boolean) => {
    if (!currentInteractionId) return;
    setIsRefining(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/deep-research/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousInteractionId: currentInteractionId,
          feedback: feedbackInput || (approve ? "Plan looks great, proceed!" : "Please refine the scope."),
          approve
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit plan feedback.");
      }

      // Chain onto newly created child interaction
      setCurrentInteractionId(data.interactionId);
      setFeedbackInput("");
      setStatus("in_progress");
      setPollingActive(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Collaboration step failed.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!outputText || !currentInteractionId) return;
    setSavingToVault(true);

    try {
      const title = `DeepResearch_${Date.now()}`;
      const markdown = `# Deep Research Report: ${queryInput.slice(0, 80)}\n\n*Generated by Gemini Deep Research Agent (\`deep-research-preview-04-2026\`)*\n*Interaction ID: ${currentInteractionId}*\n*Date: ${new Date().toISOString()}*\n\n---\n\n${outputText}\n`;

      const res = await fetch("/api/deep-research/save-to-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: markdown,
          category: "Research"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save file.");

      setSavedSuccess(data.fileName);
      if (onSavedToVault) {
        onSavedToVault(data.fileName);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to commit research to vault.");
    } finally {
      setSavingToVault(false);
    }
  };

  const pythonSnippet = `import os
import time
from google import genai

client = genai.Client(
    api_key=os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY"),
)

tools = [
    { 'type': 'google_search' },
    { 'type': 'url_context' },
]

interaction = client.interactions.create(
    agent='deep-research-preview-04-2026',
    input="""${queryInput || "Research global AI contact center TAM and labor displacement 2024-2030."}""",
    background=True,
    tools=tools,
    agent_config={
        'type': 'deep-research',
        'thinking_summaries': 'auto',
        'visualization': 'auto',
        'collaborative_planning': ${collaborativePlanning ? "True" : "False"},
    },
)

print(f"Research started: {interaction.id}")

while True:
    interaction = client.interactions.get(interaction.id)
    if interaction.status == "completed":
        print(interaction.output_text)
        break
    elif interaction.status == "failed":
        print(f"Research failed: {interaction.error}")
        break
    time.sleep(10)`;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-950 text-slate-200 max-w-7xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-950 to-zinc-900/90 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30">
                INTERACTIONS API AGENT
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800">
                deep-research-preview-04-2026
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-[#00f5d4]" />
              Deep Research Studio
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Autonomous multi-step market intelligence agent equipped with Google Search, URL Context, collaborative planning, and recursive report synthesis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCodeModal(true)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-lg text-xs font-mono transition flex items-center gap-2"
            >
              <Code2 className="w-4 h-4 text-[#00f5d4]" />
              <span>Python & TS Code</span>
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-4 gap-4 text-left font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Search className="w-4 h-4 text-[#00f5d4]" />
            <span>Google Search Tool Active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>URL Context Crawling</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>Collaborative Planning</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Automatic Visualizations</span>
          </div>
        </div>
      </div>

      {/* Main Research Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Research Initiation & Presets */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Query Formulation Box */}
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Compass className="w-4 h-4 text-[#00f5d4]" />
                Research Directive
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Async Background Job</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold block">
                Research Goal or Thesis Topic:
              </label>
              <textarea
                rows={4}
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter enterprise market research query, entity comparison, or thesis to execute in-depth research..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f5d4] transition font-sans leading-relaxed"
              />
            </div>

            {/* Config Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 bg-zinc-950/80 p-2.5 rounded border border-zinc-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={collaborativePlanning}
                  onChange={(e) => setCollaborativePlanning(e.target.checked)}
                  className="rounded border-zinc-700 text-[#00f5d4] focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 font-mono">Collaborative Plan</span>
              </label>

              <label className="flex items-center gap-2 bg-zinc-950/80 p-2.5 rounded border border-zinc-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={visualization}
                  onChange={(e) => setVisualization(e.target.checked)}
                  className="rounded border-zinc-700 text-[#00f5d4] focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 font-mono">Auto Visuals</span>
              </label>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartResearch}
              disabled={status === "starting" || status === "in_progress" || !queryInput.trim()}
              className="w-full bg-[#00f5d4] hover:bg-[#00e0c2] text-zinc-950 font-mono font-bold py-2.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "starting" || status === "in_progress" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Research in Progress ({elapsedSeconds}s)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Deep Research Agent</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-5 space-y-3 font-mono">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-zinc-800 pb-2">
              Strategic Research Directives (Presets)
            </span>
            <div className="space-y-2">
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setQueryInput(preset.prompt)}
                  className="w-full text-left p-3 rounded-lg bg-zinc-950/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-[#00f5d4]/40 transition group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-[#00f5d4] transition flex items-center justify-between">
                    <span>{preset.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-[#00f5d4]" />
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-sans">
                    {preset.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Telemetry & Synthesized Report */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Status & Telemetry Bar */}
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Status:</span>
              {status === "idle" && (
                <span className="text-slate-500">Idle / Ready</span>
              )}
              {(status === "starting" || status === "in_progress") && (
                <span className="flex items-center gap-1.5 text-yellow-400 font-bold animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Agent Synthesizing ({elapsedSeconds}s)
                </span>
              )}
              {status === "completed" && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Synthesis Completed ({elapsedSeconds}s)
                </span>
              )}
              {status === "failed" && (
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Failed
                </span>
              )}
            </div>

            {currentInteractionId && (
              <div className="text-[11px] text-slate-400">
                Job ID: <span className="text-[#00f5d4]">{currentInteractionId.slice(0, 18)}...</span>
              </div>
            )}

            {status === "completed" && outputText && (
              <button
                onClick={handleSaveToVault}
                disabled={savingToVault}
                className="bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 border border-[#00f5d4]/40 text-[#00f5d4] px-3 py-1 rounded text-xs transition flex items-center gap-1.5 font-bold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingToVault ? "Saving..." : "Commit to Vault"}</span>
              </button>
            )}
          </div>

          {/* Saved Toast */}
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Report successfully archived in Intelligence Vault as <strong>{savedSuccess}</strong>. Visible in the Vault Tab!</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl text-xs font-mono text-red-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Execution Notice</span>
              </div>
              <p>{errorMsg}</p>
              <p className="text-[11px] text-slate-400">
                Note: <code>deep-research-preview-04-2026</code> requires an active Gemini API key with billing enabled. Ensure <code>GOOGLE_API_KEY</code> or <code>GEMINI_API_KEY</code> is defined in your environment or secrets.
              </p>
            </div>
          )}

          {/* Collaborative Planning Step (If agent produced an initial plan) */}
          {(status === "in_progress" || status === "completed") && outputText && (
            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#00f5d4]" />
                  Collaborative Plan Feedback / Steering
                </span>
                <span className="text-[10px] text-slate-500">Multi-Turn Thread Continuation</span>
              </div>
              
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Refine the research scope or approve the plan to initiate exhaustive execution across deep web sources.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="e.g. Focus specifically on TSMC CoWoS capacity and 2026 delivery lead times..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
                />
                <button
                  onClick={() => handleCollaborate(false)}
                  disabled={isRefining || !feedbackInput.trim()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-slate-200 px-3 py-1.5 rounded text-xs transition disabled:opacity-50"
                >
                  {isRefining ? "Steering..." : "Refine Plan"}
                </button>
                <button
                  onClick={() => handleCollaborate(true)}
                  disabled={isRefining}
                  className="bg-[#00f5d4] hover:bg-[#00e0c2] text-zinc-950 font-bold px-3 py-1.5 rounded text-xs transition disabled:opacity-50"
                >
                  Approve Plan
                </button>
              </div>
            </div>
          )}

          {/* Report Viewer / Results Area */}
          <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-6 min-h-[400px] max-h-[600px] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-xs text-slate-400">
              <span className="font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00f5d4]" />
                Synthesized Research Output
              </span>
              <span>{outputText ? `${outputText.split(" ").filter(Boolean).length} words` : "No output generated yet"}</span>
            </div>

            {outputText ? (
              <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 font-sans text-slate-300">
                {outputText.split("\n\n").map((chunk, idx) => {
                  if (chunk.startsWith("# ")) {
                    return <h1 key={idx} className="text-lg font-bold text-white border-b border-zinc-800 pb-2 mt-4 font-mono">{chunk.replace("# ", "")}</h1>;
                  }
                  if (chunk.startsWith("## ")) {
                    return <h2 key={idx} className="text-sm font-bold text-[#00f5d4] mt-4 mb-2 font-mono">{chunk.replace("## ", "")}</h2>;
                  }
                  if (chunk.startsWith("### ")) {
                    return <h3 key={idx} className="text-xs font-bold text-cyan-300 mt-3 mb-1 font-mono">{chunk.replace("### ", "")}</h3>;
                  }
                  if (chunk.startsWith("- ") || chunk.startsWith("* ")) {
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-1">
                        {chunk.split("\n").map((item, i) => (
                          <li key={i}>{item.replace(/^[-*]\s+/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx} className="leading-relaxed">{chunk}</p>;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 font-mono text-xs space-y-3">
                <Bot className="w-10 h-10 stroke-1 text-slate-700" />
                <p>Launch a research task above to observe real-time agent output.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 font-mono text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#00f5d4]" />
                <span className="font-bold text-sm text-white">Google GenAI Deep Research Script</span>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-zinc-800"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Executable Python code using the official <code>google-genai</code> SDK and the <code>deep-research-preview-04-2026</code> agent:
            </p>

            <div className="relative">
              <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-[11px] text-[#00f5d4] max-h-96 overflow-y-auto leading-relaxed">
                {pythonSnippet}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pythonSnippet);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1.5 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
