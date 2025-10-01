import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';
import './Home.css';

export default function Home() {
  // Si usas el hook useMeta, descomenta:
   useMeta({
     title: "Norwest DS | Automatización a la medida",
     description: "Celdas robóticas, visión artificial, pick-and-place e integración industrial.",
     ogImage: "/og-default.jpg",
     url: "https://norwestds.com/"
   });

  const solutions = [
    { 
      title: "Automatización Industrial",
      description: "Diseño e integración de celdas robóticas, sistemas de visión y soluciones de automatización personalizadas para optimizar procesos industriales.",
      features: [
        "Celdas robóticas con FANUC",
        "Sistemas de visión 2D/3D",
        "Integración PLC y HMI",
        "Redes industriales"
      ]
    },
    {
      title: "Desarrollo de Proyectos",
      description: "Gestión integral de proyectos desde el concepto hasta la implementación, asegurando calidad y cumplimiento de objetivos.",
      features: [
        "Análisis de requerimientos",
        "Diseño de soluciones",
        "Implementación y pruebas",
        "Documentación y capacitación"
      ]
    }
  ];

  const specialties = [
    { title: "Robótica Industrial", items: ["FANUC Robotics", "Programación de robots", "Integración de sistemas", "Células de trabajo"] },
    { title: "Visión Artificial", items: ["Keyence", "Cognex", "SICK", "Sistemas 2D/3D"] },
    { title: "Control y Automatización", items: ["PLCs", "HMIs", "SCADA", "Redes industriales"] },
    { title: "Seguridad Industrial", items: ["Análisis de riesgos", "Normativas", "Guardas de seguridad", "Sistemas de control"] }
  ];

  const stats = [
    { n: "100%", l: "Satisfacción del cliente" },
    { n: "50+", l: "Proyectos exitosos" },
    { n: "10+", l: "Años de experiencia" },
    { n: "24/7", l: "Soporte técnico" },
  ];

  return (
    <>
<PageLayout>
          {/* HERO (sin hero__bg) */}
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero__content">
            <div className="hero__copy">
              <h1 className="hero__title">
                Soluciones Inteligentes en <span className="accent">Automatización Industrial</span>
              </h1>
              <p className="hero__subtitle">
                Optimizamos procesos industriales con tecnología de punta y experiencia comprobada
              </p>
              <div className="hero__actions">
                <a className="btn" href="/contact">Consulta con un experto</a>
                <a className="btn outline" href="/projects">Conoce nuestros proyectos</a>
              </div>
            </div>
            <div className="image-placeholder">
              Imagen: Robot industrial en acción
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="section">
          <div className="container">
            <h2 className="section__title">Nuestras Soluciones</h2>
            <div className="grid grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <div key={index} className="section__content">
                  <h3 className="text-xl text-brand-light mb-4">{solution.title}</h3>
                  <p className="mb-4">{solution.description}</p>
                  <ul className="list-disc pl-5">
                    {solution.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <div className="image-placeholder mt-4">
                    Imagen: {solution.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="section bg-brand-deep">
          <div className="container">
            <h2 className="section__title">Especialidades</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {specialties.map((specialty, index) => (
                <div key={index} className="section__content">
                  <h3 className="text-lg text-brand-light mb-3">{specialty.title}</h3>
                  <ul className="space-y-2">
                    {specialty.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <div className="image-placeholder mt-4">
                    Ícono: {specialty.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl text-brand-light font-bold">{stat.n}</div>
                  <div className="text-white">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container text-center">
            <h2 className="text-3xl text-brand-light mb-4">¿Listo para optimizar tus procesos?</h2>
            <p className="text-white mb-6">Contáctanos hoy y descubre cómo podemos ayudarte</p>
            <div className="space-x-4">
              <a href="/contact" className="btn">Solicitar consultoría</a>
              <a href="/projects" className="btn outline">Ver casos de éxito</a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
    </>
  );
}