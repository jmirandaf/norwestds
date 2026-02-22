import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-selector">
      <button
        onClick={() => changeLanguage('en')}
        className={`lang-button ${i18n.language === 'en' ? 'active' : ''}`}
        aria-label="Switch to English"
        title="English"
      >
        <img src="/usaflag.png" alt="USA" className="flag-icon" />
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`lang-button ${i18n.language === 'es' ? 'active' : ''}`}
        aria-label="Cambiar a Español"
        title="Español"
      >
        <img src="/mxflag.png" alt="México" className="flag-icon" />
      </button>
    </div>
  );
}
