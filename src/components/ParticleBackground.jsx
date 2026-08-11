import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const colors = [
      'rgba(232, 197, 200, 0.45)', // --accent-blush at low opacity
      'rgba(195, 139, 144, 0.35)', // --accent-blush-dark
      'rgba(197, 160, 89, 0.3)',   // --accent-gold
      'rgba(244, 234, 212, 0.6)',  // --accent-gold-light
    ];

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 8 + 3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.5 - 0.1; // Float upwards
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.type = Math.random() > 0.4 ? 'circle' : 'heart';
        this.opacity = Math.random() * 0.6 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      }

      update() {
        if (prefersReducedMotion) return; // Do not move if reduced motion is on

        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around screen
        if (this.y < -20) {
          this.y = canvas.height + 20;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < -20) {
          this.x = canvas.width + 20;
        } else if (this.x > canvas.width + 20) {
          this.x = -20;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        if (this.type === 'heart') {
          // Draw heart path
          ctx.beginPath();
          const d = this.size;
          ctx.moveTo(0, -d / 4);
          ctx.bezierCurveTo(-d / 2, -d, -d, -d / 2, -d, 0);
          ctx.bezierCurveTo(-d, d / 2, -d / 4, d * 0.9, 0, d * 1.3);
          ctx.bezierCurveTo(d / 4, d * 0.9, d, d / 2, d, 0);
          ctx.bezierCurveTo(d, -d / 2, d / 2, -d, 0, -d / 4);
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const initParticles = () => {
      // Scale particle density with screen size
      const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 30000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    if (prefersReducedMotion) {
      // Just draw static particles once
      particles.forEach((p) => p.draw());
    } else {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

export default ParticleBackground;
