import { useEffect, useState } from 'react';

interface RippleEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export default function RippleEffect({ x, y, onComplete }: RippleEffectProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  useEffect(() => {
    // Create multiple ripples for a more liquified effect
    const newRipples = [
      { id: 1, x, y },
      { id: 2, x: x + 20, y: y + 20 },
      { id: 3, x: x - 20, y: y - 20 },
    ];
    setRipples(newRipples);

    const timer = setTimeout(() => {
      setRipples([]);
      if (onComplete) {
        onComplete();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [x, y, onComplete]);

  if (ripples.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ripples.map((ripple, index) => (
        <div key={ripple.id}>
          <div
            className="ripple-effect"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
              animationDelay: `${index * 0.1}s`,
            }}
          />
          <div
            className="ripple-wave"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
              animationDelay: `${index * 0.15}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

