import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import CropReport from "./models/cropReport";

type CropReportInput = {
  cropName?: unknown;
  cropType?: unknown;
  detectedCondition?: unknown;
  condition?: unknown;
  confidenceScore?: unknown;
  confidence?: unknown;
  damageSeverity?: unknown;
  damage?: unknown;
  treatmentSuggestions?: unknown;
  suggestions?: unknown;
  diagnosticType?: unknown;
  status?: unknown;
  capturedAt?: unknown;
  fileName?: unknown;
  imageName?: unknown;
  cropImage?: unknown;
  cropImageUrl?: unknown;
  pmfbyClaimFiled?: unknown;
};

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numericValue));
}

function deriveDamageSeverity(condition: string, currentSeverity: number): number {
  const normalizedCondition = condition.toLowerCase();
  const highRiskKeywords = ["severe", "rot", "blight", "infestation"];
  const hasHighRiskKeyword = highRiskKeywords.some((keyword) => normalizedCondition.includes(keyword));

  if (hasHighRiskKeyword) {
    return Math.max(currentSeverity, 85);
  }

  if (currentSeverity > 0) {
    return currentSeverity;
  }

  return 5;
}

function deriveStatus(condition: string, damageSeverity: number): string {
  const normalizedCondition = condition.toLowerCase();
  const hasCriticalKeyword = ["severe", "rot", "blight", "infestation"].some((keyword) =>
    normalizedCondition.includes(keyword)
  );

  if (hasCriticalKeyword || damageSeverity > 60) {
    return "Critical";
  }

  if (damageSeverity >= 15) {
    return "Monitor";
  }

  return "Healthy";
}

function normalizeCropReportInput(report: CropReportInput) {
  const detectedCondition = String(report.detectedCondition || report.condition || "Unknown condition").trim();
  const confidenceScore = clampNumber(report.confidenceScore ?? report.confidence, 0, 100, 0);
  const initialSeverity = clampNumber(report.damageSeverity ?? report.damage, 0, 100, 5);
  const damageSeverity = deriveDamageSeverity(detectedCondition, initialSeverity);
  const status = deriveStatus(detectedCondition, damageSeverity);

  return {
    cropName: String(report.cropName || report.cropType || "Unknown crop").trim(),
    detectedCondition,
    confidenceScore,
    damageSeverity,
    treatmentSuggestions: Array.isArray(report.treatmentSuggestions)
      ? report.treatmentSuggestions.map((item) => String(item)).filter(Boolean)
      : Array.isArray(report.suggestions)
        ? report.suggestions.map((item) => String(item)).filter(Boolean)
        : [],
    diagnosticType: String(report.diagnosticType || report.cropType || "Crop Analysis").trim(),
    status,
    capturedAt: report.capturedAt ? new Date(String(report.capturedAt)) : new Date(),
    fileName: String(report.fileName || report.imageName || "image.jpg").trim(),
    cropImage: String(report.cropImage || report.cropImageUrl || "").trim() || undefined,
    pmfbyClaimFiled: Boolean(report.pmfbyClaimFiled),
  };
}

// Load environment variables from .env
dotenv.config();
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Lazy initialize the Gemini client to avoid crashing on boot if the key is not defined yet
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in your environment or .env file.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Set standard limits on body parser to handle high-resolution image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use("/api/auth", authRoutes);

  // API: Analyze crop disease image using the backend-hidden Gemini client
  app.post("/api/analyze-crop", async (req, res) => {
    try {
      const { base64Image, language } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: "Missing crop image data" });
      }

      const client = getGeminiClient();
      const model = "gemini-3-flash-preview";
      const prompt = `Analyze this crop image. 
  1. Identify the crop type if possible.
  2. Detect any diseases, pests, or nutrient deficiencies.
  3. Provide a 'Detected Condition' (short name).
  4. Provide 'Treatment Suggestions' (bullet points).
  5. Provide a confidence score.
  
  IMPORTANT: Provide all text fields ("cropType", "condition", "suggestions") in the language corresponding to this code: ${language || 'en'}.
  
  Format the response as JSON:
  {
    "cropType": "string",
    "condition": "string",
    "suggestions": ["string"],
    "confidence": number
  }`;

      const imageParts = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

      const response = await client.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: imageParts } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      const parsed = JSON.parse(resultText);
      res.json(parsed);
    } catch (error: any) {
      console.error("Error analyzing crop image in server API:", error);
      res.status(500).json({ error: error?.message || "Failed to analyze crop image" });
    }
  });

  app.post("/api/cropreports", async (req, res) => {
    try {
      const report = req.body?.report;
      if (!report || typeof report !== "object") {
        return res.status(400).json({ error: "Missing crop report data" });
      }

      const normalizedReport = normalizeCropReportInput(report as CropReportInput);
      const savedReport = await CropReport.create(normalizedReport);

      res.status(201).json({ message: "Crop report saved successfully", report: savedReport });
    } catch (error: any) {
      console.error("Error saving crop report:", error);
      res.status(500).json({ error: error?.message || "Failed to save crop report" });
    }
  });

  app.get("/api/cropreports", async (_req, res) => {
    try {
      const reports = await CropReport.find({}).sort({ capturedAt: -1, createdAt: -1 }).lean();
      res.json(reports);
    } catch (error: any) {
      console.error("Error fetching crop reports:", error);
      res.status(500).json({ error: error?.message || "Failed to fetch crop reports" });
    }
  });

  app.delete("/api/cropreports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedReport = await CropReport.findByIdAndDelete(id);

      if (!deletedReport) {
        return res.status(404).json({ error: "Crop report not found" });
      }

      res.json({ message: "Crop report deleted successfully", id });
    } catch (error: any) {
      console.error("Error deleting crop report:", error);
      res.status(500).json({ error: error?.message || "Failed to delete crop report" });
    }
  });

  // API: AgriLens intelligent crop Assistant Chat proxy
  app.post("/api/chat-assistant", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message input is required" });
      }

      const client = getGeminiClient();
      const model = "gemini-3-flash-preview";
      const systemInstruction = `You are AgriLens Assistant, a helpful digital farming expert. 
  You help farmers with:
  - Crop disease detection and treatment.
  - PMFBY (Pradhan Mantri Fasal Bima Yojana) insurance policies and claims.
  - Kharif and Rabi season advice.
  - General farming practices.
  
  Always be professional, helpful, and use farming emojis. 
  If the user asks about insurance, explain the benefits of PMFBY.
  If they ask about seasons, mention Kharif (June-Oct) and Rabi (Oct-March).`;

      const chat = client.chats.create({
        model,
        config: {
          systemInstruction
        },
        history: history || []
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text || "" });
    } catch (error: any) {
      console.error("Error invoking assistant in server API:", error);
      res.status(500).json({ error: error?.message || "Failed to get AI assistant guidance" });
    }
  });

  // API: Health probe
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Serve Frontend: Vite handler in development mode, client build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AgriLens Server] running securely on http://localhost:${PORT}`);
  });
}

startServer();
