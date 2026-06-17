import { useState } from "react";
import { Terminal, Code, Braces, Database, Network, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConsoleInspectorProps {
  selectedAxis: string;
  isLoading: boolean;
  rawResponse: string;
  responsePayload: any;
  errorMsg: string | null;
}

export default function ConsoleInspector({
  selectedAxis,
  isLoading,
  rawResponse,
  responsePayload,
  errorMsg
}: ConsoleInspectorProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"response" | "prompt" | "flask">("response");

  const systemInstructions = `Eres el núcleo de Inteligencia Ambiental Cognitiva para el Tótem de Señalética Interactiva del Centro de Educación Ambiental (CEA). Tu objetivo es proveer contenido educativo dinámico y actividades de gamificación a los visitantes, bajo los lineamientos de la Ley 19.300 (Bases Generales del Medio Ambiente en Chile).

Cuando recibas el nombre de un Eje Ambiental Estratégico, debes responder ESTRICTAMENTE con un objeto JSON que contenga las siguientes llaves:
1. "contenido_educativo": Un texto conciso, pedagógico y de alto impacto (máximo 45 palabras) que entregue un dato relevante, estadística o consejo práctico sobre el eje seleccionado. Debe usar un lenguaje accesible pero técnico.
2. "url_trivia": Una URL simulada y parametrizada para redirigir al usuario a la PWA móvil del juego interactivo.

Reglas críticas de comportamiento:
- Responde ÚNICAMENTE con el formato JSON crudo.
- No incluyas bloques de código con la palabra \`\`\`json o \`\`\`. 
- No saludes, no des introducciones ni cierres corporativos. 
- La consistencia del formato es vital para no romper la capa de persistencia y lógica del backend en Flask.`;

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div id="developer-inspector" className="flex flex-col h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono antialiased text-[#e0f2e9]/90">
      {/* Console Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#02120b]/90">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]/80"></span>
          </div>
          <span className="text-xs font-semibold text-[#e0f2e9]/50 select-none">COGNITIVE_CORE_INSPECTOR v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 text-[10px] text-[#4ade80] font-semibold select-none uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
            Flask Sync Estándar
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-black/20 text-xs text-sans">
        <button
          onClick={() => setActiveTab("response")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === "response"
              ? "border-[#4ade80] text-[#4ade80] bg-white/5"
              : "border-transparent text-[#e0f2e9]/60 hover:text-[#e0f2e9]"
          }`}
        >
          <Braces size={13} />
          Respuesta JSON Cruda
        </button>
        <button
          onClick={() => setActiveTab("prompt")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === "prompt"
              ? "border-[#4ade80] text-[#4ade80] bg-white/5"
              : "border-transparent text-[#e0f2e9]/60 hover:text-[#e0f2e9]"
          }`}
        >
          <Terminal size={13} />
          Prompt de Sistema
        </button>
        <button
          onClick={() => setActiveTab("flask")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === "flask"
              ? "border-[#4ade80] text-[#4ade80] bg-white/5"
              : "border-transparent text-[#e0f2e9]/60 hover:text-[#e0f2e9]"
          }`}
        >
          <Database size={13} />
          Simulador Flask / Ley 19.300
        </button>
      </div>

      {/* Console Content */}
      <div className="flex-1 p-5 overflow-y-auto text-xs leading-relaxed max-h-[460px]">
        <AnimatePresence mode="wait">
          {activeTab === "response" && (
            <motion.div
              layoutId="console-tab-content-resp"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
              id="raw-json-tab"
            >
              {/* API Endpoints Info */}
              <div className="p-3 bg-black/30 rounded-lg border border-white/5 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#e0f2e9]/40">MÉTODO HTTP & ENDPOINT:</span>
                  <span className="font-bold text-[#4ade80] uppercase font-mono bg-[#4ade80]/10 px-1.5 py-0.5 rounded border border-[#4ade80]/20 text-[10px]">POST /api/eje-ambiental</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#e0f2e9]/40">PAYLOAD ENVIADO:</span>
                  <span className="text-[#e0f2e9]/80 font-mono">{"{"} "eje": "{selectedAxis || "..."}" {"}"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#e0f2e9]/40">ESTADO DE TRANSFERENCIA:</span>
                  {isLoading ? (
                    <span className="text-amber-400 animate-pulse font-bold">PROCESANDO COGNITIVO...</span>
                  ) : errorMsg ? (
                    <span className="text-red-400 flex items-center gap-1 font-bold">
                      <AlertTriangle size={11} id="alert-network" /> ERROR 500
                    </span>
                  ) : (
                    <span className="text-[#4ade80] flex items-center gap-1 font-bold">
                      <CheckCircle2 size={11} /> CONFORME RES_200 OK
                    </span>
                  )}
                </div>
              </div>

              {/* JSON Code Viewer */}
              <div className="relative">
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button
                    onClick={() => copyToClipboard(rawResponse || "// No hay datos", "raw")}
                    className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0f2e9]/60 hover:text-[#e0f2e9] rounded transition-colors cursor-pointer"
                    title="Copiar contenido"
                  >
                    {copiedSection === "raw" ? (
                      <Check size={14} className="text-[#4ade80]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-[#e0f2e9]/40 mb-1 flex items-center gap-1.5">
                  <Code size={11} /> ESTRICTAMENTE JSON CRUDO RETORNADO POR GEMINI (SIN MARCADORES DE BLOQUE):
                </div>

                <pre className="p-4 bg-black/50 border border-white/5 rounded-xl overflow-x-auto text-[11px] text-[#4ade80]/90 font-mono min-h-[140px] whitespace-pre-wrap leading-relaxed shadow-inner">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-[#e0f2e9]/30 py-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping"></span>
                      <span>Esperando respuesta de Inteligencia Cognitiva...</span>
                    </div>
                  ) : errorMsg ? (
                    <span className="text-red-400">{`// Error en Consola del Núcleo Cognitivo:\n{\n  "error": "${errorMsg}"\n}`}</span>
                  ) : rawResponse ? (
                    rawResponse
                  ) : (
                    <span className="text-[#e0f2e9]/30">// Selecciona un Eje Ambiental Estratégico para ver el JSON crudo del Núcleo</span>
                  )}
                </pre>
              </div>

              {/* Compliance checklist */}
              <div className="p-3 bg-black/25 rounded-lg border border-white/5 text-[11px] space-y-1.5">
                <div className="text-xs font-semibold text-[#e0f2e9]/50 mb-1 border-b border-white/5 pb-1">Análisis de Cumplimiento de Reglas:</div>
                <div className="flex items-center justify-between">
                  <span>¿Formato es JSON crudo parseable?</span>
                  <span className={rawResponse && responsePayload ? "text-[#4ade80]" : "text-[#e0f2e9]/30"}>
                    {rawResponse && responsePayload ? "✓ SÍ (Cumplido)" : "Esperando dato..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>¿Libre de etiquetas \`\`\`json o \`\`\`?</span>
                  <span className={rawResponse ? (!rawResponse.includes("```") ? "text-[#4ade80]" : "text-red-400") : "text-[#e0f2e9]/30"}>
                    {rawResponse ? (!rawResponse.includes("```") ? "✓ SÍ (Cumplido)" : "✗ Falló") : "Esperando dato..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>¿Sin saludos ni textos introductorios?</span>
                  <span className={rawResponse ? (rawResponse.trim().startsWith("{") ? "text-[#4ade80]" : "text-yellow-400") : "text-[#e0f2e9]/30"}>
                    {rawResponse ? (rawResponse.trim().startsWith("{") ? "✓ SÍ (Cumplido)" : "✗ Posee texto extra") : "Esperando dato..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>¿Posee llaves 'contenido_educativo' y 'url_trivia'?</span>
                  <span className={responsePayload ? (responsePayload.hasOwnProperty("contenido_educativo") && responsePayload.hasOwnProperty("url_trivia") ? "text-[#4ade80]" : "text-red-400") : "text-[#e0f2e9]/30"}>
                    {responsePayload ? (responsePayload.hasOwnProperty("contenido_educativo") && responsePayload.hasOwnProperty("url_trivia") ? "✓ SÍ (Estructura Correcta)" : "✗ Estructura Inválida") : "Esperando dato..."}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "prompt" && (
            <motion.div
              layoutId="console-tab-content-prompt"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
              id="prompt-tab"
            >
              <div className="relative">
                <div className="absolute top-2 pb-1 right-2 z-10">
                  <button
                    onClick={() => copyToClipboard(systemInstructions, "prompt")}
                    className="p-1 px-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0f2e9]/65 hover:text-[#e0f2e9] rounded text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === "prompt" ? (
                      <Check size={12} className="text-[#4ade80]" />
                    ) : (
                      <Copy size={12} />
                    )}
                    Copiar Prompt
                  </button>
                </div>
                <div className="text-[11px] text-[#e0f2e9]/40 mb-1 flex items-center gap-1.5 select-none">
                  <Terminal size={11} /> PROMPT DE SISTEMA QUE RIGE AL NÚCLEO COGNITIVO (VERBATIM):
                </div>
                <pre className="p-4 bg-black/50 border border-white/5 rounded-xl overflow-x-auto text-[10px] text-[#e0f2e9]/70 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                  {systemInstructions}
                </pre>
              </div>
            </motion.div>
          )}

          {activeTab === "flask" && (
            <motion.div
              layoutId="console-tab-content-flask"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
              id="flask-tab"
            >
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Network className="text-[#4ade80]" size={16} />
                  <span className="text-xs font-semibold text-[#e0f2e9]/80">Esquema de Integración de Persistencia</span>
                </div>
                
                <p className="text-[11px] text-[#e0f2e9]/60 leading-relaxed">
                  Para el funcionamiento con el backend en <strong>Flask</strong>, el formato JSON no-decorado es indispensable. Los decoradores de código markdown como <code className="text-red-400">```json</code> bloquean el método nativo <code className="text-blue-450">request.get_json()</code> de Python y producen excepciones de tipo <code className="text-red-400">json.decoder.JSONDecodeError</code> al intentar insertar en base de datos.
                </p>

                <div className="bg-black/50 p-3 rounded-lg border border-white/5 text-[10px] space-y-1.5 font-mono text-[#e0f2e9]/80">
                  <span className="text-[10px] text-[#4ade80] font-semibold block uppercase">Simulación de Recepción en Flask:</span>
                  <code className="block whitespace-pre text-[#e0f2e9]/65 text-[9px] leading-relaxed select-all">
{`@app.route('/api/eje-ambiental', methods=['POST'])
def handle_eje():
    # Obtener el JSON directo (Sin markdown tags que rompan el stream)
    raw_data = request.data.decode('utf-8')
    try:
        # Al no poseer saludos ni backticks, el json carga directo:
        data = json.loads(raw_data)
        guardar_en_persistencia(data['contenido_educativo'])
        return jsonify({"status": "synchronized", "payload": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 400`}
                  </code>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#4ade80]/90 bg-[#4ade80]/5 p-2 rounded border border-[#4ade80]/15">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>Nuestra pasarela sanitiza y emula de forma segura este comportamiento. ¡Formato 100% verificado!</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
