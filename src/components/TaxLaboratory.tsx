import React, { useState } from "react";
import { AudienceMode } from "../types";
import { CharacterAvatar } from "./CharacterAvatar";
import { soundManager } from "../utils/audio";
import { 
  Calculator, 
  FileText, 
  Search, 
  ShieldCheck, 
  Plane, 
  Coins, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface Props {
  audience: AudienceMode;
}

export const TaxLaboratory: React.FC<Props> = ({ audience }) => {
  const [activeTool, setActiveTool] = useState<"igv" | "rhe" | "ruc" | "customs">("igv");

  // IGV Calculator state
  const [calcMode, setCalcMode] = useState<"from_total" | "from_subtotal">("from_total");
  const [amountInput, setAmountInput] = useState<number>(118);

  // RHE Calculator state
  const [honorarioInput, setHonorarioInput] = useState<number>(2000);
  const [hasSuspension, setHasSuspension] = useState<boolean>(false);

  // RUC Checker state
  const [rucQuery, setRucQuery] = useState<string>("10458923411");
  const [rucResult, setRucResult] = useState<any>(null);

  // Customs Inspector state
  const [selectedCustomsItem, setSelectedCustomsItem] = useState<string>("laptop");

  // IGV Math calculations
  const calculateIGV = () => {
    if (calcMode === "from_total") {
      const total = Number(amountInput) || 0;
      const subtotal = total / 1.18;
      const igv = total - subtotal;
      const igvPure = (subtotal * 0.16);
      const ipmPure = (subtotal * 0.02);
      return { total, subtotal, igv, igvPure, ipmPure };
    } else {
      const subtotal = Number(amountInput) || 0;
      const igv = subtotal * 0.18;
      const total = subtotal + igv;
      const igvPure = subtotal * 0.16;
      const ipmPure = subtotal * 0.02;
      return { total, subtotal, igv, igvPure, ipmPure };
    }
  };

  const igvData = calculateIGV();

  // RHE Math
  const calculateRHE = () => {
    const gross = Number(honorarioInput) || 0;
    const shouldRetain = gross > 1500 && !hasSuspension;
    const retentionRate = shouldRetain ? 0.08 : 0;
    const retentionAmount = gross * retentionRate;
    const netAmount = gross - retentionAmount;
    return { gross, shouldRetain, retentionAmount, netAmount };
  };

  const rheData = calculateRHE();

  // RUC Verification Logic
  const handleCheckRUC = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = rucQuery.trim().replace(/\D/g, "");
    if (clean.length !== 11) {
      setRucResult({
        valid: false,
        error: "Un número de RUC en el Perú debe tener exactamente 11 dígitos.",
      });
      soundManager.playIncorrect();
      return;
    }

    const prefix = clean.substring(0, 2);
    let typeDescription = "Persona Natural";
    if (prefix === "10") typeDescription = "Persona Natural (Freelancer / Emprendedor individual)";
    else if (prefix === "20") typeDescription = "Persona Jurídica (Empresa S.A.C. / E.I.R.L. / S.R.L.)";
    else if (prefix === "15" || prefix === "17") typeDescription = "Persona Natural con Carné de Extranjería";
    else typeDescription = "Entidad Pública o Régimen Especial";

    setRucResult({
      valid: true,
      ruc: clean,
      typeDescription,
      estado: "ACTIVO",
      condicion: "HABIDO",
      domicilioFiscal: "Av. La Marina 1250, San Miguel, Lima",
      emisionElectronica: "Factura, Boleta y RHE Autorizados",
    });
    soundManager.playCorrect();
  };

  const customsItemsCatalog = [
    {
      id: "laptop",
      nombre: "1 Laptop de uso personal",
      icono: "💻",
      status: "Inafecto (Libre de Impuestos)",
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      descripcion: "Cada viajero tiene derecho a ingresar 1 computadora portátil de uso personal libre de tributos según el Reglamento de Equipaje de SUNAT.",
    },
    {
      id: "celulares",
      nombre: "2 Teléfonos celulares usados",
      icono: "📱",
      status: "Inafecto (Libre de Impuestos)",
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      descripcion: "Hasta 2 teléfonos móviles de uso personal están inafectos de arancel aduanero.",
    },
    {
      id: "regalos",
      nombre: "Ropa nueva y juguetes de regalo por US$ 450",
      icono: "🎁",
      status: "Dentro de la Franquicia de $500",
      color: "text-blue-700 bg-blue-50 border-blue-300",
      descripcion: "Bienes para uso o consumo del viajero y obsequios hasta un valor de US$ 500.00 en total ingresan libres de impuestos.",
    },
    {
      id: "drone",
      nombre: "Drone profesional con cámara 4K",
      icono: "🚁",
      status: "Mercancía Restringida (Requiere Permiso)",
      color: "text-amber-700 bg-amber-50 border-amber-300",
      descripcion: "Los drones y equipos transmisores requieren permiso de internamiento expedido por el MTC (Ministerio de Transportes y Comunicaciones).",
    },
    {
      id: "pirateria",
      nombre: "Lote de 50 zapatillas clonadas con marcas falsas",
      icono: "🚫",
      status: "Contrabando y Piratería (Incautación Obligatoria)",
      color: "text-rose-700 bg-rose-50 border-rose-300",
      descripcion: "¡Alerta de Justus! Los productos falsificados y piratería vulneran la propiedad intelectual y constituyen delito aduanero.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>Simuladores Interactivos de la Normativa SUNAT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Laboratorio Tributario & Aduanero
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Experimenta con cálculos reales de IGV (18%), emisión de Recibos por Honorarios, validación de RUC y clasificación aduanera.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <button
          id="lab-tab-igv"
          onClick={() => {
            setActiveTool("igv");
            soundManager.playCoin();
          }}
          className={`p-4 rounded-2xl border font-black text-xs sm:text-sm flex flex-col items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
            activeTool === "igv"
              ? "bg-red-500 text-white border-white shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5"
              : "bg-white/70 text-slate-700 border-white/80 hover:bg-white/90 shadow-2xs"
          }`}
        >
          <Calculator className={`w-6 h-6 ${activeTool === "igv" ? "text-white" : "text-red-500"}`} />
          <span>Calculadora IGV (18%)</span>
        </button>

        <button
          id="lab-tab-rhe"
          onClick={() => {
            setActiveTool("rhe");
            soundManager.playCoin();
          }}
          className={`p-4 rounded-2xl border font-black text-xs sm:text-sm flex flex-col items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
            activeTool === "rhe"
              ? "bg-red-500 text-white border-white shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5"
              : "bg-white/70 text-slate-700 border-white/80 hover:bg-white/90 shadow-2xs"
          }`}
        >
          <FileText className={`w-6 h-6 ${activeTool === "rhe" ? "text-white" : "text-red-500"}`} />
          <span>Recibo por Honorarios (4ta)</span>
        </button>

        <button
          id="lab-tab-ruc"
          onClick={() => {
            setActiveTool("ruc");
            soundManager.playCoin();
          }}
          className={`p-4 rounded-2xl border font-black text-xs sm:text-sm flex flex-col items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
            activeTool === "ruc"
              ? "bg-red-500 text-white border-white shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5"
              : "bg-white/70 text-slate-700 border-white/80 hover:bg-white/90 shadow-2xs"
          }`}
        >
          <Search className={`w-6 h-6 ${activeTool === "ruc" ? "text-white" : "text-red-500"}`} />
          <span>Validador RUC (10 vs 20)</span>
        </button>

        <button
          id="lab-tab-customs"
          onClick={() => {
            setActiveTool("customs");
            soundManager.playCoin();
          }}
          className={`p-4 rounded-2xl border font-black text-xs sm:text-sm flex flex-col items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
            activeTool === "customs"
              ? "bg-red-500 text-white border-white shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5"
              : "bg-white/70 text-slate-700 border-white/80 hover:bg-white/90 shadow-2xs"
          }`}
        >
          <Plane className={`w-6 h-6 ${activeTool === "customs" ? "text-white" : "text-red-500"}`} />
          <span>Aduana de Viajeros (Justus)</span>
        </button>
      </div>

      {/* TOOL 1: CALCULADORA IGV 18% */}
      {activeTool === "igv" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white/75 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">
                Fórmula Oficial del IGV en el Perú
              </h3>
              <span className="text-xs bg-red-50 border border-red-200 text-red-700 font-black px-3 py-1 rounded-full">
                Tasa: 18% (16% IGV + 2% IPM)
              </span>
            </div>

            {/* Mode switch */}
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
              <button
                onClick={() => setCalcMode("from_total")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  calcMode === "from_total"
                    ? "bg-white text-red-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tengo el Precio Total (con IGV)
              </button>
              <button
                onClick={() => setCalcMode("from_subtotal")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  calcMode === "from_subtotal"
                    ? "bg-white text-red-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tengo el Valor Venta (sin IGV)
              </button>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                {calcMode === "from_total" ? "Monto Total en Boleta / Factura (S/):" : "Subtotal / Valor de Venta (S/):"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 font-black text-slate-400">S/</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={amountInput}
                  onChange={(e) => setAmountInput(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 border border-slate-200 font-black text-slate-900 text-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 shadow-2xs"
                />
              </div>
            </div>

            {/* Result Breakdown Card */}
            <div className="bg-white/80 border border-white/90 rounded-2xl p-5 space-y-3 font-mono text-sm shadow-2xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal (Base Imponible):</span>
                <span className="font-bold text-slate-900">S/ {igvData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-xs pl-3 border-l-2 border-red-300">
                <span>• 16% IGV Central:</span>
                <span>S/ {igvData.igvPure.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-xs pl-3 border-l-2 border-red-300">
                <span>• 2% IPM (Municipalidades):</span>
                <span>S/ {igvData.ipmPure.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-red-600 font-bold border-t border-slate-200/80 pt-2">
                <span>Total IGV (18%):</span>
                <span>S/ {igvData.igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-black text-base text-slate-900 border-t-2 border-slate-200 pt-2">
                <span>IMPORTE TOTAL:</span>
                <span className="text-red-600">S/ {igvData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Where does IGV go? */}
          <div className="lg:col-span-6 bg-white/75 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <CharacterAvatar character="clarita" size="md" />
              <div>
                <h3 className="font-black text-base text-slate-900">
                  ¿A dónde van los S/ {igvData.igv.toFixed(2)} de IGV?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  El presupuesto público se invierte en obras y servicios comunitarios
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-800">🏫 Educación Pública & Colegios (25%)</span>
                  <span className="font-bold text-red-600">S/ {(igvData.igv * 0.25).toFixed(2)}</span>
                </div>
                <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "25%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-800">🏥 Hospitales, Postas y Medicinas (20%)</span>
                  <span className="font-bold text-red-600">S/ {(igvData.igv * 0.2).toFixed(2)}</span>
                </div>
                <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "20%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-800">🛣️ Carreteras, Puentes y Pistas (22%)</span>
                  <span className="font-bold text-red-600">S/ {(igvData.igv * 0.22).toFixed(2)}</span>
                </div>
                <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "22%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-800">🚓 Seguridad Ciudadana y Comisarías (15%)</span>
                  <span className="font-bold text-red-600">S/ {(igvData.igv * 0.15).toFixed(2)}</span>
                </div>
                <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: "15%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-800">🍲 Programas Sociales y Qali Warma (18%)</span>
                  <span className="font-bold text-red-600">S/ {(igvData.igv * 0.18).toFixed(2)}</span>
                </div>
                <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "18%" }} />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl text-xs text-red-950 font-medium">
              💡 <strong>Regla de Oro:</strong> Al exigir tu boleta de venta, garantizas que el 18% del IGV que ya pagaste no se quede en manos de Evasif y llegue a construir el Perú.
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: RECIBO POR HONORARIOS */}
      {activeTool === "rhe" && (
        <div className="max-w-3xl mx-auto bg-white/75 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
            <CharacterAvatar character="mateo" size="md" />
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Simulador de Recibo por Honorarios Electrónico (RHE)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Rentas de 4ta Categoría para trabajadores independientes y freelancers
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                Honorario Bruto Pactado (S/):
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 font-black text-slate-400">S/</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={honorarioInput}
                  onChange={(e) => setHonorarioInput(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 border border-slate-200 font-black text-slate-900 text-lg focus:outline-none focus:border-red-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white/80 border border-white/90 rounded-2xl shadow-2xs">
              <input
                id="suspension-check"
                type="checkbox"
                checked={hasSuspension}
                onChange={(e) => setHasSuspension(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm accent-red-600"
              />
              <label htmlFor="suspension-check" className="text-xs font-bold text-slate-800 cursor-pointer">
                Cuento con Constancia de Suspensión de Retenciones de 4ta Categoría (SUNAT Formulario 1609)
              </label>
            </div>

            {/* Visual Receipt */}
            <div className="bg-slate-900/95 text-slate-100 p-6 rounded-2xl font-mono text-xs space-y-3 shadow-inner border border-slate-800">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="font-bold text-red-400">RECIBO POR HONORARIOS ELECTRÓNICO</span>
                <span>N° E001 - 00042</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <p>Emisor: MATEO SERVICIOS DIGITALES (RUC: 10458923411)</p>
                <p>Usuario: EMPRESA CLIENTE S.A.C. (RUC: 20601234567)</p>
                <p>Concepto: Desarrollo y diseño de aplicativo web educativo</p>
              </div>

              <div className="border-t border-slate-700 pt-3 space-y-1.5">
                <div className="flex justify-between">
                  <span>Total Honorario Bruto:</span>
                  <span className="font-bold text-white">S/ {rheData.gross.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>
                    Retención Impuesto a la Renta (8%):
                    {rheData.shouldRetain ? " [Aplica monto > S/ 1,500]" : " [Sin retención]"}
                  </span>
                  <span>- S/ {rheData.retentionAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-emerald-400 border-t border-slate-700 pt-2">
                  <span>NETO A COBRAR EN CUENTA:</span>
                  <span>S/ {rheData.netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl text-xs text-red-950 font-medium">
              📌 <strong>Explicación:</strong> Si emites un recibo a una empresa por más de S/ 1,500.00, la empresa te retiene el 8% y lo deposita a la SUNAT a tu nombre como pago a cuenta de tu impuesto anual.
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: RUC CHECKER */}
      {activeTool === "ruc" && (
        <div className="max-w-3xl mx-auto bg-white/75 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-black border border-red-200 shadow-2xs">
              RUC
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Consulta y Validador de RUC SUNAT (11 Dígitos)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Aprende a identificar RUC 10 (Personas) y RUC 20 (Empresas)
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckRUC} className="flex gap-3">
            <input
              type="text"
              maxLength={11}
              value={rucQuery}
              onChange={(e) => setRucQuery(e.target.value)}
              placeholder="Ingresa los 11 dígitos del RUC (ej. 10458923411 o 20601234567)"
              className="flex-1 px-4 py-3 rounded-2xl bg-white/90 border border-slate-200 text-sm font-mono font-bold focus:outline-none focus:border-red-500 shadow-2xs"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#b91c1c] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Consultar RUC
            </button>
          </form>

          {rucResult && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {rucResult.valid ? (
                <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-emerald-950">
                      R.U.C. N° {rucResult.ruc}
                    </span>
                    <div className="flex gap-2">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        {rucResult.estado}
                      </span>
                      <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        {rucResult.condicion}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="font-black block text-slate-900">Tipo de Contribuyente:</span>
                      <span>{rucResult.typeDescription}</span>
                    </div>
                    <div>
                      <span className="font-black block text-slate-900">Comprobantes Autorizados:</span>
                      <span>{rucResult.emisionElectronica}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-black block text-slate-900">Domicilio Fiscal:</span>
                      <span>{rucResult.domicilioFiscal}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{rucResult.error}</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-white/80 border border-white/90 rounded-2xl shadow-2xs">
              <span className="font-black text-red-700 block mb-1">RUC 10 (Personas Naturales)</span>
              <p className="text-slate-700">
                Empieza con 10 + tu DNI + 1 dígito de chequeo. Para trabajadores independientes, profesionales y pequeños negocios del Nuevo RUS.
              </p>
            </div>
            <div className="p-4 bg-white/80 border border-white/90 rounded-2xl shadow-2xs">
              <span className="font-black text-red-700 block mb-1">RUC 20 (Personas Jurídicas)</span>
              <p className="text-slate-700">
                Empieza con 20. Para empresas constituidas como sociedades (S.A.C., E.I.R.L., S.R.L.) inscritas en Registros Públicos (SUNARP).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: ADUANAS DE VIAJEROS (JUSTUS) */}
      {activeTool === "customs" && (
        <div className="max-w-4xl mx-auto bg-white/75 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200/80">
            <CharacterAvatar character="justus" size="lg" animate />
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Simulador de Control Aduanero de Viajeros con Justus
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Aeropuerto Internacional Jorge Chávez y puestos de frontera
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customsItemsCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCustomsItem(item.id);
                  if (item.id === "pirateria") soundManager.playJustusAlert();
                  else soundManager.playCoin();
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  selectedCustomsItem === item.id
                    ? "border-red-400 bg-red-50/80 shadow-md ring-2 ring-red-300/30"
                    : "border-white/80 bg-white/80 hover:bg-white shadow-2xs"
                }`}
              >
                <span className="text-2xl">{item.icono}</span>
                <div className="flex-1">
                  <span className="font-black text-xs text-slate-900 block">{item.nombre}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 border ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Item Explanation */}
          {(() => {
            const currentItem = customsItemsCatalog.find((c) => c.id === selectedCustomsItem);
            if (!currentItem) return null;
            return (
              <div className="p-5 bg-white/90 border border-white rounded-2xl space-y-2 animate-in fade-in duration-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentItem.icono}</span>
                  <h4 className="font-black text-sm text-slate-900">
                    Dictamen Aduanero de Justus: {currentItem.nombre}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentItem.descripcion}
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
