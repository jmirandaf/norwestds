// ─── Chatbot Responses ────────────────────────────────────────────────────────
// All scripted flows for the NDS chatbot.
// To add a new flow: add an entry to FLOWS and register keywords in KEYWORDS.
// ─────────────────────────────────────────────────────────────────────────────

const FLOWS = {
  greeting: {
    es: {
      text: '¡Hola! 👋 Soy el asistente de Norwest Dynamic Systems.\n¿En qué puedo ayudarte hoy?',
      quickReplies: [
        { label: '🤖 Servicios',   action: 'services'   },
        { label: '📁 Proyectos',   action: 'projects'   },
        { label: '⚡ DesignPro',   action: 'designpro'  },
        { label: '📞 Contacto',    action: 'contact'    },
      ],
    },
    en: {
      text: "Hi! 👋 I'm the Norwest Dynamic Systems assistant.\nHow can I help you today?",
      quickReplies: [
        { label: '🤖 Services',    action: 'services'   },
        { label: '📁 Projects',    action: 'projects'   },
        { label: '⚡ DesignPro',   action: 'designpro'  },
        { label: '📞 Contact',     action: 'contact'    },
      ],
    },
  },

  services: {
    userText: { es: '🤖 Servicios', en: '🤖 Services' },
    es: {
      text: 'Ofrecemos soluciones de automatización industrial:\n\n🤖 Robótica Industrial — Integración FANUC\n👁 Visión Artificial — Keyence, Cognex, SICK\n🔧 Control Industrial — PLCs, HMIs, SCADA\n⚡ Diseño Eléctrico — Safety & normativas\n\n¿Sobre cuál quieres saber más?',
      quickReplies: [
        { label: '🤖 Robótica',    action: 'robotics'   },
        { label: '👁 Visión',      action: 'vision'     },
        { label: '🔧 Control',     action: 'control'    },
        { label: '↩ Inicio',       action: 'greeting'   },
      ],
    },
    en: {
      text: 'We offer industrial automation solutions:\n\n🤖 Industrial Robotics — FANUC integration\n👁 Machine Vision — Keyence, Cognex, SICK\n🔧 Industrial Control — PLCs, HMIs, SCADA\n⚡ Electrical Design — Safety & standards\n\nWhich one would you like to know more about?',
      quickReplies: [
        { label: '🤖 Robotics',    action: 'robotics'   },
        { label: '👁 Vision',      action: 'vision'     },
        { label: '🔧 Control',     action: 'control'    },
        { label: '↩ Home',         action: 'greeting'   },
      ],
    },
  },

  robotics: {
    userText: { es: '🤖 Robótica', en: '🤖 Robotics' },
    es: {
      text: 'Somos integradores certificados de robots FANUC.\nDiseñamos e implementamos:\n\n• Celdas pick & place\n• Paletizado y empaque\n• Soldadura y ensamble\n• Inspección con visión guiada\n\n¿Te gustaría hablar con un especialista?',
      quickReplies: [
        { label: '📞 Contactar',      action: 'contact'       },
        { label: '📁 Ver proyectos',  action: 'projects'      },
        { label: '↩ Servicios',       action: 'services'      },
      ],
    },
    en: {
      text: 'We are certified FANUC robot integrators.\nWe design and implement:\n\n• Pick & place cells\n• Palletizing and packaging\n• Welding and assembly\n• Vision-guided inspection\n\nWould you like to speak with a specialist?',
      quickReplies: [
        { label: '📞 Contact',        action: 'contact'       },
        { label: '📁 View projects',  action: 'projects'      },
        { label: '↩ Services',        action: 'services'      },
      ],
    },
  },

  vision: {
    userText: { es: '👁 Visión Artificial', en: '👁 Machine Vision' },
    es: {
      text: 'Implementamos visión artificial 2D y 3D con:\n\n• Keyence — inspección de alta velocidad\n• Cognex — visión guiada para robots\n• SICK — sensores y escáneres industriales\n\nAplicaciones: control de calidad, trazabilidad y guía robótica.',
      quickReplies: [
        { label: '📞 Contactar',  action: 'contact'   },
        { label: '↩ Servicios',   action: 'services'  },
      ],
    },
    en: {
      text: 'We implement 2D and 3D machine vision with:\n\n• Keyence — high-speed inspection\n• Cognex — robot-guided vision\n• SICK — industrial sensors and scanners\n\nApplications: quality control, traceability and robot guidance.',
      quickReplies: [
        { label: '📞 Contact',   action: 'contact'   },
        { label: '↩ Services',   action: 'services'  },
      ],
    },
  },

  control: {
    userText: { es: '🔧 Control Industrial', en: '🔧 Industrial Control' },
    es: {
      text: 'Trabajamos con los principales fabricantes:\n\n• PLCs: Allen Bradley, Siemens, Omron\n• HMI: FactoryTalk, TIA Portal, NB Series\n• SCADA: Ignition, iFIX, WinCC\n• Redes: OPC UA, EtherNet/IP, PROFINET',
      quickReplies: [
        { label: '📞 Contactar',  action: 'contact'   },
        { label: '↩ Servicios',   action: 'services'  },
      ],
    },
    en: {
      text: 'We work with leading manufacturers:\n\n• PLCs: Allen Bradley, Siemens, Omron\n• HMI: FactoryTalk, TIA Portal, NB Series\n• SCADA: Ignition, iFIX, WinCC\n• Networks: OPC UA, EtherNet/IP, PROFINET',
      quickReplies: [
        { label: '📞 Contact',   action: 'contact'   },
        { label: '↩ Services',   action: 'services'  },
      ],
    },
  },

  projects: {
    userText: { es: '📁 Proyectos', en: '📁 Projects' },
    es: {
      text: 'Hemos completado proyectos en diversos sectores:\n\n🏭 Automotriz Tier 1 — Celdas robóticas pick & place\n🏥 Industria Médica — Trazabilidad FDA\n💻 Manufactura Electrónica — Modernización de líneas\n🍎 Industria Alimenticia — Control de calidad\n\n¿Quieres ver los detalles?',
      quickReplies: [
        { label: '🔗 Ver casos de éxito',  action: 'projects_link'  },
        { label: '📞 Hablar con experto',  action: 'contact'        },
        { label: '↩ Inicio',               action: 'greeting'       },
      ],
    },
    en: {
      text: 'We have completed projects across industries:\n\n🏭 Automotive Tier 1 — Pick & place robotic cells\n🏥 Medical Industry — FDA traceability\n💻 Electronics Manufacturing — Line modernization\n🍎 Food Industry — Automated quality control\n\nWant to see the details?',
      quickReplies: [
        { label: '🔗 View case studies',  action: 'projects_link'  },
        { label: '📞 Talk to an expert',  action: 'contact'        },
        { label: '↩ Home',                action: 'greeting'       },
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
      text: 'DesignPro by NDS es nuestra plataforma de ingeniería que reduce de días a minutos la generación de:\n\n📐 Ingeniería base para automatización\n📋 Cotizaciones estandarizadas\n✅ Validaciones de diseño\n\n— 60% menos tiempo · 35% menos retrabajo · 24h respuesta',
      quickReplies: [
        { label: '🔗 Ir al Portal',    action: 'designpro_link'  },
        { label: '📞 Solicitar demo',  action: 'contact'         },
        { label: '↩ Inicio',           action: 'greeting'        },
      ],
    },
    en: {
      text: 'DesignPro by NDS is our engineering platform that reduces base engineering from days to minutes:\n\n📐 Base engineering for automation\n📋 Standardized quotes\n✅ Design validations\n\n— 60% less time · 35% less rework · 24h response',
      quickReplies: [
        { label: '🔗 Go to Portal',    action: 'designpro_link'  },
        { label: '📞 Request demo',    action: 'contact'         },
        { label: '↩ Home',             action: 'greeting'        },
      ],
    },
  },

  designpro_link: {
    userText: { es: '🔗 Ir al Portal', en: '🔗 Go to Portal' },
    es: {
      text: 'DesignPro está disponible en el portal para clientes registrados. ¡Solicita acceso!',
      link: { label: 'Acceder al Portal', href: '/portal' },
      quickReplies: [{ label: '↩ Inicio', action: 'greeting' }],
    },
    en: {
      text: 'DesignPro is available in the portal for registered clients. Request access!',
      link: { label: 'Access Portal', href: '/portal' },
      quickReplies: [{ label: '↩ Home', action: 'greeting' }],
    },
  },

  contact: {
    userText: { es: '📞 Contacto', en: '📞 Contact' },
    es: {
      text: '¡Con gusto! Estamos disponibles en:\n\n📞 +52 664 685 3430\n📧 ventas@norwestds.com\n📍 Tijuana, MX · San Diego, USA\n\n⏱ Respondemos en menos de 24 horas.',
      link: { label: 'Ir a Contacto', href: '/contact' },
      quickReplies: [{ label: '↩ Inicio', action: 'greeting' }],
    },
    en: {
      text: "Of course! You can reach us at:\n\n📞 +52 664 685 3430\n📧 ventas@norwestds.com\n📍 Tijuana, MX · San Diego, USA\n\n⏱ We respond within 24 hours.",
      link: { label: 'Go to Contact', href: '/contact' },
      quickReplies: [{ label: '↩ Home', action: 'greeting' }],
    },
  },

  fallback: {
    es: {
      text: 'No estoy seguro de entender tu pregunta 😅\n¿Te puedo ayudar con alguno de estos temas?',
      quickReplies: [
        { label: '🤖 Servicios',  action: 'services'  },
        { label: '📁 Proyectos',  action: 'projects'  },
        { label: '⚡ DesignPro',  action: 'designpro' },
        { label: '📞 Contacto',   action: 'contact'   },
      ],
    },
    en: {
      text: "I'm not sure I understood your question 😅\nCan I help you with one of these topics?",
      quickReplies: [
        { label: '🤖 Services',  action: 'services'  },
        { label: '📁 Projects',  action: 'projects'  },
        { label: '⚡ DesignPro', action: 'designpro' },
        { label: '📞 Contact',   action: 'contact'   },
      ],
    },
  },
};

// ── Keyword → flow mapping ────────────────────────────────────────────────────
const KEYWORDS = {
  robotics:   ['robot', 'fanuc', 'robótica', 'robotica', 'brazo', 'pick', 'place', 'paletiz', 'solda'],
  vision:     ['visión', 'vision', 'camara', 'cámara', 'cognex', 'keyence', 'sick', 'inspección', 'inspeccion', 'calidad', 'defecto', '2d', '3d'],
  control:    ['plc', 'scada', 'hmi', 'control', 'siemens', 'allen', 'bradley', 'omron', 'ignition', 'opc', 'profinet', 'ethernet'],
  projects:   ['proyecto', 'project', 'caso', 'éxito', 'exito', 'ejemplo', 'cliente', 'automotriz', 'médic', 'medic'],
  designpro:  ['design', 'designpro', 'herramienta', 'tool', 'cotización', 'cotizacion', 'cotizar', 'ingeniería', 'ingenieria', 'precio', 'costo', 'presupuesto', 'quote'],
  contact:    ['contacto', 'contact', 'teléfono', 'telefono', 'email', 'correo', 'llamar', 'hablar', 'reunión', 'reunion', 'demo'],
  services:   ['servicio', 'service', 'ofrecen', 'hacen', 'pueden', 'hacemos', 'ofrecemos'],
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
