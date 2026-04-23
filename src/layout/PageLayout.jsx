export default function PageLayout({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
