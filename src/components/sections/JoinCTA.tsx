"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function JoinCTA() {
  return (
    <section id="join" className="bg-primary text-primary-foreground py-32 md:py-48 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute -top-20 -right-20 w-96 h-96 border-[40px] border-background/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] border-[60px] border-background/5 rounded-full blur-2xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="font-mono text-background font-bold text-sm md:text-base uppercase tracking-[0.2em] mb-8">
            RECRUITMENT IS OPEN
          </div>
          
          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-12">
            THINK YOU<br />
            BELONG HERE?
          </h2>

          <p className="font-sans text-xl md:text-3xl max-w-4xl mx-auto leading-relaxed mb-16 font-medium">
            Whether you&apos;re a developer, designer, filmmaker, strategist, organizer or simply someone who loves building things —
            <br /><br />
            <span className="font-bold border-b-4 border-background pb-2">there&apos;s a place for you at TechTrack.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="#"
              className="group flex items-center justify-center gap-4 bg-background text-foreground px-10 py-6 font-display text-3xl md:text-4xl hover:bg-transparent hover:text-background border-4 border-background transition-all w-full sm:w-auto"
            >
              JOIN TECHTRACK
              <ArrowUpRight className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" size={40} />
            </Link>
            
            <Link 
              href="#team"
              className="group flex items-center justify-center gap-2 bg-transparent text-background px-10 py-6 font-display text-2xl md:text-3xl border-4 border-background hover:bg-background hover:text-foreground transition-all w-full sm:w-auto"
            >
              EXPLORE TEAMS
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
