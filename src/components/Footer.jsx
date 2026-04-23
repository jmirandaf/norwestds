import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '/logo.png';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="ns-footer">
      <div className="ns-footer-inner">
        <div className="ns-footer-grid">
          <div className="ns-footer-brand">
            <img src={logo} alt="Norwest Dynamic Systems" />
            <p>{t('footer.tagline')}</p>
          </div>

          <div>
            <h4>{t('footer.company')}</h4>
            <ul>
              <li><Link to="/about">{t('footer.about')}</Link></li>
              <li><Link to="/team">{t('footer.team')}</Link></li>
              <li><Link to="/contact">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t('footer.solutions')}</h4>
            <ul>
              <li><Link to="/services">{t('footer.services')}</Link></li>
              <li><Link to="/projects">{t('footer.projects')}</Link></li>
              <li><Link to="/training">{t('footer.training')}</Link></li>
              <li><Link to="/portal/designpro">{t('footer.designPro')}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t('footer.contactTitle')}</h4>
            <ul>
              <li><a href="tel:+526646853430">{t('footer.phone')}</a></li>
              <li><a href="mailto:ventas@norwestds.com">{t('footer.email')}</a></li>
              <li>{t('footer.location')}</li>
            </ul>
          </div>
        </div>

        <div className="ns-footer-bottom">
          <span>© {year} Norwest Dynamic Systems — {t('footer.rights')}</span>
          <span>
            <Link to="/contact">{t('footer.privacy')}</Link>
            {' · '}
            <Link to="/contact">{t('footer.terms')}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
