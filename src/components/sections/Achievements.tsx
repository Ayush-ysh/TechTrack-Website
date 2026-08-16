"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { achievements } from "@/data/events";

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 md:py-40 bg-background relative z-10 border-t border-border overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative">
        <SectionHeader
          label="03 / MILESTONES"
          title="WE DON'T JUST\nPARTICIPATE.\nWE LEAVE A MARK."
        />

        <div className="relative mt-20 max-w-5xl mx-auto">
          {/* Vertical line connecting milestones */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2" />

          <div className="space-y-12 md:space-y-24">
            {achievements.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex flex-col md:flex-row items-start ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Center Node */}
                <div className="absolute left-[24px] md:left-1/2 top-6 w-4 h-4 bg-primary -translate-x-1/2 rounded-full z-10 outline outline-4 outline-background" />

                {/* Content */}
                <div className="w-full md:w-1/2 pl-16 md:pl-0">
                  <div className={`flex flex-col ${i % 2 === 0 ? "md:pl-16" : "md:pr-16 md:text-right"}`}>
                    <div className="relative group">
                      <span className="absolute -top-12 -left-4 md:-top-16 md:left-auto md:-right-8 font-display text-[8rem] md:text-[12rem] text-border opacity-20 pointer-events-none group-hover:text-primary group-hover:opacity-10 transition-colors z-0">
                        {item.year}
                      </span>
                      <div className="relative z-10 bg-secondary border border-border p-8 hover:border-primary transition-colors">
                        <div className="font-mono text-primary text-xl mb-4">{item.year}</div>
                        <h3 className="font-display text-4xl md:text-5xl uppercase mb-4">{item.title}</h3>
                        <p className="font-sans text-muted-foreground text-lg">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
