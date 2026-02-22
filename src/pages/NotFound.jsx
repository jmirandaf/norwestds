import PageLayout from '../layout/PageLayout';

export default function NotFound() {
  return (
    <PageLayout>
      <section className="container" style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px'
      }}>
        <h1 style={{
          fontSize: '8rem',
          margin: '0',
          color: 'var(--brand)',
          opacity: 0.2,
          fontWeight: 800
        }}>404</h1>
        
        <h2 style={{
          fontSize: '2rem',
          margin: '0 0 24px',
          color: 'var(--brand)'
        }}>Página No Encontrada</h2>
        
        <p style={{
          fontSize: '1.2rem',
          margin: '0 0 32px',
          maxWidth: '500px',
          opacity: 0.8
        }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Te invitamos a explorar nuestro sitio desde el inicio.
        </p>
        
        <div style={{display: 'flex', gap: '16px'}}>
          <a href="/" className="btn">Volver al Inicio</a>
          <a href="/contact" className="btn outline">Contactar</a>
        </div>
      </section>
    </PageLayout>
  );
}