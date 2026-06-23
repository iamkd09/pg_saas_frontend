"use client";

import { motion } from "framer-motion";

const orbs = [
  {
    className:
      "left-[10%] top-[15%] size-64 bg-sky-400/20 blur-3xl",
    animate: { x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] },
    duration: 8,
  },
  {
    className:
      "right-[5%] top-[40%] size-72 bg-indigo-500/20 blur-3xl",
    animate: { x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] },
    duration: 10,
  },
  {
    className:
      "bottom-[10%] left-[30%] size-56 bg-violet-400/15 blur-3xl",
    animate: { x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.08, 1] },
    duration: 9,
  },
];

export function FloatingOrbs({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const opacity = variant === "dark" ? 1 : 0.6;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${orb.className}`}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
