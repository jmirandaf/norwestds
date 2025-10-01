// Si ya tienes el hook, descomenta la siguiente línea:
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';

export default function Home() {
  // Si usas el hook useMeta, descomenta:
   useMeta({
     title: "Norwest DS | Automatización a la medida",
     description: "Celdas robóticas, visión artificial, pick-and-place e integración industrial.",
     ogImage: "/og-default.jpg",
     url: "https://norwestds.com/"
   });

  const services = [
    { t: "Celdas robóticas", d: "Integración Fanuc y control de movimiento con seguridad." },
    { t: "Visión artificial", d: "Inspección 2D/3D (Keyence, Cognex, SICK) y guías de robot." },
    { t: "Pick-and-Place", d: "Mecanismos a medida con actuadores, conveyors y sensórica." },
    { t: "Sistemas de prueba", d: "End-of-line, trazabilidad, captura y análisis de datos." },
    { t: "Integración de equipos", d: "PLC, HMI, redes industriales (EtherNet/IP, Profinet)." },
    { t: "Evaluación de riesgos", d: "Cumplimiento normativo e implementación de resguardos." },
  ];

  const stats = [
    { n: "50+", l: "Proyectos" },
    { n: "12",  l: "Celdas robóticas" },
    { n: "8",   l: "Sistemas de visión" },
    { n: "5",   l: "Sectores atendidos" },
  ];

  const steps = [
    { n: "01", t: "Descubrimiento", d: "Entendemos tu proceso, métricas y objetivo de negocio." },
    { n: "02", t: "Propuesta técnica", d: "Concepto, alcance, tiempos y entregables claros." },
    { n: "03", t: "Ejecución", d: "Diseño, fabricación, integración y validación." },
    { n: "04", t: "Soporte", d: "Arranque, documentación y mejora continua." },
  ];

  return (
    <>
<PageLayout>
          {/* HERO (sin hero__bg) */}
      <section className="hero">
        <div className="container hero__content">
          <div className="hero__copy">
            <h1 className="hero__title">
              Automatización industrial <span className="accent">a la medida</span>
            </h1>
            <p className="hero__subtitle">
              Integramos celdas robóticas, visión artificial y sistemas de prueba para aumentar
              productividad, calidad y trazabilidad.
            </p>
            <div className="hero__actions">
              <a className="btn" href="/contact">Cotiza tu proyecto</a>
              <a className="btn outline" href="/projects">Ver proyectos</a>
            </div>
            <ul className="hero__bullets">
              <li>Robots + Visión 2D/3D</li>
              <li>Integración PLC / HMI</li>
              <li>Seguridad y normativas</li>
            </ul>
          </div>

          <div className="hero__panel">
            <div className="panel">
              <p className="panel__label">Especialistas en</p>
              <ul className="panel__list">
                <li>Fanuc • Keyence • Cognex • SICK</li>
                <li>EtherNet/IP • Profinet</li>
                <li>End-of-line • Trazabilidad</li>
              </ul>
              <a className="btn block" href="/services">Nuestros servicios</a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="container pad">
        <h2 className="section__title">Qué hacemos</h2>
        <p className="section__lead">
          Diseñamos e integramos soluciones llave en mano, desde el concepto hasta el arranque en sitio.
        </p>
        <div className="grid cards-3">
          {services.map((s, i) => (
            <article className="card" key={i}>
              <h3 className="card__title">{s.t}</h3>
              <p className="card__text">{s.d}</p>
              <a href="/services" className="card__link">Saber más →</a>
            </article>
          ))}
        </div>
      </section>

      {/* MÉTRICAS */}
      <section className="metrics">
        <div className="container metrics__row">
          {stats.map((s, i) => (
            <div className="metric" key={i}>
              <div className="metric__n">{s.n}</div>
              <div className="metric__l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="container pad">
        <h2 className="section__title">Nuestro proceso</h2>
        <div className="steps">
          {steps.map((st, i) => (
            <div className="step" key={i}>
              <div className="step__n">{st.n}</div>
              <div className="step__body">
                <h3 className="step__title">{st.t}</h3>
                <p className="step__text">{st.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta">
        <div className="container cta__row">
          <div>
            <h2 className="cta__title">¿Listo para automatizar?</h2>
            <p className="cta__text">Cuéntanos tu reto y construimos la solución indicada.</p>
          </div>
          <div className="cta__actions">
            <a className="btn" href="/contact">Agendar llamada</a>
            <a className="btn outline" href="/projects">Ver casos</a>
          </div>
        </div>
      </section>
    </PageLayout>
    </>
  );
}