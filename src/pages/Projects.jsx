import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';
import SolidworksScrollCanvas from '../components/SolidworksScrollCanvas';

// To add real SolidWorks frames, build the array here and pass it as `frames`:
// const SW_FRAMES = Array.from({ length: 120 }, (_, i) =>
//   `/sw-frames/frame_${String(i).padStart(3, '0')}.png`
// );
const SW_FRAMES = [];

const projects = [
  {
    title: 'Celda Robótica Pick & Place',
    client: 'Automotriz Tier 1',
    description: 'Implementación de celda robotizada con visión artificial para clasificación y empaque de componentes automotrices.',
    tech: ['Robot Fanuc', 'Visión Cognex', 'PLC Allen Bradley', 'HMI FactoryTalk'],
    results: ['Incremento de 40% en productividad', 'Reducción de errores a <0.1%', 'ROI en 18 meses'],
  },
  {
    title: 'Sistema de Trazabilidad',
    client: 'Industria Médica',
    description: 'Sistema de trazabilidad con múltiples estaciones de escaneo y base de datos centralizada para dispositivos médicos.',
    tech: ['Escáneres Keyence', 'SQL Server', 'Web API .NET', 'HMI web-based'],
    results: ['100% trazabilidad de producto', 'Cumplimiento FDA CFR 21', 'Reducción tiempo de auditoría 60%'],
  },
  {
    title: 'Modernización Línea de Ensamble',
    client: 'Manufactura Electrónica',
    description: 'Actualización de línea de ensamble existente con nuevos controles y sistema de monitoreo en tiempo real.',
    tech: ['PLC Siemens S7', 'SCADA Ignition', 'OPC UA', 'Azure IoT'],
    results: ['OEE mejorado de 65% a 85%', 'Reducción downtime 45%', 'Dashboards en tiempo real'],
  },
  {
    title: 'Control de Calidad Automatizado',
    client: 'Industria Alimenticia',
    description: 'Sistema de inspección automática con múltiples cámaras para control de calidad en línea de empaque.',
    tech: ['Visión SICK', 'PLC Omron', 'Conveyor Intralox', 'HMI NB Series'],
    results: ['Detección defectos 99.9%', 'Velocidad 120 ppm', 'Reducción personal QA 75%'],
  },
];

export default function Projects() {
  const { t } = useTranslation();
  useMeta({
    title: 'Proyectos | Norwest DS',
    description: 'Casos reales de integración y automatización.',
    url: 'https://norwestds.com/projects',
  });

  return (
    <PageLayout>
      {/* ── HEADER ── */}
      <div className="ns-page-header">
        <div className="ns-page-header-inner">
          <div className="ns-eyebrow"><span className="ns-eyebrow-dot" />Casos de Éxito</div>
          <h1 className="ns-page-title">Proyectos Destacados</h1>
          <p className="ns-page-lead">Conoce algunos de nuestros casos de éxito en implementación de soluciones de automatización industrial.</p>
        </div>
      </div>

      {/* ── SOLIDWORKS ANIMATION ── */}
      <section className="ns-section--dark ns-section--tight">
        <div className="ns-section-inner">
          <div className="ns-eyebrow"><span className="ns-eyebrow-dot" />Ingeniería 3D</div>
          <h2 className="ns-section-title" style={{ color: '#fff', marginBottom: 8 }}>
            Diseño e Ingeniería en SolidWorks
          </h2>
          <p className="ns-section-lead" style={{ marginBottom: 0 }}>
            Cada proyecto parte de un modelo 3D detallado. Desplázate para explorar el proceso de diseño.
          </p>
        </div>
      </section>
      <SolidworksScrollCanvas frames={SW_FRAMES} scrollHeight={3} />

      {/* ── PROYECTOS ── */}
      <section className="ns-section">
        <div className="ns-section-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {projects.map((p, i) => (
              <article key={i} className="ns-card" style={{ display: 'grid', gap: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--nds-teal)', marginBottom: 4 }}>{p.title}</h2>
                    <span className="nds-badge nds-badge-teal">{p.client}</span>
                  </div>
                </div>

                <p style={{ fontSize: '1rem', color: 'var(--nds-muted)', lineHeight: 1.6 }}>{p.description}</p>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--nds-muted)', marginBottom: 10 }}>Tecnologías</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {p.tech.map(t => (
                      <span key={t} className="nds-badge nds-badge-teal">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--nds-muted)', marginBottom: 10 }}>Resultados Clave</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
                    {p.results.map(r => (
                      <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.93rem', color: 'var(--nds-text)' }}>
                        <svg width="14" height="14" fill="none" stroke="var(--nds-teal)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ns-cta-band">
        <div className="ns-cta-band-inner">
          <div>
            <h2>¿Listo para tu Próximo Proyecto?</h2>
            <p>Permítenos llevar tu operación al siguiente nivel con automatización personalizada.</p>
          </div>
          <div className="ns-cta-band-btns">
            <Link to="/contact" className="ns-btn ns-btn-light">Contactar Ahora</Link>
            <Link to="/services" className="ns-btn ns-btn-ghost-dark">Ver Servicios</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
