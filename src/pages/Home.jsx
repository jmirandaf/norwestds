import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';
import LogoLoop from '../components/bits/LogoLoop';

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
              <a className="btn outline" href="/projects">Ver proyectos</a>
            </div>
            <ul className="hero__bullets">
              <li>Integración Robótica FANUC</li>
              <li>Sistemas de Visión 2D/3D</li>
              <li>Control y Automatización</li>
            </ul>
          </div>

          <div className="hero__panel">
            <div className="panel">
              <p className="panel__label">Especialistas en</p>
              <ul className="panel__list">
                <li>FANUC • Keyence • Cognex • SICK</li>
                <li>PLCs • HMIs • SCADA</li>
                <li>Seguridad Industrial</li>
              </ul>
              <a className="btn block" href="/services">Nuestros servicios</a>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="container">
        <h2 className="section__title" style={{marginTop: 32}}>Soluciones Integrales</h2>
        <p className="section__lead">
          Diseñamos e implementamos soluciones de automatización personalizadas para optimizar tus procesos industriales
        </p>
        <div className="grid" style={{marginTop: 48, gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
          {solutions.map((solution, i) => (
            <article className="card" key={i}>
              <h3 className="card__title">{solution.title}</h3>
              <p className="card__text">{solution.description}</p>
              <a href="/services" className="card__link">Conoce más →</a>
            </article>
          ))}
        </div>
      </section>

      {/* Especialidades */}
      <section className="container">
        <h2 className="section__title" style={{marginTop: 64}}>Nuestras Especialidades</h2>
        <div className="grid" style={{marginTop: 32, gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
          {specialties.map((specialty, i) => (
            <article className="card" key={i}>
              <h3 className="card__title">{specialty.title}</h3>
              <ul className="card__list">
                {specialty.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="container" style={{marginTop: 64}}>
        <h2 className="section__title">Nuestros Partners Tecnológicos</h2>
        <p className="section__lead">Trabajamos con las marcas líderes en automatización industrial</p>
        <div style={{marginTop: 40}}>
          <LogoLoop
            logos={[
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#004C71', padding: '0 20px'}}>FANUC</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#004C71', padding: '0 20px'}}>Keyence</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#004C71', padding: '0 20px'}}>Cognex</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#004C71', padding: '0 20px'}}>SICK</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#004C71', padding: '0 20px'}}>Siemens</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#004C71', padding: '0 20px'}}>ABB</div>,
            ]}
            speed={50}
            direction="left"
            logoHeight={60}
            gap={80}
            hoverSpeed={0}
            fadeOut={true}
            fadeOutColor="rgba(255,255,255,1)"
            scaleOnHover={true}
            ariaLabel="Technology partners"
          />
        </div>
      </section>

      {/* Clientes */}
      <section className="container" style={{marginTop: 64}}>
        <h2 className="section__title">Clientes que Confían en Nosotros</h2>
        <p className="section__lead">Empresas líderes que han optimizado sus procesos con nuestras soluciones</p>
        <div style={{marginTop: 40}}>
          <LogoLoop
            logos={[
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#007DAB', padding: '0 20px'}}>MeritMedical</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#007DAB', padding: '0 20px'}}>Medtronic</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#007DAB', padding: '0 20px'}}>Foxconn</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#007DAB', padding: '0 20px'}}>Jabil</div>,
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#007DAB', padding: '0 20px'}}>TE Connectivity</div>,
            ]}
            speed={40}
            direction="left"
            logoHeight={60}
            gap={100}
            hoverSpeed={0}
            fadeOut={true}
            fadeOutColor="rgba(255,255,255,1)"
            scaleOnHover={true}
            ariaLabel="Our clients"
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta">
        <div className="container cta__row">
          <div>
            <h2 className="cta__title">¿Listo para optimizar tus procesos?</h2>
            <p className="cta__text">Descubre cómo podemos ayudarte a alcanzar tus objetivos</p>
          </div>
          <div className="cta__actions">
            <a className="btn" href="/contact">Solicitar consultoría</a>
            <a className="btn outline" href="/projects">Ver casos de éxito</a>
          </div>
        </div>
      </section>
    </PageLayout>
    </>
  );
}