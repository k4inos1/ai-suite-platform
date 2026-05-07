import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";

const foodEmojis = [
  "🥕",
  "🍅",
  "🥑",
  "🍎",
  "🥦",
  "🍗",
  "🥩",
  "🍝",
  "🌮",
  "🍕",
  "🥪",
  "🥗",
];

export function BackgroundEffects() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Particles
        init={particlesInit}
        options={{
          particles: {
            number: {
              value: 15,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#000000",
            },
            shape: {
              type: "char",
              character: {
                value: foodEmojis,
                font: "Segoe UI Emoji",
                style: "",
                weight: "400",
              },
            },
            opacity: {
              value: 0.3,
              random: true,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false,
              },
            },
            size: {
              value: 20,
              random: true,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 15,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: true,
              straight: false,
              outModes: {
                default: "bounce",
              },
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          retina_detect: true,
          background: {
            color: "transparent",
          },
        }}
      />

      {/* Gradiente animado en el fondo */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-pulse" />
    </div>
  );
}
