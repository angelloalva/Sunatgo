import React, { useState, useEffect } from "react";
import { AudienceMode, Lesson, UserStats } from "./types";
import { Navbar } from "./components/Navbar";
import { LearningPath } from "./components/LearningPath";
import { LessonPlayer } from "./components/LessonPlayer";
import { LessonDesigner } from "./components/LessonDesigner";
import { TaxLaboratory } from "./components/TaxLaboratory";
import { CivicCity } from "./components/CivicCity";
import { TutorChat } from "./components/TutorChat";
import { soundManager } from "./utils/audio";

const INITIAL_STATS: UserStats = {
  soles: 150,
  xp: 220,
  nivel: 2,
  rachaDias: 4,
  vidas: 5,
  maxVidas: 5,
  leccionesCompletadas: ["k-1-1"],
  logrosDesbloqueados: ["primer-paso"],
  historiaCiudadNivel: 1, // Colegio built by default
};

export default function App() {
  const [audience, setAudience] = useState<AudienceMode>(() => {
    const saved = localStorage.getItem("sunat_go_audience");
    return (saved as AudienceMode) || "kids";
  });

  const [activeTab, setActiveTab] = useState<string>("tree");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem("sunat_go_stats");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem("sunat_go_audience", audience);
  }, [audience]);

  useEffect(() => {
    localStorage.setItem("sunat_go_stats", JSON.stringify(stats));
  }, [stats]);

  const handleLessonFinish = ({
    passed,
    solesEarned,
    xpEarned,
  }: {
    passed: boolean;
    solesEarned: number;
    xpEarned: number;
  }) => {
    if (!activeLesson) return;

    setStats((prev) => {
      const alreadyCompleted = prev.leccionesCompletadas.includes(activeLesson.id);
      const newCompleted = alreadyCompleted
        ? prev.leccionesCompletadas
        : [...prev.leccionesCompletadas, activeLesson.id];

      const newXP = prev.xp + xpEarned;
      const newNivel = Math.floor(newXP / 200) + 1;

      return {
        ...prev,
        soles: prev.soles + solesEarned,
        xp: newXP,
        nivel: newNivel,
        leccionesCompletadas: newCompleted,
      };
    });

    setActiveLesson(null);
  };

  const handleDeductLife = () => {
    setStats((prev) => ({
      ...prev,
      vidas: Math.max(0, prev.vidas - 1),
    }));
  };

  const handleRefillHearts = () => {
    setStats((prev) => ({
      ...prev,
      vidas: prev.maxVidas,
    }));
  };

  const handleUpgradeCity = (cost: number) => {
    setStats((prev) => ({
      ...prev,
      soles: prev.soles - cost,
      historiaCiudadNivel: prev.historiaCiudadNivel + 1,
    }));
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-red-200">
      {/* Top Navbar */}
      <Navbar
        audience={audience}
        onAudienceChange={(mode) => {
          setAudience(mode);
          setActiveLesson(null);
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveLesson(null);
        }}
        stats={stats}
        onRefillHearts={handleRefillHearts}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {activeLesson ? (
          <LessonPlayer
            lesson={activeLesson}
            onFinish={handleLessonFinish}
            onExit={() => setActiveLesson(null)}
            userVidas={stats.vidas}
            onDeductLife={handleDeductLife}
          />
        ) : (
          <>
            {activeTab === "tree" && (
              <LearningPath
                audience={audience}
                onSelectLesson={(lesson) => setActiveLesson(lesson)}
                stats={stats}
              />
            )}

            {activeTab === "designer" && (
              <LessonDesigner
                audience={audience}
                onPlayLesson={(lesson) => setActiveLesson(lesson)}
              />
            )}

            {activeTab === "lab" && <TaxLaboratory audience={audience} />}

            {activeTab === "city" && (
              <CivicCity stats={stats} onUpgradeCity={handleUpgradeCity} />
            )}

            {activeTab === "tutor" && <TutorChat audience={audience} />}
          </>
        )}
      </main>

      {/* Frosted Glass Footer */}
      <footer className="border-t border-white/60 bg-white/40 backdrop-blur-xl py-6 text-center text-xs text-slate-600 shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-red-600 tracking-tight">SUNAT Go!</span>
            <span>• Educación Cívica y Cultura Tributaria para el Perú</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Con Clarita, Mateo, Justus el sabueso aduanero y Evasif • Normativa Tributaria y Aduanera Oficial SUNAT
          </p>
        </div>
      </footer>
    </div>
  );
}
