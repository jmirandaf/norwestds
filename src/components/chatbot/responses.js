// ─── Chatbot Responses ────────────────────────────────────────────────────────
// All scripted flows for the NDS chatbot.
// To add a new flow: add an entry to FLOWS and register keywords in KEYWORDS.
// ─────────────────────────────────────────────────────────────────────────────

const FLOWS = {
  greeting: {
    es: {
      text: '¡Hola! 👋 Soy el asistente de Norwest Dynamic Systems.\n\nSomos una empresa de automatización industrial con presencia en Tijuana, MX y San Diego, USA. ¿En qué puedo ayudarte hoy?',
      quickReplies: [
        { label: '🤖 Servicios',      action: 'services'   },
        { label: '🏭 Industrias',     action: 'industries' },
        { label: '🏢 Quiénes somos',  action: 'about'      },
        { label: '📁 Proyectos',      action: 'projects'   },
        { label: '⚡ DesignPro',      action: 'designpro'  },
        { label: '📞 Contacto',       action: 'contact'    },
      ],
    },
    en: {
      text: "Hi! 👋 I'm the Norwest Dynamic Systems assistant.\n\nWe're an industrial automation company based in Tijuana, MX with a presence in San Diego, USA. How can I help you today?",
      quickReplies: [
        { label: '🤖 Services',       action: 'services'   },
        { label: '🏭 Industries',     action: 'industries' },
        { label: '🏢 About NDS',      action: 'about'      },
        { label: '📁 Projects',       action: 'projects'   },
        { label: '⚡ DesignPro',      action: 'designpro'  },
        { label: '📞 Contact',        action: 'contact'    },
      ],
    },
  },

  about: {
    userText: { es: '🏢 Quiénes somos', en: '🏢 About NDS' },
    es: {
      text: 'Norwest Dynamic Systems (NDS) es una empresa de automatización industrial fundada hace más de 8 años.\n\n📍 Sede principal en Tijuana, BC · Oficina en San Diego, CA\n🌐 Atendemos proyectos en México y Estados Unidos\n🤖 Integradores certificados de robots FANUC\n👷 Equipo de ingenieros especializados en robótica, visión artificial, control y diseño eléctrico\n✅ 10+ proyectos exitosos completados\n\nNuestra ventaja: conocemos a fondo el mercado de la frontera MX/USA y operamos en ambos idiomas.',
      quickReplies: [
        { label: '🤖 Servicios',    action: 'services'   },
        { label: '📁 Proyectos',    action: 'projects'   },
        { label: '🔄 Cómo trabajamos', action: 'process' },
        { label: '📞 Contacto',    action: 'contact'    },
      ],
    },
    en: {
      text: 'Norwest Dynamic Systems (NDS) is an industrial automation company with over 8 years of experience.\n\n📍 Headquarters in Tijuana, BC · Office in San Diego, CA\n🌐 We serve projects in Mexico and the United States\n🤖 Certified FANUC robot integrators\n👷 Team of engineers specialized in robotics, machine vision, control and electrical design\n✅ 10+ successful projects completed\n\nOur edge: we know the MX/USA border market deeply and operate fully bilingual.',
      quickReplies: [
        { label: '🤖 Services',        action: 'services'   },
        { label: '📁 Projects',        action: 'projects'   },
        { label: '🔄 How we work',     action: 'process'    },
        { label: '📞 Contact',         action: 'contact'    },
      ],
    },
  },

  services: {
    userText: { es: '🤖 Servicios', en: '🤖 Services' },
    es: {
      text: 'Ofrecemos soluciones integrales de automatización industrial, con más de 8 años de experiencia en la frontera MX/USA:\n\n🤖 Robótica Industrial — Integradores certificados FANUC\n👁 Visión Artificial — Keyence, Cognex, SICK\n🔧 Control Industrial — PLCs, HMIs, SCADA\n⚡ Diseño Eléctrico — Safety, normativas NEC/NOM\n\n¿Sobre cuál quieres saber más?',
      quickReplies: [
        { label: '🤖 Robótica',     action: 'robotics'   },
        { label: '👁 Visión',       action: 'vision'     },
        { label: '🔧 Control',      action: 'control'    },
        { label: '⚡ Eléctrico',    action: 'electrical' },
        { label: '↩ Inicio',        action: 'greeting'   },
      ],
    },
    en: {
      text: 'We offer comprehensive industrial automation solutions, with 8+ years of experience serving the MX/USA border region:\n\n🤖 Industrial Robotics — Certified FANUC integrators\n👁 Machine Vision — Keyence, Cognex, SICK\n🔧 Industrial Control — PLCs, HMIs, SCADA\n⚡ Electrical Design — Safety, NEC/NOM standards\n\nWhich one would you like to know more about?',
      quickReplies: [
        { label: '🤖 Robotics',     action: 'robotics'   },
        { label: '👁 Vision',       action: 'vision'     },
        { label: '🔧 Control',      action: 'control'    },
        { label: '⚡ Electrical',   action: 'electrical' },
        { label: '↩ Home',          action: 'greeting'   },
      ],
    },
  },

  robotics: {
    userText: { es: '🤖 Robótica', en: '🤖 Robotics' },
    es: {
      text: 'Somos integradores certificados de robots industriales FANUC.\n\nModelos con los que trabajamos:\n• LR Mate 200iD — compacto, hasta 7 kg\n• M-10iA / M-20iA — propósito general, hasta 20 kg\n• M-710iC — manejo de materiales pesados\n• R-2000iC — paletizado y celdas grandes\n\nAplicaciones que implementamos:\n• Celdas pick & place de alta velocidad\n• Paletizado y empaque automatizado\n• Soldadura MIG/TIG y ensamble\n• Inspección con visión guiada (iRVision)\n\n¿Te gustaría hablar con un especialista?',
      quickReplies: [
        { label: '📞 Contactar',       action: 'contact'    },
        { label: '📁 Ver proyectos',   action: 'projects'   },
        { label: '🏭 Industrias',      action: 'industries' },
        { label: '↩ Servicios',        action: 'services'   },
      ],
    },
    en: {
      text: 'We are certified FANUC industrial robot integrators.\n\nModels we work with:\n• LR Mate 200iD — compact, up to 7 kg\n• M-10iA / M-20iA — general purpose, up to 20 kg\n• M-710iC — heavy material handling\n• R-2000iC — palletizing and large cells\n\nApplications we implement:\n• High-speed pick & place cells\n• Automated palletizing and packaging\n• MIG/TIG welding and assembly\n• Vision-guided inspection (iRVision)\n\nWould you like to speak with a specialist?',
      quickReplies: [
        { label: '📞 Contact',         action: 'contact'    },
        { label: '📁 View projects',   action: 'projects'   },
        { label: '🏭 Industries',      action: 'industries' },
        { label: '↩ Services',         action: 'services'   },
      ],
    },
  },

  vision: {
    userText: { es: '👁 Visión Artificial', en: '👁 Machine Vision' },
    es: {
      text: 'Implementamos sistemas de visión artificial 2D y 3D para líneas de producción de alta velocidad.\n\nMarcas con las que trabajamos:\n• Keyence CV-X / XG-X — hasta 1,200 piezas/min\n• Cognex In-Sight — guía robótica y lectura de códigos\n• SICK VISOR / Lector 65x — trazabilidad y escaneo\n\nAplicaciones principales:\n• Control de calidad e inspección de defectos\n• Trazabilidad (QR, DataMatrix, barcode)\n• Guía robótica vision-guided (eye-to-hand / eye-in-hand)\n• Cumplimiento FDA/GMP en industria médica\n\n¿Tienes una aplicación específica en mente?',
      quickReplies: [
        { label: '📞 Contactar',    action: 'contact'    },
        { label: '🏭 Industrias',   action: 'industries' },
        { label: '↩ Servicios',     action: 'services'   },
      ],
    },
    en: {
      text: 'We implement 2D and 3D machine vision systems for high-speed production lines.\n\nBrands we work with:\n• Keyence CV-X / XG-X — up to 1,200 parts/min\n• Cognex In-Sight — robot guidance and code reading\n• SICK VISOR / Lector 65x — traceability and scanning\n\nMain applications:\n• Quality control and defect inspection\n• Traceability (QR, DataMatrix, barcode)\n• Vision-guided robot guidance (eye-to-hand / eye-in-hand)\n• FDA/GMP compliance in medical industry\n\nDo you have a specific application in mind?',
      quickReplies: [
        { label: '📞 Contact',      action: 'contact'    },
        { label: '🏭 Industries',   action: 'industries' },
        { label: '↩ Services',      action: 'services'   },
      ],
    },
  },

  control: {
    userText: { es: '🔧 Control Industrial', en: '🔧 Industrial Control' },
    es: {
      text: 'Desarrollamos soluciones de control industrial con los líderes del mercado:\n\n• PLCs: Allen Bradley (FactoryTalk), Siemens (TIA Portal), Omron (Sysmac)\n• HMIs: PanelView, Comfort Panel, NB Series\n• SCADA: Ignition (Inductive Automation), iFIX, WinCC\n• Redes industriales: OPC UA, EtherNet/IP, PROFINET, Modbus TCP\n\nIntegramos equipos nuevos con sistemas legacy y conectamos toda la planta al nivel MES/ERP cuando se requiere.',
      quickReplies: [
        { label: '📞 Contactar',      action: 'contact'    },
        { label: '📁 Ver proyectos',  action: 'projects'   },
        { label: '↩ Servicios',       action: 'services'   },
      ],
    },
    en: {
      text: 'We develop industrial control solutions with market leaders:\n\n• PLCs: Allen Bradley (FactoryTalk), Siemens (TIA Portal), Omron (Sysmac)\n• HMIs: PanelView, Comfort Panel, NB Series\n• SCADA: Ignition (Inductive Automation), iFIX, WinCC\n• Industrial networks: OPC UA, EtherNet/IP, PROFINET, Modbus TCP\n\nWe integrate new equipment with legacy systems and connect the entire plant to MES/ERP level when required.',
      quickReplies: [
        { label: '📞 Contact',        action: 'contact'    },
        { label: '📁 View projects',  action: 'projects'   },
        { label: '↩ Services',        action: 'services'   },
      ],
    },
  },

  electrical: {
    userText: { es: '⚡ Diseño Eléctrico', en: '⚡ Electrical Design' },
    es: {
      text: 'Ofrecemos diseño eléctrico industrial completo para maquinaria y celdas de automatización:\n\n📐 Diseño de tableros de control y distribución\n📄 Diagramas eléctricos (AutoCAD Electrical, EPLAN)\n🔌 Ingeniería de cableado y especificación de componentes\n🛡 Safety: análisis de riesgos, PL/SIL según ISO 13849 / IEC 62061\n📋 Cumplimiento normativo: NOM, NEC, NFPA 79, UL 508A\n\nTrabajamos tanto para el mercado mexicano como para proyectos con requerimientos de EUA.',
      quickReplies: [
        { label: '📞 Contactar',        action: 'contact'   },
        { label: '↩ Servicios',         action: 'services'  },
        { label: '↩ Inicio',            action: 'greeting'  },
      ],
    },
    en: {
      text: 'We provide complete industrial electrical design for machinery and automation cells:\n\n📐 Control and distribution panel design\n📄 Electrical diagrams (AutoCAD Electrical, EPLAN)\n🔌 Wiring engineering and component specification\n🛡 Safety: risk analysis, PL/SIL per ISO 13849 / IEC 62061\n📋 Standards compliance: NOM, NEC, NFPA 79, UL 508A\n\nWe work for both the Mexican market and projects with US requirements.',
      quickReplies: [
        { label: '📞 Contact',          action: 'contact'   },
        { label: '↩ Services',          action: 'services'  },
        { label: '↩ Home',              action: 'greeting'  },
      ],
    },
  },

  industries: {
    userText: { es: '🏭 Industrias', en: '🏭 Industries' },
    es: {
      text: 'Tenemos experiencia en múltiples sectores industriales, atendiendo tanto a empresas en México como en Estados Unidos:\n\n🚗 Automotriz Tier 1 y Tier 2 — celdas robóticas, ensamble y paletizado\n🏥 Médica y Farmacéutica — trazabilidad FDA/GMP, salas limpias\n💻 Manufactura Electrónica — inspección de PCBs, SMT, pruebas AOI\n🍎 Industria Alimenticia — visión para calidad, control higiénico\n🏭 Maquiladora en general — modernización de líneas y reducción de costos\n\n¿Estás en alguno de estos sectores?',
      quickReplies: [
        { label: '📁 Ver proyectos',    action: 'projects'  },
        { label: '📞 Contactar',        action: 'contact'   },
        { label: '↩ Servicios',         action: 'services'  },
      ],
    },
    en: {
      text: 'We have experience across multiple industrial sectors, serving companies in both Mexico and the United States:\n\n🚗 Automotive Tier 1 & Tier 2 — robotic cells, assembly and palletizing\n🏥 Medical & Pharmaceutical — FDA/GMP traceability, clean rooms\n💻 Electronics Manufacturing — PCB inspection, SMT, AOI testing\n🍎 Food Industry — vision for quality control, hygienic design\n🏭 General Maquiladora — line modernization and cost reduction\n\nAre you in one of these sectors?',
      quickReplies: [
        { label: '📁 View projects',    action: 'projects'  },
        { label: '📞 Contact',          action: 'contact'   },
        { label: '↩ Services',          action: 'services'  },
      ],
    },
  },

  process: {
    userText: { es: '🔄 Cómo trabajamos', en: '🔄 How we work' },
    es: {
      text: 'Nuestro proceso de trabajo en 4 etapas:\n\n1️⃣ Diagnóstico inicial — Visita o videollamada sin costo para entender tu proceso y necesidades\n2️⃣ Propuesta técnica — Presentamos solución con especificaciones, planos preliminares y cotización en 24–48 h\n3️⃣ Implementación — Diseño, fabricación, programación, instalación y pruebas en planta\n4️⃣ Soporte post-arranque — Capacitación al equipo, garantía y soporte técnico continuo\n\n¿Quieres agendar un diagnóstico sin compromiso?',
      quickReplies: [
        { label: '📞 Agendar llamada',  action: 'contact'   },
        { label: '⚡ Ver DesignPro',    action: 'designpro' },
        { label: '↩ Inicio',            action: 'greeting'  },
      ],
    },
    en: {
      text: 'Our work process in 4 stages:\n\n1️⃣ Initial assessment — Free site visit or video call to understand your process and needs\n2️⃣ Technical proposal — We present the solution with specs, preliminary drawings and quote in 24–48 h\n3️⃣ Implementation — Design, manufacturing, programming, installation and plant testing\n4️⃣ Post-startup support — Team training, warranty and ongoing technical support\n\nWould you like to schedule a no-commitment assessment?',
      quickReplies: [
        { label: '📞 Schedule a call',  action: 'contact'   },
        { label: '⚡ See DesignPro',    action: 'designpro' },
        { label: '↩ Home',              action: 'greeting'  },
      ],
    },
  },

  projects: {
    userText: { es: '📁 Proyectos', en: '📁 Projects' },
    es: {
      text: 'Con más de 8 años de experiencia y 10+ proyectos exitosos, hemos trabajado en sectores clave:\n\n🚗 Automotriz Tier 1 — Celdas robóticas pick & place, reducción de ciclo en 40%\n🏥 Industria Médica — Trazabilidad FDA con visión artificial y lectores SICK\n💻 Manufactura Electrónica — Modernización de líneas SMT con inspección AOI\n🍎 Industria Alimenticia — Control de calidad automatizado al 100%\n\nProyectos realizados en México y Estados Unidos.',
      quickReplies: [
        { label: '🔗 Ver casos de éxito',  action: 'projects_link' },
        { label: '🏭 Ver industrias',       action: 'industries'    },
        { label: '📞 Hablar con experto',   action: 'contact'       },
        { label: '↩ Inicio',                action: 'greeting'      },
      ],
    },
    en: {
      text: 'With 8+ years of experience and 10+ successful projects, we have worked across key sectors:\n\n🚗 Automotive Tier 1 — Pick & place robotic cells, 40% cycle time reduction\n🏥 Medical Industry — FDA traceability with machine vision and SICK readers\n💻 Electronics Manufacturing — SMT line modernization with AOI inspection\n🍎 Food Industry — 100% automated quality control\n\nProjects completed in Mexico and the United States.',
      quickReplies: [
        { label: '🔗 View case studies',    action: 'projects_link' },
        { label: '🏭 View industries',      action: 'industries'    },
        { label: '📞 Talk to an expert',    action: 'contact'       },
        { label: '↩ Home',                  action: 'greeting'      },
      ],
    },
  },

  projects_link: {
    userText: { es: '🔗 Ver casos de éxito', en: '🔗 View case studies' },
    es: {
      text: 'Aquí puedes ver todos nuestros proyectos destacados 👇',
      link: { label: 'Ver Proyectos', href: '/projects' },
      quickReplies: [{ label: '↩ Inicio', action: 'greeting' }],
    },
    en: {
      text: 'Here you can view all our featured projects 👇',
      link: { label: 'View Projects', href: '/projects' },
      quickReplies: [{ label: '↩ Home', action: 'greeting' }],
    },
  },

  designpro: {
    userText: { es: '⚡ DesignPro', en: '⚡ DesignPro' },
    es: {
      text: 'DesignPro by NDS es nuestra plataforma de ingeniería interna que reduce el tiempo de generación de proyectos de días a minutos:\n\n📐 Ingeniería base para automatización industrial\n📋 Cotizaciones estandarizadas y reproducibles\n✅ Validaciones de diseño antes de comprometer recursos\n\nResultados comprobados:\n— 60% menos tiempo en ingeniería\n— 35% menos retrabajo técnico\n— Respuesta al cliente en menos de 24 h',
      quickReplies: [
        { label: '🔗 Ir al Portal',    action: 'designpro_link' },
        { label: '📞 Solicitar demo',  action: 'contact'        },
        { label: '↩ Inicio',           action: 'greeting'       },
      ],
    },
    en: {
      text: 'DesignPro by NDS is our internal engineering platform that reduces project generation from days to minutes:\n\n📐 Base engineering for industrial automation\n📋 Standardized and reproducible quotes\n✅ Design validations before committing resources\n\nProven results:\n— 60% less engineering time\n— 35% less technical rework\n— Customer response in under 24 h',
      quickReplies: [
        { label: '🔗 Go to Portal',    action: 'designpro_link' },
        { label: '📞 Request demo',    action: 'contact'        },
        { label: '↩ Home',             action: 'greeting'       },
      ],
    },
  },

  designpro_link: {
    userText: { es: '🔗 Ir al Portal', en: '🔗 Go to Portal' },
    es: {
      text: 'DesignPro está disponible en el portal para clientes y socios registrados. ¡Solicita tu acceso hoy!',
      link: { label: 'Acceder al Portal', href: '/portal' },
      quickReplies: [{ label: '↩ Inicio', action: 'greeting' }],
    },
    en: {
      text: 'DesignPro is available in the portal for registered clients and partners. Request your access today!',
      link: { label: 'Access Portal', href: '/portal' },
      quickReplies: [{ label: '↩ Home', action: 'greeting' }],
    },
  },

  contact: {
    userText: { es: '📞 Contacto', en: '📞 Contact' },
    es: {
      text: '¡Con gusto te atendemos! Estamos disponibles en español e inglés:\n\n📞 +52 664 685 3430\n📧 ventas@norwestds.com\n\n📍 Oficina principal: Tijuana, BC, México\n📍 Presencia en: San Diego, CA, Estados Unidos\n\n⏱ Respondemos en menos de 24 horas.\n\nPuedes también visitar nuestra página de contacto para enviarnos un mensaje directo.',
      link: { label: 'Ir a Contacto', href: '/contact' },
      quickReplies: [
        { label: '🔄 Cómo trabajamos', action: 'process'  },
        { label: '↩ Inicio',           action: 'greeting' },
      ],
    },
    en: {
      text: "We're happy to assist! We operate fully in both English and Spanish:\n\n📞 +52 664 685 3430\n📧 ventas@norwestds.com\n\n📍 Main office: Tijuana, BC, Mexico\n📍 Presence in: San Diego, CA, United States\n\n⏱ We respond within 24 hours.\n\nYou can also visit our contact page to send us a direct message.",
      link: { label: 'Go to Contact', href: '/contact' },
      quickReplies: [
        { label: '🔄 How we work',  action: 'process'  },
        { label: '↩ Home',          action: 'greeting' },
      ],
    },
  },

  fallback: {
    es: {
      text: 'Hmm, no estoy seguro de entender tu pregunta. 😅\n\n¿Te puedo ayudar con alguno de estos temas?',
      quickReplies: [
        { label: '🤖 Servicios',      action: 'services'   },
        { label: '🏭 Industrias',     action: 'industries' },
        { label: '🏢 Quiénes somos',  action: 'about'      },
        { label: '📞 Contacto',       action: 'contact'    },
      ],
    },
    en: {
      text: "Hmm, I'm not sure I understood your question. 😅\n\nCan I help you with one of these topics?",
      quickReplies: [
        { label: '🤖 Services',     action: 'services'   },
        { label: '🏭 Industries',   action: 'industries' },
        { label: '🏢 About NDS',    action: 'about'      },
        { label: '📞 Contact',      action: 'contact'    },
      ],
    },
  },
};

