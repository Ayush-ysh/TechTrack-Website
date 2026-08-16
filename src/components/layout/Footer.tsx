import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 px-6 md:px-12 mt-20 relative overflow-hidden">
      {/* Decorative large background text */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5 flex items-center justify-center">
        <h1 className="font-display text-[20vw] leading-none whitespace-nowrap text-white">
          TECHTRACK
        </h1>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2">
            <h2 className="font-display text-5xl md:text-7xl mb-6">
              TECHTRACK <span className="text-primary">;</span>
            </h2>
            <p className="text-2xl md:text-3xl font-sans text-muted-foreground mb-8 max-w-xl">
              Technology doesn&apos;t stand still.<br />
              <strong className="text-foreground">Neither do we.</strong>
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 border border-border rounded-none hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="p-3 border border-border rounded-none hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="#" className="p-3 border border-border rounded-none hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="p-3 border border-border rounded-none hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-primary mb-6 text-sm uppercase tracking-widest">Navigation</h3>
            <ul className="flex flex-col gap-4 font-sans text-lg">
              <li><Link href="#home" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#events" className="hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="#achievements" className="hover:text-primary transition-colors">Achievements</Link></li>
              <li><Link href="#team" className="hover:text-primary transition-colors">Team</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-primary mb-6 text-sm uppercase tracking-widest">Contact</h3>
            <ul className="flex flex-col gap-4 font-sans text-lg text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 shrink-0 text-foreground" size={20} />
                <span>hello@techtrack.college.edu</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-foreground" size={20} />
                <span>
                  Tech Innovation Block,<br />
                  Campus Location,<br />
                  City, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TECHTRACK</p>
          <p className="hidden md:block opacity-30 group hover:opacity-100 transition-opacity cursor-default">
            <span className="text-primary group-hover:text-primary">while</span>(true) &#123; build(); learn(); repeat(); &#125;
          </p>
          <p>BUILT BY TECHTRACK TECH TEAM</p>
        </div>
      </div>
    </footer>
  );
}
