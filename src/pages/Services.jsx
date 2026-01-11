import { useTranslation } from 'react-i18next';
import useMeta from "../hooks/useMeta";

import PageLayout from '../layout/PageLayout';

export default function Services() {
    const { t } = useTranslation();
    useMeta({
        title: "Services - Norwest",
        description: "Explore the range of services offered by Norwest, including construction management, design-build, general contracting, and pre-construction consulting.",
        url: "https://norwestds.com/services",
    });


    const items = [
        { title: t('services.service1'), desc: t('services.service1Desc') },
        { title: t('services.service2'), desc: t('services.service2Desc') },
        { title: t('services.service3'), desc: t('services.service3Desc') },
        { title: t('services.service4'), desc: t('services.service4Desc') },
        { title: t('services.service5'), desc: t('services.service5Desc') },
        { title: t('services.service6'), desc: t('services.service6Desc') },
        { title: t('services.service7'), desc: t('services.service7Desc') },
        { title: t('services.service8'), desc: t('services.service8Desc') },
    ]; 

    return (
        <PageLayout>
            <section className="container pad">
                <h1>{t('services.title')}</h1>
                <div className="grid">
                    {items.map((x,i)=>(
                    <div className="card" key={i}>
                        <h3>{x.title}</h3>
                        <p>{x.desc}</p>
                    </div>
                    ))}
                </div>
            </section>
        </PageLayout>
    );
}