import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from 'next-themes';

interface RealityCanvasProps {
  children: React.ReactNode;
  intensity?: number;
  frequency?: 'ambient' | 'active' | 'intense';
  color?: string;
}

export const RealityCanvas: React.FC<RealityCanvasProps> = ({
  children,
  intensity = 0.5,
  frequency = 'ambient',
  color = 'possibility'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  const { theme } = useTheme();

  const colors = {
    possibility: theme === 'dark' ? '#66A3FF' : '#0055FF',
    dream: theme === 'dark' ? '#FF66A3' : '#FF0055',
    reality: theme === 'dark' ? '#A366FF' : '#5500FF'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = Math.floor(intensity * 1000);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3;
        this.color = colors[color as keyof typeof colors];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [intensity, frequency, color, theme]);

  return (
    <motion.div
      className="relative w-full h-[400px] rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: theme === 'dark' ? '#000' : '#fff' }}
      />
      <div className="relative z-10 p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default RealityCanvas; 