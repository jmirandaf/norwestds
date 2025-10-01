import { useState, useEffect } from 'react';

export default function MouseTracker({ onMouseMove }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const newPosition = {
        x: event.clientX,
        y: event.clientY
      };
      setPosition(newPosition);
      if (onMouseMove) {
        onMouseMove(newPosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onMouseMove]);

  return null;
}