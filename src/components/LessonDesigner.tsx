import React, { useState } from "react";
import { AudienceMode, CharacterId, Lesson, Module } from "../types";
import { CURRICULUM_DATA } from "../data/curriculum";
import { CHARACTERS } from "../data/characters";
import { CharacterAvatar } from "./CharacterAvatar";
import { soundManager } from "../utils/audio";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  FileText, 
  BookOpen, 
  Wand2, 
  HelpCircle,
  Layers,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";

interface Props {
  audience: AudienceMode;
  onPlayLesson: (lesson: Lesson) => void;
}

export const LessonDesigner: React.FC<Props> = ({ audience, onPlayLesson }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("kids-mod-1");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("k-1-1");
  const [copied, setCopied] = useState(false);

  // AI Generator state
  const [aiTopic, setAiTopic] = useState("");
  const [aiAudience, setAiAudience] = useState<AudienceMode>(audience);
  const [aiCharacter, setAiCharacter] = useState<CharacterId>("clarita");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<Lesson | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Pre-configured modules for current audience
  const filteredModules = CURRICULUM_DATA.filter((m) => m.audience === audience);
  const currentModule = CURRICULUM_DATA.find((m) => m.id === selectedModuleId) || filteredModules[0];
  const activeLesson = generatedLesson || currentModule?.lecciones.find((l) => l.id === selectedLessonId) || currentModule?.lecciones[0];

  // Helper to format structured markdown
  const getStructuredMarkdown = (l: Lesson) => {
    return `### **Módulo y Nivel:** ${l.moduloNivel}
**Objetivo pedagógico:** ${l.objetivoPedagogico}
**Diálogo del personaje guía (${CHARACTERS[l.personajeGuia]?.name}):** "${l.dialogoPersonaje}"
**Mecánica del ejercicio:** ${
      l.mecanicaEjercicio === "multiple_choice"
        ? "Selección múltiple con contextualización cotidiana"
        : l.mecanicaEjercicio === "invoice_inspector"
        ? "Inspector de comprobantes (identificación de inconsistencias en RUC/IGV)"
        : l.mecanicaEjercicio === "customs_detector"
        ? "Control aduanero y clasificación de equipaje/mercancías"
        : "Simulador de cálculo numérico de tributos (IGV 18% / Renta 8%)"
    }

**Contenido/Opciones:**
${l.preguntas
  .map(
    (q, idx) => `* **Pregunta ${idx + 1}:** ${q.pregunta}
${q.opciones.map((o) => `  - [${o.esCorrecta ? "x" : " "}] ${o.texto}`).join("\n")}`
  )
  .join("\n\n")}

**Feedback/Retroalimentación:**
${l.preguntas
  .map(
    (q, idx) => `* **Pregunta ${idx + 1}:**
${q.opciones.map((o) => `  - *${o.texto.slice(0, 40)}...*: ${o.retroalimentacion}`).join("\n")}`
  )
  .join("\n\n")}`;
  };

  const handleCopyMarkdown = () => {
    if (!activeLesson) return;
    const text = getStructuredMarkdown(activeLesson);
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundManager.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/gemini/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          audience: aiAudience,
          character: CHARACTERS[aiCharacter]?.name || "Clarita",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error generando la lección");
      }

      if (data.lesson) {
        const fullLesson: Lesson = {
          id: `gen-${Date.now()}`,
          moduloNivel: data.lesson.moduloNivel || `Módulo Especial: ${aiTopic}`,
          titulo: aiTopic,
          descripcion: data.lesson.objetivoPedagogico || "Lección generada con IA para SUNAT Go!",
          objetivoPedagogico: data.lesson.objetivoPedagogico,
          personajeGuia: aiCharacter,
          dialogoPersonaje: data.lesson.dialogoPersonaje,
          mecanicaEjercicio: data.lesson.mecanicaEjercicio || "multiple_choice",
          explicacionTeorica: data.lesson.explicacionTeorica || "La cultura tributaria fomenta la formalidad y el desarrollo de nuestro país.",
          preguntas: data.lesson.preguntas || [],
          recompensaSoles: 60,
          recompensaXP: 100,
          audience: aiAudience,
        };
        setGeneratedLesson(fullLesson);
        soundManager.playVictory();
      }
    } catch (err: any) {
      setGenError(err.message || "No se pudo conectar con el servidor Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentCharacter = activeLesson ? CHARACTERS[activeLesson.personajeGuia] : CHARACTERS.clarita;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Banner: Designer Studio Info */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-8 text-slate-900 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3.5 py-1 rounded-full text-xs font-black text-red-600 mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Estudio de Diseño Pedagógico & UX SUNAT Go!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
              Diseñador de Lecciones y Dinámicas Gamificadas
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Crea, inspecciona y exporta unidades didácticas bajo los 6 pilares obligatorios de Cultura Tributaria SUNAT, integrando personajes oficiales, jerga peruana y rigor técnico.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md p-3.5 rounded-3xl border border-white/80 shadow-sm">
            <CharacterAvatar character="clarita" size="md" />
            <CharacterAvatar character="mateo" size="md" />
            <CharacterAvatar character="justus" size="md" />
            <CharacterAvatar character="evasif" size="md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Module Catalog & AI Generator Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Generator Box */}
          <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-[2rem] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200 shadow-2xs">
                <Wand2 className="w-4 h-4" />
              </div>
              <h2 className="font-black text-base text-slate-900">
                Generador de Lecciones con IA (Gemini)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Ingresa cualquier tema tributario o aduanero peruano y genera una lección estructurada al instante.
            </p>

            <form onSubmit={handleGenerateAI} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                  Tema o Caso Específico:
                </label>
                <input
                  id="ai-topic-input"
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ej: Cobros por Yape en feria de libros, Importar zapatillas por courier..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-slate-200 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                    Público Objetivo:
                  </label>
                  <select
                    id="ai-audience-select"
                    value={aiAudience}
                    onChange={(e) => setAiAudience(e.target.value as AudienceMode)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/90 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-2xs"
                  >
                    <option value="kids">Niños (8-12 años)</option>
                    <option value="youth">Jóvenes (13-18+ años)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                    Personaje Guía:
                  </label>
                  <select
                    id="ai-character-select"
                    value={aiCharacter}
                    onChange={(e) => setAiCharacter(e.target.value as CharacterId)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/90 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-2xs"
                  >
                    <option value="clarita">Clarita (Guía General)</option>
                    <option value="mateo">Mateo (Emprendimiento)</option>
                    <option value="justus">Justus (Aduanas)</option>
                    <option value="evasif">Evasif (Villano Evasor)</option>
                  </select>
                </div>
              </div>

              {genError && (
                <div className="p-3.5 bg-rose-50/90 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
                  {genError}
                </div>
              )}

              <button
                id="generate-ai-lesson-btn"
                type="submit"
                disabled={isGenerating || !aiTopic.trim()}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Diseñando Lección Pedagógica...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar Lección Estructurada</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Module Catalog Selector */}
          <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-[2rem] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-red-600" />
              <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                Catálogo de Lecciones Oficiales
              </h2>
            </div>

            <div className="space-y-3">
              {filteredModules.map((mod) => (
                <div key={mod.id} className="bg-white/80 border border-white/90 rounded-2xl p-3.5 shadow-2xs">
                  <div className="font-black text-xs text-slate-900 mb-2 flex items-center justify-between">
                    <span>Módulo {mod.numero}: {mod.titulo}</span>
                    <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-100">
                      {mod.lecciones.length} lecciones
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {mod.lecciones.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setSelectedLessonId(l.id);
                          setGeneratedLesson(null);
                          soundManager.playCoin();
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                          activeLesson?.id === l.id && !generatedLesson
                            ? "bg-red-500 text-white shadow-xs"
                            : "bg-slate-50/80 text-slate-700 hover:bg-red-50/50 hover:text-red-700"
                        }`}
                      >
                        <span className="truncate mr-2">{l.titulo}</span>
                        <CharacterAvatar character={l.personajeGuia} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Lesson Specification Card (7 cols) */}
        <div className="lg:col-span-7">
          {activeLesson ? (
            <div className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <CharacterAvatar character={activeLesson.personajeGuia} size="md" />
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-3 py-0.5 rounded-full">
                      {activeLesson.moduloNivel}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 mt-1.5">
                      {activeLesson.titulo}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    id="copy-structured-markdown-btn"
                    onClick={handleCopyMarkdown}
                    className="px-4 py-2.5 bg-white/90 hover:bg-white text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                    title="Copiar formato Markdown estructurado"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "¡Copiado!" : "Copiar Markdown"}</span>
                  </button>

                  <button
                    id="play-designed-lesson-btn"
                    onClick={() => onPlayLesson(activeLesson)}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#047857] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Jugar Lección</span>
                  </button>
                </div>
              </div>

              {/* 6-Field Standardized Pedagogical Presentation */}
              <div className="space-y-5 text-sm">
                {/* 1. Módulo y Nivel */}
                <div className="bg-white/80 p-4 rounded-2xl border border-white/90 shadow-2xs">
                  <span className="font-black text-xs text-red-700 uppercase tracking-wider block mb-1">
                    📌 1. Módulo y Nivel:
                  </span>
                  <p className="text-slate-800 font-bold">{activeLesson.moduloNivel}</p>
                </div>

                {/* 2. Objetivo Pedagógico */}
                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 shadow-2xs">
                  <span className="font-black text-xs text-red-700 uppercase tracking-wider block mb-1">
                    🎯 2. Objetivo Pedagógico:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {activeLesson.objetivoPedagogico}
                  </p>
                </div>

                {/* 3. Diálogo del Personaje Guía */}
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 shadow-2xs">
                  <div className="text-2xl">💬</div>
                  <div>
                    <span className="font-black text-xs text-amber-900 uppercase tracking-wider block mb-1">
                      3. Diálogo del Personaje Guía ({currentCharacter?.name} - {currentCharacter?.role}):
                    </span>
                    <p className="text-slate-800 italic font-medium">
                      "{activeLesson.dialogoPersonaje}"
                    </p>
                  </div>
                </div>

                {/* 4. Mecánica del Ejercicio */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="font-black text-xs text-slate-800 uppercase tracking-wider block mb-1">
                    ⚙️ 4. Mecánica del Ejercicio:
                  </span>
                  <p className="text-slate-800 font-medium">
                    {activeLesson.mecanicaEjercicio === "multiple_choice"
                      ? "Selección múltiple con contextualización cotidiana y retroalimentación instantánea."
                      : activeLesson.mecanicaEjercicio === "invoice_inspector"
                      ? "Inspector de comprobantes: visualización interactiva para detectar inconsistencias en RUC de 11 dígitos, IGV y autorizaciones."
                      : activeLesson.mecanicaEjercicio === "customs_detector"
                      ? "Simulador de Aduanas y Rayos X con Justus: clasificación de bienes inafectos vs mercancía prohibida."
                      : "Calculadora interactiva de tasas tributarias (IGV 18% / Retención Renta 8%)."}
                  </p>
                </div>

                {/* 5. Contenido y Opciones */}
                <div className="bg-white/80 p-4 rounded-2xl border border-white/90 shadow-2xs">
                  <span className="font-black text-xs text-slate-900 uppercase tracking-wider block mb-2">
                    📋 5. Contenido / Opciones de Pregunta:
                  </span>
                  <div className="space-y-4">
                    {activeLesson.preguntas.map((q, idx) => (
                      <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">
                          Pregunta {idx + 1}: {q.pregunta}
                        </p>
                        {q.contextoPeruano && (
                          <p className="text-[11px] text-slate-500 italic">
                            Contexto: {q.contextoPeruano}
                          </p>
                        )}
                        <ul className="space-y-1.5 pl-2">
                          {q.opciones.map((o) => (
                            <li
                              key={o.id}
                              className={`text-xs p-2 rounded-lg flex items-start gap-2 ${
                                o.esCorrecta
                                  ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200"
                                  : "bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span className="font-bold shrink-0">{o.esCorrecta ? "✅ [Correcta]" : "❌"}</span>
                              <span>{o.texto}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Feedback / Retroalimentación */}
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                  <span className="font-black text-xs text-emerald-900 uppercase tracking-wider block mb-2">
                    💡 6. Feedback / Retroalimentación Pedagógica:
                  </span>
                  <div className="space-y-3">
                    {activeLesson.preguntas.map((q, idx) => (
                      <div key={q.id} className="text-xs space-y-1.5">
                        <p className="font-bold text-slate-800">Pregunta {idx + 1}:</p>
                        {q.opciones.map((o) => (
                          <div key={o.id} className="pl-3 border-l-2 border-slate-300 text-slate-700">
                            <span className="font-semibold text-slate-900">
                              {o.esCorrecta ? "Al acertar: " : "Al fallar con esta opción: "}
                            </span>
                            {o.retroalimentacion}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-12 text-center text-slate-400">
              Selecciona una lección para ver su diseño pedagógico.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
