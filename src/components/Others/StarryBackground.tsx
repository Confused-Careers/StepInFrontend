import React, { useEffect, useRef } from "react";

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    interface Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      brightness: number;
    }

    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5, 
      speedX: (Math.random() - 0.5) * 0.1, 
      speedY: (Math.random() - 0.5) * 0.1, 
      brightness: 0.3 + Math.random() * 0.7, 
    }));
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4
      );
      gradient1.addColorStop(0, 'rgba(75, 0, 130, 0.03)'); 
      gradient1.addColorStop(1, 'rgba(75, 0, 130, 0)');
      
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.3
      );
      gradient2.addColorStop(0, 'rgba(0, 0, 128, 0.02)'); 
      gradient2.addColorStop(1, 'rgba(0, 0, 128, 0)');
      
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
  
        star.x += star.speedX;
        star.y += star.speedY;
        
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        
        const twinkle = 0.85 + Math.sin(Date.now() * 0.001 * Math.random()) * 0.15;
        const alpha = star.brightness * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
     
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-gradient-to-r from-primary/10 to-primary/0 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/3 -right-64 w-96 h-96 bg-gradient-to-l from-primary/10 to-primary/0 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "3s", animationDuration: "8s" }}
      />
    </div>
  );
};

export default StarryBackground;