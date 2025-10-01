import CardNav from './bits/CardNav'
import logo from '/logo.png'

export default function Navbar() {
  const items = [
    { 
      label: "About",    
      bgColor: "#ffffff",
      textColor: "#004C71", // brand-deep
      links: [
        { label: "Nuestra Historia", ariaLabel: "About Company", href: "/about" },
        { label: "Equipo", ariaLabel: "About Team", href: "/about#team" }
      ]
    },
    { 
      label: "Projects", 
      bgColor: "#ffffff",
      textColor: "#004C71", // brand-deep
      links: [
        { label: "Automatización", ariaLabel: "Automation Projects", href: "/projects#automation" },
        { label: "Visión Artificial", ariaLabel: "Vision Projects", href: "/projects#vision" }
      ]
    },
    { 
      label: "Services", 
      bgColor: "#ffffff",
      textColor: "#004C71", // brand-deep
      links: [
        { label: "Robótica", ariaLabel: "Robotics Services", href: "/services#robotics" },
        { label: "Control de Calidad", ariaLabel: "Quality Control", href: "/services#quality" }
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
        baseColor="#EAF6FB"           // texto/link base claro
        menuColor="var(--brand)"      // paneles/menus
        buttonBgColor="var(--brand)"  // botones
        buttonTextColor="#ffffff"     // texto de botón
        ease="power3.out"
      />
    </header>
  )
}