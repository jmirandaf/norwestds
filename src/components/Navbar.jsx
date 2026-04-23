import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector.jsx';
import logo from '/logo.png';

function Caret() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefetchedRef = useRef(new Set());

  const isHome = false; // nav siempre sticky oscuro en todas las páginas

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const prefetchRoute = (href = '') => {
    if (!href || prefetchedRef.current.has(href)) return;
    const prefetchMap = {
      '/': () => import('../pages/Home.jsx'),
      '/services': () => import('../pages/Services.jsx'),
      '/projects': () => import('../pages/Projects.jsx'),
      '/about': () => import('../pages/About.jsx'),
      '/team': () => import('../pages/Team.jsx'),
      '/contact': () => import('../pages/Contact.jsx'),
      '/training': () => import('../pages/TrainingCenter.jsx'),
      '/portal/designpro': () => import('../pages/portal/PortalDesignPro.jsx'),
    };
    const importer = prefetchMap[href];
    if (importer) {
      prefetchedRef.current.add(href);
      importer();
    }
  };

  const items = [
    {
      label: t('nav.projects'),
      href: '/projects',
      links: [
        { label: t('nav.projectsAutomation'), href: '/projects' },
      ],
    },
    {
      label: t('nav.services'),
      href: '/services',
      links: [
        { label: t('nav.servicesField'), href: '/services' },
        { label: t('nav.servicesTraining'), href: '/training' },
      ],
    },
    {
      label: t('nav.tools'),
      href: '/portal/designpro',
      links: [
        { label: t('nav.designPro'), href: '/portal/designpro' },
      ],
    },
    {
      label: t('nav.about'),
      href: '/about',
      links: [
        { label: t('nav.aboutUs'), href: '/about' },
        { label: t('nav.aboutTeam'), href: '/team' },
        { label: t('nav.aboutContact'), href: '/contact' },
      ],
    },
  ];

  return (
    <header className={`ns-nav ${isHome ? 'ns-nav--overlay' : ''}`}>
      <div className="ns-nav-inner">
        <Link to="/" aria-label="Norwest Dynamic Systems">
          <img src={logo} alt="Norwest Dynamic Systems" className="ns-nav-logo" />
        </Link>

        <nav className={`ns-nav-links ${mobileOpen ? 'is-open' : ''}`}>
          {items.map((item) => (
            <div className="ns-nav-item" key={item.label}>
              <Link
                to={item.href}
                className={`ns-nav-link ${location.pathname === item.href ? 'is-active' : ''}`}
                onMouseEnter={() => prefetchRoute(item.href)}
                onFocus={() => prefetchRoute(item.href)}
              >
                {item.label}
                {item.links?.length > 1 && <Caret />}
              </Link>
              {item.links?.length > 1 && (
                <div className="ns-nav-drop">
                  {item.links.map((l) => (
                    <Link
                      key={l.href + l.label}
                      to={l.href}
                      onMouseEnter={() => prefetchRoute(l.href)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="ns-nav-lang">
            <LanguageSelector />
          </div>

          <Link to="/contact" className="ns-nav-cta" onMouseEnter={() => prefetchRoute('/contact')}>
            {t('home.heroConsult')}
          </Link>
        </nav>

        <button
          type="button"
          className="ns-nav-burger"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
