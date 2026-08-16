"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import LoadingScreen from "@/components/ui/LoadingScreen";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AboutModal from "@/components/sections/AboutModal";
import Marquee from "@/components/sections/Marquee";
import Events from "@/components/sections/Events";
import Achievements from "@/components/sections/Achievements";
import Team from "@/components/sections/Team";
import Culture from "@/components/sections/Culture";
import JoinCTA from "@/components/sections/JoinCTA";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Prevent scroll while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Navbar />
      
      <main className="flex min-h-screen flex-col bg-background">
        <Hero />
        <AboutModal />
        
        {/* Segue 1 */}
        <div className="py-20 flex justify-center items-center bg-background border-t border-border z-10 relative">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-muted-foreground opacity-30 text-center px-4">
            WHAT&apos;S HAPPENING?
          </h2>
        </div>
        
        <Marquee text="TECHTRACK • CREATE • COLLABORATE • INNOVATE • BUILD • LEARN" />
        
        <Events />

        {/* Segue 2 */}
        <div className="py-20 flex justify-center items-center bg-background border-t border-border z-10 relative">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-muted-foreground opacity-30 text-center px-4">
            AND THAT&apos;S NOT ALL.
          </h2>
        </div>

        <Achievements />

        {/* Segue 3 */}
        <div className="py-20 flex justify-center items-center bg-background border-t border-border z-10 relative">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-muted-foreground opacity-30 text-center px-4">
            NONE OF THIS HAPPENS ALONE.
          </h2>
        </div>

        <Team />

        {/* Segue 4 */}
        <div className="py-20 flex justify-center items-center bg-background border-t border-border z-10 relative">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-muted-foreground opacity-30 text-center px-4">
            THE MOMENTS BETWEEN THE MILESTONES.
          </h2>
        </div>

        <Culture />

        {/* Segue 5 */}
        <div className="py-20 flex justify-center items-center bg-background border-t border-border z-10 relative">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-muted-foreground opacity-30 text-center px-4">
            YOUR NAME COULD BE NEXT.
          </h2>
        </div>

        <JoinCTA />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}
