import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LANGS = [
  { code: 'es', label: 'Español',  flag: '/mxflag.png', alt: 'MX' },
  { code: 'en', label: 'English',  flag: '/usaflag.png', alt: 'EN' },
  { code: 'zh', label: '中文',     flag: '/cnflag.svg',  alt: 'CN' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="language-selector">
      {LANGS.map(({ code, label, flag, alt }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`lang-button ${i18n.language === code ? 'active' : ''}`}
          aria-label={label}
          title={label}
        >
          {flag
            ? <img src={flag} alt={alt} className="flag-icon" />
            : <span className="flag-emoji">{alt}</span>
          }
        </button>
      ))}
    </div>
  );
}
