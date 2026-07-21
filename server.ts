import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the workspace secrets or environment properties.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Lazy-initialize Stripe Client
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured.");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// API Endpoints
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Producer Registry Premium Access' },
          unit_amount: 5000, // $50.00
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/?success=true`,
      cancel_url: `${process.env.APP_URL}/?canceled=true`
    });
    res.json({ id: session.id });
  } catch (error: any) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message || "Payment session creation failed." });
  }
});

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Synthesize research data using Gemini
app.post("/api/synthesize", async (req, res) => {
  try {
    const { text, type } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text content is required for intelligence synthesis." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Simulate synthesis gracefully so app is fully functional even without a key on launch
      return res.json({
        synthesized: true,
        simulation: true,
        summary: `[Simulation Mode - Add GEMINI_API_KEY to test actual AI models] Here is a synthesized analysis of: "${text.substring(0, 100)}..."`,
        signals: [
          {
            title: "Accelerated Market Decoupling",
            impact: "High",
            stage: "Consolidation",
            whyItMatters: "Rapid adoption shifts capabilities toward automated, self-governing frameworks.",
            implication: "Resource control transfers away from fixed physical endpoints to active cognitive streams.",
            opportunity: "Develop modular abstraction agents that capture low-risk arbitrage pathways."
          }
        ],
        patterns: [
          {
            title: "Frictionless Capture Loops",
            strength: "7/8",
            impact: "High",
            observation: "High-latency intake pathways restrict actionable intelligence compounds.",
            implication: "Simplicity at the top level is mandatory for high-tier strategic retention.",
            opportunity: "Create zero-friction inbox buffers that hold raw signals before indexing."
          }
        ],
        updatedThesis: "AI compresses operational delay, shifting competitive advantages directly to execution velocity and structured knowledge mapping."
      });
    }

    const client = getGeminiClient();
    
    // Call Gemini with Structured Outputs depending on user's synthesis goals
    const prompt = `You are a Principal AI Strategist and Intelligence Architect. Analyze the following user research text/observations/signals and partition them into highly actionable key signals, patterns, and a summarized core thesis update.
Text for analysis:
"""
${text}
"""
Based on your analysis, define associated new Signals, key Patterns, and core strategic directions.`;

    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "signals", "patterns", "updatedThesis"],
          properties: {
            summary: {
              type: Type.STRING,
              description: "A solid, high-impact clinical synthesis of the analyzed content."
            },
            signals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "impact", "stage", "whyItMatters", "implication", "opportunity"],
                properties: {
                  title: { type: Type.STRING },
                  impact: { type: Type.STRING, description: "High, Medium, or Low" },
                  stage: { type: Type.STRING, description: "Exploration, Acceleration, or Consolidation" },
                  whyItMatters: { type: Type.STRING },
                  implication: { type: Type.STRING },
                  opportunity: { type: Type.STRING }
                }
              }
            },
            patterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "strength", "impact", "observation", "implication", "opportunity"],
                properties: {
                  title: { type: Type.STRING },
                  strength: { type: Type.STRING, description: "e.g. 7/8, 8/8" },
                  impact: { type: Type.STRING, description: "High, Medium, or Low" },
                  observation: { type: Type.STRING },
                  implication: { type: Type.STRING },
                  opportunity: { type: Type.STRING }
                }
              }
            },
            updatedThesis: {
              type: Type.STRING,
              description: "Actionable adjustments to make to the strategic investment or operational thesis."
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({
      synthesized: true,
      simulation: false,
      ...parsedData
    });
  } catch (error: any) {
    console.error("Synthesis error:", error);
    let errorMessage = error.message || "An unexpected error occurred during synthesis.";
    if (errorMessage.includes("API key not valid")) {
      errorMessage = "The Gemini API key is invalid. Please check your settings and ensure a valid key is provided.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

// Intelligent Advisory Chat Routing
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "A list of chat messages is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return beautiful conversational simulation to avoid throwing 500
      const lastMsg = messages[messages.length - 1]?.content || "";
      return res.json({
        content: `[Simulation Mode - GEMINI_API_KEY is not set] I have received your request about: "${lastMsg}". To run actual AI advisory models and receive active market intelligence guidance, please enter your Gemini API key in the platform Settings panel. \n\nStrategic Note: Simplicity scales better than complexity. We should filter out redundant nodes and focus on raw execution velocity!`,
        simulation: true
      });
    }

    const client = getGeminiClient();
    
    // Format messages into Content array for Gemini
    const systemInstruction = `You are a world-class Strategic Advisor. Guide the developer workspace holder using their AI Strategic Intelligence Vault contexts. Provide highly critical, actionable, and human-readable responses. Avoid tech-larping or fake logging lines. Use professional, clinical prose. Here is the active vault context: ${JSON.stringify(systemContext || {})}`;
    
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({
      content: response.text || "",
      simulation: false
    });
  } catch (error: any) {
    console.error("Chat proxy error:", error);
    let errorMessage = error.message || "Error running advisor model query.";
    if (errorMessage.includes("API key not valid")) {
      errorMessage = "The Gemini API key is invalid. Please check your settings and ensure a valid key is provided.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

// Configure Vite dynamic middleware serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing live on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Main bootstrap crashed:", err);
});
