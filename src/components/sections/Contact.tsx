"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-40 bg-background relative z-10 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          <div>
            <SectionHeader
              label="07 / CONTACT"
              title="LET'S\nBUILD\nSOMETHING."
            />
          </div>

          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-secondary border border-border p-8 md:p-12 space-y-12 relative group hover:border-primary transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-xl">
                <div>
                  <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-4">EMAIL</h4>
                  <a href="mailto:hello@techtrack.college.edu" className="text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
                    hello@techtrack.college.edu
                  </a>
                </div>
                <div>
                  <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-4">INSTAGRAM</h4>
                  <a href="#" className="text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
                    @TECHTRACK
                  </a>
                </div>
                <div>
                  <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-4">LINKEDIN</h4>
                  <a href="#" className="text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
                    TechTrack Community
                  </a>
                </div>
                <div>
                  <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-4">LOCATION</h4>
                  <div className="text-muted-foreground">
                    College Name<br />
                    Campus Location
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-border">
                <a href="#" className="inline-flex items-center gap-4 text-3xl md:text-5xl font-display uppercase hover:text-primary transition-colors group/link">
                  COLLABORATE WITH US
                  <ArrowUpRight className="group-hover/link:translate-x-2 group-hover/link:-translate-y-2 transition-transform text-primary" size={40} />
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
