"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import EventModal from "../ui/EventModal";
import { events, EventData } from "@/data/events";

export default function Events() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const filteredEvents = events.filter((e) => e.status === activeTab);

  return (
    <section id="events" className="py-24 md:py-40 bg-background relative z-10 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeader
          label="02 / EVENTS"
          title="SOMETHING IS\nALWAYS HAPPENING."
        />

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-border pb-6">
          {(["ongoing", "upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-xl md:text-3xl uppercase tracking-widest pb-2 transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ongoing" && activeTab === "ongoing" && (
                <motion.span
                  layoutId="dot"
                  className="absolute -left-4 top-2 w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              {tab === "ongoing" ? "LIVE NOW" : tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-[-24px] left-0 right-0 h-1 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="min-h-[50vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group cursor-pointer flex flex-col bg-secondary border border-border hover:border-primary transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-background">
                    <img
                      src={event.poster}
                      alt={event.name}
                      className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    
                    {event.status === "ongoing" && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                        LIVE
                      </div>
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-sm">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <ArrowUpRight size={32} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-primary text-xs uppercase tracking-widest mb-3">
                        {event.category}
                      </div>
                      <h3 className="font-display text-4xl mb-4 uppercase">{event.name}</h3>
                      <p className="text-muted-foreground font-sans line-clamp-2">
                        {event.tagline || event.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border font-mono text-sm flex justify-between text-muted-foreground uppercase">
                      <span>{event.date?.split(',')[0]}</span>
                      {event.status === "past" ? (
                        <span>{event.participantsCount} PARTICIPANTS</span>
                      ) : (
                        <span>{event.venue}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredEvents.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted-foreground font-mono text-xl uppercase tracking-widest">
                  No {activeTab} events right now.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
