import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Hammer, Menu, X, Github, Linkedin, Instagram, Mail, ChevronRight, ExternalLink, MapPin, Clock, Layers, PenTool, Cpu, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Types & Interfaces ---

type PageType = 'home' | 'about' | 'work' | 'portfolio' | 'journal' | 'contact';
type PortfolioCategory = 'all' | 'leather' | 'software' | 'restoration';
interface Project {
  id: string;
  title: string;
  category: 'leather' | 'software' | 'restoration';
  description: string;
  tags: string[];
  year: string;
  image?: string;
}
interface Article {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
}

// --- Mock Data ---

const PROJECTS: Project[] = [{
  id: 'p1',
  title: 'Flagship Tote',
  category: 'leather',
  description: '17 hours of hand-stitching. Italian vegetable-tanned leather. A bag designed to outlast its owner.',
  tags: ['Bespoke', 'Hand-stitched', 'Italian Leather'],
  year: '2023'
}, {
  id: 'p2',
  title: 'Handline Platform',
  category: 'software',
  description: 'Production tracking for artisans. Replaces chaotic spreadsheets with streamlined workflow automation.',
  tags: ['SaaS', 'React', 'Node.js'],
  year: '2022'
}, {
  id: 'p3',
  title: 'Louis Vuitton Restoration',
  category: 'restoration',
  description: 'Complete zipper replacement and leather conditioning for a 14-year-old heirloom wallet.',
  tags: ['Restoration', 'Luxury', 'Repair'],
  year: '2023'
}, {
  id: 'p4',
  title: 'Abrax',
  category: 'software',
  description: 'Task automation and property maintenance system for real-time workflow management.',
  tags: ['Automation', 'Mobile App', 'Enterprise'],
  year: '2024'
}, {
  id: 'p5',
  title: 'Heirloom Belt Series',
  category: 'leather',
  description: 'Solid brass hardware, 12oz bridle leather. The "Choose One, Choose Once" philosophy embodied.',
  tags: ['Accessories', 'Heavyweight', 'Lifetime'],
  year: '2021'
}, {
  id: 'p6',
  title: 'Escape the Pacific',
  category: 'software',
  description: 'Creative mode design and game economics balancing for a survival simulation game.',
  tags: ['Game Dev', 'System Design', 'Lua'],
  year: '2020'
}];
const ARTICLES: Article[] = [{
  id: 'a1',
  title: 'Why I Stitch by Hand',
  date: 'Oct 12, 2023',
  summary: 'The engineering mindset applied to craft. Why the saddle stitch is superior to any machine lockstitch, and what it teaches us about software resilience.',
  category: 'Craft Notes'
}, {
  id: 'a2',
  title: 'From Romania to Kinsale',
  date: 'Sep 04, 2023',
  summary: 'A journey of craftsmanship. How a leather apprenticeship in Ireland changed my perspective on building digital products.',
  category: 'Personal'
}, {
  id: 'a3',
  title: 'The Psychology of Longevity',
  date: 'Aug 15, 2023',
  summary: 'Why cheap breaks the soul. Analyzing the impact of disposable culture on our expectations for software and physical goods.',
  category: 'Philosophy'
}];

// --- Sub-Components (Non-Exported) ---

const Button = ({
  children,
  variant = 'primary',
  className,
  onClick,
  icon: Icon
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'link';
  className?: string;
  onClick?: () => void;
  icon?: React.ElementType;
}) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 focus:outline-none border-4 disabled:opacity-50 disabled:pointer-events-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]";
  const variants = {
    primary: "bg-[#39FF14] text-[#0a0e27] border-black hover:bg-[#2ecc11]",
    outline: "bg-transparent text-[#f5f1e3] border-[#39FF14] hover:bg-[#39FF14] hover:text-[#0a0e27]",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-[#39FF14]/20 hover:shadow-none hover:translate-x-0 hover:translate-y-0",
    link: "bg-transparent border-transparent shadow-none text-[#39FF14] hover:translate-x-1 hover:translate-y-0 hover:shadow-none underline underline-offset-4 decoration-4 p-0"
  };
  return <button onClick={onClick} className={cn(baseStyles, variants[variant], className)}>
      {children}
      {Icon && <Icon className="ml-2 h-4 w-4" />}
    </button>;
};
const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}) => <div className={cn("mb-16", centered && "text-center", className)}>
    <h2 className="font-black text-4xl md:text-6xl uppercase tracking-tight text-[#f5f1e3] mb-6 relative inline-block transform -rotate-1">
      <span className="relative z-10 px-4 py-2 bg-[#39FF14] text-[#0a0e27] inline-block shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {title}
      </span>
    </h2>
    {subtitle && <p className="text-[#f5f1e3]/80 text-base max-w-2xl mx-auto leading-relaxed mt-4 font-mono">
        {subtitle}
      </p>}
  </div>;
const Card = ({
  children,
  className,
  noPadding = false,
  tiltDirection = 'left',
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  tiltDirection?: 'left' | 'right' | 'none';
  onClick?: () => void;
}) => {
  const tiltClass = tiltDirection === 'left' ? '-rotate-1' : tiltDirection === 'right' ? 'rotate-1' : '';
  return <div onClick={onClick} className={cn("bg-[#1a1f3a] text-[#f5f1e3] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group hover:shadow-[12px_12px_0px_0px_rgba(57,255,20,1)] hover:-translate-y-1 transition-all duration-200", !noPadding && "p-6", tiltClass, className)}>
    <div className="relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.3) 2px, rgba(57, 255, 20, 0.3) 4px)'
      }} />
      {children}
    </div>
  </div>;
};

// Glitch text animation component
const GlitchText = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <span className={cn("relative inline-block", className)}>
    <span className="relative z-10">{children}</span>
    <span className="absolute top-0 left-0 -z-10 text-[#39FF14] animate-glitch-1" aria-hidden="true">{children}</span>
    <span className="absolute top-0 left-0 -z-10 text-[#ff00ff] animate-glitch-2" aria-hidden="true">{children}</span>
  </span>;
};

