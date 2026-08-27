import React, { useState } from "react";
import { AudienceMode, CharacterId } from "../types";
import { CHARACTERS } from "../data/characters";
import { CharacterAvatar } from "./CharacterAvatar";
import { soundManager } from "../utils/audio";
import { Send, Sparkles, MessageSquare, Loader2, Bot } from "lucide-react";

interface Props {
  audience: AudienceMode;
}

interface ChatMessage {
  id: string;
  sender: "user" | "character";
  characterId?: CharacterId;
  text: string;
  timestamp: string;
}

export const TutorChat: React.FC<Props> = ({ audience }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>("clarita");
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-init",
      sender: "character",
      characterId: "clarita",
      text: "¡Hola, futuro gran ciudadano! Soy Clarita. Pregúntame sobre comprobantes de pago, el IGV 18%, cómo sacar tu RUC digital o por qué los tributos son el corazón de nuestro Perú.",
      timestamp: "Ahora",
    },
  ]);

  const quickQuestions = audience === "kids"
    ? [
        "¿Por qué siempre debo pedir boleta en la bodega?",
        "¿Qué pasa si compro un juguete 'bamba' de contrabando?",
        "¿Cómo ayuda Justus en el aeropuerto?",
      ]
    : [
        "¿Cómo saco mi RUC 10 gratis por la App Personas?",
        "¿Cuándo me retienen el 8% en un Recibo por Honorarios?",
        "¿Pagan impuestos las transferencias de Yape entre amigos?",
        "¿Qué me conviene más: Nuevo RUS o MYPE Tributario?",
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/ask-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          character: CHARACTERS[selectedCharacter]?.name || "Clarita",
          audience,
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `char-${Date.now()}`,
            sender: "character",
            characterId: selectedCharacter,
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        soundManager.playCoin();
      } else {
        throw new Error(data.error || "Error al recibir respuesta");
      }
    } catch (err) {
      // Smart offline fallback
      let fallbackText = "¡Excelente pregunta! Recuerda que en el Perú el IGV es del 18% y todo comprobante de pago legal debe contar con RUC de 11 dígitos y autorización de la SUNAT.";
      if (selectedCharacter === "justus") {
        fallbackText = "¡Guau! Justus te recuerda: los viajeros pueden ingresar 1 laptop personal y artículos hasta $500 libres de aranceles. ¡El contrabando daña a nuestra patria!";
      } else if (selectedCharacter === "mateo") {
        fallbackText = "¡Hola emprendedor! Si tus ventas no pasan de S/ 5,000 al mes, el Nuevo RUS es tu mejor opción pagando solo S/ 20 mensuales.";
      } else if (selectedCharacter === "evasif") {
        fallbackText = "¡Rayos! Clarita siempre me atrapa. Te confieso a regañadientes que no pedir boleta es una falta tributaria.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `char-${Date.now()}`,
          sender: "character",
          characterId: selectedCharacter,
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 z-10 relative">
          <div>
            <span className="text-xs uppercase font-black text-red-600 bg-red-50 border border-red-200 px-3.5 py-1 rounded-full shadow-2xs">
              Tutor Tributario SUNAT con IA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5">
              Conversa con los Personajes Oficiales
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Selecciona a tu guía favorito para recibir respuestas claras, ejemplos cotidianos y rigor normativo.
            </p>
          </div>

          {/* Character selector pills */}
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/90 shadow-2xs">
            {(["clarita", "mateo", "justus", "evasif"] as CharacterId[]).map((cid) => (
              <button
                key={cid}
                onClick={() => {
                  setSelectedCharacter(cid);
                  soundManager.playCoin();
                }}
                className={`p-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCharacter === cid
                    ? "bg-white shadow-xs border border-red-200 ring-2 ring-red-400/20 scale-105"
                    : "opacity-60 hover:opacity-100"
                }`}
                title={CHARACTERS[cid].name}
              >
                <CharacterAvatar character={cid} size="sm" />
                <span className="text-xs font-black hidden md:inline text-slate-800">
                  {CHARACTERS[cid].name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-slate-200/60 z-10 relative">
          <span className="text-[11px] font-black text-slate-400 shrink-0 uppercase tracking-wider">Preguntas sugeridas:</span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-white/80 hover:bg-white text-slate-700 font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border border-white/90 shadow-2xs shrink-0 cursor-pointer active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Chat Box */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-5 sm:p-7 shadow-xl h-[440px] flex flex-col justify-between mb-4">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.sender === "character" && msg.characterId && (
                <CharacterAvatar character={msg.characterId} size="sm" />
              )}
              <div
                className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-red-500 text-white rounded-br-none shadow-md"
                    : "bg-white/90 text-slate-800 rounded-bl-none border border-white/90 shadow-2xs"
                }`}
              >
                {msg.sender === "character" && msg.characterId && (
                  <span className="block font-black text-[10px] uppercase text-red-600 mb-1">
                    {CHARACTERS[msg.characterId].name} ({CHARACTERS[msg.characterId].role})
                  </span>
                )}
                <p className="font-medium">{msg.text}</p>
                <span className={`block text-[9px] mt-1.5 text-right font-bold ${msg.sender === "user" ? "text-red-100" : "text-slate-400"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs pl-2 font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              <span>{CHARACTERS[selectedCharacter].name} está escribiendo...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2.5 pt-3.5 border-t border-slate-200/60"
        >
          <input
            id="chat-user-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Hazle una pregunta sobre tributación o aduanas a ${CHARACTERS[selectedCharacter].name}...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/90 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-red-500 shadow-2xs"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-[0_3px_0_0_#b91c1c] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
