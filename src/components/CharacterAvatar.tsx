import React from "react";
import { CharacterId } from "../types";

interface Props {
  character: CharacterId;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
  mood?: "happy" | "thinking" | "alert" | "sneaky" | "proud";
}

export const CharacterAvatar: React.FC<Props> = ({
  character,
  size = "md",
  className = "",
  animate = false,
  mood = "happy",
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-24 h-24 text-base",
    xl: "w-32 h-32 text-lg",
  };

  const renderSvg = () => {
    switch (character) {
      case "clarita":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Background halo */}
            <circle cx="50" cy="50" r="48" fill="#E0F2FE" />
            
            {/* Hair back */}
            <path d="M25 55 C20 30 80 30 75 55 C78 70 70 85 50 85 C30 85 22 70 25 55 Z" fill="#451A03" />
            
            {/* Body & SUNAT Uniform */}
            <path d="M30 80 L70 80 L65 100 L35 100 Z" fill="#0284C7" />
            {/* Shirt collar & Tie/Badge */}
            <path d="M42 80 L50 88 L58 80 Z" fill="#FFFFFF" />
            <rect x="46" y="85" width="8" height="12" rx="2" fill="#EAB308" />
            
            {/* Head */}
            <ellipse cx="50" cy="48" rx="22" ry="24" fill="#FED7AA" />
            
            {/* Hair bangs */}
            <path d="M28 42 C35 28 65 28 72 42 C68 35 55 33 50 35 C45 33 32 35 28 42 Z" fill="#78350F" />
            
            {/* Cheerful Eyes */}
            {mood === "happy" || mood === "proud" ? (
              <>
                <circle cx="42" cy="46" r="3.5" fill="#1E293B" />
                <circle cx="58" cy="46" r="3.5" fill="#1E293B" />
                <circle cx="43.5" cy="44.5" r="1.2" fill="#FFFFFF" />
                <circle cx="59.5" cy="44.5" r="1.2" fill="#FFFFFF" />
                {/* Cheerful Blush */}
                <ellipse cx="37" cy="52" rx="4" ry="2" fill="#FDA4AF" opacity="0.6" />
                <ellipse cx="63" cy="52" rx="4" ry="2" fill="#FDA4AF" opacity="0.6" />
              </>
            ) : (
              <>
                <path d="M39 46 Q42 43 45 46" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M55 46 Q58 43 61 46" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            )}
            
            {/* Eyebrows */}
            <path d="M38 40 Q42 37 46 40" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M54 40 Q58 37 62 40" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            
            {/* Smile */}
            <path d="M44 56 Q50 62 56 56" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            
            {/* Smart Glasses */}
            <circle cx="42" cy="46" r="8" fill="none" stroke="#0284C7" strokeWidth="2.2" />
            <circle cx="58" cy="46" r="8" fill="none" stroke="#0284C7" strokeWidth="2.2" />
            <path d="M50 46 L50 46" stroke="#0284C7" strokeWidth="2.5" />
            <path d="M34 44 L28 42" stroke="#0284C7" strokeWidth="2" />
            <path d="M66 44 L72 42" stroke="#0284C7" strokeWidth="2" />

            {/* SUNAT Badge Star */}
            <circle cx="78" cy="22" r="12" fill="#0284C7" />
            <text x="78" y="26" fill="#FACC15" fontSize="12" fontWeight="bold" textAnchor="middle">★</text>
          </svg>
        );

      case "mateo":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="#FEF3C7" />
            
            {/* Hair */}
            <path d="M28 45 C25 22 75 20 72 45 C75 25 60 18 50 18 C38 18 25 25 28 45 Z" fill="#1C1917" />
            
            {/* Hoodie */}
            <path d="M25 80 L75 80 L70 100 L30 100 Z" fill="#EA580C" />
            <path d="M44 80 L50 92 L56 80 Z" fill="#FDBA74" />
            
            {/* Head */}
            <ellipse cx="50" cy="48" rx="21" ry="23" fill="#FDE047" opacity="0.3" />
            <ellipse cx="50" cy="48" rx="21" ry="23" fill="#FDBA74" />
            
            {/* Eyes */}
            <circle cx="43" cy="47" r="3.2" fill="#1C1917" />
            <circle cx="57" cy="47" r="3.2" fill="#1C1917" />
            <circle cx="44.2" cy="45.5" r="1" fill="#FFFFFF" />
            <circle cx="58.2" cy="45.5" r="1" fill="#FFFFFF" />
            
            {/* Eyebrows */}
            <path d="M39 41 Q43 38 47 42" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M53 42 Q57 38 61 41" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
            
            {/* Big Enthusiastic Smile */}
            <path d="M43 56 Q50 64 57 56 Z" fill="#BE123C" />
            <path d="M45 56 Q50 59 55 56" fill="#FFFFFF" />

            {/* Entrepreneur Cap */}
            <path d="M26 35 C30 18 70 18 74 35 Z" fill="#2563EB" />
            <path d="M22 34 Q50 28 78 34 Q50 38 22 34" fill="#1D4ED8" />
          </svg>
        );

      case "justus":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="#D1FAE5" />
            
            {/* Dog Ears (Fluffy Labrador/Golden) */}
            <path d="M20 38 C15 55 25 75 32 68 C35 60 30 45 28 38 Z" fill="#B45309" />
            <path d="M80 38 C85 55 75 75 68 68 C65 60 70 45 72 38 Z" fill="#B45309" />
            
            {/* Dog Head */}
            <ellipse cx="50" cy="50" rx="26" ry="24" fill="#D97706" />
            <ellipse cx="50" cy="56" rx="16" ry="14" fill="#FDE68A" />
            
            {/* Customs Officer Cap (SUNAT Aduanas) */}
            <path d="M30 32 C35 15 65 15 70 32 Z" fill="#065F46" />
            <path d="M24 32 Q50 26 76 32 Q50 36 24 32" fill="#047857" />
            <circle cx="50" cy="24" r="5" fill="#FBBF24" />
            <text x="50" y="27" fill="#065F46" fontSize="7" fontWeight="bold" textAnchor="middle">★</text>
            
            {/* Dog Snout & Nose */}
            <path d="M44 54 C46 51 54 51 56 54 C58 57 53 60 50 60 C47 60 42 57 44 54 Z" fill="#1E293B" />
            
            {/* Tongue */}
            <path d="M47 63 C47 68 53 68 53 63 Z" fill="#F43F5E" />
            <path d="M44 60 Q50 64 56 60" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            
            {/* Friendly Dog Eyes */}
            <ellipse cx="38" cy="46" rx="4" ry="4.5" fill="#1E293B" />
            <ellipse cx="62" cy="46" rx="4" ry="4.5" fill="#1E293B" />
            <circle cx="39.5" cy="44.5" r="1.5" fill="#FFFFFF" />
            <circle cx="63.5" cy="44.5" r="1.5" fill="#FFFFFF" />
            
            {/* Customs Vest */}
            <path d="M32 78 L68 78 L65 100 L35 100 Z" fill="#047857" />
            <rect x="42" y="82" width="16" height="10" rx="2" fill="#F59E0B" />
            <text x="50" y="89" fill="#1E293B" fontSize="6" fontWeight="bold" textAnchor="middle">ADUANAS</text>
          </svg>
        );

      case "evasif":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="#F3E8FF" />
            
            {/* Shadowy Trenchcoat Collar */}
            <path d="M20 80 L80 80 L75 100 L25 100 Z" fill="#3B0764" />
            <path d="M36 78 L50 90 L64 78 Z" fill="#581C87" />
            
            {/* Head */}
            <ellipse cx="50" cy="50" rx="22" ry="23" fill="#E2E8F0" />
            
            {/* Sneaky Mask / Sunglasses */}
            <path d="M28 42 C35 38 65 38 72 42 C70 54 58 54 50 50 C42 54 30 54 28 42 Z" fill="#1E1B4B" />
            <circle cx="40" cy="46" r="2" fill="#A855F7" />
            <circle cx="60" cy="46" r="2" fill="#A855F7" />
            
            {/* Fedora Hat */}
            <ellipse cx="50" cy="32" rx="34" ry="7" fill="#1E1B4B" />
            <path d="M32 32 C34 16 66 16 68 32 Z" fill="#312E81" />
            <rect x="33" y="28" width="34" height="4" fill="#A855F7" />
            
            {/* Sneaky / Smirking Mouth */}
            <path d="M42 62 Q52 64 58 58" stroke="#581C87" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            
            {/* Little sweat drop (foiled) */}
            <path d="M68 38 C68 35 72 38 72 42 C72 44 70 45 68 45 C66 45 65 44 65 42 C65 38 68 38 68 38 Z" fill="#38BDF8" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full transition-transform ${sizeClasses[size]} ${
        animate ? "hover:scale-105" : ""
      } ${className}`}
    >
      {renderSvg()}
    </div>
  );
};
