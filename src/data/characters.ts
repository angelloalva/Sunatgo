import { CharacterId, CharacterInfo } from "../types";

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  clarita: {
    id: "clarita",
    name: "Clarita",
    role: "Guía de Cultura Tributaria",
    avatarBg: "from-sky-500 to-blue-600",
    badgeColor: "bg-blue-600 text-white",
    quote: "¡Cada boleta que pides es un ladrillo para los colegios y hospitales de nuestro Perú!",
    description: "Experta y entusiasta embajadora de la cultura cívica tributaria. Te enseña cómo los impuestos construyen el bien común.",
  },
  mateo: {
    id: "mateo",
    name: "Mateo",
    role: "Joven Emprendedor & Estudiante",
    avatarBg: "from-amber-400 to-orange-500",
    badgeColor: "bg-amber-600 text-white",
    quote: "¡Quiero formalizar mi negocio de polos y emitir boletas electrónicas por mi celular!",
    description: "Curioso e innovador. Aprende a crear su RUC digital, gestionar sus finanzas y formalizar emprendimientos.",
  },
  justus: {
    id: "justus",
    name: "Justus",
    role: "Sabueso Inspector de Aduanas",
    avatarBg: "from-emerald-500 to-teal-600",
    badgeColor: "bg-teal-700 text-white",
    quote: "¡Guau! Mi olfato aduanero detecta el contrabando a kilómetros. ¡Cuidemos nuestras fronteras!",
    description: "El fiel perro aduanero de la SUNAT. Protege los aeropuertos y fronteras contra la piratería y el contrabando ilegal.",
  },
  evasif: {
    id: "evasif",
    name: "Evasif",
    role: "El Villano Evasor",
    avatarBg: "from-purple-600 to-slate-800",
    badgeColor: "bg-purple-800 text-white",
    quote: "Psst... ¿para qué pides boleta? Mejor te hago una rebajita y nos ahorramos el IGV...",
    description: "El astuto personaje que busca engañar a compradores y comerciantes. ¡Tus conocimientos tributarios lo dejarán sin escapatoria!",
  },
};