// Bouncing icon animation
const BouncingIcon = ({
  icon: Icon,
  className = ""
}: {
  icon: React.ElementType;
  className?: string;
}) => {
  return <div className={cn("animate-bounce-slow", className)}>
    <Icon />
  </div>;
};

// --- Page Components ---

const HomePage = ({
  setPage
}: {
  setPage: (page: PageType) => void;
}) => {
  return <div className="space-y-32 pb-24">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-20 overflow-hidden">
        {/* Noisy background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        backgroundSize: '200px 200px'
      }} />
        
        <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h1 className="font-black text-6xl md:text-8xl lg:text-9xl leading-none text-[#f5f1e3] mb-8 uppercase tracking-tighter transform -rotate-2">
              <GlitchText>PRECISION</GlitchText> IN <br />
              <span className="text-[#39FF14] inline-block transform rotate-1 bg-black px-4 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">CODE</span>
              <br />
              <span className="text-[#f5f1e3]">SOUL IN</span> <br />
              <span className="text-[#39FF14] inline-block transform -rotate-1 bg-black px-4 py-2 shadow-[8px_8px_0px_0px_rgba(57,255,20,1)]">LEATHER</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#f5f1e3]/90 max-w-3xl mx-auto font-mono leading-relaxed border-4 border-[#39FF14]/30 p-6 bg-[#0a0e27]/50 backdrop-blur-sm">
              <span className="text-[#39FF14] font-black">&gt;&gt;</span> I CRAFT SOFTWARE AND LEATHER WITH THE SAME PRINCIPLES: PATIENCE, PRECISION, AND LONGEVITY.
            </p>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button onClick={() => setPage('work')} className="min-w-[200px] text-sm">
              EXPLORE WORK
            </Button>
            <Button variant="outline" onClick={() => setPage('about')} className="min-w-[200px] text-sm">
              THE ARTISAN
            </Button>
          </motion.div>
        </div>
        
        {/* Animated pixel arrow */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1,
        y: [0, 10, 0]
      }} transition={{
        delay: 1,
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#39FF14]">
          <span className="text-xs font-black tracking-widest uppercase font-mono">SCROLL</span>
          <div className="w-1 h-16 bg-[#39FF14] animate-pulse" />
        </motion.div>
      </section>

      {/* Dual Identity */}
      <section className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Card tiltDirection="left" className="hover:rotate-0 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#39FF14] text-[#0a0e27] border-2 border-black">
                  <Hammer className="w-6 h-6" />
                </div>
                <span className="text-sm font-black tracking-[0.3em] uppercase text-[#39FF14]">LEATHER</span>
              </div>
              <h2 className="font-black text-4xl text-[#f5f1e3] uppercase leading-tight">HEIRLOOMS<br />NOT PRODUCTS</h2>
              <p className="text-[#f5f1e3]/80 leading-relaxed font-mono text-sm">
                I REVIVE A DYING CRAFT: HONEST LEATHERWORK. NO MACHINES, NO SHORTCUTS. 
                JUST PREMIUM ITALIAN VEGETABLE-TANNED LEATHER, LINEN THREAD, AND TWO HANDS.
              </p>
              <Button variant="link" onClick={() => setPage('portfolio')} icon={ArrowRight} className="text-xs">
                LEATHER PORTFOLIO
              </Button>
            </div>
          </Card>
          
          <Card tiltDirection="right" className="hover:rotate-0 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#39FF14] text-[#0a0e27] border-2 border-black animate-pulse-slow">
                  <Code className="w-6 h-6" />
                </div>
                <span className="text-sm font-black tracking-[0.3em] uppercase text-[#39FF14]">SOFTWARE</span>
              </div>
              <h2 className="font-black text-4xl text-[#f5f1e3] uppercase leading-tight">SYSTEMS<br />THAT ENDURE</h2>
              <p className="text-[#f5f1e3]/80 leading-relaxed font-mono text-sm">
                I BUILD DIGITAL TOOLS THAT SOLVE REAL PROBLEMS. FROM ARTISAN PRODUCTION PLATFORMS 
                TO ENTERPRISE AUTOMATION WITH ARCHITECTURAL INTEGRITY.
              </p>
              <Button variant="link" onClick={() => setPage('work')} icon={ArrowRight} className="text-xs">
                SOFTWARE PROJECTS
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-6 py-24 border-y-8 border-black bg-[#1a1f3a]">
        <SectionHeading title="SELECTED WORKS" subtitle=">>> A CURATION OF RECENT COMMISSIONS AND TECHNICAL BUILDS" centered />
        
        <div className="grid md:grid-cols-3 gap-8">
          {PROJECTS.slice(0, 3).map((project, idx) => {
          const tilts = ['left', 'none', 'right'] as const;
          return <Card key={project.id} noPadding tiltDirection={tilts[idx % 3]} className="flex flex-col h-full hover:scale-105">
              <div className="aspect-[4/3] bg-[#0a0e27] w-full relative border-b-4 border-black overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center text-[#39FF14] group-hover:scale-110 transition-transform duration-300">
                  {project.category === 'leather' ? <BouncingIcon icon={Hammer} className="w-16 h-16" /> : project.category === 'software' ? <BouncingIcon icon={Code} className="w-16 h-16" /> : <BouncingIcon icon={Layers} className="w-16 h-16" />}
                </div>
                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14] transform translate-x-8 -translate-y-8 rotate-45 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#39FF14] bg-black px-2 py-1 border-2 border-[#39FF14]">{project.category}</span>
                  <span className="text-xs text-[#f5f1e3]/60 font-mono">[{project.year}]</span>
                </div>
                <h3 className="font-black text-xl mb-3 uppercase text-[#f5f1e3] leading-tight">{project.title}</h3>
                <p className="text-[#f5f1e3]/70 text-sm mb-6 flex-grow font-mono leading-relaxed">{project.description}</p>
                <Button variant="outline" className="w-full text-[10px] py-2" onClick={() => setPage('portfolio')}>
                  VIEW DETAILS
                </Button>
              </div>
            </Card>;
        })}
        </div>
      </section>

      {/* Philosophy Teaser */}
      <section className="container mx-auto px-6 text-center max-w-4xl">
        <div className="border-8 border-black bg-[#39FF14] p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform">
          <h2 className="font-black text-3xl md:text-5xl leading-tight mb-8 uppercase text-[#0a0e27]">
            "THE WORLD HAS FORGOTTEN HOW TO BUILD THINGS THAT LAST."
          </h2>
          <p className="text-[#0a0e27] text-lg mb-10 leading-relaxed font-mono font-bold">
            WHETHER IT IS A STITCH THAT HOLDS FOR FIFTY YEARS OR CODE THAT SCALES WITHOUT DEBT, 
            THE PHILOSOPHY IS IDENTICAL: <span className="bg-[#0a0e27] text-[#39FF14] px-2 py-1">CARE. INTEGRITY. MASTERY.</span>
          </p>
          <Button onClick={() => setPage('journal')} className="bg-[#0a0e27] text-[#39FF14] border-[#0a0e27] hover:bg-black">READ JOURNAL</Button>
        </div>
      </section>
    </div>;
};
const AboutPage = () => {
  return <div className="max-w-5xl mx-auto px-6 py-12 space-y-32 pb-24">
      {/* Title Block */}
      <div className="text-center space-y-8">
        <div className="inline-block border-8 border-[#39FF14] bg-[#0a0e27] p-8 shadow-[12px_12px_0px_0px_rgba(57,255,20,1)] transform -rotate-2">
          <h1 className="font-black text-5xl md:text-7xl text-[#39FF14] uppercase tracking-tighter">
            <GlitchText>RADU SIGHENCEA</GlitchText>
          </h1>
        </div>
        <p className="text-xl text-[#f5f1e3] max-w-2xl mx-auto font-mono border-4 border-[#39FF14]/30 p-6 bg-[#1a1f3a]">
          <span className="text-[#39FF14] font-black">[SYSTEM_INIT]</span> MASTER ARTISAN, ENGINEER, AND CREATOR OF SYSTEMS. 
          I BUILD THINGS THAT LAST—IN LEATHER, IN SOFTWARE, AND IN LIFE.
        </p>
      </div>

      {/* Core Bio */}
      <Card tiltDirection="none" className="p-8 md:p-12">
        <div className="prose prose-lg mx-auto text-[#f5f1e3]/90 leading-relaxed font-mono">
          <p className="text-lg">
            <span className="text-[#39FF14] font-black text-2xl">&gt;&gt; </span>
            I AM NOT JUST A GUY WHO DOES LEATHER, NOR JUST A DEVELOPER. I AM A BUILDER. 
            BORN IN ROMANIA, FORGED IN IRELAND, I OPERATE AT THE INTERSECTION OF OLD-WORLD CRAFT 
            AND MODERN ENGINEERING. MY WORK IS A REBELLION AGAINST THE DISPOSABLE.
          </p>
        </div>
      </Card>

      {/* Origin Story */}
      <section>
        <SectionHeading title="THE ORIGIN" />
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card tiltDirection="left" className="space-y-6 text-[#f5f1e3]/80 font-mono h-full">
            <p className="leading-relaxed">
              <span className="text-[#39FF14] font-black">[BOOT_SEQUENCE_01]</span><br />
              IT STARTED IN ROMANIA, WHERE RESILIENCE WASN'T A CHOICE—IT WAS A REQUIREMENT. 
              BUT THE TRUE SHAPING BEGAN WHEN I LEFT EVERYTHING BEHIND TO FIND SOMETHING REAL.
            </p>
            <p className="leading-relaxed">
              <span className="text-[#39FF14] font-black">[BOOT_SEQUENCE_02]</span><br />
              I LANDED IN KINSALE, IRELAND. IT WAS HERE, UNDER THE MENTORSHIP OF DAN, 
              THAT I FIRST TOUCHED LEATHER WITH SERIOUS INTENT. I LEARNED THAT A SINGLE PAIR OF SHOES 
              COULD TELL THE STORY OF A MAN.
            </p>
          </Card>
          <Card tiltDirection="right" className="aspect-square md:aspect-auto h-full min-h-[300px] relative overflow-hidden bg-[#0a0e27]">
            <div className="absolute inset-0 flex items-center justify-center text-[#39FF14]/40 font-mono font-black text-sm animate-pulse">
              [PHOTO: KINSALE_WORKSHOP.JPG]
            </div>
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #39FF14 20px, #39FF14 22px), repeating-linear-gradient(90deg, transparent, transparent 20px, #39FF14 20px, #39FF14 22px)'
          }} />
          </Card>
        </div>
      </section>

      {/* Engineering Journey */}
      <section>
        <SectionHeading title="THE ENGINEER" />
        <div className="space-y-6">
          {[{
          year: '2020',
          title: 'Escape the Pacific',
          desc: 'DIVE DEEP INTO GAME LOGIC AND ECONOMICS. LEARNED THAT A SYSTEM IS ONLY AS GOOD AS ITS WEAKEST CONSTRAINT.'
        }, {
          year: '2022',
          title: 'Handline Created',
          desc: 'BUILT A PLATFORM TO SAVE ARTISANS FROM SPREADSHEET HELL. SOFTWARE SOLVING PHYSICAL PROBLEMS.'
        }, {
          year: '2024',
          title: 'Abrax Enterprise',
          desc: 'SCALING COMPLEX PROPERTY MAINTENANCE WORKFLOWS. HIGH-STAKES RELIABILITY.'
        }].map((item, idx) => <Card key={idx} tiltDirection={idx % 2 === 0 ? 'left' : 'right'} className="pl-8 border-l-8 border-[#39FF14] hover:border-l-[#ff00ff] transition-colors">
              <div className="space-y-2">
                <span className="text-lg font-black font-mono text-[#39FF14] bg-black px-3 py-1 inline-block border-2 border-[#39FF14]">[{item.year}]</span>
                <h3 className="text-2xl font-black uppercase text-[#f5f1e3]">{item.title}</h3>
                <p className="text-[#f5f1e3]/70 font-mono text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Card>)}
        </div>
      </section>

      {/* Values */}
      <section className="border-8 border-black bg-[#1a1f3a] p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <SectionHeading title="VALUE SYSTEM" centered />
        <div className="grid sm:grid-cols-2 gap-6">
          {[{
          title: 'CRAFT',
          desc: 'DOING IT RIGHT WHEN NO ONE IS WATCHING. THE BACK OF THE LEATHER MUST BE AS CLEAN AS THE FRONT.'
        }, {
          title: 'INTEGRITY',
          desc: 'I DO NOT SELL WHAT I WOULD NOT USE. MY WORD IS MY BOND, IN CODE AND IN CONTRACT.'
        }, {
          title: 'LONGEVITY',
          desc: '"CHOOSE ONE, CHOOSE ONCE." I BUILD FOR THE NEXT GENERATION, NOT THE NEXT SEASON.'
        }, {
          title: 'BROTHERHOOD',
          desc: 'WE RISE BY LIFTING OTHERS. MY KNOWLEDGE IS OPEN SOURCE, MY WORKSHOP HAS AN OPEN DOOR.'
        }].map((value, idx) => <div key={idx} className="border-4 border-[#39FF14] bg-[#0a0e27] p-6 hover:bg-[#39FF14] hover:text-[#0a0e27] transition-colors group">
              <h4 className="font-black text-xl mb-3 uppercase text-[#39FF14] group-hover:text-[#0a0e27]">[{value.title}]</h4>
              <p className="text-sm text-[#f5f1e3]/80 font-mono leading-relaxed group-hover:text-[#0a0e27]">
                {value.desc}
              </p>
            </div>)}
        </div>
      </section>

      <div className="text-center pt-12">
        <div className="inline-block bg-black border-4 border-[#39FF14] p-8 transform rotate-1 hover:-rotate-1 transition-transform">
          <p className="text-2xl font-black uppercase text-[#39FF14] mb-4 font-mono">
            /// THIS IS WHO I AM ///
          </p>
          <p className="text-xl font-black uppercase text-[#f5f1e3] font-mono">
            THIS IS THE STANDARD I LIVE BY
          </p>
        </div>
      </div>
    </div>;
};
const WorkPage = ({
  setPage
}: {
  setPage: (page: PageType) => void;
}) => {
  return <div className="space-y-32 pb-24">
      {/* Work Intro */}
      <div className="container mx-auto px-6 pt-12 text-center">
        <h1 className="font-black text-5xl md:text-7xl mb-8 uppercase text-[#39FF14] transform -rotate-2 inline-block bg-black px-6 py-4 border-8 border-[#39FF14] shadow-[12px_12px_0px_0px_rgba(57,255,20,1)]">
          <GlitchText>MASTERY × 2</GlitchText>
        </h1>
        <p className="text-[#f5f1e3] max-w-3xl mx-auto font-mono text-lg border-4 border-[#39FF14]/30 p-6 bg-[#1a1f3a] mt-8">
          <span className="text-[#39FF14] font-black">&gt;&gt;</span> PHYSICAL SYSTEMS (LEATHER) + DIGITAL SYSTEMS (SOFTWARE) = SAME DISCIPLINE
        </p>
      </div>

      {/* Leather Section */}
      <section className="bg-[#1a1f3a] py-24 border-y-8 border-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 mb-12">
            <div className="p-4 bg-[#39FF14] text-[#0a0e27] border-4 border-black animate-pulse-slow">
              <Hammer size={32} />
            </div>
            <div>
              <h2 className="font-black text-4xl md:text-5xl uppercase text-[#f5f1e3]">LEATHER CRAFT</h2>
              <p className="text-[#39FF14] font-mono font-black text-sm uppercase tracking-widest">[FLAGSHIP_ARTISAN_DISCIPLINE]</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {PROJECTS.filter(p => p.category === 'leather').map((project, idx) => <Card key={project.id} tiltDirection={idx % 2 === 0 ? 'left' : 'right'} className="hover:scale-105 hover:-rotate-0 transition-all">
                <div className="mb-4 aspect-square bg-[#0a0e27] flex items-center justify-center border-4 border-black relative overflow-hidden group">
                  <span className="text-[#39FF14]/60 font-mono font-black text-xs group-hover:scale-150 transition-transform">[IMG]</span>
                  <div className="absolute inset-0 bg-[#39FF14]/0 group-hover:bg-[#39FF14]/10 transition-colors" />
                </div>
                <h3 className="font-black text-lg mb-2 uppercase text-[#f5f1e3]">{project.title}</h3>
                <p className="text-[10px] text-[#39FF14] mb-3 font-mono font-bold">{project.tags.join(' • ')}</p>
                <p className="text-sm text-[#f5f1e3]/70 line-clamp-3 font-mono">{project.description}</p>
              </Card>)}
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center border-8 border-black bg-[#0a0e27] p-8 shadow-[12px_12px_0px_0px_rgba(57,255,20,1)]">
            <div>
              <h3 className="font-black text-3xl mb-6 uppercase text-[#39FF14]">[THE PROCESS]</h3>
              <ul className="space-y-6 text-[#f5f1e3]/80 font-mono">
                <li className="flex items-start gap-4 border-l-4 border-[#39FF14] pl-4 hover:bg-[#39FF14]/10 transition-colors p-2">
                  <span className="text-[#39FF14] font-black text-xl">[01]</span>
                  <span className="text-sm">CONSULTATION & MATERIAL SELECTION: WE CHOOSE THE HIDE TOGETHER.</span>
                </li>
                <li className="flex items-start gap-4 border-l-4 border-[#39FF14] pl-4 hover:bg-[#39FF14]/10 transition-colors p-2">
                  <span className="text-[#39FF14] font-black text-xl">[02]</span>
                  <span className="text-sm">PATTERNING: DESIGNED FROM SCRATCH FOR YOUR SPECIFIC NEEDS.</span>
                </li>
                <li className="flex items-start gap-4 border-l-4 border-[#39FF14] pl-4 hover:bg-[#39FF14]/10 transition-colors p-2">
                  <span className="text-[#39FF14] font-black text-xl">[03]</span>
                  <span className="text-sm">SADDLE STITCHING: EVERY HOLE PUNCHED BY HAND, EVERY STITCH LOCKED.</span>
                </li>
              </ul>
              <Button className="mt-8" onClick={() => setPage('contact')}>COMMISSION WORK</Button>
            </div>
            <div className="h-full min-h-[250px] bg-[#1a1f3a] border-4 border-[#39FF14] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-[#39FF14]/60 font-mono font-black animate-pulse">[PROCESS_VIDEO.MP4]</div>
              <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #39FF14 10px, #39FF14 12px)'
            }} />
            </div>
          </div>
        </div>
      </section>

      {/* Software Section */}
      <section className="container mx-auto px-6">
        <div className="flex items-center gap-6 mb-12">
          <div className="p-4 bg-[#39FF14] text-[#0a0e27] border-4 border-black animate-pulse-slow">
            <Code size={32} />
          </div>
          <div>
            <h2 className="font-black text-4xl md:text-5xl uppercase text-[#f5f1e3]">SOFTWARE ENG</h2>
            <p className="text-[#39FF14] font-mono font-black text-sm uppercase tracking-widest">[TOOLS_FOR_REAL_PROBLEMS]</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
           {PROJECTS.filter(p => p.category === 'software').map((project, idx) => <Card key={project.id} tiltDirection={idx % 2 === 0 ? 'left' : 'right'} noPadding className="flex flex-col md:flex-row overflow-hidden hover:scale-105 hover:rotate-0">
                <div className="md:w-1/3 bg-[#0a0e27] min-h-[200px] md:min-h-0 flex items-center justify-center text-[#39FF14]/60 border-r-4 border-black relative overflow-hidden group">
                  <span className="font-mono font-black text-xs z-10 relative">[UI_PREVIEW]</span>
                  <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, #39FF14 4px, #39FF14 6px)'
            }} />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-center">
                  <h3 className="font-black text-2xl mb-3 uppercase text-[#f5f1e3]">{project.title}</h3>
                  <p className="text-[#f5f1e3]/70 text-sm mb-4 font-mono">{project.description}</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {project.tags.map(tag => <span key={tag} className="text-[10px] font-black uppercase tracking-wider border-2 border-[#39FF14] bg-black text-[#39FF14] px-2 py-1">{tag}</span>)}
                  </div>
                  <Button variant="link" className="self-start px-0 text-[10px]">VIEW CASE STUDY</Button>
                </div>
              </Card>)}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={() => setPage('contact')}>SOFTWARE COLLAB</Button>
        </div>
      </section>

      {/* Restoration Section */}
      <section className="border-y-8 border-black bg-[#1a1f3a] py-24">
        <div className="container mx-auto px-6 text-center max-w-5xl">
           <h2 className="font-black text-4xl md:text-5xl mb-8 uppercase text-[#39FF14] inline-block bg-black px-6 py-3 border-4 border-[#39FF14] shadow-[8px_8px_0px_0px_rgba(57,255,20,1)] transform -rotate-1">
            RESTORATION
           </h2>
           <p className="text-[#f5f1e3]/80 mb-16 font-mono text-lg max-w-3xl mx-auto border-4 border-[#39FF14]/30 p-6 bg-[#0a0e27]">
             <span className="text-[#39FF14] font-black">&gt;&gt;</span> I DON'T JUST REPAIR; I TRANSFORM. RESTORATION IS ABOUT HONORING THE HISTORY 
             WHILE GIVING IT A SECOND LIFE. I ACCEPT ONLY PROJECTS WORTH SAVING.
           </p>
           
           <div className="grid md:grid-cols-2 gap-8">
             {['Louis Vuitton Wallet', '1970s Briefcase'].map((title, idx) => <Card key={idx} tiltDirection={idx % 2 === 0 ? 'left' : 'right'} className="space-y-4">
                 <div className="relative aspect-[4/3] bg-[#0a0e27] border-4 border-black overflow-hidden group">
                   <div className="absolute top-4 left-4 bg-black text-[#39FF14] text-xs font-black px-3 py-1 border-2 border-[#39FF14] z-20">[BEFORE]</div>
                   <div className="absolute bottom-4 right-4 bg-[#39FF14] text-black text-xs font-black px-3 py-1 border-2 border-black z-20 animate-pulse">[AFTER]</div>
                   <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #39FF14 0px, #39FF14 2px, transparent 2px, transparent 10px)'
              }} />
                 </div>
                 <h4 className="font-black text-xl uppercase text-[#f5f1e3]">{title}</h4>
                 <p className="text-xs text-[#f5f1e3]/70 font-mono uppercase">
                   {idx === 0 ? 'FULL ZIPPER REPLACEMENT & EDGE REPAINTING' : 'HANDLE RECONSTRUCTION & LEATHER NOURISHMENT'}
                 </p>
               </Card>)}
           </div>
        </div>
      </section>
    </div>;
};
const PortfolioPage = () => {
  const [filter, setFilter] = useState<PortfolioCategory>('all');
  const filteredProjects = PROJECTS.filter(p => filter === 'all' || p.category === filter);
  return <div className="container mx-auto px-6 py-12 pb-24 min-h-screen">
      <div className="mb-16">
        <h1 className="font-black text-5xl md:text-7xl mb-6 uppercase text-[#39FF14] inline-block bg-black px-6 py-4 border-8 border-[#39FF14] shadow-[12px_12px_0px_0px_rgba(57,255,20,1)] transform -rotate-2">
          PORTFOLIO
        </h1>
        <p className="text-[#f5f1e3] font-mono text-lg mt-4"><span className="text-[#39FF14] font-black">&gt;&gt;</span> A VISUAL RECORD OF PRECISION</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-16 border-b-4 border-[#39FF14] pb-4">
        {(['all', 'leather', 'software', 'restoration'] as const).map(cat => <button key={cat} onClick={() => setFilter(cat)} className={cn("text-sm font-black uppercase tracking-widest px-6 py-3 transition-all border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", filter === cat ? "bg-[#39FF14] text-[#0a0e27] border-black transform -rotate-1" : "bg-transparent text-[#f5f1e3] border-[#39FF14]/50 hover:border-[#39FF14] hover:bg-[#39FF14]/10")}>
            [{cat}]
          </button>)}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {filteredProjects.map((project, idx) => <motion.div key={project.id} layout initial={{
          opacity: 0,
          scale: 0.9,
          rotate: -2
        }} animate={{
          opacity: 1,
          scale: 1,
          rotate: 0
        }} exit={{
          opacity: 0,
          scale: 0.9,
          rotate: 2
        }} transition={{
          duration: 0.3
        }}>
              <Card noPadding tiltDirection={idx % 3 === 0 ? 'left' : idx % 3 === 1 ? 'none' : 'right'} className="h-full flex flex-col group cursor-pointer hover:scale-105 hover:rotate-0">
                <div className="aspect-[4/3] bg-[#0a0e27] relative overflow-hidden border-b-4 border-black">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#39FF14]/20 transition-colors z-10" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#39FF14]/60">
                    {project.category === 'software' ? <Code size={48} className="group-hover:scale-125 transition-transform" /> : <Hammer size={48} className="group-hover:scale-125 transition-transform" />}
                  </div>
                  <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #39FF14 2px, #39FF14 4px)'
              }} />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black text-xl uppercase text-[#f5f1e3] group-hover:text-[#39FF14] transition-colors leading-tight">{project.title}</h3>
                    <ExternalLink size={16} className="text-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[#f5f1e3]/70 text-sm mb-4 flex-grow font-mono">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(tag => <span key={tag} className="text-[10px] bg-black text-[#39FF14] border-2 border-[#39FF14] px-2 py-1 font-black uppercase">
                        {tag}
                      </span>)}
                  </div>
                </div>
              </Card>
            </motion.div>)}
        </AnimatePresence>
      </div>
      
      {filteredProjects.length === 0 && <div className="text-center py-20">
          <div className="inline-block border-4 border-[#39FF14] bg-[#0a0e27] p-8">
            <p className="text-[#39FF14] font-mono font-black text-xl">[ERROR: NO_PROJECTS_FOUND]</p>
          </div>
        </div>}

      <div className="mt-32 pt-12 border-t-8 border-black text-center">
        <p className="text-sm text-[#f5f1e3]/70 font-mono mb-8 max-w-2xl mx-auto border-4 border-[#39FF14]/30 p-6 bg-[#1a1f3a]">
          <span className="text-[#39FF14] font-black">[NOTE]</span> SOME WORKS NOT DISPLAYED DUE TO PRIVACY OR CLIENT DISCRETION. 
          ARCHIVED WORK AVAILABLE ON REQUEST.
        </p>
        <div className="flex justify-center gap-6">
          <Button variant="outline">VIEW ALL COMMISSIONS</Button>
        </div>
      </div>
    </div>;
};
const JournalPage = () => {
  return <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen pb-24">
      <div className="mb-20 text-center">
        <h1 className="font-black text-5xl md:text-7xl mb-8 uppercase text-[#39FF14] inline-block bg-black px-6 py-4 border-8 border-[#39FF14] shadow-[12px_12px_0px_0px_rgba(57,255,20,1)] transform -rotate-2">
          THE JOURNAL
        </h1>
        <p className="text-xl text-[#f5f1e3] font-mono mt-4">
          <span className="text-[#39FF14] font-black">&gt;&gt;</span> DOCUMENTING THE CRAFT, THE CODE, THE LESSONS
        </p>
      </div>

      {/* Featured */}
      <div className="mb-24">
        <Card className="p-8 md:p-12 border-8 border-[#39FF14] shadow-[16px_16px_0px_0px_rgba(57,255,20,1)] hover:shadow-[20px_20px_0px_0px_rgba(57,255,20,1)]">
          <span className="text-[#39FF14] text-xs font-black tracking-widest uppercase mb-4 block bg-black inline-block px-3 py-1 border-2 border-[#39FF14]">[FEATURED_ENTRY]</span>
          <h2 className="font-black text-3xl md:text-5xl mb-6 uppercase text-[#f5f1e3] leading-tight">
            WHY I STITCH BY HAND
          </h2>
          <p className="text-[#f5f1e3]/80 text-lg mb-8 leading-relaxed font-mono">
            IN AN AGE OF AUTOMATION, DOING THINGS THE HARD WAY IS A STRATEGIC CHOICE. 
            THE SADDLE STITCH IS NOT JUST STRONGER; IT IS AN ENGINEERING MARVEL THAT 
            LOCK-STITCH MACHINES CANNOT REPLICATE.
          </p>
          <Button>READ FULL ENTRY</Button>
        </Card>
      </div>

      {/* List */}
      <div className="space-y-12">
        {ARTICLES.slice(1).map((article, idx) => <Card key={article.id} tiltDirection={idx % 2 === 0 ? 'left' : 'right'} className="group cursor-pointer hover:scale-105 hover:rotate-0 transition-all">
            <div className="flex items-center gap-4 text-xs mb-4">
              <span className="uppercase tracking-wider text-[#39FF14] bg-black px-3 py-1 border-2 border-[#39FF14] font-black">[{article.category}]</span>
              <span className="text-[#f5f1e3]/60 font-mono">{article.date}</span>
            </div>
            <h3 className="font-black text-2xl md:text-3xl mb-4 uppercase text-[#f5f1e3] group-hover:text-[#39FF14] transition-colors leading-tight">
              {article.title}
            </h3>
            <p className="text-[#f5f1e3]/70 leading-relaxed mb-6 font-mono">
              {article.summary}
            </p>
            <div className="flex items-center text-sm font-black text-[#39FF14] uppercase group-hover:translate-x-2 transition-transform">
              READ MORE <ChevronRight size={14} className="ml-1" />
            </div>
          </Card>)}
      </div>
      
      <div className="mt-24 p-12 bg-[#39FF14] border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center transform -rotate-1 hover:rotate-0 transition-transform">
        <h4 className="font-black text-2xl mb-6 uppercase text-[#0a0e27]">[WHY_I_WRITE]</h4>
        <p className="text-sm text-[#0a0e27] max-w-xl mx-auto mb-8 font-mono font-bold">
          WRITING FORCES CLARITY. I DOCUMENT MY FAILURES IN THE WORKSHOP AND MY BUGS IN THE CODE 
          SO THAT THE NEXT ITERATION IS STRONGER.
        </p>
        <Button variant="outline" icon={Mail} className="bg-[#0a0e27] text-[#39FF14] border-black hover:bg-black">SUBSCRIBE</Button>
      </div>
    </div>;
};
const ContactPage = () => {
  const [activeTab, setActiveTab] = useState<'leather' | 'software'>('leather');
  return <div className="container mx-auto px-6 py-12 pb-24">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="font-black text-5xl md:text-7xl mb-8 uppercase text-[#39FF14] inline-block bg-black px-6 py-4 border-8 border-[#39FF14] shadow-[12px_12px_0px_0px_rgba(57,255,20,1)] transform -rotate-2">
          CONTACT
        </h1>
        <p className="text-[#f5f1e3] text-lg font-mono mt-4">
          <span className="text-[#39FF14] font-black">&gt;&gt;</span> TELL ME WHAT PROBLEM YOU WANT SOLVED
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Pathways */}
        <div className="lg:col-span-1 space-y-6">
          <Card tiltDirection="none" onClick={() => setActiveTab('leather')} className={cn("cursor-pointer transition-all", activeTab === 'leather' ? "border-[#39FF14] border-8 shadow-[12px_12px_0px_0px_rgba(57,255,20,1)]" : "border-[#39FF14]/30 hover:border-[#39FF14]")}>
            <div className="flex items-center gap-3 mb-4">
              <Hammer className={cn("w-6 h-6", activeTab === 'leather' ? "text-[#39FF14]" : "text-[#f5f1e3]/60")} />
              <h3 className="font-black uppercase text-lg text-[#f5f1e3]">[LEATHER]</h3>
            </div>
            <p className="text-sm text-[#f5f1e3]/70 font-mono">
              CUSTOM BESPOKE PIECES, HEIRLOOMS, AND PREMIUM RESTORATIONS.
            </p>
          </Card>

          <Card tiltDirection="none" onClick={() => setActiveTab('software')} className={cn("cursor-pointer transition-all", activeTab === 'software' ? "border-[#39FF14] border-8 shadow-[12px_12px_0px_0px_rgba(57,255,20,1)]" : "border-[#39FF14]/30 hover:border-[#39FF14]")}>
            <div className="flex items-center gap-3 mb-4">
              <Code className={cn("w-6 h-6", activeTab === 'software' ? "text-[#39FF14]" : "text-[#f5f1e3]/60")} />
              <h3 className="font-black uppercase text-lg text-[#f5f1e3]">[SOFTWARE]</h3>
            </div>
            <p className="text-sm text-[#f5f1e3]/70 font-mono">
              PRODUCT CONSULTING, SYSTEM ARCHITECTURE, AND SPECIALIZED BUILDS.
            </p>
          </Card>

          <Card tiltDirection="none" className="bg-[#0a0e27] border-[#39FF14]/30">
            <h4 className="font-black text-lg mb-4 uppercase text-[#39FF14]">[OTHER_INFO]</h4>
            <ul className="space-y-4 text-sm text-[#f5f1e3]/70 font-mono">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#39FF14]" /> MIDLETON, CORK, IRELAND
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#39FF14]" /> CONTACT@SIGHENCEA.COM
              </li>
            </ul>
          </Card>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-8 border-8 border-black shadow-[12px_12px_0px_0px_rgba(57,255,20,1)]">
            <h3 className="font-black text-3xl mb-8 uppercase text-[#39FF14]">
              [{activeTab === 'leather' ? 'START_COMMISSION' : 'DISCUSS_PROJECT'}]
            </h3>
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-[#f5f1e3] font-mono">[NAME]</label>
                  <input type="text" className="w-full bg-[#0a0e27] border-4 border-[#39FF14]/50 px-4 py-3 text-[#f5f1e3] font-mono focus:border-[#39FF14] outline-none transition-colors" placeholder="YOUR_NAME" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-[#f5f1e3] font-mono">[EMAIL]</label>
                  <input type="email" className="w-full bg-[#0a0e27] border-4 border-[#39FF14]/50 px-4 py-3 text-[#f5f1e3] font-mono focus:border-[#39FF14] outline-none transition-colors" placeholder="EMAIL@EXAMPLE.COM" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-black uppercase text-[#f5f1e3] font-mono">[SUBJECT]</label>
                <select className="w-full bg-[#0a0e27] border-4 border-[#39FF14]/50 px-4 py-3 text-[#f5f1e3] font-mono focus:border-[#39FF14] outline-none transition-colors font-black">
                  {activeTab === 'leather' ? <>
                      <option>BESPOKE_COMMISSION</option>
                      <option>RESTORATION_INQUIRY</option>
                      <option>PRODUCT_QUESTION</option>
                    </> : <>
                      <option>PROJECT_CONSULTATION</option>
                      <option>TECHNICAL_ADVISORY</option>
                      <option>PARTNERSHIP</option>
                    </>}
                  <option>OTHER</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase text-[#f5f1e3] font-mono">[MESSAGE]</label>
                <textarea rows={6} className="w-full bg-[#0a0e27] border-4 border-[#39FF14]/50 px-4 py-3 text-[#f5f1e3] font-mono focus:border-[#39FF14] outline-none resize-none transition-colors" placeholder={activeTab === 'leather' ? "DESCRIBE_THE_PIECE_YOU_ENVISION..." : "DESCRIBE_THE_PROBLEM_YOU_ARE_SOLVING..."} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-[#f5f1e3]/60 font-mono font-bold">
                  [RESPONSE_TIME: 48H]
                </span>
                <Button>SEND INQUIRY</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>;
};

// --- Main Layout Component ---

// @component: SighenceaPortfolio
export const SighenceaPortfolio = () => {
  const [page, setPage] = useState<PageType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [page]);
  const navItems: {
    id: PageType;
    label: string;
  }[] = [{
    id: 'home',
    label: 'HOME'
  }, {
    id: 'about',
    label: 'ABOUT'
  }, {
    id: 'work',
    label: 'WORK'
  }, {
    id: 'portfolio',
    label: 'PORTFOLIO'
  }, {
    id: 'journal',
    label: 'JOURNAL'
  }, {
    id: 'contact',
    label: 'CONTACT'
  }];

  // @return
  return <div className="min-h-screen bg-[#0a0e27] text-[#f5f1e3] font-sans selection:bg-[#39FF14] selection:text-[#0a0e27] flex flex-col relative overflow-x-hidden">
      {/* Noisy background texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      backgroundSize: '200px 200px'
    }} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-8 border-black bg-[#1a1f3a] shadow-[0_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => setPage('home')} className="cursor-pointer z-50 flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#39FF14] text-[#0a0e27] flex items-center justify-center font-black text-2xl border-4 border-black group-hover:animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              S
            </div>
            <span className="font-black text-2xl tracking-tighter group-hover:text-[#39FF14] transition-colors uppercase">
              SIGHENCEA
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(item => <button key={item.id} onClick={() => setPage(item.id)} className={cn("text-xs font-black transition-all uppercase tracking-widest px-6 py-3 border-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-rotate-2", page === item.id ? "bg-[#39FF14] text-[#0a0e27] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1" : "bg-transparent text-[#f5f1e3] border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/10")}>
                {item.label}
              </button>)}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden z-50 p-3 text-[#f5f1e3] border-4 border-[#39FF14] bg-[#0a0e27] hover:bg-[#39FF14] hover:text-[#0a0e27] transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Nav Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && <motion.div initial={{
            opacity: 0,
            x: '100%'
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: '100%'
          }} className="fixed inset-0 bg-[#0a0e27] border-8 border-[#39FF14] flex flex-col items-center justify-center gap-6 md:hidden z-40">
                {navItems.map(item => <button key={item.id} onClick={() => setPage(item.id)} className={cn("text-3xl font-black uppercase transition-all px-8 py-4 border-4 hover:scale-110", page === item.id ? "bg-[#39FF14] text-[#0a0e27] border-black transform -rotate-2" : "text-[#f5f1e3] border-[#39FF14]/50 hover:border-[#39FF14] hover:bg-[#39FF14]/10")}>
                    {item.label}
                  </button>)}
              </motion.div>}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.3
        }} className="min-h-[calc(100vh-96px)]">
            {/* Scanline transition effect */}
            <motion.div initial={{
            height: '100%'
          }} animate={{
            height: 0
          }} transition={{
            duration: 0.4
          }} className="fixed inset-0 bg-[#39FF14] z-50 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }} />
            
            {page === 'home' && <HomePage setPage={setPage} />}
            {page === 'about' && <AboutPage />}
            {page === 'work' && <WorkPage setPage={setPage} />}
            {page === 'portfolio' && <PortfolioPage />}
            {page === 'journal' && <JournalPage />}
            {page === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1f3a] border-t-8 border-black text-[#f5f1e3] py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2 border-4 border-[#39FF14]/30 p-6 bg-[#0a0e27]">
              <div className="flex items-center gap-3 mb-6 text-[#f5f1e3]">
                <div className="w-10 h-10 bg-[#39FF14] text-[#0a0e27] flex items-center justify-center font-black text-lg border-4 border-black">
                  S
                </div>
                <span className="font-black text-xl uppercase tracking-tighter">SIGHENCEA</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed mb-6 font-mono text-[#f5f1e3]/80">
                <span className="text-[#39FF14] font-black">&gt;&gt;</span> I BUILD THINGS THAT LAST. IN LEATHER, IN SOFTWARE, IN LEGACY. 
                BASED IN MIDLETON, IRELAND.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#39FF14] transition-colors p-2 border-2 border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/10">
                  <Instagram size={20} />
                </a>
                <a href="#" className="hover:text-[#39FF14] transition-colors p-2 border-2 border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/10">
                  <Github size={20} />
                </a>
                <a href="#" className="hover:text-[#39FF14] transition-colors p-2 border-2 border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/10">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div className="border-4 border-[#39FF14]/30 p-6 bg-[#0a0e27]">
              <h4 className="font-black text-[#39FF14] mb-4 uppercase text-sm tracking-widest">[NAVIGATION]</h4>
              <ul className="space-y-3 text-sm font-mono">
                <li><button onClick={() => setPage('work')} className="hover:text-[#39FF14] transition-colors hover:translate-x-1 inline-block">&gt; WORK</button></li>
                <li><button onClick={() => setPage('portfolio')} className="hover:text-[#39FF14] transition-colors hover:translate-x-1 inline-block">&gt; PORTFOLIO</button></li>
                <li><button onClick={() => setPage('journal')} className="hover:text-[#39FF14] transition-colors hover:translate-x-1 inline-block">&gt; JOURNAL</button></li>
                <li><button onClick={() => setPage('contact')} className="hover:text-[#39FF14] transition-colors hover:translate-x-1 inline-block">&gt; CONTACT</button></li>
              </ul>
            </div>

            <div className="border-4 border-[#39FF14]/30 p-6 bg-[#0a0e27]">
              <h4 className="font-black text-[#39FF14] mb-4 uppercase text-sm tracking-widest">[LEGAL]</h4>
              <ul className="space-y-3 text-sm font-mono">
                <li><a href="#" className="hover:text-[#39FF14] transition-colors hover:translate-x-1 inline-block">&gt; TERMS</a></li>
                <li><a href="#" className="hover:text-[#39FF14] transition-colors hover:translate-x-1 inline-block">&gt; PRIVACY</a></li>
                <li><a href="#" className="hover:text-[#39FF14] transition-colors hover:translate-x-1 inline-block">&gt; COOKIES</a></li>
                <li className="text-xs opacity-50 pt-2">© {new Date().getFullYear()} SIGHENCEA</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t-4 border-[#39FF14]/30 text-center">
            <p className="text-xs opacity-60 font-mono font-black uppercase tracking-widest">
              [DESIGNED_WITH_PRECISION] /// [BUILT_WITH_REACT_+_TAILWIND]
            </p>
          </div>
        </div>
      </footer>
    </div>;
};