import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';

const COURSE_ICONS = [
  <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
  <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>,
  <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  <><circle cx="12" cy="5" r="3"/><path d="M12 8v13M8 21h8M5 21H3M21 21h-2"/></>,
  <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>,
];

export default function TrainingCenter() {
  const { t } = useTranslation();
  useMeta({
    title: 'NDS Training Center | Norwest DS',
    description: 'Centro de capacitación en automatización industrial',
    url: 'https://norwestds.com/training',
  });

  const courses = [
    { title: t('training.course1'), desc: t('training.course1Desc'), comingSoon: false },
    { title: t('training.course2'), desc: t('training.course2Desc'), comingSoon: false },
    { title: t('training.course3'), desc: t('training.course3Desc'), comingSoon: false },
    { title: t('training.course4'), desc: t('training.course4Desc'), comingSoon: false },
    { title: t('training.course5'), desc: t('training.course5Desc'), comingSoon: true },
  ];

  return (
    <PageLayout>
      {/* ── HEADER ── */}
      <div className="ns-page-header">
        <div className="ns-page-header-inner">
          <div className="ns-eyebrow"><span className="ns-eyebrow-dot" />Capacitación Especializada</div>
          <h1 className="ns-page-title">{t('training.title')}</h1>
          <p className="ns-page-lead">{t('training.lead')}</p>
        </div>
      </div>

      {/* ── CURSOS ── */}
      <section className="ns-section">
        <div className="ns-section-inner">
          <div className="ns-section-overline">Cursos disponibles</div>
          <h2 className="ns-section-title">Programas de Capacitación</h2>
          <p className="ns-section-lead">Formación práctica para ingenieros y técnicos de planta.</p>
          <div className="ns-grid ns-grid--3">
            {courses.map((c, i) => (
              <article key={i} className="ns-card" style={{ position: 'relative', opacity: c.comingSoon ? 0.75 : 1 }}>
                {c.comingSoon && (
                  <span className="nds-badge nds-badge-purple" style={{ position: 'absolute', top: 16, right: 16 }}>
                    {t('training.comingSoon')}
                  </span>
                )}
                <div className="ns-card-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    {COURSE_ICONS[i]}
                  </svg>
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ns-cta-band">
        <div className="ns-cta-band-inner">
          <div>
            <h2>¿Interesado en capacitar a tu equipo?</h2>
            <p>Diseñamos programas a medida para las necesidades de tu planta.</p>
          </div>
          <div className="ns-cta-band-btns">
            <Link to="/contact" className="ns-btn ns-btn-light">Solicitar información</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
