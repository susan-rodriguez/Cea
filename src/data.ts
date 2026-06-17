import { 
  Leaf, 
  ClipboardCheck, 
  Wind, 
  GraduationCap, 
  Scale, 
  RotateCw,
  Droplet,
  Flame,
  Users
} from "lucide-react";

export interface EjeAmbiental {
  id: string;
  nombre: string;
  descripcionCorta: string;
  articulos: string;
  ley: string;
  iconName: string;
  colorHex: string;
  colorBgHex: string;
  preguntasTrivia: {
    pregunta: string;
    opciones: string[];
    indexCorrecto: number;
    explicacion: string;
  }[];
}

export const EJES_ESTRATEGICOS: EjeAmbiental[] = [
  {
    id: "biodiversidad",
    nombre: "Biodiversidad y Áreas Protegidas",
    descripcionCorta: "Preservación de la naturaleza y conservación del patrimonio ambiental. Regula la conservación de flora, fauna y hábitats únicos en Chile.",
    articulos: "Artículos 34 al 39",
    ley: "Ley 19.300 (Título SEIA / Áreas Silvestres)",
    iconName: "Leaf",
    colorHex: "#10b981", // Emerald 500
    colorBgHex: "rgba(16, 185, 129, 0.1)",
    preguntasTrivia: [
      {
        pregunta: "¿Qué porcentaje aproximado de las áreas protegidas terrestres de Chile se encuentra en la Patagonia?",
        opciones: ["Alrededor del 40%", "Más del 80%", "Cerca del 15%", "Menos del 50%"],
        indexCorrecto: 1,
        explicacion: "Más del 80% de la superficie bajo protección del Sistema Nacional de Áreas Silvestres Protegidas del Estado (SNASPE) está concentrada en las regiones australes de Chile."
      },
      {
        pregunta: "Según el Art. 34 de la Ley 19.300, el Estado participará en la conservación de:",
        opciones: [
          "Solo predios de interés minero",
          "El patrimonio ambiental del país y áreas silvestres protegidas",
          "Solo parques zoológicos municipales",
          "Bosques industriales de celulosa"
        ],
        indexCorrecto: 1,
        explicacion: "La ley mandata expresamente salvaguardar el patrimonio ambiental de la nación, asegurando la diversidad vegetal y animal."
      },
      {
        pregunta: "¿Qué organismo chileno es el encargado de administrar las Áreas Silvestres Protegidas del Estado (SNASPE)?",
        opciones: ["SAG", "CONAF", "Ministerio de Minería", "SERNAGEOMIN"],
        indexCorrecto: 1,
        explicacion: "La Corporación Nacional Forestal (CONAF) administra actualmente el SNASPE, protegiendo parques, reservas y monumentos naturales."
      }
    ]
  },
  {
    id: "seia",
    nombre: "Evaluación de Impacto Ambiental (SEIA)",
    descripcionCorta: "El instrumento preventivo de gestión ambiental que evalúa si los proyectos de inversión cumplen con las normativas vigentes.",
    articulos: "Artículos 8 al 25",
    ley: "Ley 19.300 (Sistema de Evaluación de Impacto Ambiental)",
    iconName: "ClipboardCheck",
    colorHex: "#3b82f6", // Blue 500
    colorBgHex: "rgba(59, 130, 246, 0.1)",
    preguntasTrivia: [
      {
        pregunta: "¿Cuál es la diferencia principal entre una DIA (Declaración) y un EIA (Estudio) de Impacto Ambiental?",
        opciones: [
          "El EIA es solo para proyectos públicos y la DIA para privados",
          "El EIA evalúa proyectos que generan efectos, características o circunstancias graves sobre la salud o recursos naturales",
          "La DIA no requiere aprobación legal de la autoridad",
          "La DIA cuesta el triple en pagos fiscales"
        ],
        indexCorrecto: 1,
        explicacion: "Los Estudios (EIA) son obligatorios para proyectos de mayor envergadura que generen daños severos o reasentamientos humanos, mientras que las Declaraciones (DIA) aplican cuando no hay dichos impactos significativos."
      },
      {
        pregunta: "¿Qué servicio público es el encargado de administrar el SEIA y asegurar la uniformidad en las evaluaciones?",
        opciones: ["SMA (Superintendencia)", "SEA (Servicio de Evaluación Ambiental)", "Tribunal Ambiental", "COFOC"],
        indexCorrecto: 1,
        explicacion: "El Servicio de Evaluación Ambiental (SEA) administra directamente el SEIA de forma técnica y coordinada."
      },
      {
        pregunta: "¿Tienen derecho los ciudadanos a realizar observaciones formales a un Estudio de Impacto Ambiental?",
        opciones: [
          "No, está prohibido",
          "Sí, mediante la Participación Ciudadana (PAC)",
          "Solo si son dueños de terrenos colindantes",
          "Solo si pertenecen al cuerpo de diputados"
        ],
        indexCorrecto: 1,
        explicacion: "La Participación Ciudadana (PAC) es un derecho amparado por ley para que cualquier persona natural o jurídica realice observaciones ambientales a los proyectos."
      }
    ]
  },
  {
    id: "calidad-aire",
    nombre: "Calidad del Aire, Agua y Suelo",
    descripcionCorta: "Establecimiento de normas de contaminación, planes de prevención y descontaminación para devolver la salubridad a zonas saturadas.",
    articulos: "Artículos 32 y 33",
    ley: "Ley 19.300 (Normas y Planes)",
    iconName: "Wind",
    colorHex: "#ec4899", // Pink 500
    colorBgHex: "rgba(236, 72, 153, 0.1)",
    preguntasTrivia: [
      {
        pregunta: "¿Qué significa que una zona sea declarada formalmente como 'Zona Saturada' en Chile?",
        opciones: [
          "Que no tiene suficiente población residente",
          "Que una norma de calidad ambiental ha sido sobrepasada en las mediciones",
          "Que no hay agua suficiente para la agricultura",
          "Que está inundada de residuos domiciliarios"
        ],
        indexCorrecto: 1,
        explicacion: "Una zona saturada es aquella en que una o más normas de calidad ambiental se encuentran sobrepasadas (por ejemplo, el material particulado de calefacción)."
      },
      {
        pregunta: "¿Qué diferencias hay entre una 'Norma Primaria' y una 'Norma Secundaria' de calidad ambiental?",
        opciones: [
          "La primaria es nacional y la secundaria es regional",
          "La primaria resguarda la salud de las personas; la secundaria resguarda la naturaleza, ecosistemas y recursos naturales",
          "La secundaria es solo consultiva y voluntaria",
          "No existe tal diferencia en la ley chilena"
        ],
        indexCorrecto: 1,
        explicacion: "Las Normas Primarias protegen la salud pública (humana). Las Normas Secundarias protegen el patrimonio natural, especies y conservación ecológica."
      },
      {
        pregunta: "¿Qué combustible domiciliario es el principal responsable del material particulado fino (MP2.5) en el centro-sur de Chile?",
        opciones: ["Gas licuado", "Leña de calidad húmeda", "Energía solar", "Kerosene"],
        indexCorrecto: 1,
        explicacion: "La combustión residencial de leña húmeda de mala calidad libera enormes volúmenes de MP2.5, provocando alertas ambientales severas en invierno."
      }
    ]
  },
  {
    id: "educacion-ambiental",
    nombre: "Educación y Participación Ciudadana",
    descripcionCorta: "Implementa el derecho a participar de las decisiones, fomenta la conciencia proambiental y el acceso libre a información ecológica del país.",
    articulos: "Artículos 6, 73 al 75",
    ley: "Ley 19.300 (Fomento de Cultura Ambiental)",
    iconName: "GraduationCap",
    colorHex: "#f59e0b", // Amber 500
    colorBgHex: "rgba(245, 158, 11, 0.1)",
    preguntasTrivia: [
      {
        pregunta: "La educación ambiental según la Ley 19.300 debe definirse como un proceso:",
        opciones: [
          "Para ingenieros y licenciados de postgrado en ecología exclusivamente",
          "Militar obligatorio sobre fronteras patrias",
          "Permanente e interdisciplinario que busca formar ciudadanos con valores y conductas protectoras del medio ambiente",
          "Opcional que no forma parte del currículum escolar básico"
        ],
        indexCorrecto: 2,
        explicacion: "La educación ambiental es un proceso continuo e integral tanto formal como informal que promueve conductas ecológicas responsables en todos los niveles."
      },
      {
        pregunta: "¿Qué fondo concursable del Ministerio del Medio Ambiente financia proyectos ciudadanos locales?",
        opciones: ["FNDR", "FPA (Fondo de Protección Ambiental)", "Corfo Verde", "Fondo Concursable Sol"],
        indexCorrecto: 1,
        explicacion: "El Fondo de Protección Ambiental (FPA) es el único fondo nacional dedicado a financiar iniciativas comunitarias ecológicas organizadas por la ciudadanía."
      },
      {
        pregunta: "¿Qué pilar principal resguarda el Convenio de Escazú, ratificado por Chile en 2022?",
        opciones: [
          "La venta libre de bonos de carbón internacional",
          "Acceso a la información, participación pública y justicia ambiental en América Latina",
          "La pesca de arrastre industrial",
          "La minería interestelar de litio"
        ],
        indexCorrecto: 1,
        explicacion: "El Acuerdo de Escazú fortalece el acceso equitativo a información confiable, participación en debates ecológicos y protección a defensores del medio ambiente."
      }
    ]
  },
  {
    id: "responsabilidad-dano",
    nombre: "Responsabilidad por Daño Ambiental",
    descripcionCorta: "Quien contamina o daña el ecosistema tiene el deber moral y jurídico de restaurar el entorno a su estado original.",
    articulos: "Artículos 51 al 55",
    ley: "Ley 19.300 (Responsabilidad Civil y Judicial)",
    iconName: "Scale",
    colorHex: "#8b5cf6", // Purple 500
    colorBgHex: "rgba(139, 92, 246, 0.1)",
    preguntasTrivia: [
      {
        pregunta: "En Chile, ¿cuál es el tribunal facultado expresamente para resolver las demandas por daño ambiental?",
        opciones: [
          "Corte Suprema directamente como única instancia",
          "Tribunal de Garantía Penal Local",
          "Tribunales Ambientales (Existen 3 en el territorio nacional)",
          "Juzgados de Policía Local Municipales"
        ],
        indexCorrecto: 2,
        explicacion: "Chile cuenta con tres Tribunales Ambientales especializados integrados por ministros de derecho y científicos para resolver conflictos y demandas por daño ambiental."
      },
      {
        pregunta: "¿Qué significa el principio preventivo 'El que contamina paga' consagrado implícitamente?",
        opciones: [
          "Que si tienes dinero puedes dañar y pagar la multa sin restaurar nada",
          "Que quien realiza un proyecto debe incorporar todos los costos de prevención, mitigación y eventual reparación",
          "Que los ciudadanos deben pagar un boleto diario para ver el mar",
          "Que el Estado rematará las empresas contaminantes a precio simbólico"
        ],
        indexCorrecto: 1,
        explicacion: "Este principio requiere que el agente asuma los costos socioambientales e inversiones necesarias para evitar alteraciones negativas, y no traspasar este costo a la comunidad."
      },
      {
        pregunta: "¿Cuál es el plazo general para entablar una demanda por daño ambiental según el Art. 62 de la Ley?",
        opciones: ["1 año", "5 años desde la manifestación evidente del daño", "100 años", "6 meses"],
        indexCorrecto: 1,
        explicacion: "La acción por daño ambiental prescribe en el plazo de cinco años, contado desde la manifestación evidente del daño ecológico producido."
      }
    ]
  },
  {
    id: "economia-circular",
    nombre: "Economía Circular y Ley de Reciclaje (REP)",
    descripcionCorta: "Implementa un modelo sustentable donde los productores son responsables de valorizar, recuperar y reciclar los envases y embalajes.",
    articulos: "Ley 20.920 (REP) complementaria",
    ley: "Leyes Complementarias a la 19.300",
    iconName: "RotateCw",
    colorHex: "#14b8a6", // Teal 500
    colorBgHex: "rgba(20, 184, 166, 0.1)",
    preguntasTrivia: [
      {
        pregunta: "¿Qué significa la sigla 'REP' en la Ley chilena Nº 20.920?",
        opciones: [
          "Reciclaje Extremo Particular",
          "Responsabilidad Extendida del Productor",
          "Registro Ecológico de Plásticos",
          "Recaudación Excepcional de Presupuesto"
        ],
        indexCorrecto: 1,
        explicacion: "La Responsabilidad Extendida del Productor obliga a los fabricantes e importadores a organizar y costear el reciclaje de sus productos cuando terminan su vida útil."
      },
      {
        pregunta: "¿Cuáles son los denominados 'Productos Prioritarios' bajo la Ley REP chilena?",
        opciones: [
          "Frutas frescas, agua de napas y energía eólica",
          "Aceites lubricantes, aparatos eléctricos, baterías, envases y embalajes, neumáticos, y pilas",
          "Bebidas alcohólicas y alimentos importados",
          "Ropa de camuflaje militar y carbón mineral"
        ],
        indexCorrecto: 1,
        explicacion: "La ley identificó 6 grupos prioritarios debido a su alto volumen de generación, peligrosidad o dificultad técnica para ser reciclados de forma aislada."
      },
      {
        pregunta: "¿Cuál es el eslabón básico de la jerarquía en la gestión de residuos antes de 'Reciclar'?",
        opciones: ["Verter de forma controlada", "Reducir y Evitar en origen", "Quemar con filtros de aire", "Exportar a vertederos africanos"],
        indexCorrecto: 1,
        explicacion: "La economía de los residuos prioriza la prevención en primer lugar: evitar y reducir la generación de basura mucho antes de reciclar o valorizar energéticamente."
      }
    ]
  }
];

export function getIconComponent(name: string) {
  switch (name) {
    case "Leaf": return Leaf;
    case "ClipboardCheck": return ClipboardCheck;
    case "Wind": return Wind;
    case "GraduationCap": return GraduationCap;
    case "Scale": return Scale;
    case "RotateCw": return RotateCw;
    case "Droplet": return Droplet;
    case "Flame": return Flame;
    case "Users": return Users;
    default: return Leaf;
  }
}
