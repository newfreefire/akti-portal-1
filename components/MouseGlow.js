"use client";
import { useEffect, useState } from "react";

export default function MouseGlow({ radius = 250 }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setTarget({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);

    let animation;
    const animate = () => {
      // "lerp" the position → smooth follow effect
      setPos((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.1, // control speed (0.05 slower, 0.2 faster)
        y: prev.y + (target.y - prev.y) * 0.1,
      }));
      animation = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(animation);
    };
  }, [target]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: `radial-gradient(circle ${radius}px at ${pos.x}px ${pos.y}px, #3b82f6 0%, #9333ea 30%, transparent 70%)`,
        opacity: 0.1,
      }}
    ></div>
  );
}
