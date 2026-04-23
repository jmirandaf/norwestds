import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <Navbar />
      <main className={`main ${isHome ? '' : 'layout-main'}`}>{children}</main>
      <Footer />
    </>
  )
}