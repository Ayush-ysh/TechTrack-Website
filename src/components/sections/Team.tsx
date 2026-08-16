"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import SectionHeader from "../ui/SectionHeader";
import { members, Division } from "@/data/members";

const divisions: { id: Division; label: string }[] = [
  { id: "design", label: "DESIGN" },
  { id: "tech", label: "TECH" },
  { id: "multimedia", label: "MULTIMEDIA" },
  { id: "social-media", label: "SOCIAL MEDIA" },
  { id: "management", label: "MANAGEMENT" },
];

export default function Team() {
  const [activeDivision, setActiveDivision] = useState<Division>("design");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const leadership = members.filter((m) => m.division === "leadership");
  const divisionMembers = members.filter((m) => m.division === activeDivision);

  const handleDivisionChange = (div: Division) => {
    if (div === activeDivision || isTransitioning) return;
    setIsTransitioning(true);
    setActiveDivision(div);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <section id="team" className="py-24 md:py-40 bg-background relative z-10 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeader
          label="04 / PEOPLE"
          title="THE PEOPLE\nBEHIND TECHTRACK."
        />

        {/* Leadership Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {leadership.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2 }}
              className="bg-secondary border-2 border-border p-6 md:p-12 hover:border-primary transition-colors group"
            >
              <div className="aspect-square w-full md:w-2/3 max-w-[300px] mb-8 overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="font-mono text-primary text-sm md:text-base uppercase tracking-widest mb-4">
                {leader.role}
              </div>
              <h3 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-8">
                {leader.name}
              </h3>
              
              <div className="flex gap-4">
                {leader.linkedin && (
                  <a href={leader.linkedin} className="p-3 border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
                    <FaLinkedin size={20} />
                  </a>
                )}
                {leader.github && (
                  <a href={leader.github} className="p-3 border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
                    <FaGithub size={20} />
                  </a>
                )}
                {leader.instagram && (
                  <a href={leader.instagram} className="p-3 border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
                    <FaInstagram size={20} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Divisions */}
        <div className="mb-20">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {divisions.map((div) => (
              <button
                key={div.id}
                onClick={() => handleDivisionChange(div.id)}
                disabled={isTransitioning}
                className={`font-display text-4xl md:text-6xl uppercase transition-colors ${
                  activeDivision === div.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {div.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transition Overlay */}
        <div className="relative min-h-[50vh]">
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <motion.div
                key="transition"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              >
                <h2 className="font-display text-[10vw] text-primary text-stroke-primary opacity-50 uppercase">
                  {divisions.find(d => d.id === activeDivision)?.label}
                </h2>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {divisionMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group relative overflow-hidden bg-secondary border border-border aspect-[3/4]"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/90 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] p-6 flex flex-col justify-end">
                      <div className="font-mono text-primary-foreground/80 text-xs uppercase tracking-widest mb-2">
                        {member.role}
                      </div>
                      <h4 className="font-display text-3xl uppercase text-primary-foreground mb-6">
                        {member.name}
                      </h4>
                      
                      <div className="flex gap-3 mt-auto">
                        {member.linkedin && (
                          <a href={member.linkedin} className="p-2 border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">
                            <FaLinkedin size={18} />
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} className="p-2 border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">
                            <FaGithub size={18} />
                          </a>
                        )}
                        {member.instagram && (
                          <a href={member.instagram} className="p-2 border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">
                            <FaInstagram size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
