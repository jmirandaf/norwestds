import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta'

import PageLayout from '../layout/PageLayout';

export default function Projects() {
  const { t } = useTranslation();
  useMeta({
    title: "Proyectos | Norwest DS",
    description: "Casos reales de integración y automatización.",
    url: "https://norwestds.com/projects"
  })

  const projects = [
    {
      title: "Celda Robótica Pick & Place",
      client: "Automotriz Tier 1",
      description: "Implementación de celda robotizada con visión artificial para clasificación y empaque de componentes automotrices.",
      tech: ["Robot Fanuc", "Visión Cognex", "PLC Allen Bradley", "HMI FactoryTalk"],
      results: ["Incremento de 40% en productividad", "Reducción de errores a <0.1%", "ROI en 18 meses"]
    },
    {
      title: "Sistema de Trazabilidad",
      client: "Industria Médica",
      description: "Sistema de trazabilidad con múltiples estaciones de escaneo y base de datos centralizada para dispositivos médicos.",
      tech: ["Escáneres Keyence", "SQL Server", "Web API .NET", "HMI web-based"],
      results: ["100% trazabilidad de producto", "Cumplimiento FDA CFR 21", "Reducción tiempo de auditoría 60%"]
    },
    {
      title: "Modernización Línea de Ensamble",
      client: "Manufactura Electrónica",
      description: "Actualización de línea de ensamble existente con nuevos controles y sistema de monitoreo en tiempo real.",
      tech: ["PLC Siemens S7", "SCADA Ignition", "OPC UA", "Azure IoT"],
      results: ["OEE mejorado de 65% a 85%", "Reducción downtime 45%", "Dashboards en tiempo real"]
    },
    {
      title: "Control de Calidad Automatizado",
      client: "Industria Alimenticia",
      description: "Sistema de inspección automática con múltiples cámaras para control de calidad en línea de empaque.",
      tech: ["Visión SICK", "PLC Omron", "Conveyor Intralox", "HMI NB Series"],
      results: ["Detección defectos 99.9%", "Velocidad 120 ppm", "Reducción personal QA 75%"]
    },
  ];

  return (
    <PageLayout>
      <section className="container pad">
        <h1 className="section__title">Proyectos Destacados</h1>
        <p className="section__lead">
          Conoce algunos de nuestros casos de éxito en implementación de soluciones de automatización.
        </p>

        <div style={{marginTop: 48}}>
          {projects.map((project, i) => (
            <div 
              key={i}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              <h2 style={{margin: '0 0 8px', color: 'var(--brand)'}}>{project.title}</h2>
              <p style={{margin: '0 0 24px', opacity: 0.7}}>{project.client}</p>
              
              <p style={{fontSize: '1.1rem', marginBottom: '24px'}}>{project.description}</p>
              
              <div style={{marginBottom: '24px'}}>
                <h3 style={{margin: '0 0 16px', fontSize: '1.1rem'}}>Tecnologías Implementadas</h3>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  {project.tech.map((tech, j) => (
                    <span 
                      key={j}
                      style={{
                        background: 'var(--brand-ink)',
                        color: 'var(--brand)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{margin: '0 0 16px', fontSize: '1.1rem'}}>Resultados Clave</h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gap: '8px'
                }}>
                  {project.results.map((result, k) => (
                    <li key={k} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{color: 'var(--brand)'}}>✓</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          style={{
            background: 'var(--brand-ink)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            marginTop: '64px'
          }}
        >
          <h2 style={{margin: '0 0 16px'}}>¿Listo para tu Próximo Proyecto?</h2>
          <p style={{margin: '0 0 24px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto'}}>
            Permítenos ayudarte a llevar tu operación al siguiente nivel con soluciones de automatización personalizadas.
          </p>
          <a href="/contact" className="btn">Contactar Ahora</a>
        </div>
      </section>
    </PageLayout>
  )
}