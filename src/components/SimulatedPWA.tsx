import { useState, useEffect } from "react";
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  RotateCcw, 
  Award, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Sparkles,
  QrCode,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EjeAmbiental, getIconComponent } from "../data";

interface SimulatedPWAProps {
  currentAxis: EjeAmbiental | null;
  urlTrivia: string;
  isLoading: boolean;
}

export default function SimulatedPWA({ currentAxis, urlTrivia, isLoading }: SimulatedPWAProps) {
  const [gameState, setGameState] = useState<"idle" | "intro" | "playing" | "summary">("idle");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentTime, setCurrentTime] = useState("12:00");

  // Keep phone time synchronized
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Reset state on Axis change
  useEffect(() => {
    if (currentAxis) {
      setGameState("intro");
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
    } else {
      setGameState("idle");
    }
  }, [currentAxis]);

  const questions = currentAxis?.preguntasTrivia || [];

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const submitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    
    const isCorrect = selectedOption === questions[currentQuestionIndex].indexCorrecto;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setIsAnswerSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setGameState("summary");
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setGameState("playing");
  };

  // Safe QR Code URL using free reliable QR generator
  const qrCodeUrl = urlTrivia 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(urlTrivia)}&color=0d1527`
    : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://cea.mma.gob.cl&color=0d1527`;

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-sm mx-auto" id="simulated-pwa-phone">
      <div className="relative w-full aspect-[9/19] max-w-[280px] bg-[#1a1103] rounded-[40px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800/60 overflow-hidden">
        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[22px] bg-slate-700/80 rounded-b-2xl z-25 flex items-center justify-center">
          <div className="w-12 h-1 bg-black rounded-full mb-1"></div>
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-25"></div>

        {/* Screen Container */}
        <div className="w-full h-full bg-[#faf9f6] text-slate-800 rounded-[30px] overflow-hidden flex flex-col relative z-20 font-sans select-none border border-black/10">
          
          {/* Status Bar */}
          <div className="h-7 bg-[#1e293b] text-white/90 text-[10px] px-5 pt-1.5 flex items-center justify-between font-medium">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Wifi size={10} className="stroke-[2.5]" />
              <span className="text-[9px]">4G</span>
              <Battery size={11} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Dynamic Browser Address / Header */}
          <div className="px-3 py-1.5 bg-[#0f172a] text-slate-400 border-b border-slate-800 flex items-center justify-between gap-1 text-[9px] font-mono">
            <span className="truncate max-w-[170px] text-slate-300">
              {isLoading ? "cargando..." : urlTrivia ? urlTrivia.replace("https://", "") : "cea-movil.cl/inicial"}
            </span>
            <ExternalLink size={8} className="shrink-0 text-slate-500" />
          </div>

          {/* Interactive Screen Content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between relative bg-stone-50 text-stone-900 scroll-smooth">
            <AnimatePresence mode="wait">
              {/* STATE 1: Idle (Waiting for Select) */}
              {gameState === "idle" && (
                <motion.div
                  key="idle-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                    <Smartphone size={28} className="stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">CEA MÓVIL</h4>
                    <p className="text-[10px] text-slate-500 leading-normal max-w-[180px] mx-auto">
                      Selecciona un Eje Ambiental Estratégico en la pantalla táctil para interactuar.
                    </p>
                  </div>
                  <div className="w-24 aspect-square bg-white border border-dashed border-stone-200 rounded-lg p-2.5 flex items-center justify-center opacity-60">
                    <QrCode size={40} className="text-slate-300 stroke-[1.5]" />
                  </div>
                  <span className="text-[9px] text-slate-400 italic">Dispositivo Sincronizado</span>
                </motion.div>
              )}

              {/* STATE 2: Loading Axis / Intro */}
              {gameState === "intro" && (
                <motion.div
                  key="intro-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col justify-between h-full py-2"
                >
                  <div className="space-y-3 pt-2 text-center">
                    <div className="inline-flex p-2.5 rounded-full" style={{ backgroundColor: currentAxis?.colorBgHex }}>
                      {currentAxis && (() => {
                        const Icon = getIconComponent(currentAxis.iconName);
                        return <Icon size={24} style={{ color: currentAxis.colorHex }} />;
                      })()}
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] text-emerald-600 font-bold tracking-wider uppercase font-display block">Juego Trivia Activo</span>
                      <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-tight px-1 font-display">
                        {currentAxis?.nombre}
                      </h4>
                      <p className="text-[9px] text-slate-500">
                        {currentAxis?.ley}
                      </p>
                    </div>

                    <div className="p-2.5 bg-emerald-50/50 border border-emerald-500/10 rounded-xl space-y-1 text-left">
                      <span className="text-[8px] font-semibold text-emerald-700 uppercase flex items-center gap-1">
                        <Sparkles size={8} /> Dinámica de Gamificación:
                      </span>
                      <p className="text-[8.5px] leading-relaxed text-slate-600">
                        Responde 3 preguntas educativas sobre normativas, impacto y biodiversidad en Chile. ¡Suma puntaje proambiental!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <button
                      onClick={() => setGameState("playing")}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <BookOpen size={11} />
                      Comenzar Eco-Trivia
                      <ArrowRight size={10} />
                    </button>
                    
                    {/* Real QR Scanning Display */}
                    <div className="bg-white p-2 border border-slate-100 rounded-xl flex items-center gap-2">
                      <img src={qrCodeUrl} alt="QR Trivia PWA" className="w-11 h-11 shrink-0 border border-slate-100 rounded-md" referrerPolicy="no-referrer" />
                      <div className="text-left">
                        <span className="text-[8px] font-bold text-slate-700 block">Juega en tu celular</span>
                        <span className="text-[7.5px] text-slate-400 block leading-tight">Escanea el QR en el panel para llevar el juego a tu propia PWA móvil.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STATE 3: Trivia Playing */}
              {gameState === "playing" && currentAxis && (
                <motion.div
                  key="playing-state"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col justify-between h-full pt-1"
                >
                  <div className="space-y-3 flex-1">
                    {/* Trivia Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
                      <span className="text-[8px] font-semibold text-slate-400 font-mono">Pregunta {currentQuestionIndex + 1} de 3</span>
                      <span className="text-[8px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-mono">Puntos: {score}</span>
                    </div>

                    {/* Question text */}
                    <h5 className="text-[10px] sm:text-xs font-bold text-slate-800 leading-snug">
                      {questions[currentQuestionIndex]?.pregunta}
                    </h5>

                    {/* Answers Options */}
                    <div className="space-y-1.5 pt-1">
                      {questions[currentQuestionIndex]?.opciones.map((opcion, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = idx === questions[currentQuestionIndex].indexCorrecto;
                        
                        let optionStyle = "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50";
                        if (isSelected) {
                          if (isAnswerSubmitted) {
                            optionStyle = isCorrect 
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900" 
                              : "border-red-400 bg-red-50 text-red-900";
                          } else {
                            optionStyle = "border-emerald-600 bg-emerald-500/10 text-emerald-900";
                          }
                        } else if (isAnswerSubmitted && isCorrect) {
                          optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium";
                        } else if (isAnswerSubmitted) {
                          optionStyle = "opacity-60 border-slate-100 bg-white text-slate-400";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswerSubmitted}
                            className={`w-full py-1.5 px-2 text-left rounded-xl border text-[9px] leading-tight transition-all flex items-start gap-2 cursor-pointer ${optionStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center shrink-0 font-bold bg-slate-50 text-[8px] text-slate-500 font-mono">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{opcion}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Short explanation after answer submission */}
                    <AnimatePresence>
                      {isAnswerSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-2 rounded-lg bg-slate-100 text-[8.5px] leading-relaxed text-slate-600 border border-slate-200 mt-2 flex gap-1.5 items-start"
                        >
                          {selectedOption === questions[currentQuestionIndex].indexCorrecto ? (
                            <CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={10} className="text-red-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold text-slate-800">Respuesta:</span>{" "}
                            {questions[currentQuestionIndex].explicacion}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submission and navigation */}
                  <div className="pt-3 border-t border-stone-200/50 mt-1">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={submitAnswer}
                        disabled={selectedOption === null}
                        className={`w-full py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          selectedOption !== null 
                            ? "bg-slate-800 text-white hover:bg-slate-900" 
                            : "bg-stone-200 text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        Validar Respuesta
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                      >
                        {currentQuestionIndex + 1 < questions.length ? "Siguiente Pregunta" : "Finalizar y Obtener Sello"}
                        <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STATE 4: Summary Result / Badge */}
              {gameState === "summary" && (
                <motion.div
                  key="summary-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between h-full py-2 text-center"
                >
                  <div className="space-y-3 pt-2">
                    <div className="relative inline-block">
                      <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                        <Award size={36} className="animate-spin-slow" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-md">
                        {score}/3
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-semibold text-amber-600 uppercase tracking-widest block font-display">Tótem CEA Certificado</span>
                      <h4 className="text-xs font-bold text-slate-800 font-display">¡Sello Ecológico Obtenido!</h4>
                      <p className="text-[8px] text-slate-500 max-w-[190px] mx-auto leading-normal">
                        Has completado con éxito la capacitación del eje <strong>{currentAxis?.nombre}</strong>.
                      </p>
                    </div>

                    {/* Certificate box badge */}
                    <div className="bg-amber-500/5 border border-dashed border-amber-500/30 rounded-xl p-2.5 text-left text-slate-700 font-mono text-[7px] leading-relaxed relative">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center font-bold text-[6px]">APPROVED</div>
                      <span className="font-bold text-slate-500 block uppercase border-b border-amber-600/10 pb-0.5 mb-1 text-[6.5px]">CERTIFICADO COGNITIVO CEA</span>
                      <p><span className="text-slate-400">CIUDADANO:</span> Visitante CEA</p>
                      <p><span className="text-slate-400">EJE:</span> {currentAxis?.id.toUpperCase()}</p>
                      <p><span className="text-slate-400">NORMATIVA:</span> LEY 19.300 CHILE</p>
                      <p><span className="text-slate-400">HASH_PWA:</span> OK_L19300_{currentAxis?.id.slice(0,3).toUpperCase()}_{score}</p>
                    </div>

                    <div className="p-1.5 bg-slate-100 rounded-lg text-[8px] text-slate-500 italic flex items-center justify-center gap-1">
                      <Sparkles size={8} className="text-emerald-500" />
                      <span>¡Sello sumado al pasaporte eco-PWA!</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-4">
                    <button
                      onClick={restartGame}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[9px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      Reintentar Trivia
                    </button>
                    <button
                      onClick={() => setGameState("intro")}
                      className="w-full py-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[9px] font-semibold bg-white transition-all cursor-pointer"
                    >
                      Volver a Presentación
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
