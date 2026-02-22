import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ChromaGrid.css';

const ChromaGrid = ({
  items = [],
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const gridRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.chroma-card');

    const handleMouseMove = (e) => {
      const rect = grid.getBoundingClientRect();
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardX = cardRect.left + cardRect.width / 2 - rect.left;
        const cardY = cardRect.top + cardRect.height / 2 - rect.top;

        const distance = Math.sqrt(
          Math.pow(targetRef.current.x - cardX, 2) + 
          Math.pow(targetRef.current.y - cardY, 2)
        );

        const spotlight = card.querySelector('.chroma-spotlight');
        
        if (distance < radius) {
          const intensity = 1 - distance / radius;
          const x = targetRef.current.x - cardX;
          const y = targetRef.current.y - cardY;
          
          gsap.to(spotlight, {
            opacity: intensity * 0.3,
            x: x,
            y: y,
            duration: damping,
            ease: ease
          });
        } else {
          gsap.to(spotlight, {
            opacity: 0,
            duration: fadeOut,
            ease: ease
          });
        }
      });
    };

    const handleMouseLeave = () => {
      cards.forEach((card) => {
        const spotlight = card.querySelector('.chroma-spotlight');
        gsap.to(spotlight, {
          opacity: 0,
          duration: fadeOut,
          ease: ease
        });
      });
    };

    grid.addEventListener('mousemove', handleMouseMove);
    grid.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      grid.removeEventListener('mousemove', handleMouseMove);
      grid.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [items.length, radius, damping, fadeOut, ease]);

  return (
    <div ref={gridRef} className={`chroma-grid ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="chroma-card">
          <div className="chroma-spotlight" />
          <div className="chroma-content">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name} 
                className="chroma-avatar"
              />
            )}
            <h3 className="chroma-name">{item.name}</h3>
            {item.handle && (
              <p className="chroma-handle">@{item.handle}</p>
            )}
            <p className="chroma-role">{item.role}</p>
            {item.expertise && (
              <p className="chroma-expertise">{item.expertise}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChromaGrid;
