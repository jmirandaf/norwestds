import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import CardNav from './bits/CardNav'
import logo from '/logo.png'

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  
  const prefetchedRef = useRef(new Set());

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
      '/portal/designpro': () => import('../pages/portal/PortalDesignPro.jsx')
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
      bgColor: "#ffffff",
      textColor: "#00A7E1", // brand-light-blue
      links: [
        { label: t('nav.projectsAutomation'), ariaLabel: "Automation Projects", href: "/projects" }
      ]
    },
    { 
      label: t('nav.services'), 
      bgColor: "#ffffff",
      textColor: "#00A7E1", // brand-light-blue
      links: [
        { label: t('nav.servicesField'), ariaLabel: "Field Services", href: "/services" },
        { label: t('nav.servicesTraining'), ariaLabel: "Training Center", href: "/training" }
      ]
    },
    { 
      label: t('nav.tools'),
      bgColor: "#ffffff",
      textColor: "#00A7E1",
      links: [
        { label: t('nav.designPro'), ariaLabel: 'DesignPro by NDS', href: '/portal/designpro' }
      ]
    },
    { 
      label: t('nav.about'),    
      bgColor: "#ffffff",
      textColor: "#00A7E1", // brand-light-blue
      links: [
        { label: t('nav.aboutUs'), ariaLabel: "About Company", href: "/about" },
        { label: t('nav.aboutTeam'), ariaLabel: "Our Team", href: "/team" },
        { label: t('nav.aboutContact'), ariaLabel: "Contact Us", href: "/contact" }
      ]
    }
  ]

  return (
    <header className="site-header sticky-header norwest-nav">
      <CardNav
        key={t('nav.projects')} // Force re-render on language change
        logo={logo}
        logoAlt="Norwest DS"
        items={items}

        /* Colores Norwest */
        baseColor="#ffffff"           // texto/link base claro
        menuColor="var(--brand)"      // paneles/menus
        buttonBgColor="var(--brand)"  // botones
        buttonTextColor="#ffffff"     // texto de botón
        ctaLabel={t('home.heroConsult')}
        currentPath={location.pathname}
        onPrefetchRoute={prefetchRoute}
        ease="power3.out"
      />
    </header>
  )
}