import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';

const VALUES = [
  {
    vKey: 'v1',
    icon: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>,
  },
  {
    vKey: 'v2',
    icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
  },
  {
    vKey: 'v3',
    icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  },
  {
    vKey: 'v4',
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  },
  {
    vKey: 'v5',
    icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  },
  {
    vKey: 'v6',
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  },
  {
    vKey: 'v7',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  },
];

export default function About() {
  const { t } = useTranslation();
  useMeta({
    title: 'About Us | Norwest Dynamic Systems — Industrial Automation',
    description: 'Industrial automation and robotics integration firm based in Tijuana, B.C. Serving manufacturers across Mexico and the U.S. border region.',
    url: 'https://norwestds.com/about',
  });

  return (
    <PageLayout>

      {/* ── HEADER ── */}
      <div className="ns-page-header">
        <div className="ns-page-header-inner">
          <div className="ns-eyebrow"><span className="ns-eyebrow-dot" />Norwest Dynamic Systems</div>
          <h1 className="ns-page-title">{t('about.title')}</h1>
          <p className="ns-page-lead">{t('about.lead')}</p>
        </div>
      </div>

      {/* ── WHO WE ARE ── */}
      <section className="ns-section">
        <div className="ns-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="ns-section-overline">Who We Are</div>
              <h2 className="ns-section-title" style={{ marginBottom: 20 }}>Built for Industrial Performance</h2>
              <p style={{ color: 'var(--nds-muted)', lineHeight: 1.75, fontSize: '1rem' }}>
                {t('about.description')}
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
                {['Turnkey Execution', 'In-House Build', 'Binational Operations'].map(tag => (
                  <span key={tag} style={{
                    padding: '6px 14px', borderRadius: 999,
                    background: 'var(--nds-teal-wash)', color: 'var(--nds-teal-deep)',
                    fontSize: '.82rem', fontWeight: 700, letterSpacing: '.02em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Mission */}
              <article className="ns-card" style={{ borderLeft: '3px solid var(--nds-teal)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <svg width="18" height="18" fill="none" stroke="var(--nds-teal)" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <h3 style={{ margin: 0, fontSize: '.95rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--nds-teal-deep)' }}>
                    {t('about.missionLabel')}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '.9rem', lineHeight: 1.65 }}>{t('about.missionText')}</p>
              </article>
              {/* Vision */}
              <article className="ns-card" style={{ borderLeft: '3px solid var(--nds-teal)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <svg width="18" height="18" fill="none" stroke="var(--nds-teal)" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <h3 style={{ margin: 0, fontSize: '.95rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--nds-teal-deep)' }}>
                    {t('about.visionLabel')}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '.9rem', lineHeight: 1.65 }}>{t('about.visionText')}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT DRIVES EVERY DECISION ── */}
      <section className="ns-section" style={{ background: '#fff' }}>
        <div className="ns-section-inner">
          <div className="ns-section-overline">Our Values</div>
          <h2 className="ns-section-title">{t('about.valuesTitle')}</h2>
          <p className="ns-section-lead">{t('about.valuesLead')}</p>
          <div className="ns-grid ns-grid--4">
            {VALUES.map(({ vKey, icon }) => (
              <article className="ns-card" key={vKey}>
                <div className="ns-card-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    {icon}
                  </svg>
                </div>
                <h3 style={{ fontSize: '.95rem' }}>{t(`about.${vKey}`)}</h3>
                <p>{t(`about.${vKey}Desc`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ns-cta-band">
        <div className="ns-cta-band-inner">
          <div>
            <h2>Ready to work together?</h2>
            <p>Tell us about your project and we'll find the right solution.</p>
          </div>
          <div className="ns-cta-band-btns">
            <Link to="/contact" className="ns-btn ns-btn-light">Contact us</Link>
            <Link to="/projects" className="ns-btn ns-btn-ghost-dark">See projects</Link>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
