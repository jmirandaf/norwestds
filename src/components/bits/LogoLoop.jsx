import { useEffect, useRef, useState } from 'react';
import './LogoLoop.css';

const LogoLoop = ({
  logos = [],
  speed = 120,
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
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef(null);
  const positionRef = useRef(0);

  const isVertical = direction === 'up' || direction === 'down';
  const currentSpeed = isHovered && hoverSpeed !== undefined ? hoverSpeed : speed;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const track = container.querySelector('.logo-loop-track');
    if (!track || !logos.length) return;

    // Espera a que el DOM esté listo
    let animationStarted = false;
    let lastTime = performance.now();

    const startAnimation = () => {
      if (animationStarted) return;
      
      const items = track.children;
      if (items.length === 0) return;
      
      const itemsPerSet = logos.length;
      let singleSetSize = 0;
      
      // Calcula el tamaño de un set completo
      for (let i = 0; i < itemsPerSet; i++) {
        const item = items[i];
        if (item) {
          singleSetSize += isVertical ? item.offsetHeight : item.offsetWidth;
          singleSetSize += gap;
        }
      }

      if (singleSetSize === 0) {
        requestAnimationFrame(startAnimation);
        return;
      }

      animationStarted = true;

      const animate = (currentTime) => {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        let movement = currentSpeed * deltaTime;
        
        if (direction === 'right' || direction === 'down') {
          movement = -movement;
        }

        positionRef.current += movement;

        // Reset seamless: cuando llega al final del primer set, vuelve a 0
        if (direction === 'left' || direction === 'up') {
          if (positionRef.current <= -singleSetSize) {
            positionRef.current += singleSetSize;
          }
        } else {
          if (positionRef.current >= singleSetSize) {
            positionRef.current -= singleSetSize;
          }
        }

        if (isVertical) {
          track.style.transform = `translateY(${positionRef.current}px)`;
        } else {
          track.style.transform = `translateX(${positionRef.current}px)`;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Inicia la animación cuando el DOM esté listo
    requestAnimationFrame(startAnimation);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentSpeed, direction, isVertical, logos.length, gap]);

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

  // Triplicar los logos para asegurar loop seamless
  const duplicatedLogos = [...logos, ...logos, ...logos];

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
        className="logo-loop-track"
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'center',
          willChange: 'transform'
        }}
      >
        {duplicatedLogos.map((logo, index) => itemRenderer(logo, `logo-${index}`))}
      </div>
    </div>
  );
};

export default LogoLoop;
