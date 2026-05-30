import React, { useEffect, useRef, useState } from "react";

export function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const restingGridRef = useRef<HTMLDivElement>(null);
  const maskedGridRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Find parent element to listen to mouse moves
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (maskedGridRef.current) {
        maskedGridRef.current.style.setProperty("--mouse-x", `${x}px`);
        maskedGridRef.current.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Grid Translation Animation Loop
    let animFrameRef: number;
    let offsetX = 0;
    let offsetY = 0;

    const tick = () => {
      offsetX = (offsetX + 0.5) % 40;
      offsetY = (offsetY + 0.5) % 40;

      if (restingGridRef.current) {
        restingGridRef.current.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
      }
      if (maskedGridRef.current) {
        maskedGridRef.current.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
      }

      animFrameRef = requestAnimationFrame(tick);
    };

    animFrameRef = requestAnimationFrame(tick);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameRef);
    };
  }, []);

  const svgUrl = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><path d='M 40 0 L 0 0 0 40' fill='none' stroke='%23898E90' stroke-width='0.75'/></svg>")`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Background Accent Glows */}
      {/* Top-Right Orange glow */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none mix-blend-screen opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(121, 118, 123, 0.1) 60%, transparent 100%)",
          filter: "blur(120px)",
        }}
      />
      {/* Bottom-Left subtle deep workspace glow */}
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none mix-blend-screen opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(121, 118, 123, 0.25) 0%, rgba(33, 33, 36, 0.6) 70%, transparent 100%)",
          filter: "blur(120px)",
        }}
      />

      {/* 1. Resting faint grid layer (5% opacity) */}
      <div
        ref={restingGridRef}
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: svgUrl,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 2. Illuminated hover mask layer (40% opacity) */}
      <div
        ref={maskedGridRef}
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          backgroundImage: svgUrl,
          backgroundSize: "40px 40px",
          opacity: isHovered ? 0.40 : 0,
          maskImage: "radial-gradient(300px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskImage: "radial-gradient(300px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)",
        }}
      />
    </div>
  );
}
