import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta'

import PageLayout from '../layout/PageLayout';

export default function About() {
  const { t } = useTranslation();
  useMeta({
    title: "Nosotros | Norwest DS",
    description: "Equipo multidisciplinario con enfoque en resultados.",
    url: "https://norwestds.com/about"
  })

  const team = [
    {
      name: "Carlos Gonzalez",
      role: "Sales Engineer / PM",
      expertise: "Ventas y Gestión de Proyectos"
    },
    {
      name: "Sebastian Bandeliz",
      role: "Legal Affairs / PM",
      expertise: "Asuntos Legales y Gestión de Proyectos"
    },
    {
      name: "Elias Mejia",
      role: "Design Lead Engineer",
      expertise: "Diseño e Ingeniería"
    },
    {
      name: "Juan Miranda",
      role: "Control Lead Engineer",
      expertise: "Control e Ingeniería"
    }
  ];

  return (
    <PageLayout>
      <section className="container">
        <h1 className="section__title" style={{marginTop: 32}}>{t('about.title')}</h1>
        <p className="section__lead">
          {t('about.lead')},
          comprometidos con la excelencia técnica y la innovación.
        </p>

        <div className="grid" style={{marginTop: 48, gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
          <div className="card">
            <h3>Nuestra Misión</h3>
            <p>Transformar procesos industriales mediante soluciones de automatización innovadoras y confiables que impulsen la productividad y competitividad de nuestros clientes.</p>
          </div>
          <div className="card">
            <h3>Nuestra Visión</h3>
            <p>Ser el referente en integración de tecnologías avanzadas para la industria 4.0 en México, reconocidos por nuestra excelencia técnica y compromiso con resultados.</p>
          </div>
          <div className="card">
            <h3>Valores</h3>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              <li>✓ Excelencia técnica</li>
              <li>✓ Innovación continua</li>
              <li>✓ Compromiso con resultados</li>
              <li>✓ Integridad profesional</li>
            </ul>
          </div>
        </div>

        <div style={{marginTop: 64}}>
          <h2 className="section__title">Nuestro Equipo</h2>
          <p className="section__lead">
            Contamos con profesionales especializados en diferentes áreas de ingeniería y gestión de proyectos.
          </p>
          <div className="grid" style={{marginTop: 32, gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
            {team.map((member, i) => (
              <div className="card" key={i}>
                <h3>{member.name}</h3>
                <p style={{color: 'var(--brand)', marginBottom: 8}}>{member.role}</p>
                <p style={{marginBottom: 4}}>{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop: 64}}>
          <h2 className="section__title">Por Qué Elegirnos</h2>
          <div className="grid" style={{gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
            <div className="card">
              <h3>Experiencia Comprobada</h3>
              <p>Más de 10 años en el sector industrial implementando soluciones de automatización exitosas.</p>
            </div>
            <div className="card">
              <h3>Soporte Continuo</h3>
              <p>Acompañamiento técnico durante y después de la implementación para asegurar el éxito del proyecto.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}