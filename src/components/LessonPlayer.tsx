import React, { useState } from "react";
import { Lesson, Question, CharacterId } from "../types";
import { CharacterAvatar } from "./CharacterAvatar";
import { CHARACTERS } from "../data/characters";
import { soundManager } from "../utils/audio";
import confetti from "canvas-confetti";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  Coins, 
  Trophy, 
  AlertTriangle,
  RotateCcw,
  Check,
  Eye,
  FileCheck
} from "lucide-react";

interface Props {
  lesson: Lesson;
  onFinish: (result: { passed: boolean; solesEarned: number; xpEarned: number }) => void;
  onExit: () => void;
  userVidas: number;
  onDeductLife: () => void;
}

export const LessonPlayer: React.FC<Props> = ({
  lesson,
  onFinish,
  onExit,
  userVidas,
  onDeductLife,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Inspector state
  const [inspectorRevealed, setInspectorRevealed] = useState(false);

  const currentQ: Question | undefined = lesson.preguntas[currentQuestionIndex];
  const progressPercent = Math.round(
    ((currentQuestionIndex + (hasAnswered ? 1 : 0)) / lesson.preguntas.length) * 100
  );

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleVerify = () => {
    if (!currentQ || !selectedOptionId || hasAnswered) return;

    const chosen = currentQ.opciones.find((o) => o.id === selectedOptionId);
    if (!chosen) return;

    setHasAnswered(true);
    if (chosen.esCorrecta) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      soundManager.playCorrect();
    } else {
      setIsCorrect(false);
      soundManager.playIncorrect();
      onDeductLife();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < lesson.preguntas.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
      setIsCorrect(false);
      setInspectorRevealed(false);
    } else {
      // Completed lesson
      setIsCompleted(true);
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    }
  };

  const character = CHARACTERS[lesson.personajeGuia] || CHARACTERS.clarita;

  if (isCompleted) {
    const passed = score >= Math.ceil(lesson.preguntas.length * 0.6);
    const solesReward = passed ? lesson.recompensaSoles : Math.floor(lesson.recompensaSoles / 2);
    const xpReward = passed ? lesson.recompensaXP : Math.floor(lesson.recompensaXP / 2);

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-red-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg border-4 border-white">
            <Trophy className="w-12 h-12 text-amber-900" />
          </div>

          <span className="text-xs uppercase tracking-widest font-black text-red-600 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full">
            {lesson.moduloNivel}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 mb-2 tracking-tight">
            {passed ? "¡Lección Completada con Éxito!" : "¡Buen Intento, Ciudadano!"}
          </h2>

          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            {passed
              ? "Has demostrado un sólido conocimiento tributario y aduanero. ¡El Perú cuenta con ciudadanos informados como tú!"
              : "La cultura tributaria se construye practicando. Revisa los conceptos y vuelve a intentarlo para ganar el 100% de recompensas."}
          </p>

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col items-center shadow-xs">
              <Coins className="w-8 h-8 text-amber-500 mb-1 fill-amber-400" />
              <span className="text-2xl font-black text-amber-800">+{solesReward}</span>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Soles Ganados</span>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col items-center shadow-xs">
              <Sparkles className="w-8 h-8 text-red-500 mb-1" />
              <span className="text-2xl font-black text-red-700">+{xpReward}</span>
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Puntos XP</span>
            </div>
          </div>

          {/* Final Character Dialogue */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex items-center gap-4 text-left max-w-lg mx-auto mb-8 shadow-xs">
            <CharacterAvatar character={lesson.personajeGuia} size="md" mood={passed ? "proud" : "thinking"} />
            <div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{character.name}</p>
              <p className="text-xs text-slate-600 italic">
                {passed
                  ? `"${character.quote}"`
                  : `"¡No te rindas! Recuerda que cada acierto protege los servicios públicos de nuestra comunidad."`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="lesson-finish-collect-btn"
              onClick={() => onFinish({ passed, solesEarned: solesReward, xpEarned: xpReward })}
              className="w-full sm:w-auto px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-[0_6px_0_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all text-sm flex items-center justify-center gap-2 tracking-wider uppercase"
            >
              <span>Continuar en la Senda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedOptionId(null);
                setHasAnswered(false);
                setIsCorrect(false);
                setScore(0);
                setIsCompleted(false);
              }}
              className="w-full sm:w-auto px-6 py-4 bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 font-bold rounded-2xl border border-white/80 shadow-xs transition-all text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir Lección</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedOption = currentQ?.opciones.find((o) => o.id === selectedOptionId);

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 px-4 animate-in fade-in duration-200">
      {/* Top Header: Progress Bar & Exit Button */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
        <button
          onClick={onExit}
          className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xs border border-white/80 text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0"
          title="Salir al mapa"
        >
          <XCircle className="w-5 h-5 text-slate-500" />
        </button>

        {/* Dynamic Progress Bar */}
        <div className="flex-1 max-w-xl bg-slate-200/80 backdrop-blur-sm h-4 rounded-full overflow-hidden p-0.5 shadow-inner border border-white/50">
          <div
            className="bg-red-500 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        <button
          onClick={() => setShowTheoryModal(true)}
          className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/80 text-xs font-bold text-red-600 hover:bg-white shadow-xs transition-all active:scale-95 shrink-0"
          title="Ver píldora de teoría"
        >
          <HelpCircle className="w-4 h-4 text-red-500" />
          <span className="hidden sm:inline">Píldora Teórica</span>
        </button>
      </div>

      {/* Main Split Layout: Left Character Card + Right Question Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-6">
        {/* Character Frosted Card */}
        <div className="lg:col-span-4 bg-white/50 backdrop-blur-xl border border-white/70 rounded-[2.5rem] shadow-xl p-6 flex flex-col items-center justify-end relative text-center">
          {/* Circular Portrait with Red Gradient Halo */}
          <div className="relative mb-3">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-b from-red-400 to-red-600 rounded-full border-4 sm:border-6 border-white shadow-lg flex items-center justify-center overflow-hidden">
              <CharacterAvatar
                character={lesson.personajeGuia}
                size="xl"
                animate
                mood={hasAnswered ? (isCorrect ? "proud" : "thinking") : "happy"}
              />
            </div>
            {/* Audio Toggle / Sound Cue */}
            <button
              onClick={() => {
                soundManager.playCoin();
              }}
              className="absolute -right-2 top-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md text-red-500 hover:scale-110 transition-transform"
              title="Escuchar audio"
            >
              <Sparkles className="w-4 h-4 text-red-500" />
            </button>
          </div>

          <h4 className="text-xl font-black text-red-700 mb-0.5 tracking-tight">{character.name}</h4>
          <span className="text-[11px] font-extrabold text-red-500 tracking-widest uppercase mb-3">
            {character.role}
          </span>

          {/* Speech Bubble */}
          <div className="w-full p-4 bg-white/85 backdrop-blur-md rounded-2xl border border-red-100 shadow-xs text-xs sm:text-sm font-medium text-slate-700 leading-relaxed text-left relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/85 border-t border-l border-red-100 rotate-45" />
            <p className="italic relative z-10">"{lesson.dialogoPersonaje}"</p>
          </div>
        </div>

        {/* Question & Options Frosted Container */}
        <div className="lg:col-span-8 bg-white/60 backdrop-blur-md border border-white/80 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl">
          {/* Question Header & Context */}
          {currentQ && (
            <div className="mb-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-black text-red-500 uppercase tracking-widest">
                  Pregunta {currentQuestionIndex + 1} de {lesson.preguntas.length}
                </span>
                {currentQ.contextoPeruano && (
                  <span className="text-xs text-slate-600 font-semibold bg-white/80 border border-white/90 px-3 py-1 rounded-full shadow-2xs">
                    📍 {currentQ.contextoPeruano}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentQ.pregunta}
              </h3>
            </div>
          )}

          {/* SPECIAL INTERACTIVE MECHANIC: Invoice Inspector */}
          {currentQ?.tipo === "invoice_inspector" && currentQ.invoiceData && (
            <div className="mb-6 p-4 sm:p-5 bg-amber-50/80 backdrop-blur-sm border-2 border-amber-300 border-dashed rounded-2xl sm:rounded-3xl">
              <div className="flex items-center justify-between mb-3 border-b border-amber-200 pb-2">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-700" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-amber-900">
                    Comprobante a Inspeccionar (SUNAT)
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-sm">
                  {currentQ.invoiceData.tipoComprobante}
                </span>
              </div>

              {/* Receipt Mockup */}
              <div className="bg-white/95 p-4 rounded-xl border border-amber-300 font-mono text-xs shadow-inner space-y-1.5">
                <div className="text-center font-bold text-slate-800 text-sm">
                  {currentQ.invoiceData.emisor}
                </div>
                <div className="text-center text-slate-600 font-bold">
                  R.U.C. N° {currentQ.invoiceData.rucEmisor}
                </div>
                <div className="text-center text-[10px] text-slate-500 uppercase">
                  {currentQ.invoiceData.tipoComprobante} ELECTRÓNICA
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span>Fecha: {currentQ.invoiceData.fecha}</span>
                  <span>Cliente: {currentQ.invoiceData.cliente}</span>
                </div>
                <div className="border-t border-slate-200 pt-1">
                  <div className="flex justify-between">
                    <span>1x Producto Escolar / Comercial</span>
                    <span>S/ {currentQ.invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>IGV (18%):</span>
                    <span>S/ {currentQ.invoiceData.igv.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                    <span>IMPORTE TOTAL:</span>
                    <span>S/ {currentQ.invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-amber-800 font-medium">
                <span>💡 Pista: Revisa los 11 dígitos reglamentarios del RUC y los datos obligatorios.</span>
                <button
                  onClick={() => setInspectorRevealed(!inspectorRevealed)}
                  className="text-amber-900 font-bold underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{inspectorRevealed ? "Ocultar Lupa" : "Activar Lupa"}</span>
                </button>
              </div>
            </div>
          )}

          {/* SPECIAL INTERACTIVE MECHANIC: Customs Luggage Detector */}
          {currentQ?.tipo === "customs_detector" && currentQ.customsItem && (
            <div className="mb-6 p-4 sm:p-5 bg-emerald-50/80 backdrop-blur-sm border border-emerald-300 rounded-2xl sm:rounded-3xl">
              <div className="flex items-center gap-2 mb-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
                <span>Escáner de Rayos X de Aduanas SUNAT</span>
              </div>
              <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl font-mono text-xs shadow-inner flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 bg-emerald-900 rounded-xl flex items-center justify-center text-3xl border border-emerald-700">
                  📦
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <p className="font-bold text-sm text-white">{currentQ.customsItem.nombre}</p>
                  <p className="text-emerald-300 text-xs">{currentQ.customsItem.descripcion}</p>
                  <p className="text-amber-300 font-semibold text-[11px]">
                    Valor declarado estimado: US$ {currentQ.customsItem.valorUSD.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-3.5 mb-6">
            {currentQ?.opciones.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let optionClasses = "bg-white/70 backdrop-blur-sm border-2 border-slate-200/80 hover:border-red-400 hover:bg-red-50/50 text-slate-800";
              let badgeClasses = "bg-slate-100 text-slate-400 group-hover:bg-red-100 group-hover:text-red-500";

              if (hasAnswered) {
                if (option.esCorrecta) {
                  optionClasses = "bg-emerald-50/95 backdrop-blur-sm border-4 border-emerald-500 text-emerald-900 font-bold shadow-md";
                  badgeClasses = "bg-emerald-500 text-white";
                } else if (isSelected && !option.esCorrecta) {
                  optionClasses = "bg-rose-50/95 backdrop-blur-sm border-4 border-rose-500 text-rose-900 font-bold shadow-md";
                  badgeClasses = "bg-rose-500 text-white";
                } else {
                  optionClasses = "bg-white/40 backdrop-blur-xs border-2 border-slate-200 text-slate-400 opacity-60";
                  badgeClasses = "bg-slate-100 text-slate-300";
                }
              } else if (isSelected) {
                optionClasses = "bg-white/95 backdrop-blur-sm border-4 border-red-500 text-slate-900 font-bold shadow-md relative";
                badgeClasses = "bg-red-500 text-white";
              }

              return (
                <button
                  key={option.id}
                  id={`option-btn-${option.id}`}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(option.id)}
                  className={`group w-full flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all text-left cursor-pointer disabled:cursor-default ${optionClasses}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 transition-colors shadow-2xs ${badgeClasses}`}>
                    {hasAnswered && option.esCorrecta ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : hasAnswered && isSelected && !option.esCorrecta ? (
                      <XCircle className="w-5 h-5 stroke-[3]" />
                    ) : (
                      option.id.slice(-1).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 text-sm sm:text-base leading-snug">
                    {option.texto}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Clarita's Tip Box */}
          {currentQ?.consejoClarita && !hasAnswered && (
            <div className="p-4 bg-white/80 backdrop-blur-sm border border-red-100 rounded-2xl text-xs text-slate-700 flex items-center gap-3 shadow-xs">
              <span className="text-lg">💡</span>
              <span>
                <strong className="text-red-700 font-bold">Consejo de Clarita:</strong> {currentQ.consejoClarita}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action / Feedback Footer Bar */}
      {!hasAnswered ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="text-base">🇵🇪</span>
            <span>Selecciona la alternativa correcta para apoyar los servicios públicos del Perú.</span>
          </div>

          <button
            id="lesson-verify-btn"
            disabled={!selectedOptionId}
            onClick={handleVerify}
            className={`w-full sm:w-auto px-10 sm:px-14 py-4 rounded-2xl font-black text-sm tracking-wider uppercase transition-all shadow-[0_6px_0_0_#b91c1c] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 ${
              selectedOptionId
                ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                : "bg-slate-300 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <span>Comprobar</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 shadow-xl ${
            isCorrect
              ? "bg-emerald-50/90 border-emerald-400 text-emerald-900"
              : "bg-rose-50/90 border-rose-400 text-rose-900"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                }`}
              >
                {isCorrect ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
              </div>
              <div>
                <h4 className="font-black text-base sm:text-lg mb-1">
                  {isCorrect ? "¡Excelente! Respuesta Correcta" : "¡Cuidado con la trampa de Evasif!"}
                </h4>
                <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed max-w-2xl">
                  {selectedOption?.retroalimentacion}
                </p>
              </div>
            </div>

            <button
              id="lesson-next-btn"
              onClick={handleNext}
              className={`w-full sm:w-auto shrink-0 px-10 py-4 rounded-2xl font-black text-sm tracking-wider uppercase text-white transition-all shadow-[0_6px_0_0_#047857] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 ${
                isCorrect
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-red-500 hover:bg-red-600 shadow-[0_6px_0_0_#b91c1c]"
              }`}
            >
              <span>{currentQuestionIndex + 1 < lesson.preguntas.length ? "Siguiente" : "Ver Resultados"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Theory Pill Modal */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <h3 className="font-black text-lg text-slate-900">Píldora Educativa SUNAT</h3>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-700 mb-6">
              <p className="font-bold text-red-600">{lesson.objetivoPedagogico}</p>
              <p className="bg-red-50/50 p-4 rounded-2xl border border-red-100 leading-relaxed text-slate-800">
                {lesson.explicacionTeorica}
              </p>
            </div>
            <button
              onClick={() => setShowTheoryModal(false)}
              className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-2xl shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider"
            >
              Entendido, volver al ejercicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
