import React from "react";
import { AudienceMode, Lesson, Module, UserStats } from "../types";
import { CURRICULUM_DATA } from "../data/curriculum";
import { CharacterAvatar } from "./CharacterAvatar";
import { CHARACTERS } from "../data/characters";
import { soundManager } from "../utils/audio";
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Star, 
  Sparkles, 
  Coins, 
  Trophy, 
  Gift, 
  Building2, 
  Receipt, 
  ShieldAlert, 
  KeyRound, 
  FileText, 
  Calculator, 
  Store, 
  Plane, 
  Smartphone,
  ChevronRight
} from "lucide-react";

interface Props {
  audience: AudienceMode;
  onSelectLesson: (lesson: Lesson) => void;
  stats: UserStats;
}

export const LearningPath: React.FC<Props> = ({
  audience,
  onSelectLesson,
  stats,
}) => {
  const filteredModules = CURRICULUM_DATA.filter((m) => m.audience === audience);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="w-6 h-6" />;
      case "Receipt":
        return <Receipt className="w-6 h-6" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-6 h-6" />;
      case "KeyRound":
        return <KeyRound className="w-6 h-6" />;
      case "FileText":
        return <FileText className="w-6 h-6" />;
      case "Calculator":
        return <Calculator className="w-6 h-6" />;
      case "Store":
        return <Store className="w-6 h-6" />;
      case "Plane":
        return <Plane className="w-6 h-6" />;
      case "Smartphone":
        return <Smartphone className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in duration-200">
      {/* Hero Welcome Frosted Glass Card with Clarita & Mateo */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-8 text-slate-900 shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient background blur circles */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-red-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3.5 py-1 rounded-full text-xs font-black text-red-600 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>{audience === "kids" ? "Ruta del Buen Ciudadano" : "Ruta Emprendedora & Tributaria"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
            {audience === "kids"
              ? "¡Descubre el Poder de los Tributos!"
              : "¡Domina el RUC, IGV y Haz Crecer tu Emprendimiento!"}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            {audience === "kids"
              ? "Avanza por los módulos, descubre las trampas del villano Evasif, acompaña al sabueso Justus y construye colegios y parques con tus puntos."
              : "Aprende a emitir recibos por honorarios, calcular tu IGV del 18%, elegir el Nuevo RUS y formalizar tu negocio en la SUNAT."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3.5 rounded-3xl border border-white/80 shadow-md shrink-0 z-10">
          <CharacterAvatar character={audience === "kids" ? "clarita" : "mateo"} size="lg" animate />
          <CharacterAvatar character={audience === "kids" ? "justus" : "clarita"} size="lg" animate />
        </div>
      </div>

      {/* Modules Learning Tree (Duolingo Path) */}
      <div className="space-y-12">
        {filteredModules.map((module, mIdx) => {
          const allCompletedInMod = module.lecciones.every((l) =>
            stats.leccionesCompletadas.includes(l.id)
          );

          return (
            <div key={module.id} className="relative">
              {/* Module Header Card */}
              <div
                className="rounded-[2rem] p-5 sm:p-6 bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 shadow-lg mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-400 flex items-center justify-center text-white shrink-0 shadow-md border-2 border-white">
                    {getModuleIcon(module.icono)}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-black text-red-600">
                      Módulo {module.numero}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{module.titulo}</h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      {module.subtitulo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/80 px-4 py-2 rounded-2xl text-xs font-black text-amber-600 shadow-xs self-end sm:self-center z-10">
                  <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>+{module.lecciones.reduce((acc, l) => acc + l.recompensaSoles, 0)} Soles</span>
                </div>
              </div>

              {/* Levels Path Circles */}
              <div className="flex flex-col items-center space-y-8 my-4 relative">
                {module.lecciones.map((lesson, lIdx) => {
                  const isCompleted = stats.leccionesCompletadas.includes(lesson.id);

                  // S-curve slight horizontal offsets for Duolingo path feeling
                  const offsets = ["translate-x-0", "translate-x-6 sm:translate-x-12", "-translate-x-6 sm:-translate-x-12", "translate-x-4"];
                  const offsetClass = offsets[lIdx % offsets.length];

                  return (
                    <div
                      key={lesson.id}
                      className={`flex flex-col items-center group transition-transform ${offsetClass}`}
                    >
                      {/* Interactive Level Button */}
                      <button
                        id={`level-btn-${lesson.id}`}
                        onClick={() => {
                          onSelectLesson(lesson);
                          soundManager.playCoin();
                        }}
                        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-150 cursor-pointer shadow-lg active:scale-95 group-hover:scale-105 border-4 border-white ${
                          isCompleted
                            ? "bg-amber-400 text-white shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-none"
                            : "bg-red-500 hover:bg-red-600 text-white shadow-[0_6px_0_0_#b91c1c] active:translate-y-1 active:shadow-none"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-amber-500" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                            <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">
                              Nivel {lIdx + 1}
                            </span>
                          </div>
                        )}

                        {/* Character mini badge floating */}
                        <div className="absolute -top-2 -right-2">
                          <CharacterAvatar character={lesson.personajeGuia} size="sm" />
                        </div>
                      </button>

                      {/* Level Label / Tooltip */}
                      <div className="mt-3 text-center max-w-xs bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-white/80 shadow-2xs">
                        <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-red-600 transition-colors block">
                          {lesson.titulo}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {lesson.moduloNivel.split(":")[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Module Milestone Chest / Recompensa */}
                <div className="flex flex-col items-center pt-2">
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-md border-2 ${
                      allCompletedInMod
                        ? "bg-amber-100/90 backdrop-blur-md border-amber-300 text-amber-600 animate-bounce"
                        : "bg-white/70 backdrop-blur-md border-white/80 text-slate-400"
                    }`}
                  >
                    <Gift className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 mt-2 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-white/80">
                    {allCompletedInMod ? "¡Cofre Cívico Desbloqueado!" : "Cofre del Módulo"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
