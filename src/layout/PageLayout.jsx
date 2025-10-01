import LiquidEther from '../components/bits/LiquidEther';

export default function PageLayout({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <LiquidEther
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        mouseForce={15}
        cursorSize={80}
        isViscous={false}
        viscous={25}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.4}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.3}
        autoIntensity={1.5}
        takeoverDuration={0.4}
        autoResumeDelay={4000}
        autoRampDuration={0.8}
        style={{ 
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100vh',
          opacity: 0.7
        }}
      />
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