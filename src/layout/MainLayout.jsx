import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ChatBot from '../components/chatbot/index.js'

const JSON_LD = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Norwest Dynamic Systems',
    url: 'https://norwestds.com',
    logo: 'https://norwestds.com/logo.png',
    email: 'ventas@norwestds.com',
    telephone: '+52-664-685-3430',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+52-664-685-3430',
      contactType: 'sales',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Norwest Dynamic Systems',
    description: 'Empresa de automatización industrial — robótica FANUC, visión artificial Keyence/Cognex, control PLC/SCADA, diseño eléctrico.',
    url: 'https://norwestds.com',
    telephone: '+52-664-685-3430',
    email: 'ventas@norwestds.com',
    image: 'https://norwestds.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tijuana',
      addressRegion: 'Baja California',
      addressCountry: 'MX',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 32.5149, longitude: -117.0382 },
    areaServed: [
      { '@type': 'City', name: 'Tijuana' },
      { '@type': 'City', name: 'San Diego' },
      { '@type': 'State', name: 'Baja California' },
      { '@type': 'State', name: 'California' },
    ],
    knowsAbout: [
      'Automatización industrial',
      'Robótica FANUC',
      'Visión artificial',
      'Control PLC',
      'SCADA',
      'Diseño eléctrico',
      'Seguridad industrial ISO 13849',
    ],
    priceRange: '$$',
  },
])

export default function MainLayout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <Navbar />
      <main className={`main ${isHome ? '' : 'layout-main'}`}>{children}</main>
      <Footer />
      {/* ChatBot — remove this line + import to disable the module */}
      <ChatBot />
    </>
  )
}