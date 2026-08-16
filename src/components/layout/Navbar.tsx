"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "HOME", href: "#home", id: "01" },
  { name: "ABOUT", href: "#about", id: "02" },
  { name: "EVENTS", href: "#events", id: "03" },
  { name: "ACHIEVEMENTS", href: "#achievements", id: "04" },
  { name: "TEAM", href: "#team", id: "05" },
  { name: "GALLERY", href: "#gallery", id: "06" },
  { name: "CONTACT", href: "#contact", id: "07" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="font-display text-3xl md:text-4xl tracking-tight z-50">
            TECHTRACK <span className="text-primary">;</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-mono text-sm uppercase tracking-widest">
            {navLinks.slice(1, 6).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Link
              href="#join"
              className="bg-primary text-primary-foreground px-6 py-3 font-bold hover:bg-white transition-colors flex items-center gap-2 border-2 border-primary hover:border-white"
            >
              JOIN TECHTRACK <span className="text-lg">↗</span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden z-50 p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center items-center p-6"
          >
            <nav className="flex flex-col gap-6 w-full max-w-md">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-baseline gap-4 font-display text-5xl md:text-7xl uppercase hover:text-primary transition-colors"
                  >
                    <span className="text-lg md:text-2xl font-mono text-muted-foreground group-hover:text-primary">
                      {link.id}
                    </span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
