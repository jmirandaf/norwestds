import LanguageSelector from '../components/LanguageSelector';

export default function PageLayout({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <LanguageSelector />
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  );
}