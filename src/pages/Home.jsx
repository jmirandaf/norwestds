import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';
import LogoLoop from '../components/bits/LogoLoop';

export default function Home() {
  const { t } = useTranslation();
  // Si usas el hook useMeta, descomenta:
   useMeta({
     title: "Norwest DS | Automatización a la medida",
     description: "Celdas robóticas, visión artificial, pick-and-place e integración industrial.",
     ogImage: "/og-default.jpg",
     url: "https://norwestds.com/"
   });

  const solutions = [
    { 
      title: t('home.solution1Title'),
      description: t('home.solution1Description'),
      features: [
        t('home.solution1Feature1'),
        t('home.solution1Feature2'),
        t('home.solution1Feature3'),
        t('home.solution1Feature4')
      ]
    },
    {
      title: t('home.solution2Title'),
      description: t('home.solution2Description'),
      features: [
        t('home.solution2Feature1'),
        t('home.solution2Feature2'),
        t('home.solution2Feature3'),
        t('home.solution2Feature4')
      ]
    }
  ];

  const specialties = [
    { title: t('home.specialty1Title'), items: [
      t('home.specialty1Item1'),
      t('home.specialty1Item2'),
      t('home.specialty1Item3'),
      t('home.specialty1Item4')
    ]},
    { title: t('home.specialty2Title'), items: [
      t('home.specialty2Item1'),
      t('home.specialty2Item2'),
      t('home.specialty2Item3'),
      t('home.specialty2Item4')
    ]},
    { title: t('home.specialty3Title'), items: [
      t('home.specialty3Item1'),
      t('home.specialty3Item2'),
      t('home.specialty3Item3'),
      t('home.specialty3Item4')
    ]},
    { title: t('home.specialty4Title'), items: [
      t('home.specialty4Item1'),
      t('home.specialty4Item2'),
      t('home.specialty4Item3'),
      t('home.specialty4Item4')
    ]}
  ];

  const stats = [
    { n: "100%", l: "Satisfacción del cliente" },
    { n: "50+", l: "Proyectos exitosos" },
    { n: "10+", l: "Años de experiencia" },
    { n: "24/7", l: "Soporte técnico" },
  ];

  return (
    <>
<PageLayout>
          {/* HERO (sin hero__bg) */}
      <section className="hero">
        <div className="container hero__content">
          <div className="hero__copy">
            <h1 className="hero__title">
              {t('home.heroTitle')} <span className="accent">{t('home.heroTitleAccent')}</span>
            </h1>
            <p className="hero__subtitle">
              {t('home.heroSubtitle')}
            </p>
            <div className="hero__actions">
              <a className="btn" href="/contact">{t('home.heroConsult')}</a>
              <a className="btn outline" href="/projects">{t('home.heroProjects')}</a>
            </div>
            <ul className="hero__bullets">
              <li>{t('home.heroBullet1')}</li>
              <li>{t('home.heroBullet2')}</li>
              <li>{t('home.heroBullet3')}</li>
            </ul>
          </div>

          <div className="hero__panel">
            <div className="panel">
              <p className="panel__label">{t('home.panelLabel')}</p>
              <ul className="panel__list">
                <li>{t('home.panelList1')}</li>
                <li>{t('home.panelList2')}</li>
                <li>{t('home.panelList3')}</li>
              </ul>
              <a className="btn block" href="/services">{t('home.panelServices')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="container section-block section-block--tight">
        <h2 className="section__title">{t('home.solutionsTitle')}</h2>
        <p className="section__lead">
          {t('home.solutionsLead')}
        </p>
        <div className="grid grid--wide section-grid-gap">
          {solutions.map((solution, i) => (
            <article className="card" key={i}>
              <h3 className="card__title">{solution.title}</h3>
              <p className="card__text">{solution.description}</p>
              <a href="/services" className="card__link">{t('home.learnMore')} →</a>
            </article>
          ))}
        </div>
      </section>

      {/* Especialidades */}
      <section className="container section-block">
        <h2 className="section__title">{t('home.specialtiesTitle')}</h2>
        <div className="grid grid--wide section-grid-gap section-grid-gap--sm">
          {specialties.map((specialty, i) => (
            <article className="card" key={i}>
              <h3 className="card__title">{specialty.title}</h3>
              <ul className="card__list">
                {specialty.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Métricas */}
      <section className="metrics">
        <div className="container metrics__row">
          {stats.map((s, i) => (
            <article className="metric" key={i}>
              <div className="metric__n">{s.n}</div>
              <div className="metric__l">{s.l}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="container section-block">
        <h2 className="section__title">{t('home.partnersTitle')}</h2>
        <p className="section__lead">{t('home.partnersLead')}</p>
        <div className="logo-loop-wrap">
          <LogoLoop
            logos={[
              '/partnersLogo/fanucLogo.png',
              '/partnersLogo/keyenceLogo.png',
              '/partnersLogo/cognexLogo.png',
              '/partnersLogo/omronLogo.png',
              '/partnersLogo/abbLogo.png',
              '/partnersLogo/yaskawaLogo.png',
              '/partnersLogo/kukaLogo.png',
              '/partnersLogo/mitsubishielectricLogo.png',
              '/partnersLogo/nachiLogo.png',
              '/partnersLogo/boschrexrothLogo.png',
              '/partnersLogo/festoLogo.png',
              '/partnersLogo/smcLogo.png',
              '/partnersLogo/medtronicLogo.png'
            ]}
            speed={50}
            direction="left"
            logoHeight={60}
            gap={80}
            hoverSpeed={0}
            fadeOut={true}
            fadeOutColor="rgba(255,255,255,1)"
            scaleOnHover={true}
            ariaLabel="Technology partners"
          />
        </div>
      </section>

      {/* Clientes */}
      <section className="container section-block">
        <h2 className="section__title">{t('home.clientsTitle')}</h2>
        <p className="section__lead">{t('home.clientsLead')}</p>
        <div className="logo-loop-wrap">
          <LogoLoop
            logos={[
              '/clientsLogo/jabilLogo.png',
              '/clientsLogo/strykerLogo.png',
              '/clientsLogo/napsLogo.png',
              '/clientsLogo/poseyLogo.png',
              '/clientsLogo/tenmaLogo.png'
            ]}
            speed={40}
            direction="left"
            logoHeight={60}
            gap={100}
            hoverSpeed={0}
            fadeOut={true}
            fadeOutColor="rgba(255,255,255,1)"
            scaleOnHover={true}
            ariaLabel="Our clients"
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta">
        <div className="container cta__row">
          <div>
            <h2 className="cta__title">{t('home.ctaTitle')}</h2>
            <p className="cta__text">{t('home.ctaText')}</p>
          </div>
          <div className="cta__actions">
            <a className="btn" href="/contact">{t('home.ctaConsult')}</a>
            <a className="btn outline" href="/projects">{t('home.ctaSuccess')}</a>
          </div>
        </div>
      </section>
    </PageLayout>
    </>
  );
}