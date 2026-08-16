"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const textSequence = [
  "INITIALIZING",
  "IDEAS",
  "PEOPLE",
  "TECHNOLOGY",
  "CREATIVITY",
  "READY."
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < textSequence.length - 1) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 400); // Fast sequence
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 600); // Wait briefly on "READY." before finishing
      return () => clearTimeout(timer);
    }
  }, [index, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute top-12 left-12 font-display text-2xl">
        TECHTRACK <span className="text-primary">;</span>
      </div>
      
      <div className="h-20 overflow-hidden relative flex items-center justify-center w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`font-display text-5xl md:text-7xl uppercase tracking-widest ${
              index === textSequence.length - 1 ? "text-primary" : "text-foreground"
            }`}
          >
            {textSequence[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
