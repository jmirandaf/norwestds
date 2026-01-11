import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta'
import PageLayout from '../layout/PageLayout';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  const { t } = useTranslation();
  useMeta({
    title: "Contacto | Norwest DS",
    description: "Cuéntanos tu reto y lo convertimos en solución.",
    url: "https://norwestds.com/contact"
  })

  const contactMethods = [
    {
      icon: "📍",
      title: "Oficina",
      info: "Parque Industrial Monterrey\nAv. Industria #2000\nMonterrey, N.L.",
    },
    {
      icon: "📱",
      title: "Teléfono",
      info: "+52 (81) 8123-4567\nLun - Vie: 9:00 - 18:00",
    },
    {
      icon: "📧",
      title: "Email",
      info: "contacto@norwestds.com\nventas@norwestds.com",
    }
  ];

  return (
    <PageLayout>
      <section className="container pad">
        <h1 className="section__title">{t('contact.title')}</h1>
        <p className="section__lead">
          {t('contact.lead')}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          marginTop: '48px'
        }}>
          {/* Formulario */}
          <div>
            <h2 style={{fontSize: '1.5rem', marginBottom: '24px'}}>Envíanos un mensaje</h2>
            <ContactForm />
          </div>

          {/* Info de Contacto */}
          <div>
            <h2 style={{fontSize: '1.5rem', marginBottom: '24px'}}>Información de Contacto</h2>
            <div style={{display: 'grid', gap: '24px'}}>
              {contactMethods.map((method, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{fontSize: '32px', marginBottom: '16px'}}>{method.icon}</div>
                  <h3 style={{margin: '0 0 8px'}}>{method.title}</h3>
                  <p style={{
                    margin: 0,
                    whiteSpace: 'pre-line',
                    opacity: 0.8
                  }}>
                    {method.info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}