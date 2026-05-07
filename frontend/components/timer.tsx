import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface TimerProps {
  initialMinutes: number;
  onComplete?: () => void;
}

export function Timer({ initialMinutes, onComplete }: TimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setSeconds(initialMinutes * 60);
    setIsRunning(false);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            toast({
              title: "¡Tiempo terminado!",
              description: "Tu temporizador ha finalizado",
              variant: "default",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, onComplete, toast]);

  const progress = (seconds / (initialMinutes * 60)) * 100;

  return (
    <Card className="p-4">
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              className="text-muted stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            <motion.circle
              className="text-primary stroke-current"
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              initial={false}
              animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{formatTime(seconds)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            variant={isRunning ? "destructive" : "default"}
            onClick={toggleTimer}
          >
            {isRunning ? "Pausar" : "Iniciar"}
          </Button>
          <Button variant="outline" onClick={resetTimer}>
            Reiniciar
          </Button>
        </div>
      </div>
    </Card>
  );
}
