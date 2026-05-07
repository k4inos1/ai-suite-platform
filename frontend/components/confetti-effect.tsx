import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

interface ConfettiEffectProps {
  active: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ active, onComplete }: ConfettiEffectProps) {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (active) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!isActive) return null;

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      colors={[
        "#FF6B6B", // rojo suave
        "#4ECDC4", // turquesa
        "#FFD93D", // amarillo
        "#95E1D3", // menta
        "#FF8E8E", // coral
      ]}
    />
  );
}
