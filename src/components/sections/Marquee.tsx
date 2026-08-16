"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  text: string;
}

export default function Marquee({ text }: MarqueeProps) {
  return (
    <div className="bg-primary py-4 md:py-6 overflow-hidden flex whitespace-nowrap border-y-2 border-border">
      <motion.div
        className="flex gap-4 font-display text-4xl md:text-6xl text-background uppercase tracking-wider"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15,
        }}
      >
        {/* Repeat the text twice to create a seamless loop */}
        <div className="flex gap-4 pr-4">
          {text} • {text} • {text} • {text} •
        </div>
        <div className="flex gap-4 pr-4">
          {text} • {text} • {text} • {text} •
        </div>
      </motion.div>
    </div>
  );
}
