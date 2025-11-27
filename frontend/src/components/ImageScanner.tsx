import { useEffect, useState } from 'react';

interface ImageScannerProps {
  imageUrl: string;
  onComplete?: () => void;
}

export const ImageScanner = ({ imageUrl, onComplete }: ImageScannerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula il progresso dell'analisi AI
    const duration = 8000; // 9 secondi totali
    const interval = 50; // Aggiorna ogni 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 200);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      {/* Immagine */}
      <img
        src={imageUrl}
        alt="Food being analyzed"
        className="w-full h-full object-cover"
      />

      {/* Overlay scuro */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Effetto Scanner - Barra luminosa che scorre */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-primary/80 to-transparent"
        style={{
          width: '20%',
          transform: `translateX(${(progress / 100) * 500}%)`,
          transition: 'transform 50ms linear',
          boxShadow: '0 0 30px 10px hsl(var(--primary))',
          filter: 'blur(8px)',
        }}
      />

      {/* Griglia di scansione */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 25%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 26%, transparent 27%, transparent 74%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 75%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 25%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 26%, transparent 27%, transparent 74%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 75%, rgba(var(--primary-rgb, 147, 51, 234), 0.3) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Percentuale e testo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center space-y-2 z-10">
          <div className="text-6xl font-bold text-white drop-shadow-lg">
            {Math.round(progress)}%
          </div>
          <div className="text-sm font-medium text-white/90 drop-shadow-md">
            Analisi in corso...
          </div>
          <div className="text-xs text-white/70">
            Riconoscimento ingredienti e calorie
          </div>
        </div>
      </div>

      {/* Barra di progresso in basso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bordo luminoso animato */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: `inset 0 0 20px hsl(var(--primary))`,
          opacity: 0.5 + (progress / 200),
        }}
      />
    </div>
  );
};
