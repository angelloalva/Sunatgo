export type AudienceMode = "kids" | "youth";

export type CharacterId = "clarita" | "mateo" | "justus" | "evasif";

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  role: string;
  avatarBg: string;
  badgeColor: string;
  quote: string;
  description: string;
}

export type ExerciseType = 
  | "multiple_choice"
  | "invoice_inspector"
  | "customs_detector"
  | "tax_calculator"
  | "boss_battle";

export interface QuestionOption {
  id: string;
  texto: string;
  esCorrecta: boolean;
  retroalimentacion: string;
}

export interface Question {
  id: string;
  pregunta: string;
  contextoPeruano?: string;
  tipo: ExerciseType;
  opciones: QuestionOption[];
  consejoClarita?: string;
  // Specific data for interactive mechanics:
  invoiceData?: {
    tipoComprobante: "Boleta de Venta" | "Factura" | "Recibo por Honorarios";
    emisor: string;
    rucEmisor: string;
    cliente: string;
    rucCliente?: string;
    fecha: string;
    subtotal: number;
    igv: number;
    total: number;
    errorsToSpot: string[];
    isTamperedByEvasif: boolean;
  };
  customsItem?: {
    nombre: string;
    valorUSD: number;
    descripcion: string;
    esPermitidoLibre: boolean;
    esRestringido: boolean;
    esContrabando: boolean;
    explicacionAduana: string;
  };
  taxCalculation?: {
    precioConIGV?: number;
    subtotal?: number;
    igvRate: number; // 0.18
    retencionRenta?: number; // 0.08 for recibo por honorarios
  };
}

export interface Lesson {
  id: string;
  moduloNivel: string;
  titulo: string;
  descripcion: string;
  objetivoPedagogico: string;
  personajeGuia: CharacterId;
  dialogoPersonaje: string;
  mecanicaEjercicio: ExerciseType;
  explicacionTeorica: string;
  preguntas: Question[];
  recompensaSoles: number;
  recompensaXP: number;
  audience: AudienceMode;
  completada?: boolean;
  puntuacion?: number;
}

export interface Module {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  icono: string;
  colorTema: string;
  audience: AudienceMode;
  lecciones: Lesson[];
}

export interface UserStats {
  soles: number; // Puntos / Monedas SUNAT
  xp: number;
  nivel: number;
  rachaDias: number;
  vidas: number;
  maxVidas: number;
  leccionesCompletadas: string[];
  logrosDesbloqueados: string[];
  historiaCiudadNivel: number; // Progreso de obras públicas construidas (hospital, colegio, parque, comisaría)
}

export interface Achievement {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  completado: boolean;
  recompensaSoles: number;
}
