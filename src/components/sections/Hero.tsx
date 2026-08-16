"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background Text */}
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden opacity-10 pointer-events-none select-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="whitespace-nowrap font-display text-[12vw] leading-none text-transparent text-stroke"
            initial={{ x: i % 2 === 0 ? "0%" : "-50%" }}
            animate={{ x: i % 2 === 0 ? "-50%" : "0%" }}
            transition={{
              duration: 50 + i * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            BUILD • BREAK • LEARN • CREATE • REPEAT • BUILD • BREAK • LEARN • CREATE • REPEAT
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 mt-10">
        
        {/* Main Content */}
        <div className="flex-1 w-full text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-mono text-primary mb-4 tracking-[0.2em] text-sm md:text-base uppercase">
              Student Technology Community
            </p>
            <h1 className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-[0.85] tracking-tight mb-8">
              TECH<br />
              <span className="text-primary">TRACK</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto lg:mx-0 space-y-6"
          >
            <p className="text-2xl md:text-4xl font-sans font-medium text-foreground">
              We build. We experiment. We compete. We create.
            </p>
            <p className="text-xl md:text-2xl font-sans text-muted-foreground">
              A community where ideas move beyond the classroom.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 justify-center lg:justify-start">
              <Link 
                href="#events" 
                className="group flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-bold text-lg border-2 border-primary hover:bg-transparent hover:text-primary transition-colors w-full sm:w-auto justify-center"
              >
                EXPLORE EVENTS
                <ArrowDownRight className="group-hover:translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#team" 
                className="group flex items-center gap-3 bg-transparent text-foreground px-8 py-4 font-bold text-lg border-2 border-foreground hover:bg-foreground hover:text-background transition-colors w-full sm:w-auto justify-center"
              >
                MEET THE TEAM
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <div className="pt-12 font-mono text-xs md:text-sm text-muted-foreground flex items-center gap-4 justify-center lg:justify-start uppercase tracking-widest">
              <span>EST. 2024</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>CAMPUS LOCATION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>INDIA</span>
            </div>
          </motion.div>
        </div>
        
        {/* Image Collage / Abstract Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="hidden lg:block relative w-[450px] h-[600px]"
        >
          {/* Main big image */}
          <div className="absolute inset-0 bg-secondary grayscale hover:grayscale-0 transition-all duration-700 ease-in-out border border-border overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Students collaborating"
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
            />
          </div>
          
          {/* Floating accent images */}
          <div className="absolute -left-12 bottom-12 w-48 h-64 bg-background border border-border p-2">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
              alt="Coding"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary flex items-center justify-center p-6 text-primary-foreground font-display text-4xl text-center leading-none rotate-12">
            BUILD
            <br />
            NOW.
          </div>
        </motion.div>
      </div>

      {/* Custom Cursor follower */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-primary mix-blend-difference pointer-events-none z-[100] hidden lg:block"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
    </section>
  );
}
