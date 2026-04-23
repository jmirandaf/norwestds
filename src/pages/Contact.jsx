import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';
import ContactForm from '../components/ContactForm';

const contactMethods = [
  {
    title: 'Oficina',
    info: 'Pedregal de Santa Julia\nTijuana, Baja California, México',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    title: 'Teléfono',
    info: '+52 664-685-3430\nLun — Vie: 9:00 — 18:00',
    href: 'tel:+526646853430',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    title: 'Email',
    info: 'ventas@norwestds.com',
    href: 'mailto:ventas@norwestds.com',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const { t } = useTranslation();
  useMeta({
    title: 'Contacto | Norwest DS',
    description: 'Cuéntanos tu reto y lo convertimos en solución.',
    url: 'https://norwestds.com/contact',
  });

  return (
    <PageLayout>
      {/* ── HEADER ── */}
      <div className="ns-page-header">
        <div className="ns-page-header-inner">
          <div className="ns-eyebrow"><span className="ns-eyebrow-dot" />Hablemos</div>
          <h1 className="ns-page-title">{t('contact.title')}</h1>
          <p className="ns-page-lead">{t('contact.lead')}</p>
        </div>
      </div>

      {/* ── FORM + INFO ── */}
      <section className="ns-section">
        <div className="ns-section-inner">
          <div className="ns-grid ns-grid--2" style={{ alignItems: 'start', gap: 48 }}>
            {/* Formulario */}
            <div>
              <h2 className="nds-h2" style={{ marginBottom: 24 }}>Envíanos un mensaje</h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div>
              <h2 className="nds-h2" style={{ marginBottom: 24 }}>Información de Contacto</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {contactMethods.map((m) => (
                  <article key={m.title} className="ns-card" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div className="ns-card-icon" style={{ flexShrink: 0 }}>{m.icon}</div>
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{m.title}</h3>
                      {m.href ? (
                        <a href={m.href} style={{ color: 'var(--nds-muted)', fontSize: '.93rem', whiteSpace: 'pre-line', textDecoration: 'none' }} className="ns-contact-info-link">
                          {m.info}
                        </a>
                      ) : (
                        <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: '.93rem' }}>{m.info}</p>
                      )}
                    </div>
                  </article>
                ))}

                {/* Disponibilidad */}
                <div className="ns-card" style={{ background: 'var(--nds-teal-wash)', border: '1px solid #CBE6F5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--nds-success)', boxShadow: '0 0 8px rgba(22,163,74,0.5)', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--nds-teal-deep)', fontSize: '.93rem' }}>
                      Tiempo de respuesta: dentro de las 24 horas hábiles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
