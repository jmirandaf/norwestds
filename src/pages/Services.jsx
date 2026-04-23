import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';

const SERVICE_ICONS = [
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>,
  <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>,
  <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
  <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>,
  <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></>,
  <><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M11 18H8a2 2 0 0 1-2-2V9"/></>,
  <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>,
];

export default function Services() {
  const { t } = useTranslation();
  useMeta({
    title: 'Servicios | Norwest DS',
    description: 'Soluciones de automatización industrial: robótica, visión, control, PLCs y más.',
    url: 'https://norwestds.com/services',
  });

  const items = [
    { title: t('services.service1'), desc: t('services.service1Desc') },
    { title: t('services.service2'), desc: t('services.service2Desc') },
    { title: t('services.service3'), desc: t('services.service3Desc') },
    { title: t('services.service4'), desc: t('services.service4Desc') },
    { title: t('services.service5'), desc: t('services.service5Desc') },
    { title: t('services.service6'), desc: t('services.service6Desc') },
    { title: t('services.service7'), desc: t('services.service7Desc') },
    { title: t('services.service8'), desc: t('services.service8Desc') },
  ];

  return (
    <PageLayout>
      {/* ── HEADER ── */}
      <div className="ns-page-header">
        <div className="ns-page-header-inner">
          <div className="ns-eyebrow"><span className="ns-eyebrow-dot" />Soluciones</div>
          <h1 className="ns-page-title">{t('services.title')}</h1>
          <p className="ns-page-lead">Diseñamos e implementamos sistemas de automatización adaptados a los requerimientos de cada industria.</p>
        </div>
      </div>

      {/* ── DESIGNPRO FEATURE ── */}
      <section className="ns-section ns-section--dark">
        <div className="ns-section-inner">
          <div className="ns-dp-feature-card">
            <div className="ns-dp-feature-grid" />
            <div className="ns-dp-feature-body">
              <div className="ns-eyebrow" style={{ marginBottom: 16 }}><span className="ns-eyebrow-dot" />Product Suite</div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>{t('services.designProTitle')}</h2>
              <p style={{ color: 'rgba(234,246,251,0.85)', fontSize: '1.05rem', maxWidth: 680, marginBottom: 20 }}>{t('services.designProValue')}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[t('services.designProBenefit1'), t('services.designProBenefit2'), t('services.designProBenefit3')].map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(234,246,251,0.85)', fontSize: '.97rem' }}>
                    <svg width="16" height="16" fill="none" stroke="#12A6CC" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                    {b}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 28, maxWidth: 520 }}>
                {[
                  { v: t('services.designProMetric1Value'), l: t('services.designProMetric1Label') },
                  { v: t('services.designProMetric2Value'), l: t('services.designProMetric2Label') },
                  { v: t('services.designProMetric3Value'), l: t('services.designProMetric3Label') },
                ].map(m => (
                  <div key={m.l} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{m.v}</div>
                    <div style={{ fontSize: 12, color: 'rgba(234,246,251,0.75)', marginTop: 4 }}>{m.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/contact" className="ns-btn ns-btn-light">{t('services.designProCtaDemo')}</Link>
                <Link to="/portal/designpro" className="ns-btn ns-btn-ghost-dark">{t('services.designProCtaPortal')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS GRID ── */}
      <section className="ns-section">
        <div className="ns-section-inner">
          <div className="ns-section-overline">Catálogo</div>
          <h2 className="ns-section-title">Nuestros Servicios</h2>
          <p className="ns-section-lead">Soluciones end-to-end desde el diseño hasta la puesta en marcha y soporte.</p>
          <div className="ns-grid ns-grid--4">
            {items.map((item, i) => (
              <article className="ns-card" key={i}>
                <div className="ns-card-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    {SERVICE_ICONS[i]}
                  </svg>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ns-cta-band">
        <div className="ns-cta-band-inner">
          <div>
            <h2>¿Necesitas una solución personalizada?</h2>
            <p>Cuéntanos tu reto y diseñamos la respuesta técnica ideal.</p>
          </div>
          <div className="ns-cta-band-btns">
            <Link to="/contact" className="ns-btn ns-btn-light">Solicitar consultoría</Link>
            <Link to="/projects" className="ns-btn ns-btn-ghost-dark">Ver casos de éxito</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
