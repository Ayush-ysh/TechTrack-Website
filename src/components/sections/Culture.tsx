"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

const galleryImages = [
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
];

const smallPhrases = [
  { text: "WE BUILD TOGETHER.", top: "10%", left: "5%" },
  { text: "WE FAIL FAST.", top: "30%", right: "10%" },
  { text: "WE LEARN FASTER.", top: "50%", left: "15%" },
  { text: "WE SHIP.", top: "70%", right: "20%" },
  { text: "WE HAVE FUN.", top: "90%", left: "10%" }
];

export default function Culture() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 md:py-40 bg-background relative z-10 border-t border-border overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionHeader
          label="05 / CULTURE"
          title="MORE THAN\nA CLUB."
          subtitle="SEE WHAT WE'VE BEEN BUILDING."
        />

        <div className="relative mt-20">
          {/* Scattered Phrases */}
          {smallPhrases.map((phrase, i) => (
            <div
              key={i}
              className="absolute font-mono text-primary text-xs md:text-sm uppercase tracking-[0.3em] pointer-events-none z-0 hidden md:block"
              style={{ top: phrase.top, left: phrase.left, right: phrase.right }}
            >
              [ {phrase.text} ]
            </div>
          ))}

          {/* Masonry Gallery */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10">
            {galleryImages.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.2 }}
                className="relative group overflow-hidden border border-border cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt="Gallery image"
                  className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                
                <div className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                  <Maximize2 size={18} className="text-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors z-10"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full border border-border"
            >
              <img
                src={selectedImage}
                alt="Enlarged gallery view"
                className="w-full h-full object-contain max-h-[90vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
