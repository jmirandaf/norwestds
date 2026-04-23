import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';
import CircuitCanvas from '../components/CircuitCanvas';

const CLIENT_LOGOS = [
  '/clientsLogo/jabilLogo.png',
  '/clientsLogo/strykerLogo.png',
  '/clientsLogo/tenmaLogo.png',
  '/clientsLogo/napsLogo.png',
  '/clientsLogo/poseyLogo.png',
];

const PARTNER_LOGOS = [
  '/partnersLogo/fanucLogo.png',
  '/partnersLogo/keyenceLogo.png',
  '/partnersLogo/cognexLogo.png',
  '/partnersLogo/omronLogo.png',
  '/partnersLogo/abbLogo.png',
  '/partnersLogo/yaskawaLogo.png',
  '/partnersLogo/kukaLogo.png',
  '/partnersLogo/mitsubishielectricLogo.png',
  '/partnersLogo/nachiLogo.png',
  '/partnersLogo/boschrexrothLogo.png',
  '/partnersLogo/festoLogo.png',
  '/partnersLogo/smcLogo.png',
];

function MarqueeRow({ logos, direction = 'lr', label }) {
  const doubled = [...logos, ...logos];
  return (
    <div className="ns-marquee-band">
      <span className="ns-marquee-label">{label}</span>
      <div className="ns-marquee-track">
        <div className={`ns-marquee-inner ${direction === 'rl' ? 'ns-marquee-rl' : 'ns-marquee-lr'}`}>
          {doubled.map((src, i) => (
            <img key={i} src={src} alt="" className="ns-marquee-logo" loading="lazy" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();

  useMeta({
    title: 'Norwest DS | Automatización a la medida',
    description: 'Celdas robóticas, visión artificial, pick-and-place e integración industrial.',
    ogImage: '/og-default.jpg',
    url: 'https://norwestds.com/',
  });

  return (
    <PageLayout>
      <section className="ns-hero">
        <CircuitCanvas opacity={0.45} />

        <div className="ns-hero-inner">
          {/* ── HERO BODY ── */}
          <div className="ns-hero-body">
            {/* LEFT */}
            <div className="ns-hero-left">
              <div className="ns-hero-overline">
                <span className="ns-hero-overline-dot" />
                {t('home.heroOverline')}
              </div>

              <h1 className="ns-hero-title">
                {t('home.heroTitle')}<br />
                <span className="accent">{t('home.heroTitleAccent')}</span>
              </h1>

              <p className="ns-hero-sub">{t('home.heroSubtitle')}</p>

              <div className="ns-hero-ctas">
                <Link to="/contact" className="ns-hero-btn-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 12h8M12 8l4 4-4 4" />
                  </svg>
                  {t('home.heroConsult')}
                </Link>
                <Link to="/projects" className="ns-hero-btn-secondary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                  </svg>
                  {t('home.heroProjects')}
                </Link>
              </div>

              <div className="ns-contact-row">
                <a className="ns-contact-item" href="tel:+526646853430">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +52 664 685 3430
                </a>
                <span className="ns-contact-sep" />
                <a className="ns-contact-item" href="mailto:ventas@norwestds.com">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  ventas@norwestds.com
                </a>
                <span className="ns-contact-sep" />
                <span className="ns-contact-item">
                  <span className="ns-contact-dot" />
                  {t('home.heroAvailability')}
                </span>
              </div>
            </div>

            {/* RIGHT: INFO CARD */}
            <aside className="ns-info-card" aria-label={t('home.panelLabel')}>
              <div className="ns-info-card__header">
                <div className="ns-info-card__header-icon">
                  <svg width="18" height="18" fill="none" stroke="#12A6CC" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                  </svg>
                </div>
                <div className="ns-info-card__header-text">{t('home.panelLabel')}</div>
              </div>

              <div className="ns-info-card__section">
                <div className="ns-info-card__label">{t('home.infoCat1')}</div>
                <div className="ns-info-card__tags">
                  {['FANUC', 'Keyence', 'Cognex', 'SICK'].map(tag => (
                    <span key={tag} className="ns-info-card__tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="ns-info-card__divider" />

              <div className="ns-info-card__section">
                <div className="ns-info-card__label">{t('home.infoCat2')}</div>
                <div className="ns-info-card__tags">
                  {['PLCs', 'HMIs', 'SCADA'].map(tag => (
                    <span key={tag} className="ns-info-card__tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="ns-info-card__divider" />

              <div className="ns-info-card__section">
                <div className="ns-info-card__label">{t('home.infoCat3')}</div>
                <div className="ns-info-card__tags">
                  <span className="ns-info-card__tag">{t('home.specialty4Title')}</span>
                  <span className="ns-info-card__tag">ISO 13849</span>
                </div>
              </div>

              <div className="ns-info-card__divider" />

              <div className="ns-info-card__stat-row">
                <div className="ns-info-card__stat">
                  <div className="ns-info-card__stat-num">{t('home.infoStat1Num')}</div>
                  <div className="ns-info-card__stat-lbl">{t('home.infoStat1Lbl')}</div>
                </div>
                <div className="ns-info-card__stat">
                  <div className="ns-info-card__stat-num">{t('home.infoStat2Num')}</div>
                  <div className="ns-info-card__stat-lbl">{t('home.infoStat2Lbl')}</div>
                </div>
              </div>
            </aside>
          </div>

          {/* ── MARQUEES ── */}
          <div className="ns-hero-bands">
            <MarqueeRow logos={CLIENT_LOGOS} direction="lr" label={t('home.heroClientsLabel')} />
            <MarqueeRow logos={PARTNER_LOGOS} direction="rl" label={t('home.heroPartnersLabel')} />
          </div>

          {/* ── FEATURE TAGS ── */}
          <div className="ns-hero-bottom">
            <div className="ns-hero-bottom-tags">
              {[
                { label: t('home.heroBullet1'), icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /> },
                { label: t('home.heroBullet2'), icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></> },
                { label: t('home.heroBullet3'), icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /> },
              ].map(({ label, icon }, i, arr) => (
                <Fragment key={label}>
                  <span className="ns-feature-tag">
                    <span className="ns-feature-tag-icon">
                      <svg width="12" height="12" fill="none" stroke="#12A6CC" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                        {icon}
                      </svg>
                    </span>
                    {label}
                  </span>
                  {i < arr.length - 1 && <span className="ns-hero-bottom-sep" />}
                </Fragment>
              ))}
            </div>
            <div className="ns-hero-bottom-coverage">
              <span className="ns-contact-dot" />
              {t('home.heroCoverage')}
            </div>
          </div>

          {/* ── CTA DENTRO DEL HERO ── */}
          <div className="ns-hero-cta">
            <div className="ns-hero-cta-inner">
              <div className="ns-hero-cta-text">
                <h2>{t('home.ctaTitle')}</h2>
                <p>{t('home.ctaText')}</p>
              </div>
              <div className="ns-hero-cta-btns">
                <Link to="/contact" className="ns-hero-btn-primary">
                  {t('home.ctaConsult')}
                </Link>
                <Link to="/projects" className="ns-hero-btn-secondary">
                  {t('home.ctaSuccess')}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}
