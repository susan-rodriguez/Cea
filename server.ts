import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Enable simple CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
  });

  // REST API route to query cognitive core for the strategical environmental axis
  app.post("/api/eje-ambiental", async (req, res) => {
    const { eje } = req.body;
    if (!eje) {
      return res.status(400).json({ error: "Debe proveer un Eje Ambiental Estratégico" });
    }

    try {
      const systemInstruction = `Eres el núcleo de Inteligencia Ambiental Cognitiva para el Tótem de Señalética Interactiva del Centro de Educación Ambiental (CEA). Tu objetivo es proveer contenido educativo dinámico y actividades de gamificación a los visitantes, bajo los lineamientos de la Ley 19.300 (Bases Generales del Medio Ambiente en Chile).

Cuando recibas el nombre de un Eje Ambiental Estratégico, debes responder ESTRICTAMENTE con un objeto JSON que contenga las siguientes llaves:
1. "contenido_educativo": Un texto conciso, pedagógico y de alto impacto (máximo 45 palabras) que entregue un dato relevante, estadística o consejo práctico sobre el eje seleccionado. Debe usar un lenguaje accesible pero técnico.
2. "url_trivia": Una URL simulada y parametrizada para redirigir al usuario a la PWA móvil del juego interactivo.

Reglas críticas de comportamiento:
- Responde ÚNICAMENTE con el formato JSON crudo.
- No incluyas bloques de código con la palabra \`\`\`json o \`\`\`. 
- No saludes, no des introducciones ni cierres corporativos. 
- La consistencia del formato es vital para no romper la capa de persistencia y lógica del backend en Flask.`;

      // Call Gemini 3.5 Flash for the environmental core
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: eje,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1, // low temperature for strict adherence to rules and formatting
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text || "{}";

      // Parsea de forma segura para validar, pero también guardaremos la respuesta original cruda para que el usuario pueda validarla.
      let parsed = null;
      let originalRaw = rawText;
      try {
        parsed = JSON.parse(rawText.trim());
      } catch (parseErr) {
        // En caso excepcional que añada markdown, limpiamos para no romper el flujo
        const cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleanedText);
      }

      res.json({
        success: true,
        rawResponse: originalRaw,
        payload: parsed,
      });

    } catch (error: any) {
      console.error("Error en Inteligencia Cognitiva:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error al conectar con el Núcleo Cognitivo.",
      });
    }
  });

  // Serve static UI representation of Ley 19.300 reference for Flask backend simulation
  app.get("/api/config-flask", (req, res) => {
    res.json({
      status: "activo",
      ley: "Ley 19.300 de Bases Generales del Medio Ambiente",
      pais: "Chile",
      flask_version: "2.3.2",
      python_version: "3.10.8",
      endpoint_ejemplo: "/api/eje-ambiental",
    });
  });

  // Vite middleware for development or Static server for production
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
