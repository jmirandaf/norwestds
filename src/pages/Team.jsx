import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';
import ChromaGrid from '../components/bits/ChromaGrid';

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
      handle: "cgonzalez",
      role: "Sales Engineer / PM",
      expertise: t('team.expertise1'),
      image: "https://i.pravatar.cc/300?img=12"
    },
    {
      name: "Sebastian Bandeliz",
      handle: "sbandeliz",
      role: "Legal Affairs / PM",
      expertise: t('team.expertise2'),
      image: "https://i.pravatar.cc/300?img=33"
    },
    {
      name: "Elias Mejia",
      handle: "emejia",
      role: "Design Lead Engineer",
      expertise: t('team.expertise3'),
      image: "https://i.pravatar.cc/300?img=68"
    },
    {
      name: "Juan Miranda",
      handle: "jmiranda",
      role: "Control Lead Engineer",
      expertise: t('team.expertise4'),
      image: "https://i.pravatar.cc/300?img=14"
    }
  ];

  return (
    <PageLayout>
      <section className="container pad">
        <h1 className="section__title">{t('team.title')}</h1>
        <p className="section__lead">
          {t('team.lead')}
        </p>

        <ChromaGrid 
          items={team}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </section>
    </PageLayout>
  );
}
