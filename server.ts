import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with server-side API Key
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "SUNAT Go!",
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Lesson Generator Endpoint using Gemini 3.7 Flash
app.post("/api/gemini/generate-lesson", async (req, res) => {
  try {
    const { topic, audience, character = "Clarita" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY no configurada. Usa las lecciones precargadas o añade tu clave en Settings > Secrets.",
      });
    }

    const systemPrompt = `Eres un diseñador de experiencia de usuario (UX) y educador gamificado especializado en la normativa tributaria y aduanera de la SUNAT en Perú para la aplicación "SUNAT Go!".

Pautas obligatorias:
1. TONO: Dinámico, didáctico, motivador con referencias peruanas (bodegas, Yape/Plin, Gamarra, cevicherías, ferias).
2. PERSONAJES: Clarita (guía inteligente y amable), Mateo (joven emprendedor/estudiante), Justus (perro aduanero sabueso), Evasif (villano evasor pícaro).
3. PÚBLICO:
   - Si es "kids" (Niños 8-12): Bien común, civismo, pedir boleta de venta, evitar contrabando/piratería con minijuegos simples.
   - Si es "youth" (Jóvenes 13-18+): RUC 10/20, Clave SOL, comprobantes electrónicos, IGV 18% (16%+2% IPM), regímenes (NRUS, RER, RMT, RG), freelancers, Yape/Plin.
4. RIGOR TÉCNICO PERUANO: Tasas vigentes (IGV 18%), comprobantes válidos, RUC 11 dígitos, obligatoriedad de boleta desde S/ 5.00, etc.

Debes devolver un JSON con esta estructura exacta:
{
  "moduloNivel": "Módulo X - Nivel Y: [Nombre descriptivo]",
  "objetivoPedagogico": "[Qué aprende el usuario de forma concreta]",
  "personajeGuia": "${character}",
  "dialogoPersonaje": "[Texto breve, motivador y con jerga peruana respetuosa del personaje]",
  "mecanicaEjercicio": "[Tipo: 'multiple_choice' | 'invoice_inspector' | 'customs_detector' | 'tax_calculator']",
  "explicacionTeorica": "[Breve píldora educativa de 2 oraciones sobre el tema]",
  "preguntas": [
    {
      "id": "q1",
      "pregunta": "[Texto de la pregunta contextualizada en Perú]",
      "contextoPeruano": "[Ej: En la bodega de Don Lucho, comprando en Polvos Azules, etc.]",
      "tipo": "multiple_choice",
      "opciones": [
        { "id": "a", "texto": "[Opción A]", "esCorrecta": true, "retroalimentacion": "[Por qué es correcta]" },
        { "id": "b", "texto": "[Opción B]", "esCorrecta": false, "retroalimentacion": "[Por qué es incorrecta]" },
        { "id": "c", "texto": "[Opción C]", "esCorrecta": false, "retroalimentacion": "[Por qué es incorrecta]" },
        { "id": "d", "texto": "[Opción D]", "esCorrecta": false, "retroalimentacion": "[Por qué es incorrecta]" }
      ],
      "consejoClarita": "[Un tip clave de cultura tributaria]"
    }
  ]
}`;

    const promptText = `Genera una lección interactiva para SUNAT Go! sobre el tema: "${topic || "Importancia de pedir boleta de venta"}".
Público objetivo: ${audience === "kids" ? "Niños (8-12 años)" : "Jóvenes y Emprendedores (13-18+ años)"}.
Personaje guía principal: ${character}.
Genera 2 o 3 preguntas dinámicas. Devuelve ÚNICAMENTE el JSON válido.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const outputText = response.text || "{}";
    const lessonData = JSON.parse(outputText);
    return res.json({ success: true, lesson: lessonData });
  } catch (error: any) {
    console.error("Error generating lesson:", error);
    return res.status(500).json({
      error: error.message || "Error al procesar la lección con Gemini",
    });
  }
});

// AI Tutor chat endpoint
app.post("/api/gemini/ask-tutor", async (req, res) => {
  try {
    const { question, character = "Clarita", audience = "youth" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY no configurada.",
      });
    }

    const characterPersonas: Record<string, string> = {
      Clarita: "Eres Clarita, la simpática y brillante experta en Cultura Tributaria de la SUNAT. Explica con claridad, calidez, ejemplos cotidianos de Perú y metáforas sencillas.",
      Mateo: "Eres Mateo, un joven estudiante y emprendedor peruano entusiasta. Te encanta aprender sobre RUC, cómo formalizar tu emprendimiento y consejos prácticos.",
      Justus: "Eres Justus, el noble perro aduanero sabueso de la SUNAT. Hablas con lealtad y astucia protegiendo las fronteras peruanas del contrabando y la piratería. A veces ladras amistosamente '¡Guau!' o dices que tu olfato no falla.",
      Evasif: "Eres Evasif, el pícaro villano evasor que intentaba no pagar impuestos pero Clarita y Justus siempre descubren tus trucos. Eres sarcástico pero al final admites a regañadientes las reglas tributarias.",
    };

    const systemPrompt = `${characterPersonas[character] || characterPersonas.Clarita}
Estás en la app 'SUNAT Go!'. Dirígete a un público ${audience === "kids" ? "infantil (8-12 años, sé muy didáctico y visual)" : "juvenil/emprendedor (13-18+, enfócate en trámites reales, RUC, IGV, recibos por honorarios, Yape/Plin)"}.
Responde en un párrafo conciso (máximo 3-4 oraciones) en español con mucho entusiasmo peruano y rigor legal SUNAT.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text,
      character,
    });
  } catch (error: any) {
    console.error("Error in ask-tutor:", error);
    return res.status(500).json({
      error: error.message || "Error al consultar al tutor tributario",
    });
  }
});

// Vite Middleware & SPA Serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SUNAT Go! Server running on http://localhost:${PORT}`);
  });
}

start();
