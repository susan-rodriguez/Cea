import React, { useState, useEffect, FormEvent } from "react";
import { 
  Compass, 
  Search, 
  Sparkles, 
  Info, 
  Terminal, 
  Smartphone, 
  QrCode, 
  AlertTriangle, 
  Clock, 
  AppWindow,
  HelpCircle,
  HelpCircle as QuestionIcon,
  ChevronRight,
  Send,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EJES_ESTRATEGICOS, EjeAmbiental, getIconComponent } from "./data";
import ConsoleInspector from "./components/ConsoleInspector";
import SimulatedPWA from "./components/SimulatedPWA";
import EngineeringReport from "./components/EngineeringReport";

export default function App() {
  const [selectedAxis, setSelectedAxis] = useState<EjeAmbiental>(EJES_ESTRATEGICOS[0]);
  const [customQuery, setCustomQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);
  
  // Results from backend AI core
  const [rawResponse, setRawResponse] = useState<string>("");
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Totem clock
  const [totemTime, setTotemTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTotemTime(
        now.toLocaleTimeString("es-CL", { 
          hour: "2-digit", 
          minute: "2-digit",
          second: "2-digit", 
          hour12: false 
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Primary function to fetch data from Express backend (which uses Gemini)
  const fetchCognitiveContent = async (axisName: string, isCustomFlag = false) => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsUsingBackup(false);

    try {
      const response = await fetch("/api/eje-ambiental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eje: axisName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setRawResponse(data.rawResponse);
        setResponsePayload(data.payload);
      } else {
        throw new Error(data.error || "Error al procesar el eje ambiental");
      }
    } catch (err: any) {
      console.warn("Backend API Error, utilizando simulación offline:", err);
      
      // Fallback offline simulator if Gemini API Key is missing or server is down
      setIsUsingBackup(true);
      const axisKeyClean = isCustomFlag 
        ? "tema-personalizado" 
        : selectedAxis.id;
      
      const simulatedContent = isCustomFlag
        ? `La Ley 19.300 establece regulaciones sobre ${axisName}. Es fundamental adoptar planes de contingencia comunitarios y evaluar el impacto sin afectar el patrimonio de los ecosistemas chilenos actuales, promoviendo el desarrollo sustentable nacional.`
        : `La Ley 19.300 regula el eje de ${selectedAxis.nombre}. Es de suma importancia asegurar el resguardo de estos recursos mediante regulaciones técnicas coordinadas para beneficio de todas las comunidades y la preservación silvestre nacional.`;
      
      const simulatedUrl = `https://cea-trivia.cl/juego?eje=${encodeURIComponent(axisName.toLowerCase().replace(/\s+/g, "-"))}&id=sim-322`;
      
      const simulatedRawJSON = `{\n  "contenido_educativo": "${simulatedContent}",\n  "url_trivia": "${simulatedUrl}"\n}`;
      
      setRawResponse(simulatedRawJSON);
      setResponsePayload({
        contenido_educativo: simulatedContent,
        url_trivia: simulatedUrl
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetch initially and whenever selected axis changes
  useEffect(() => {
    fetchCognitiveContent(selectedAxis.nombre);
    setCustomQuery("");
  }, [selectedAxis]);

  const handleCustomSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    // Create a temporary pseudo-axis for custom query rendering
    const customAxisPseudo: EjeAmbiental = {
      id: "personalizado",
      nombre: customQuery.trim(),
      descripcionCorta: "Tema de consulta libre e interactiva formulado por el visitante.",
      articulos: "Ley 19.300 General",
      ley: "Bases Generales del Medio Ambiente",
      iconName: "Users",
      colorHex: "#14b8a6", // teal
      colorBgHex: "rgba(20, 184, 166, 0.1)",
      preguntasTrivia: [
        {
          pregunta: `¿Cuál es el valor proambiental de capacitarse en: ${customQuery.trim()}?`,
          opciones: ["Fomentar el cuidado ecosistémico", "Ignorar las leyes del país", "Aumentar la huella industrial", "Detener toda educación."],
          indexCorrecto: 0,
          explicacion: "Fomentar el cuidado de los ecosistemas es mandante para la sustentabilidad de Chile según describe el Art. 6 de la Ley 19.300."
        },
        {
          pregunta: `El pilar principal de consultar sobre ${customQuery.trim()} radica en:`,
          opciones: ["El individualismo", "La participación ciudadana activa", "La omisión fiscal", "El rechazo del patrimonio natural"],
          indexCorrecto: 1,
          explicacion: "La participación pública en temas ambientales fortalece la conciencia ecológica y facilita la sustentabilidad local."
        },
        {
          pregunta: "¿Cuál es el fin supremo de la Ley 19.300 sobre bases del medio ambiente?",
          opciones: ["Garantizar el derecho a vivir en un medio ambiente libre de contaminación", "Privatizar santuarios ecológicos", "Eximir de impacto a las inmobiliarias", "Sancionar la educación científica escolar"],
          indexCorrecto: 0,
          explicacion: "El Artículo 1 consagra el derecho humano e inalienable a vivir en un entorno libre de agentes contaminantes."
        }
      ]
    };

    setSelectedAxis(customAxisPseudo);
    fetchCognitiveContent(customQuery.trim(), true);
  };

  // Word counter helper
  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };

  const currentEducationText = responsePayload?.contenido_educativo || "";
  const currentTriviaUrl = responsePayload?.url_trivia || "";
  const wordCount = getWordCount(currentEducationText);
  const isWordCountCompliant = wordCount <= 45;

  return (
    <div className="min-h-screen bg-[#02120b] text-[#e0f2e9] flex flex-col relative overflow-hidden font-sans selection:bg-[#4ade80] selection:text-[#02120b]" id="main-container">
      {/* Immersive background glow circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#1a4d2e] rounded-full blur-[120px] opacity-30 pointer-events-none" id="ambient-glow-top" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#3d5a1c] rounded-full blur-[100px] opacity-20 pointer-events-none" id="ambient-glow-bottom" />
      
      {/* Top Government Title Flag Banner with Immersive UI style */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40 relative" id="header-section">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Chilean Gov Badge */}
          <div className="flex items-center gap-4">
            {/* Immersive UI Gradient Logo Badge */}
            <div className="w-12 h-12 bg-gradient-to-tr from-[#4ade80] to-[#166534] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.35)] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#02120b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/>
              </svg>
            </div>
            
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#4ade80] font-bold font-display select-none block">Núcleo de Inteligencia Ambiental</span>
              <h2 className="text-xl font-light tracking-tight text-[#e0f2e9] flex items-center gap-2">
                Centro de Educación Ambiental (CEA)
                <span className="text-[9px] font-mono text-[#4ade80] bg-[#4ade80]/15 border border-[#4ade80]/30 rounded-full px-2 py-0.5 tracking-normal">Ley 19.300</span>
              </h2>
            </div>
          </div>

          {/* Interactive Totem Utilities (Clock / Location) */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden md:flex flex-col text-right text-[#e0f2e9]/60">
              <span className="text-[9px] uppercase tracking-wider text-[#4ade80]/80">UBICACIÓN TÓTEM</span>
              <span>Hall Central CEA - Santiago</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <Clock className="text-[#4ade80]" size={14} />
              <span className="font-bold text-[#e0f2e9] tracking-wider text-xs select-none">{totemTime || "12:00:00"}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10" id="workspace-grid">
        
        {/* LEFT COLUMN: Ejes Selector Panel & Simple Search (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5" id="axis-selector-column">
          
          {/* Custom Search / Topic Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-semibold text-[#e0f2e9]/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-display">
              <Search size={13} className="text-[#4ade80]" />
              Consulta Libre en Chile
            </h3>
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ej: Glaciares, Ley Humedales..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 hover:border-[#4ade80]/50 focus:border-[#4ade80] rounded-xl py-2 pl-3 pr-8 text-xs font-sans text-[#e0f2e9] placeholder-[#e0f2e9]/30 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-[#4ade80] hover:bg-[#22c55e] text-[#02120b] font-bold text-xs px-4 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-[0_4px_12px_rgba(74,222,128,0.25)]"
                title="Consultar al Núcleo"
              >
                <Send size={12} className="stroke-[2.5]" />
              </button>
            </form>
            <span className="text-[10px] text-[#e0f2e9]/40 block mt-1.5 font-sans">Escribe cualquier tópico para ver cómo el Núcleo redacta en formato estricto.</span>
          </div>

          {/* Grid of Predefined Strategic Environmental Axes with Immersive UI */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex-1 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <h3 className="text-xs font-bold text-[#e0f2e9]/80 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Compass size={13} className="text-[#4ade80]" />
                  Ejes de Señalética
                </h3>
                <span className="text-[9px] font-mono text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded-full border border-[#4ade80]/20">Ley 19.300</span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {EJES_ESTRATEGICOS.map((axis) => {
                  const IconComponent = getIconComponent(axis.iconName);
                  const isSelected = selectedAxis && selectedAxis.id === axis.id;

                  return (
                    <button
                      key={axis.id}
                      onClick={() => setSelectedAxis(axis)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 group relative overflow-hidden cursor-pointer ${
                        isSelected 
                          ? "bg-white/10 border-[#4ade80]/40 shadow-[0_0_15px_rgba(74,222,128,0.15)] transform translate-x-1" 
                          : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
                      }`}
                    >
                      {/* Left accent color bar */}
                      <span 
                        className="absolute left-0 top-0 bottom-0 w-1 transition-all" 
                        style={{ backgroundColor: isSelected ? "#4ade80" : "rgba(224, 242, 233, 0.2)" }}
                      />

                      {/* Icon */}
                      <div 
                        className="p-2.5 rounded-lg shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ 
                          backgroundColor: isSelected ? "rgba(74, 222, 128, 0.15)" : "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <IconComponent size={15} style={{ color: isSelected ? "#4ade80" : "rgba(224, 242, 233, 0.70)" }} />
                      </div>

                      {/* Info Text */}
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className={`text-xs font-bold truncate transition-colors ${
                            isSelected ? "text-[#4ade80]" : "text-[#e0f2e9]/90 group-hover:text-[#4ade80]"
                          }`}>
                            {axis.nombre}
                          </h4>
                          <ChevronRight size={10} className="text-white/30 transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <p className="text-[10px] text-[#e0f2e9]/50 line-clamp-1">
                          {axis.descripcionCorta}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-center">
              <span className="text-[10px] text-[#e0f2e9]/40 font-mono italic">Selecciona un eje para proyectar cognitivamente</span>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Interactive Signage Totem Display SCREEN (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="totem-display-column">
          
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            
            {/* Ambient Leaf background decoration */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#4ade80]/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#3d5a1c]/10 rounded-full filter blur-3xl pointer-events-none" />

            {/* Totem Viewport Top */}
            <div className="space-y-4">
              
              {/* Virtual Totem Screen Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse shrink-0" />
                  <span className="text-[10px] uppercase font-bold text-[#e0f2e9]/50 tracking-wider font-mono">SEÑALÉCTICA COGNITIVA ACTIVA</span>
                </div>
                
                {isUsingBackup && (
                  <span className="text-[9px] px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-md font-mono flex items-center gap-1 font-bold">
                    <AlertTriangle size={10} /> SIMULADO (Local)
                  </span>
                )}
              </div>

              {/* Loader */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="totem-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-24 text-center space-y-4"
                  >
                    {/* Pulsing Core graphic with Immersive UI Styling */}
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#4ade80]/10 rounded-full animate-ping"></div>
                      <div className="absolute inset-2 bg-[#4ade80]/20 rounded-full animate-pulse"></div>
                      <div className="w-10 h-10 bg-[#4ade80] text-[#02120b] rounded-full flex items-center justify-center font-bold font-display shadow-[0_0_25px_rgba(74,222,128,0.4)]">
                        CEA
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#e0f2e9]">Conectando con Núcleo de Inteligencia Ambiental</p>
                      <p className="text-[10px] text-[#e0f2e9]/50 italic max-w-[280px] mx-auto font-mono">Redactando datos bajo la Ley 19.300 de Chile...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="totem-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="space-y-6"
                  >
                    
                    {/* Active Strategic Axis Badge */}
                    <div className="space-y-3">
                      <div className="inline-block px-3 py-1 bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-full text-[#4ade80] text-[10px] font-bold uppercase tracking-widest select-none font-sans">
                        Eje: {selectedAxis.nombre}
                      </div>
                      
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic leading-tight drop-shadow-lg text-[#e0f2e9] tracking-tight">
                        Señaléctica de <br/>
                        <span className="text-[#4ade80] not-italic font-sans font-bold block mt-1">{selectedAxis.id === 'personalizado' ? 'Consulta Libre' : selectedAxis.ley.split(' (')[1]?.replace(')', '') || selectedAxis.nombre}</span>
                      </h2>
                    </div>

                    {/* Educational Content Panel */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.5)]"></div>
                      
                      {/* Giant Accent Watermark Icon */}
                      <div className="absolute -bottom-8 -right-8 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        {(() => {
                          const IconComp = getIconComponent(selectedAxis.iconName);
                          return <IconComp size={120} />;
                        })()}
                      </div>

                      {/* Display Text styled beautifully with a drop cap */}
                      <p className="text-sm sm:text-base text-[#e0f2e9]/95 leading-relaxed font-sans relative z-10 antialiased font-light">
                        <span className="text-[34px] font-bold font-display float-left mr-2 mt-0.5 leading-[28px] text-[#4ade80] select-none">
                          {currentEducationText.charAt(0) || "L"}
                        </span>
                        {currentEducationText.slice(1)}
                      </p>

                      {/* Validation & Word Counter overlay */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#e0f2e9]/50 font-mono relative z-10 select-none">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={11} className={isWordCountCompliant ? "text-[#4ade80]" : "text-amber-400"} />
                          Norma Ley 19.300
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${
                          isWordCountCompliant 
                            ? "bg-black/20 text-[#e0f2e9]/50 border-white/5" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {wordCount} / 45 palabras {isWordCountCompliant ? "✓" : "✗ (Excedido)"}
                        </span>
                      </div>
                    </div>

                    {/* QR Code Segment for mobile scan with Immersive styling */}
                    <div className="bg-white/[0.03] p-4 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between backdrop-blur-lg">
                      <div className="text-left space-y-1">
                        <span className="text-[10px] font-bold text-[#e0f2e9]/50 uppercase tracking-widest font-mono flex items-center gap-1.5">
                          <QrCode size={12} className="text-[#4ade80]" />
                          Escaneado Móvil
                        </span>
                        <h4 className="text-xs font-bold text-[#e0f2e9] font-display">Sigue la Trivia en tu Celular</h4>
                        <p className="text-[10px] text-[#e0f2e9]/50 leading-normal max-w-[200px]">
                          Abre la cámara de tu smartphone para redirigirte a la PWA móvil de gamificación del CEA mediante esta URL parametrizada.
                        </p>
                      </div>

                      <div className="bg-white p-2 rounded-xl shrink-0 shadow-[0_0_20px_rgba(74,222,128,0.2)] relative group select-none transition-transform hover:scale-105 duration-300">
                        {isLoading ? (
                          <div className="w-24 h-24 bg-stone-900 animate-pulse rounded flex items-center justify-center">
                            <span className="text-stone-500 font-mono text-[8px]">Generando...</span>
                          </div>
                        ) : (
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(currentTriviaUrl || "https://cea-movil.cl")}&color=02120b`} 
                            alt="QR de redirección" 
                            className="w-24 h-24 rounded-md"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-[#4ade80] text-[#02120b] font-bold text-[6px] rounded select-none">SCAN</span>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Totem Viewport Footer Information */}
            <div className="border-t border-white/5 pt-4 mt-6 text-center text-[10px] text-[#e0f2e9]/40 flex items-center justify-between font-mono">
              <span>Frecuencia_Nucleo: 50Hz</span>
              <span>Soporte Ley Bases Ambientales de Chile</span>
              <span>ID_TOTEM_04</span>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Simulated Mobile PWA Phone Simulator with Immersive styling */}
        <div className="lg:col-span-3 flex flex-col justify-center" id="mobile-pwa-column">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-left pb-2 border-b border-white/5">
              <span className="text-xs font-bold font-display text-[#e0f2e9]/80 flex items-center gap-1.5">
                <Smartphone size={13} className="text-[#4ade80]" />
                Simulador PWA Móvil
              </span>
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
            </div>
            
            <SimulatedPWA 
              currentAxis={selectedAxis} 
              urlTrivia={currentTriviaUrl} 
              isLoading={isLoading} 
            />
          </div>
        </div>

      </main>

      {/* SECTION DIVIDER & DECK SWITCH */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 mb-8 relative z-10" id="engineering-report-container">
        <EngineeringReport />
      </div>

      {/* BOTTOM DEVELOPER INSPECTOR CONSOLE SECTION */}
      <footer className="max-w-7xl w-full mx-auto p-4 sm:p-6 mt-auto relative z-10" id="developer-footer">
        <div className="border-t border-white/5 pt-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#e0f2e9] font-display flex items-center gap-1.5">
                <Terminal size={15} className="text-[#4ade80]" />
                Inspección del Núcleo Cognitivo API
              </h3>
              <p className="text-xs text-[#e0f2e9]/55 font-sans">
                Verifica en tiempo real el cumplimiento del JSON solicitado y su simulación de persistencia en Flask.
              </p>
            </div>
            <div className="flex items-center gap-2 select-none text-[11px] font-mono">
              <span className="text-[#e0f2e9]/40">Estado de API:</span>
              <span className="text-[#4ade80] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                Operativo
              </span>
            </div>
          </div>

          <ConsoleInspector
            selectedAxis={selectedAxis?.nombre || ""}
            isLoading={isLoading}
            rawResponse={rawResponse}
            responsePayload={responsePayload}
            errorMsg={errorMsg}
          />
        </div>
      </footer>
    </div>
  );
}

