import React, { useState } from "react";
import { UserStats } from "../types";
import { soundManager } from "../utils/audio";
import { CharacterAvatar } from "./CharacterAvatar";
import confetti from "canvas-confetti";
import { 
  Building2, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Hammer, 
  CheckCircle2,
  Trees,
  Truck,
  HeartPulse,
  School
} from "lucide-react";

interface Props {
  stats: UserStats;
  onUpgradeCity: (cost: number) => void;
}

export const CivicCity: React.FC<Props> = ({ stats, onUpgradeCity }) => {
  const publicWorks = [
    {
      id: 1,
      name: "Colegio Nacional Bicentenario",
      desc: "Aulas digitales, laboratorios de ciencias y biblioteca para 1,200 estudiantes.",
      icon: "School",
      cost: 100,
      levelRequired: 1,
      impact: "Educación de calidad con profesores capacitados",
      bgColor: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      name: "Hospital Comunitario de Salud",
      desc: "Postas de emergencia, ambulancias equipadas y medicamentos gratuitos.",
      icon: "HeartPulse",
      cost: 180,
      levelRequired: 2,
      impact: "Atención médica oportuna para niños y adultos mayores",
      bgColor: "from-emerald-500 to-teal-600",
    },
    {
      id: 3,
      name: "Gran Parque Recreativo & Ecológico",
      desc: "Áreas verdes, canchas deportivas iluminadas y ciclovías seguras.",
      icon: "Trees",
      cost: 250,
      levelRequired: 3,
      impact: "Espacios de juego y vida sana para toda la familia",
      bgColor: "from-amber-500 to-orange-600",
    },
    {
      id: 4,
      name: "Central de Bomberos y Seguridad",
      desc: "Camiones cisterna de bomberos voluntarios y cámaras de vigilancia vecinal.",
      icon: "ShieldCheck",
      cost: 350,
      levelRequired: 4,
      impact: "Protección ciudadana rápida ante emergencias y desastres",
      bgColor: "from-rose-500 to-red-600",
    },
  ];

  const handleBuild = (work: typeof publicWorks[0]) => {
    if (stats.soles < work.cost) {
      soundManager.playIncorrect();
      return;
    }
    onUpgradeCity(work.cost);
    soundManager.playVictory();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const getWorkIcon = (name: string) => {
    switch (name) {
      case "School":
        return <School className="w-8 h-8 text-white" />;
      case "HeartPulse":
        return <HeartPulse className="w-8 h-8 text-white" />;
      case "Trees":
        return <Trees className="w-8 h-8 text-white" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-8 text-slate-900 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3.5 py-1 rounded-full text-xs font-black mb-3 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-red-500" />
            <span>Simulador Cívico del Bien Común</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
            La Ciudad que Construimos con Tributos
          </h1>
          <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
            Invierte tus Soles SUNAT ganados en las lecciones para financiar hospitales, colegios públicos y parques para tu comunidad.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white/90 text-center shrink-0 shadow-sm z-10">
          <div className="flex items-center justify-center gap-2 text-amber-500 font-black text-2xl">
            <Coins className="w-6 h-6 fill-amber-400" />
            <span>S/ {stats.soles}</span>
          </div>
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mt-0.5">
            Fondos Tributarios
          </span>
        </div>
      </div>

      {/* Public Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publicWorks.map((work) => {
          const isBuilt = stats.historiaCiudadNivel >= work.id;
          const canAfford = stats.soles >= work.cost;

          return (
            <div
              key={work.id}
              className={`bg-white/70 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 shadow-lg transition-all flex flex-col justify-between ${
                isBuilt ? "ring-2 ring-emerald-500/20 bg-emerald-50/40" : ""
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-tr ${work.bgColor} border-2 border-white`}
                  >
                    {getWorkIcon(work.icon)}
                  </div>
                  {isBuilt ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Construido y Operando!</span>
                    </span>
                  ) : (
                    <span className="text-xs font-black text-slate-600 bg-white/80 border border-white/90 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>Costo: S/ {work.cost}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-black text-lg text-slate-900 mb-1">{work.name}</h3>
                <p className="text-xs text-slate-600 mb-3">{work.desc}</p>
                <div className="p-3.5 bg-white/80 rounded-2xl border border-white/90 text-xs text-slate-700 font-medium shadow-2xs">
                  🌟 <strong>Impacto Social:</strong> {work.impact}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                {isBuilt ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span>✨ Beneficiando a miles de familias</span>
                  </span>
                ) : (
                  <button
                    id={`build-work-btn-${work.id}`}
                    disabled={!canAfford}
                    onClick={() => handleBuild(work)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      canAfford
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5 active:shadow-none"
                        : "bg-slate-200/80 text-slate-400 border border-slate-200"
                    }`}
                  >
                    <Hammer className="w-4 h-4" />
                    <span>{canAfford ? `Construir con S/ ${work.cost} Tributos` : `Necesitas S/ ${work.cost}`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
