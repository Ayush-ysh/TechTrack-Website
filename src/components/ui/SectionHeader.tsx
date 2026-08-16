"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export default function SectionHeader({ label, title, subtitle, align = "left" }: SectionHeaderProps) {
  const alignClass = 
    align === "center" ? "text-center items-center" : 
    align === "right" ? "text-right items-end" : 
    "text-left items-start";

  const lines = title.split("\n");

  return (
    <div className={`flex flex-col mb-16 md:mb-24 ${alignClass}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="font-mono text-primary text-sm md:text-base uppercase tracking-[0.2em] mb-6 flex items-center gap-4"
      >
        {align === "right" && <span className="w-12 h-[1px] bg-primary"></span>}
        {label}
        {align !== "right" && <span className="w-12 h-[1px] bg-primary"></span>}
      </motion.div>

      <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="overflow-hidden"
          >
            {line}
          </motion.div>
        ))}
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
