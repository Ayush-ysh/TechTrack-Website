"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-background border border-border px-6 py-4 flex items-center gap-3 font-mono text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        WHAT IS TECHTRACK? <Plus size={18} />
      </motion.button>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-background text-foreground overflow-y-auto"
          >
            <div className="min-h-screen p-6 md:p-12 lg:p-24 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 md:top-12 md:right-12 p-4 bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors z-10"
              >
                <X size={32} />
              </button>

              <div className="max-w-6xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] mb-12"
                >
                  WE ARE<br />
                  <span className="text-primary text-stroke-primary">TECHTRACK.</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-sans text-xl md:text-2xl text-muted-foreground space-y-6"
                  >
                    <p>
                      TechTrack is a student-driven technology community focused on experimentation, innovation, collaboration and learning beyond the classroom.
                    </p>
                    <p>
                      We bring together students interested in technology, development, design, media, management and creative problem solving.
                    </p>
                  </motion.div>

                  <div className="space-y-16">
                    <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="grid grid-cols-2 gap-8"
                    >
                      <div>
                        <div className="font-display text-5xl md:text-6xl text-primary">20+</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground mt-2">EVENTS</div>
                      </div>
                      <div>
                        <div className="font-display text-5xl md:text-6xl text-primary">1000+</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground mt-2">PARTICIPANTS</div>
                      </div>
                      <div>
                        <div className="font-display text-5xl md:text-6xl text-primary">50+</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground mt-2">PROJECTS</div>
                      </div>
                      <div>
                        <div className="font-display text-5xl md:text-6xl text-primary">10+</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground mt-2">ACHIEVEMENTS</div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-12"
                    >
                      <div>
                        <h3 className="font-mono text-primary text-sm uppercase tracking-widest mb-4">OUR MISSION</h3>
                        <p className="font-sans text-lg">
                          Create an environment where students can explore technology, build meaningful projects, collaborate across disciplines and transform ideas into experiences.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-mono text-primary text-sm uppercase tracking-widest mb-4">OUR VISION</h3>
                        <p className="font-sans text-lg">
                          Build one of the most active and innovative student technology communities on campus.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
