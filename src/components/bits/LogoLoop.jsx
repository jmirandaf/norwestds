import { useEffect, useRef, useState } from 'react';
import './LogoLoop.css';

const LogoLoop = ({
  logos = [],
  speed = 50,
  direction = 'left',
  width = '100%',
  logoHeight = 28,
  gap = 32,
  hoverSpeed = 0,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = 'Partner logos',
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const speedRef = useRef(speed);

  const isVertical = direction === 'up' || direction === 'down';

  // Actualizar la velocidad sin reiniciar la animación
  useEffect(() => {
    speedRef.current = isHovered && hoverSpeed !== undefined ? hoverSpeed : speed;
  }, [isHovered, speed, hoverSpeed]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !logos.length) return;

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Usar la velocidad actual del ref
      const movement = speedRef.current * deltaTime;
      
      if (direction === 'left' || direction === 'up') {
        positionRef.current -= movement;
      } else {
        positionRef.current += movement;
      }

      // Aplicar transformación
      if (isVertical) {
        track.style.transform = `translateY(${positionRef.current}px)`;
      } else {
        track.style.transform = `translateX(${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, isVertical, logos.length]);

  const defaultRenderItem = (item, key) => {
    const content = typeof item === 'string' ? (
      <img
        src={item}
        alt=""
        style={{ height: `${logoHeight}px`, width: 'auto', objectFit: 'contain' }}
      />
    ) : (
      item
    );

    return (
      <div
        key={key}
        className={`logo-loop-item ${scaleOnHover ? 'scale-on-hover' : ''}`}
        style={{
          height: isVertical ? 'auto' : `${logoHeight}px`,
          [isVertical ? 'marginBottom' : 'marginRight']: `${gap}px`
        }}
      >
        {content}
      </div>
    );
  };

  const itemRenderer = renderItem || defaultRenderItem;

  // Crear suficientes copias para loop infinito (mínimo 50 copias para garantizar cobertura)
  const repeatedLogos = [];
  for (let i = 0; i < 50; i++) {
    repeatedLogos.push(...logos);
  }

  return (
    <div
      ref={containerRef}
      className={`logo-loop-container ${className}`}
      style={{
        width,
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
    >
      {fadeOut && (
        <>
          <div
            className="logo-loop-fade logo-loop-fade-start"
            style={{
              background: isVertical
                ? `linear-gradient(to bottom, ${fadeOutColor || 'rgba(255,255,255,1)'}, transparent)`
                : `linear-gradient(to right, ${fadeOutColor || 'rgba(255,255,255,1)'}, transparent)`
            }}
          />
          <div
            className="logo-loop-fade logo-loop-fade-end"
            style={{
              background: isVertical
                ? `linear-gradient(to top, ${fadeOutColor || 'rgba(255,255,255,1)'}, transparent)`
                : `linear-gradient(to left, ${fadeOutColor || 'rgba(255,255,255,1)'}, transparent)`
            }}
          />
        </>
      )}
      <div
        ref={trackRef}
        className="logo-loop-track"
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'center',
          willChange: 'transform'
        }}
      >
        {repeatedLogos.map((logo, index) => itemRenderer(logo, `logo-${index}`))}
      </div>
    </div>
  );
};

export default LogoLoop;