// ── Keyword → flow mapping ────────────────────────────────────────────────────
const KEYWORDS = {
  robotics:   ['robot', 'fanuc', 'robotica', 'brazo', 'pick', 'place', 'paletiz', 'solda', 'lr mate', 'manipulador'],
  vision:     ['vision', 'camara', 'cognex', 'keyence', 'sick', 'inspeccion', 'calidad', 'defecto', '2d', '3d', 'trazabilidad', 'qr', 'barcode', 'datamatrix', 'codigo', 'aoi', 'lector'],
  control:    ['plc', 'scada', 'hmi', 'siemens', 'allen', 'bradley', 'omron', 'ignition', 'opc', 'profinet', 'ethernet', 'factorytalk', 'tia portal', 'mes', 'erp'],
  electrical: ['electrico', 'electrica', 'electricidad', 'tablero', 'diagrama', 'cableado', 'safety', 'seguridad', 'normativa', 'nfpa', 'nec', 'nom', '13849', '62061', 'iec', 'ul508', 'eplan', 'autocad electrical', 'panel'],
  about:      ['quien', 'quienes', 'somos', 'empresa', 'nosotros', 'experiencia', 'historia', 'anos', 'tijuana', 'san diego', 'frontera', 'ubicacion', 'donde', 'oficina', 'equipo', 'certificado', 'certificacion', 'nds'],
  industries: ['industria', 'sector', 'automotriz', 'automotive', 'medico', 'medica', 'farmaceutico', 'farmaceutica', 'alimentos', 'food', 'electronico', 'electronica', 'manufactura', 'maquiladora', 'tier', 'smt', 'pcb'],
  process:    ['proceso', 'como trabajan', 'etapas', 'pasos', 'plazo', 'tiempo', 'cuanto', 'implementacion', 'arranque', 'startup', 'metodologia', 'propuesta', 'cotizacion', 'diagnostico'],
  projects:   ['proyecto', 'project', 'caso', 'exito', 'ejemplo', 'cliente'],
  designpro:  ['designpro', 'herramienta', 'tool', 'ingenieria', 'presupuesto', 'quote', 'plataforma', 'portal'],
  contact:    ['contacto', 'contact', 'telefono', 'email', 'correo', 'llamar', 'hablar', 'reunion', 'demo', 'whatsapp', 'cita', 'visita', 'agendar', 'ventas'],
  services:   ['servicio', 'service', 'automatizacion', 'automatizar', 'automacion', 'ofrecen', 'hacen', 'pueden'],
};

// ── Public API ────────────────────────────────────────────────────────────────

export function getGreeting(lang) {
  return FLOWS.greeting[lang] ?? FLOWS.greeting.es;
}

export function getResponse(action, lang) {
  const flow = FLOWS[action];
  if (!flow) return FLOWS.fallback[lang] ?? FLOWS.fallback.es;
  return flow[lang] ?? flow.es ?? FLOWS.fallback.es;
}

export function getUserLabel(action, lang) {
  return FLOWS[action]?.userText?.[lang] ?? FLOWS[action]?.userText?.es ?? '';
}

export function matchKeywords(text, lang) {
  const lower = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const [key, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw.normalize('NFD').replace(/[̀-ͯ]/g, '')))) {
      return getResponse(key, lang);
    }
  }
  return getResponse('fallback', lang);
}
