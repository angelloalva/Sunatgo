import React, { useState } from "react";
import { AudienceMode, UserStats } from "../types";
import { soundManager } from "../utils/audio";
import { 
  Flame, 
  Heart, 
  Coins, 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  Baby, 
  MapPin, 
  Sparkles, 
  Wrench, 
  Building, 
  MessageSquare,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

interface Props {
  audience: AudienceMode;
  onAudienceChange: (mode: AudienceMode) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: UserStats;
  onRefillHearts: () => void;
}

export const Navbar: React.FC<Props> = ({
  audience,
  onAudienceChange,
  activeTab,
  onTabChange,
  stats,
  onRefillHearts,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [showHeartModal, setShowHeartModal] = useState(false);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playCoin();
  };

  const getNivelTitle = (nivel: number) => {
    if (nivel <= 1) return audience === "kids" ? "Pequeño Ciudadano" : "Contribuyente Principiante";
    if (nivel === 2) return audience === "kids" ? "Detective de Boletas" : "Emprendedor Formal";
    if (nivel === 3) return audience === "kids" ? "Guardián de Aduanas" : "Especialista en RUC & IGV";
    return "Máster en Cultura Tributaria";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-white/60 shadow-sm">
      {/* Top Bar: Brand, Audience Toggle, Gamification Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div 
            id="brand-logo"
            onClick={() => onTabChange("tree")}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform border border-white/60">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  SUNAT <span className="text-red-600">Go!</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                  Cultura Tributaria
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {audience === "kids" ? "Aprende jugando con Clarita, Mateo y Justus" : "Tu guía práctica para emprender y tributar"}
              </p>
            </div>
          </div>
        </div>

        {/* Audience Mode Switcher (Kids vs Youth) */}
        <div className="flex items-center bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-white/80 shadow-xs">
          <button
            id="audience-kids-btn"
            onClick={() => {
              onAudienceChange("kids");
              soundManager.playCoin();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              audience === "kids"
                ? "bg-white text-red-600 shadow-sm border border-slate-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Baby className="w-4 h-4 text-red-500" />
            <span>Niños (8-12)</span>
          </button>
          <button
            id="audience-youth-btn"
            onClick={() => {
              onAudienceChange("youth");
              soundManager.playCoin();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              audience === "youth"
                ? "bg-white text-red-600 shadow-sm border border-slate-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-red-500" />
            <span>Jóvenes (13-18+)</span>
          </button>
        </div>

        {/* Gamification Stats: Soles, XP, Streak, Hearts, Audio */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Soles SUNAT */}
          <div 
            id="soles-pill" 
            className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-2xl text-amber-600 font-extrabold text-xs shadow-xs"
            title="Tus Soles y Puntos de Cultura Tributaria"
          >
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>S/ {stats.soles}</span>
          </div>

          {/* Racha / Fire Streak */}
          <div 
            id="streak-pill"
            className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-2xl text-orange-600 font-extrabold text-xs shadow-xs"
            title="Días de racha de aprendizaje"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{stats.rachaDias} d</span>
          </div>

          {/* Vidas / Hearts */}
          <button
            id="hearts-btn"
            onClick={() => setShowHeartModal(true)}
            className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-2xl text-rose-600 font-extrabold text-xs shadow-xs hover:bg-white transition-all active:scale-95"
            title="Vidas disponibles (Click para recargar)"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>{stats.vidas}/{stats.maxVidas}</span>
          </button>

          {/* Level / Citizenship Rank */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-2xl text-slate-700 font-bold text-xs shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>Nvl {stats.nivel}: {getNivelTitle(stats.nivel)}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            className="p-2 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 text-slate-600 hover:bg-white hover:text-slate-900 transition-all shadow-xs"
            title={isMuted ? "Activar sonido" : "Silenciar sonido"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-red-500" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/40">
        <button
          id="nav-tree-btn"
          onClick={() => {
            onTabChange("tree");
            soundManager.playCoin();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all rounded-t-xl ${
            activeTab === "tree"
              ? "border-red-500 text-red-600 bg-red-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Senda de Aprendizaje</span>
        </button>

        <button
          id="nav-designer-btn"
          onClick={() => {
            onTabChange("designer");
            soundManager.playCoin();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all rounded-t-xl ${
            activeTab === "designer"
              ? "border-red-500 text-red-600 bg-red-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Sparkles className="w-4 h-4 text-red-500" />
          <span>Taller Pedagógico & Creador IA</span>
        </button>

        <button
          id="nav-lab-btn"
          onClick={() => {
            onTabChange("lab");
            soundManager.playCoin();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all rounded-t-xl ${
            activeTab === "lab"
              ? "border-red-500 text-red-600 bg-red-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Wrench className="w-4 h-4 text-red-500" />
          <span>Laboratorio Tributario & IGV</span>
        </button>

        <button
          id="nav-city-btn"
          onClick={() => {
            onTabChange("city");
            soundManager.playCoin();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all rounded-t-xl ${
            activeTab === "city"
              ? "border-red-500 text-red-600 bg-red-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Building className="w-4 h-4 text-emerald-600" />
          <span>Ciudad del Bien Común</span>
        </button>

        <button
          id="nav-tutor-btn"
          onClick={() => {
            onTabChange("tutor");
            soundManager.playCoin();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all rounded-t-xl ${
            activeTab === "tutor"
              ? "border-red-500 text-red-600 bg-red-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span>Asesoría con Clarita & Justus</span>
        </button>
      </div>

      {/* Heart Refill Modal */}
      {showHeartModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 border border-rose-200">
              <Heart className="w-8 h-8 fill-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Vidas de Aprendizaje</h3>
            <p className="text-sm text-slate-600 mb-5">
              Tienes <strong>{stats.vidas}</strong> de {stats.maxVidas} vidas. Cada error en un ejercicio consume 1 vida, ¡pero puedes recargarlas respondiendo con honestidad cívica!
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                id="refill-hearts-confirm-btn"
                onClick={() => {
                  onRefillHearts();
                  setShowHeartModal(false);
                  soundManager.playVictory();
                }}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black text-sm rounded-2xl shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recargar Vidas al Máximo (Gratis)</span>
              </button>
              <button
                onClick={() => setShowHeartModal(false)}
                className="w-full py-2 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-100/60 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
