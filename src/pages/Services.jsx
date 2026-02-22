import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useMeta from "../hooks/useMeta";

import PageLayout from '../layout/PageLayout';

function Metric({ value, label }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.24)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{label}</div>
        </div>
    );
}

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

                <div
                    className="card"
                    style={{
                        marginBottom: '24px',
                        border: '1px solid rgba(0, 167, 225, 0.45)',
                        background: 'linear-gradient(135deg, rgba(0,76,113,0.97), rgba(0,167,225,0.9))',
                        color: '#fff',
                        boxShadow: '0 16px 36px rgba(0, 76, 113, 0.24)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: 13, letterSpacing: '0.08em', opacity: 0.9, textTransform: 'uppercase' }}>🚀 Product Suite</div>
                            <h2 style={{ marginTop: 6, marginBottom: 8, color: '#fff' }}>{t('services.designProTitle')}</h2>
                            <p style={{ fontSize: '1.05rem', opacity: 0.97, maxWidth: 760 }}>{t('services.designProValue')}</p>
                        </div>
                    </div>

                    <ul style={{ marginTop: 12, marginBottom: 14 }}>
                        <li>{t('services.designProBenefit1')}</li>
                        <li>{t('services.designProBenefit2')}</li>
                        <li>{t('services.designProBenefit3')}</li>
                    </ul>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginTop: 10 }}>
                        <Metric value={t('services.designProMetric1Value')} label={t('services.designProMetric1Label')} />
                        <Metric value={t('services.designProMetric2Value')} label={t('services.designProMetric2Label')} />
                        <Metric value={t('services.designProMetric3Value')} label={t('services.designProMetric3Label')} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                        <Link to="/contact" className="btn btn-primary">{t('services.designProCtaDemo')}</Link>
                        <Link to="/portal/designpro" className="btn" style={{ borderColor: '#fff', color: '#fff' }}>{t('services.designProCtaPortal')}</Link>
                    </div>
                </div>

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