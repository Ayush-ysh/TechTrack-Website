"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Clock, Users, Download, ArrowUpRight } from "lucide-react";
import { EventData } from "@/data/events";

interface EventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-background/95 backdrop-blur-md overflow-y-auto"
        >
          <div className="min-h-screen p-4 md:p-8 lg:p-12 relative">
            <button
              onClick={onClose}
              className="fixed top-6 right-6 md:top-8 md:right-8 z-20 p-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="max-w-7xl mx-auto bg-background border border-border mt-12 md:mt-0"
            >
              {/* Header Image */}
              <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden bg-secondary">
                <img
                  src={event.poster}
                  alt={event.name}
                  className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-16">
                  <div className="font-mono text-primary text-sm uppercase tracking-widest mb-4">
                    {event.category}
                  </div>
                  <h2 className="font-display text-5xl md:text-8xl lg:text-[7rem] leading-none text-foreground uppercase tracking-tight">
                    {event.name}
                  </h2>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-8 md:p-16">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-sans font-medium text-primary mb-6">
                      {event.tagline}
                    </h3>
                    <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {event.rounds && (
                    <div>
                      <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">EVENT FORMAT</h4>
                      <div className="space-y-6">
                        {event.rounds.map((round, idx) => (
                          <div key={idx} className="border-l-2 border-primary pl-6">
                            <h5 className="font-sans text-xl text-foreground font-bold mb-2">{round.name}</h5>
                            <p className="text-muted-foreground">{round.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.rules && (
                    <div>
                      <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">RULES</h4>
                      <ul className="list-disc list-inside space-y-3 text-muted-foreground text-lg">
                        {event.rules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.prizes && (
                    <div>
                      <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">PRIZES</h4>
                      <div className="p-8 bg-secondary border border-border text-foreground font-sans text-xl text-center">
                        {event.prizes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                  <div className="bg-secondary p-8 border border-border">
                    <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">EVENT DETAILS</h4>
                    <ul className="space-y-6 font-sans">
                      <li className="flex items-start gap-4">
                        <Calendar className="text-primary mt-1 shrink-0" size={24} />
                        <div>
                          <div className="text-sm text-muted-foreground">Date</div>
                          <div className="text-lg text-foreground">{event.date}</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <Clock className="text-primary mt-1 shrink-0" size={24} />
                        <div>
                          <div className="text-sm text-muted-foreground">Time</div>
                          <div className="text-lg text-foreground">{event.time}</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <MapPin className="text-primary mt-1 shrink-0" size={24} />
                        <div>
                          <div className="text-sm text-muted-foreground">Venue</div>
                          <div className="text-lg text-foreground">{event.venue}</div>
                        </div>
                      </li>
                      {event.teamSize && (
                        <li className="flex items-start gap-4">
                          <Users className="text-primary mt-1 shrink-0" size={24} />
                          <div>
                            <div className="text-sm text-muted-foreground">Team Size</div>
                            <div className="text-lg text-foreground">{event.teamSize}</div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>

                  {event.status !== "past" && (
                    <div className="space-y-4">
                      {event.registrationUrl && (
                        <a 
                          href={event.registrationUrl}
                          className="w-full flex items-center justify-between p-6 bg-primary text-primary-foreground hover:bg-white transition-colors font-bold text-xl group"
                        >
                          REGISTER NOW
                          <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      )}
                      <button className="w-full flex items-center justify-between p-6 bg-transparent border-2 border-border text-foreground hover:border-primary transition-colors font-bold text-xl group">
                        DOWNLOAD RULEBOOK
                        <Download className="group-hover:translate-y-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {event.coordinators && (
                    <div className="pt-8 border-t border-border">
                      <h4 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">CONTACT</h4>
                      <div className="space-y-4">
                        {event.coordinators.map((coord, idx) => (
                          <div key={idx}>
                            <div className="text-foreground font-bold">{coord.name}</div>
                            <div className="text-muted-foreground">{coord.contact}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
