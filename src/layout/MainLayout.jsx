import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ChatBot from '../components/chatbot/index.js'

export default function MainLayout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <Navbar />
      <main className={`main ${isHome ? '' : 'layout-main'}`}>{children}</main>
      <Footer />
      {/* ChatBot — remove this line + import to disable the module */}
      <ChatBot />
    </>
  )
}