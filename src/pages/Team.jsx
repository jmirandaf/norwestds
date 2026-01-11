import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';

export default function Team() {
  const { t } = useTranslation();
  
  useMeta({
    title: "Equipo | Norwest DS",
    description: "Conoce al equipo de Norwest Dynamic Systems",
    url: "https://norwestds.com/team"
  });

  const team = [
    {
      name: "Carlos Gonzalez",
      role: "Sales Engineer / PM",
      expertise: t('team.expertise1')
    },
    {
      name: "Sebastian Bandeliz",
      role: "Legal Affairs / PM",
      expertise: t('team.expertise2')
    },
    {
      name: "Elias Mejia",
      role: "Design Lead Engineer",
      expertise: t('team.expertise3')
    },
    {
      name: "Juan Miranda",
      role: "Control Lead Engineer",
      expertise: t('team.expertise4')
    }
  ];

  return (
    <PageLayout>
      <section className="container pad">
        <h1 className="section__title">{t('team.title')}</h1>
        <p className="section__lead">
          {t('team.lead')}
        </p>

        <div className="grid" style={{marginTop: 48, gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {team.map((member, i) => (
            <article className="card" key={i}>
              <h3 className="card__title">{member.name}</h3>
              <p style={{color: '#00A7E1', fontWeight: 600, marginBottom: 8}}>{member.role}</p>
              <p className="card__text">{member.expertise}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
