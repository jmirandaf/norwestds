import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';

const team = [
  { name: 'Carlos Gonzalez',   role: 'Sales Engineer / PM',        expertise: 'Ventas y Gestión de Proyectos' },
  { name: 'Sebastian Bandeliz', role: 'Legal Affairs / PM',          expertise: 'Asuntos Legales y Gestión de Proyectos' },
  { name: 'Elias Mejia',        role: 'Design Lead Engineer',        expertise: 'Diseño e Ingeniería' },
  { name: 'Juan Miranda',       role: 'Control Lead Engineer',       expertise: 'Control e Ingeniería' },
];

const whyUs = [
  { title: 'Experiencia Comprobada', text: 'Más de 10 años en el sector industrial implementando soluciones de automatización exitosas.' },
  { title: 'Soporte Continuo',       text: 'Acompañamiento técnico durante y después de la implementación para asegurar el éxito del proyecto.' },
  { title: 'Tecnología de Punta',    text: 'Trabajamos con las marcas líderes del mercado para entregar soluciones confiables y escalables.' },
  { title: 'Equipo Certificado',     text: 'Nuestros ingenieros cuentan con certificaciones internacionales en robótica, visión y control.' },
];

export default function About() {
  const { t } = useTranslation();
  useMeta({
    title: 'Nosotros | Norwest DS',
    description: 'Equipo multidisciplinario con enfoque en resultados.',
    url: 'https://norwestds.com/about',
  });

  return (
    <PageLayout>
      {/* ── HEADER ── */}
      <div className="ns-page-header">
        <div className="ns-page-header-inner">
          <div className="ns-eyebrow"><span className="ns-eyebrow-dot" />Norwest Dynamic Systems</div>
          <h1 className="ns-page-title">{t('about.title')}</h1>
          <p className="ns-page-lead">{t('about.lead')}, comprometidos con la excelencia técnica y la innovación.</p>
        </div>
      </div>

      {/* ── MISIÓN / VISIÓN / VALORES ── */}
      <section className="ns-section">
        <div className="ns-section-inner">
          <div className="ns-grid ns-grid--3">
            <article className="ns-card">
              <div className="ns-card-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h3>Nuestra Misión</h3>
              <p>Transformar procesos industriales mediante soluciones de automatización innovadoras y confiables que impulsen la productividad y competitividad de nuestros clientes.</p>
            </article>
            <article className="ns-card">
              <div className="ns-card-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3>Nuestra Visión</h3>
              <p>Ser el referente en integración de tecnologías avanzadas para la industria 4.0 en México, reconocidos por nuestra excelencia técnica y compromiso con resultados.</p>
            </article>
            <article className="ns-card">
              <div className="ns-card-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <h3>Valores</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Excelencia técnica', 'Innovación continua', 'Compromiso con resultados', 'Integridad profesional'].map(v => (
                  <li key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--nds-muted)', fontSize: '.93rem' }}>
                    <svg width="14" height="14" fill="none" stroke="var(--nds-teal)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {v}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="ns-section" style={{ background: '#fff' }}>
        <div className="ns-section-inner">
          <div className="ns-section-overline">Personas</div>
          <h2 className="ns-section-title">{t('about.teamTitle')}</h2>
          <p className="ns-section-lead">Contamos con profesionales especializados en diferentes áreas de ingeniería y gestión de proyectos.</p>
          <div className="ns-grid ns-grid--4">
            {team.map((m) => (
              <article className="ns-card" key={m.name}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--nds-teal-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: 'var(--nds-teal)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {m.name.charAt(0)}
                </div>
                <h3 style={{ marginBottom: 4 }}>{m.name}</h3>
                <p style={{ color: 'var(--nds-teal)', fontWeight: 600, fontSize: '.88rem', marginBottom: 6 }}>{m.role}</p>
                <p>{m.expertise}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section className="ns-section">
        <div className="ns-section-inner">
          <div className="ns-section-overline">Diferenciadores</div>
          <h2 className="ns-section-title">Por Qué Elegirnos</h2>
          <div className="ns-grid ns-grid--4">
            {whyUs.map((w) => (
              <article className="ns-card" key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ns-cta-band">
        <div className="ns-cta-band-inner">
          <div>
            <h2>¿Listo para trabajar juntos?</h2>
            <p>Cuéntanos tu proyecto y encontramos la solución ideal.</p>
          </div>
          <div className="ns-cta-band-btns">
            <Link to="/contact" className="ns-btn ns-btn-light">Contactar</Link>
            <Link to="/projects" className="ns-btn ns-btn-ghost-dark">Ver proyectos</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
