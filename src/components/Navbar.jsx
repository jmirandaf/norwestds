import { useTranslation } from 'react-i18next';
import CardNav from './bits/CardNav'
import logo from '/logo.png'

export default function Navbar() {
  const { t } = useTranslation();
  
  const items = [
    { 
      label: t('nav.about'),    
      bgColor: "#ffffff",
      textColor: "#00A7E1", // brand-light-blue
      links: [
        { label: t('nav.aboutHistory'), ariaLabel: "About Company", href: "/about" },
        { label: t('nav.aboutTeam'), ariaLabel: "About Team", href: "/about#team" }
      ]
    },
    { 
      label: t('nav.projects'), 
      bgColor: "#ffffff",
      textColor: "#00A7E1", // brand-light-blue
      links: [
        { label: t('nav.projectsAutomation'), ariaLabel: "Automation Projects", href: "/projects#automation" },
        { label: t('nav.projectsVision'), ariaLabel: "Vision Projects", href: "/projects#vision" }
      ]
    },
    { 
      label: t('nav.services'), 
      bgColor: "#ffffff",
      textColor: "#00A7E1", // brand-light-blue
      links: [
        { label: t('nav.servicesRobotics'), ariaLabel: "Robotics Services", href: "/services#robotics" },
        { label: t('nav.servicesQuality'), ariaLabel: "Quality Control", href: "/services#quality" },
        { label: t('nav.servicesTraining'), ariaLabel: "Training Center", href: "/training" }
      ]
    }
  ]

  return (
    <header className="site-header sticky-header norwest-nav">
      <CardNav
        logo={logo}
        logoAlt="Norwest DS"
        items={items}

        /* Colores Norwest */
        baseColor="#ffffff"           // texto/link base claro
        menuColor="var(--brand)"      // paneles/menus
        buttonBgColor="var(--brand)"  // botones
        buttonTextColor="#ffffff"     // texto de botón
        ease="power3.out"
      />
    </header>
  )
}