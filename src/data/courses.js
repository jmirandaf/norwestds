// NDS Training Center — static course catalog
// To add courses: extend COURSES array; to add lessons: extend module.lessons

export const COURSES = [
  {
    id: 'robotics-fanuc',
    title: 'Robótica Industrial con FANUC',
    subtitle: 'Integración y programación de robots FANUC',
    category: 'Robótica',
    level: 'Intermedio',
    duration: '8h 30min',
    totalLessons: 12,
    color: '#007DA6',
    description:
      'Domina la programación y operación de robots industriales FANUC. Aprende desde los fundamentos cinemáticos hasta celdas pick & place completas con visión integrada.',
    objectives: [
      'Comprender la cinemática y configuraciones del robot FANUC',
      'Programar movimientos con FANUC TP y Karel',
      'Diseñar e implementar celdas pick & place',
      'Integrar visión artificial iRVision',
      'Aplicar las normas de seguridad ISO 10218',
    ],
    modules: [
      {
        id: 'mod1',
        title: 'Fundamentos de Robótica Industrial',
        lessons: [
          {
            id: 'l1',
            title: 'Historia y evolución del robot industrial',
            duration: '20 min',
            type: 'video',
            content:
              'Los robots industriales nacen en los años 60 con Unimate en General Motors. FANUC fue fundada en 1956 como división de Fujitsu, lanzando su primer robot CNC en 1977.\n\nHoy FANUC es el mayor fabricante de robots industriales, CNCs y servomotores del mundo, con más de 750.000 robots instalados.',
          },
          {
            id: 'l2',
            title: 'Anatomía del robot FANUC: ejes y configuraciones',
            duration: '28 min',
            type: 'video',
            content:
              'Un robot FANUC de 6 ejes tiene:\n\n• J1 – Rotación de base\n• J2 – Hombro\n• J3 – Codo\n• J4 – Muñeca rotación\n• J5 – Muñeca inclinación\n• J6 – Muñeca giro\n\nConfiguración estándar UPR (Up-Right) o DWN (Down). El Área de Trabajo (workspace) está determinado por los rangos de cada eje.',
          },
          {
            id: 'l3',
            title: 'Seguridad en la celda robótica (ISO 10218)',
            duration: '22 min',
            type: 'reading',
            content:
              'La norma ISO 10218-1/2 establece los requisitos de seguridad para robots y sistemas robóticos.\n\nConceptos clave:\n• Zona restringida vs. zona colaborativa\n• Dispositivos de parada de emergencia\n• Interbloqueos de puerta\n• Vallado de seguridad y escáneres láser\n• Evaluación de riesgos según ISO 12100',
          },
          {
            id: 'l4-quiz',
            title: 'Quiz: Fundamentos de robótica',
            duration: '10 min',
            type: 'quiz',
            questions: [
              {
                id: 'q1',
                text: '¿Cuántos ejes tiene un robot FANUC estándar de brazo articulado?',
                options: ['4', '5', '6', '7'],
                correct: 2,
              },
              {
                id: 'q2',
                text: '¿Qué norma rige la seguridad en sistemas robóticos industriales?',
                options: ['ISO 13849', 'ISO 10218', 'ISO 9001', 'IEC 62061'],
                correct: 1,
              },
              {
                id: 'q3',
                text: '¿Cuál eje corresponde a la rotación de la base del robot?',
                options: ['J3', 'J6', 'J1', 'J4'],
                correct: 2,
              },
            ],
          },
        ],
      },
      {
        id: 'mod2',
        title: 'Programación FANUC TP',
        lessons: [
          {
            id: 'l5',
            title: 'Teach Pendant: navegación y registros',
            duration: '35 min',
            type: 'video',
            content:
              'El Teach Pendant (TP) es la interfaz de programación del robot. Funciones clave:\n\n• Pantalla: 6.4" color touch\n• DEADMAN switch: botón de hombre muerto (3 posiciones)\n• Teclas de jogging: Individual / World / Tool / User\n• Registros de posición (PR[]) y de datos (R[])\n• Macros para secuencias repetitivas',
          },
          {
            id: 'l6',
            title: 'Instrucciones de movimiento: J, L, C',
            duration: '30 min',
            type: 'video',
            content:
              'Tipos de movimiento en FANUC TP:\n\n• J (Joint): interpolación articular — más rápido\n• L (Linear): interpolación lineal — trayectoria recta\n• C (Circular): interpolación circular\n\nParámetros: velocidad (mm/s o %), CNT (continuity), ACC, termination type.',
          },
          {
            id: 'l7',
            title: 'Programación de Pick & Place',
            duration: '40 min',
            type: 'video',
            content:
              'Estructura básica de un programa pick & place:\n\n1: J P[1] 30% FINE   ; Posición home\n2: L P[2] 500mm/s CNT50 ; Approach\n3: L P[3] 100mm/s FINE  ; Pick\n4: RO[1:VACÍO]=ON\n5: WAIT 0.3sec\n6: L P[2] 500mm/s CNT50 ; Retract\n7: J P[4] 50% CNT50  ; Transit\n8: L P[5] 100mm/s FINE  ; Place\n9: RO[1:VACÍO]=OFF',
          },
          {
            id: 'l8-quiz',
            title: 'Quiz: Programación TP',
            duration: '10 min',
            type: 'quiz',
            questions: [
              {
                id: 'q4',
                text: '¿Qué tipo de movimiento garantiza una trayectoria recta entre dos puntos?',
                options: ['Movimiento J (Joint)', 'Movimiento L (Linear)', 'Movimiento C (Circular)', 'Movimiento A (Arc)'],
                correct: 1,
              },
              {
                id: 'q5',
                text: '¿Qué significa CNT100 en una instrucción de movimiento FANUC?',
                options: [
                  'El robot se detiene completamente antes de continuar',
                  'El robot se mueve al 100% de velocidad',
                  'El robot no se detiene y continúa suavemente al siguiente movimiento',
                  'El movimiento dura 100 milisegundos',
                ],
                correct: 2,
              },
            ],
          },
        ],
      },
      {
        id: 'mod3',
        title: 'Integración y Puesta en Marcha',
        lessons: [
          {
            id: 'l9',
            title: 'Comunicación I/O: Digital, Analógica y Fieldbus',
            duration: '25 min',
            type: 'reading',
            content:
              'FANUC soporta múltiples protocolos:\n\n• Digital I/O nativa (DI/DO, RI/RO, UI/UO)\n• DeviceNet, EtherNet/IP, PROFIBUS, PROFINET\n• EtherNet/IP para integración con PLCs Allen-Bradley\n• PROFINET para PLCs Siemens\n\nConfiguración en el controlador R-30iB mediante i pendant: MENU → I/O → Digital.',
          },
          {
            id: 'l10',
            title: 'Calibración y verificación de TCP',
            duration: '20 min',
            type: 'video',
            content:
              'El TCP (Tool Center Point) define el punto de referencia de la herramienta.\n\nMétodos de calibración:\n• 3-Point: mínimo, baja precisión\n• 6-Point: recomendado para herramientas de proceso\n• Direct entry: cuando se conocen las dimensiones CAD\n\nVerificación: rotar el robot en J4/J5/J6 y confirmar que el TCP no se mueve.',
          },
          {
            id: 'l11',
            title: 'Mantenimiento preventivo del robot',
            duration: '18 min',
            type: 'reading',
            content:
              'Plan de mantenimiento FANUC:\n\n• 3 meses: inspección visual, limpieza exterior\n• 1 año: revisión de conectores y cables\n• 3 años: cambio de grasa en ejes J1-J6 (grease type según manual)\n• 5 años: revisión de baterías de encoders\n\nHerramientas: kit de lubricación FANUC, pistola de grasa, torquímetro.',
          },
          {
            id: 'l12-quiz',
            title: 'Evaluación final del curso',
            duration: '20 min',
            type: 'quiz',
            questions: [
              {
                id: 'q6',
                text: '¿Qué protocolo Fieldbus se usa típicamente con PLCs Allen-Bradley?',
                options: ['PROFINET', 'EtherNet/IP', 'DeviceNet', 'Modbus TCP'],
                correct: 1,
              },
              {
                id: 'q7',
                text: '¿Cada cuántos años se recomienda cambiar la grasa de los ejes del robot FANUC?',
                options: ['1 año', '2 años', '3 años', '5 años'],
                correct: 2,
              },
              {
                id: 'q8',
                text: '¿Qué es el TCP (Tool Center Point)?',
                options: [
                  'El control principal del robot',
                  'El punto de referencia de la herramienta del robot',
                  'El protocolo de comunicación TCP/IP',
                  'El tiempo de ciclo del programa',
                ],
                correct: 1,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'machine-vision',
    title: 'Visión Artificial Industrial',
    subtitle: 'Sistemas 2D y 3D con Keyence, Cognex y SICK',
    category: 'Visión',
    level: 'Básico–Intermedio',
    duration: '6h 45min',
    totalLessons: 10,
    color: '#059669',
    description:
      'Aprende a implementar sistemas de visión artificial para inspección, guía robótica y trazabilidad. Desde la óptica hasta la configuración de cámaras industriales líderes del mercado.',
    objectives: [
      'Seleccionar la cámara y lente correctas para cada aplicación',
      'Configurar sistemas Keyence para inspección de alta velocidad',
      'Implementar guía robótica con Cognex In-Sight',
      'Integrar escáneres SICK para trazabilidad',
      'Diseñar iluminación efectiva para visión industrial',
    ],
    modules: [
      {
        id: 'mod1',
        title: 'Fundamentos Ópticos',
        lessons: [
          {
            id: 'l1',
            title: 'Principios de la visión artificial: sensor, lente e iluminación',
            duration: '30 min',
            type: 'video',
            content:
              'La tríada de la visión industrial:\n\n1. SENSOR: CCD vs CMOS, resolución (píxeles), tamaño del chip, velocidad (fps)\n2. LENTE: distancia focal, apertura (f/#), campo de visión, profundidad de campo\n3. ILUMINACIÓN: backlight, coaxial, ring, dome — cada tipo resuelve problemas distintos\n\nRegla de oro: invertir más en iluminación siempre vale la pena.',
          },
          {
            id: 'l2',
            title: 'Selección de óptica y cámara para tu aplicación',
            duration: '25 min',
            type: 'reading',
            content:
              'Criterios de selección:\n\n• Resolución requerida = tamaño del defecto / precisión deseada\n• Velocidad de línea → fps mínimos necesarios\n• Entorno (IP rating, temperatura, vibración)\n• Presupuesto y soporte técnico\n\nFormula para lente: f = d × WD / (FOV + d)\ndonde d = tamaño del chip, WD = working distance, FOV = field of view',
          },
          {
            id: 'l3-quiz',
            title: 'Quiz: Óptica y selección',
            duration: '8 min',
            type: 'quiz',
            questions: [
              {
                id: 'q1',
                text: '¿Cuál técnica de iluminación es mejor para detectar rayaduras superficiales en metales?',
                options: ['Backlight', 'Coaxial (dark field)', 'Ring frontal', 'Dome difuso'],
                correct: 1,
              },
              {
                id: 'q2',
                text: '¿Qué significa la apertura f/2.8 en una lente industrial?',
                options: [
                  'La lente tiene 2.8 milímetros de diámetro',
                  'La relación entre la focal y el diámetro de la apertura es 2.8 (más abierta = más luz)',
                  'La lente pesa 2.8 kilogramos',
                  'La distancia de trabajo mínima es 2.8 metros',
                ],
                correct: 1,
              },
            ],
          },
        ],
      },
      {
        id: 'mod2',
        title: 'Sistemas Keyence',
        lessons: [
          {
            id: 'l4',
            title: 'Keyence CV-X / XG-X: configuración y herramientas',
            duration: '40 min',
            type: 'video',
            content:
              'El sistema CV-X de Keyence es un sistema de visión all-in-one con pantalla táctil integrada.\n\nHerramientas principales:\n• Pattern Search (búsqueda de patrón)\n• Edge Inspection (detección de bordes)\n• Color Inspection (análisis de color)\n• OCR (lectura de caracteres)\n• Código de barras y QR\n\nComunicación: Ethernet, RS-232, I/O digital, EtherNet/IP.',
          },
          {
            id: 'l5',
            title: 'Caso práctico: inspección de PCB con Keyence',
            duration: '35 min',
            type: 'video',
            content:
              'Configuración de inspección de PCB:\n\n1. Montar cámara coaxial 5MP sobre la línea\n2. Iluminación coaxial de alta frecuencia para evitar sombras\n3. Crear tool "Pattern Search" con la plantilla del PCB\n4. Agregar tools de inspección de componentes\n5. Configurar trigger externo desde PLC\n6. Salida: OK/NG por I/O digital a robot de rechazo',
          },
        ],
      },
      {
        id: 'mod3',
        title: 'Cognex In-Sight y Guía Robótica',
        lessons: [
          {
            id: 'l6',
            title: 'Cognex In-Sight: EasyBuilder y Spreadsheet mode',
            duration: '35 min',
            type: 'video',
            content:
              'Cognex In-Sight es el sistema de visión inteligente más vendido del mundo.\n\nModos de programación:\n• EasyBuilder: interfaz guiada, para usuarios sin experiencia\n• Spreadsheet: potente, basado en fórmulas tipo Excel\n\nHerramientas clave:\n• PatMax: localización de patrones geométricos\n• IDMax: lectura de códigos 1D/2D\n• OCRMax: reconocimiento de texto',
          },
          {
            id: 'l7',
            title: 'Guía robótica con Cognex VisionPro + FANUC iRVision',
            duration: '45 min',
            type: 'video',
            content:
              'Integración visión-robot en 4 pasos:\n\n1. CALIBRACIÓN: método Hand-Eye (eye-in-hand) o Eye-to-Hand\n2. LOCALIZACIÓN: herramienta PatMax encuentra la pieza\n3. TRANSFORMACIÓN: converir píxeles a coordenadas de robot (matriz de transformación)\n4. CORRECCIÓN: el robot recibe offset X,Y,Rz y ajusta la trayectoria\n\nComunicación: Cognex → FANUC por EtherNet/IP o string ASCII por TCP.',
          },
          {
            id: 'l8-quiz',
            title: 'Quiz: Cognex y guía robótica',
            duration: '10 min',
            type: 'quiz',
            questions: [
              {
                id: 'q3',
                text: '¿Qué herramienta de Cognex se usa para localización de patrones geométricos complejos?',
                options: ['EdgeFinder', 'PatMax', 'BlobTool', 'LineFinder'],
                correct: 1,
              },
              {
                id: 'q4',
                text: '¿Qué significa calibración "Eye-to-Hand" en visión robótica?',
                options: [
                  'La cámara está montada en el flange del robot',
                  'La cámara está fija en la celda y observa el área de trabajo del robot',
                  'La cámara inspecciona la mano del operario',
                  'El robot tiene un sensor en la muñeca',
                ],
                correct: 1,
              },
            ],
          },
        ],
      },
      {
        id: 'mod4',
        title: 'SICK y Trazabilidad',
        lessons: [
          {
            id: 'l9',
            title: 'Lectores SICK: CLV, Lector 65x y sistema VISOR',
            duration: '25 min',
            type: 'reading',
            content:
              'Familia de lectores SICK:\n\n• CLV: lectores laser 1D para bandas transportadoras\n• Lector 65x: cámara omnidireccional para DM/QR/1D\n• VISOR: sistema de visión con procesamiento integrado\n\nConexión: SoftScan (USB), Ethernet, DeviceNet\nSoftware: SOPAS Engineering Tool (gratuito)',
          },
          {
            id: 'l10-quiz',
            title: 'Evaluación final del curso',
            duration: '12 min',
            type: 'quiz',
            questions: [
              {
                id: 'q5',
                text: '¿Qué tipo de iluminación es más adecuada para leer texto grabado en una superficie metálica plana?',
                options: ['Backlight (contraluz)', 'Ring LED frontal', 'Dark field (luz rasante)', 'Dome difuso'],
                correct: 2,
              },
              {
                id: 'q6',
                text: '¿Cuál es la ventaja principal del sistema Keyence CV-X frente a un sistema basado en PC?',
                options: [
                  'Es más barato siempre',
                  'Tiene pantalla táctil integrada y no requiere PC separado',
                  'Soporta más protocolos de comunicación',
                  'Su cámara es de mayor resolución',
                ],
                correct: 1,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'safety-iso13849',
    title: 'Safety Industrial: ISO 13849 y IEC 62061',
    subtitle: 'Diseño de funciones de seguridad para maquinaria',
    category: 'Safety',
    level: 'Avanzado',
    duration: '5h 20min',
    totalLessons: 8,
    color: '#dc2626',
    description:
      'Aprende a diseñar, calcular y validar funciones de seguridad según ISO 13849-1 y IEC 62061. Desde la evaluación de riesgos hasta la documentación requerida por CE.',
    objectives: [
      'Realizar evaluación de riesgos según ISO 12100',
      'Determinar el PLr requerido para cada función de seguridad',
      'Calcular el PL alcanzado con arquitecturas SISTEMA',
      'Seleccionar componentes de seguridad certificados',
      'Documentar el Safety Design según directiva de maquinaria',
    ],
    modules: [
      {
        id: 'mod1',
        title: 'Marco Normativo',
        lessons: [
          {
            id: 'l1',
            title: 'Directiva de Maquinaria 2006/42/CE y normas relacionadas',
            duration: '30 min',
            type: 'reading',
            content:
              'La Directiva de Maquinaria 2006/42/CE es obligatoria para maquinaria vendida en la UE.\n\nJerarquía normativa:\n• Directiva 2006/42/CE → obligatoria\n• ISO 12100 → evaluación de riesgos (tipo A)\n• ISO 13849, IEC 62061 → control de seguridad (tipo B)\n• Normas específicas por máquina (tipo C)\n\nEl marcado CE requiere el expediente técnico, evaluación de riesgos y declaración de conformidad.',
          },
          {
            id: 'l2',
            title: 'Evaluación de riesgos según ISO 12100',
            duration: '40 min',
            type: 'video',
            content:
              'Proceso de evaluación de riesgos en 6 pasos (ISO 12100):\n\n1. Determinar los límites de la máquina\n2. Identificar peligros\n3. Estimar el riesgo (severidad × probabilidad)\n4. Evaluar el riesgo (¿es tolerable?)\n5. Eliminar/reducir el riesgo\n6. Verificar la reducción\n\nParámetros: S (severidad), F (frecuencia), P (posibilidad de evitar), W (probabilidad de ocurrencia).',
          },
          {
            id: 'l3-quiz',
            title: 'Quiz: Marco normativo',
            duration: '8 min',
            type: 'quiz',
            questions: [
              {
                id: 'q1',
                text: '¿Cuál norma define el proceso de evaluación de riesgos para maquinaria?',
                options: ['ISO 13849-1', 'IEC 62061', 'ISO 12100', 'EN 954-1'],
                correct: 2,
              },
              {
                id: 'q2',
                text: '¿Qué significa PLr?',
                options: [
                  'Performance Level real alcanzado',
                  'Performance Level requerido para la función de seguridad',
                  'Performance Level mínimo de la norma',
                  'Performance Level reducido',
                ],
                correct: 1,
              },
            ],
          },
        ],
      },
      {
        id: 'mod2',
        title: 'ISO 13849 en la Práctica',
        lessons: [
          {
            id: 'l4',
            title: 'Categorías B, 1, 2, 3 y 4: arquitecturas y requisitos',
            duration: '45 min',
            type: 'video',
            content:
              'Las categorías determinan la arquitectura del sistema de control:\n\n• Cat B: componente único, sin diagnóstico\n• Cat 1: componentes probados, sin diagnóstico\n• Cat 2: con función de prueba periódica (DC ≥ 60%)\n• Cat 3: canal redundante, sin DC requerida\n• Cat 4: canal redundante con DC ≥ 99%, detecta fallos antes de la demanda\n\nNota: NO es una escala lineal. La categoría determina la arquitectura, el PL depende también de MTTFd y DC.',
          },
          {
            id: 'l5',
            title: 'Cálculo con SISTEMA (software gratuito BG ETEM)',
            duration: '50 min',
            type: 'video',
            content:
              'SISTEMA (Safety Integrity Software Tool for the Evaluation of Machine Applications) es gratuito y valida ISO 13849.\n\nFlujo de trabajo:\n1. Crear proyecto → definir funciones de seguridad\n2. Para cada función: seleccionar arquitectura (categoría)\n3. Agregar bloques (sensor, lógica, actuador)\n4. Para cada bloque: cargar librería del fabricante o ingresar MTTFd y DC manualmente\n5. El software calcula el PL alcanzado\n\nResultado: reporte PDF para el expediente técnico.',
          },
          {
            id: 'l6',
            title: 'Selección de componentes: relés, controladores y sensores',
            duration: '30 min',
            type: 'reading',
            content:
              'Componentes de seguridad certificados (PL d/e):\n\n• Relés de seguridad: Pilz PNOZ, Schmersal SRB, Phoenix PSR\n• Controladores de seguridad: Pilz PNOZmulti, Sick Flexi Soft, Banner SC26\n• Paros de emergencia: Schmersal EX-AR, Pilz PITstop\n• Cortinas de luz: Keyence SL-V, Sick deTec4\n• Escáneres: Sick S3000, Pilz PSENscan\n\nSiempre verificar el MTTFd y DC en la hoja de datos del fabricante.',
          },
          {
            id: 'l7',
            title: 'Documentación Safety: expediente técnico y declaración de conformidad',
            duration: '25 min',
            type: 'reading',
            content:
              'El expediente técnico para CE debe incluir:\n\n1. Descripción general de la máquina\n2. Planos de diseño\n3. Evaluación de riesgos (ISO 12100)\n4. Funciones de seguridad y sus PL alcanzados\n5. Lista de normas aplicadas\n6. Manual de instrucciones\n7. Declaración de incorporación (si aplica)\n\nDebe conservarse por 10 años después del último año de fabricación.',
          },
          {
            id: 'l8-quiz',
            title: 'Evaluación final del curso',
            duration: '15 min',
            type: 'quiz',
            questions: [
              {
                id: 'q3',
                text: '¿Qué categoría requiere redundancia de canal Y diagnóstico de al menos 99%?',
                options: ['Categoría 2', 'Categoría 3', 'Categoría 4', 'Categoría 1'],
                correct: 2,
              },
              {
                id: 'q4',
                text: '¿Cuál es el nombre del software gratuito de BG ETEM para validar ISO 13849?',
                options: ['PAScal', 'SISTEMA', 'SAFEXPERT', 'IFA BGIA'],
                correct: 1,
              },
              {
                id: 'q5',
                text: 'Un paro de emergencia con Cat 3 / DC_medio / MTTFd_alto, ¿qué PL alcanza?',
                options: ['PL b', 'PL c', 'PL d', 'PL e'],
                correct: 2,
              },
            ],
          },
        ],
      },
    ],
  },
]

export function getCourse(id) {
  return COURSES.find((c) => c.id === id) ?? null
}

export function getLesson(courseId, lessonId) {
  const course = getCourse(courseId)
  if (!course) return null
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId)
    if (lesson) return { lesson, module: mod }
  }
  return null
}

export function getAllLessons(courseId) {
  const course = getCourse(courseId)
  if (!course) return []
  return course.modules.flatMap((mod) => mod.lessons.map((l) => ({ ...l, moduleTitle: mod.title })))
}
