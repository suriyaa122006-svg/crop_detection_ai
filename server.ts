import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";

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
