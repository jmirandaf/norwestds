import { useTranslation } from 'react-i18next';
import useMeta from '../hooks/useMeta';
import PageLayout from '../layout/PageLayout';

export default function TrainingCenter() {
  const { t } = useTranslation();
  
  useMeta({
    title: "NDS Training Center | Norwest DS",
    description: "Centro de capacitación en automatización industrial",
    url: "https://norwestds.com/training"
  });

  return (
    <PageLayout>
      <section className="container pad">
        <h1 className="section__title">{t('training.title')}</h1>
        <p className="section__lead">
          {t('training.lead')}
        </p>

        <div className="grid" style={{marginTop: 48, gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
          <article className="card">
            <h3 className="card__title">{t('training.course1')}</h3>
            <p className="card__text">{t('training.course1Desc')}</p>
          </article>
          <article className="card">
            <h3 className="card__title">{t('training.course2')}</h3>
            <p className="card__text">{t('training.course2Desc')}</p>
          </article>
          <article className="card">
            <h3 className="card__title">{t('training.course3')}</h3>
            <p className="card__text">{t('training.course3Desc')}</p>
          </article>
          <article className="card">
            <h3 className="card__title">{t('training.course4')}</h3>
            <p className="card__text">{t('training.course4Desc')}</p>
          </article>
          <article className="card" style={{opacity: 0.7, position: 'relative'}}>
            <span style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#00A7E1',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {t('training.comingSoon')}
            </span>
            <h3 className="card__title">{t('training.course5')}</h3>
            <p className="card__text">{t('training.course5Desc')}</p>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
