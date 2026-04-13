import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';

const CONTENT = [
  {
    id: 'intro',
    subtitle: 'THE SACRED BEGINNING',
    title: 'Grace & Eternal',
    body: 'A love written in the heavens, celebrated under the silver moon.',
    image: '/assets/hero.png',
    floatingColor: 'rgba(229, 193, 133, 0.6)'
  },
  {
    id: 'story',
    subtitle: 'A JOURNEY OF FAITH',
    title: 'Written in Heavens',
    body: 'Faith, Hope, and Love. But the greatest of these is Love.',
    image: '/assets/story.png',
    floatingColor: 'rgba(255, 255, 255, 0.4)'
  },
  {
    id: 'vow',
    subtitle: 'THE DIVINE COVENANT',
    title: 'A Promise of Forever',
    body: 'Two souls becoming one in a sacred dance of destiny.',
    image: '/assets/vow.png',
    floatingColor: 'rgba(229, 193, 133, 0.6)'
  },
  {
    id: 'details',
    subtitle: 'THE CELEBRATION',
    title: 'Join Our Joy',
    body: 'St. Mary’s Cathedral | 4:00 PM. May 24, 2026.',
    image: '/assets/details.png',
    cta: true,
    floatingColor: 'rgba(255, 255, 255, 0.4)'
  }
];

const Lantern = ({ delay }) => {
  const x = Math.random() * 100;
  const size = Math.random() * 20 + 10;
  const duration = Math.random() * 15 + 15;
  const depth = Math.random(); // 0 to 1 for parallax depth

  return (
    <motion.div
      initial={{ x: `${x}%`, y: '110vh', rotate: 0 }}
      animate={{ 
        y: '-20vh', 
        rotate: [0, 5, -5, 0],
        x: [`${x}%`, `${x + (Math.random() - 0.5) * 15}%`]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        delay: delay,
        ease: 'linear'
      }}
      style={{ 
        position: 'absolute',
        width: size, 
        height: size * 1.5,
        zIndex: depth > 0.8 ? 50 : depth > 0.4 ? 15 : 5,
        filter: `blur(${ (1 - depth) * 2 }px)`,
        pointerEvents: 'none'
      }}
    >
      {/* Lantern Body */}
      <div 
        className="lantern-glow"
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, #f39c12, #e67e22)',
          borderRadius: '4px',
          position: 'relative'
        }}
      >
        {/* Lantern Top/Bottom caps */}
        <div style={{ position: 'absolute', top: -2, left: '10%', right: '10%', height: '4px', background: '#2c3e50', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', bottom: -2, left: '10%', right: '10%', height: '4px', background: '#2c3e50', borderRadius: '2px' }} />
        
        {/* Flickering Flame Glow */}
        <motion.div 
          animate={{ opacity: [0.6, 1, 0.7, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '20%',
            background: 'radial-gradient(circle, #fff 0%, #f1c40f 70%, transparent 100%)',
            filter: 'blur(5px)'
          }}
        />
      </div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <motion.div className="cursor-dot" style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }} />
      <motion.div className="cursor-follower" style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }} />
    </>
  );
};

const Scene = ({ data, index, scrollYProgress }) => {
  const count = CONTENT.length;
  const start = index / count;
  const end = (index + 1) / count;
  const nextStart = (index + 1) / count;
  
  // Transition curves
  // If it's the first scene, it starts at scale 1 and opacity 1
  const scale = useTransform(
    scrollYProgress, 
    [start - 0.2, start, end, end + 0.3], 
    index === 0 ? [1, 1, 1.3, 4] : [0.2, 1, 1.3, 4]
  );
  
  const opacity = useTransform(
    scrollYProgress, 
    [start - 0.15, start, start + 0.05, end - 0.05, end, end + 0.15], 
    index === 0 
      ? [1, 1, 1, 1, 0.5, 0] 
      : (index === count - 1 
          ? [0, 0, 1, 1, 1, 1] 
          : [0, 0, 1, 1, 0.5, 0])
  );

  const blur = useTransform(
    scrollYProgress, 
    [start - 0.2, start, start + 0.1], 
    index === 0 ? [0, 0, 0] : [20, 0, 0]
  );

  return (
    <motion.section 
      className="scene"
      style={{ 
        scale,
        opacity,
        zIndex: index + 10,
        filter: `blur(${blur}px) url(#liquid-filter)`,
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pointerEvents: useTransform(scrollYProgress, [start, end], ['auto', 'none'])
      }}
    >
      {/* Background Depth */}
      <div className="parallax-container">
        <div 
          className="parallax-layer layer-bg"
          style={{ 
            backgroundImage: `url(${data.image})`,
            filter: `brightness(0.35)`
          }}
        />
        <div className="atmosphere" />
      </div>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(10)].map((_, i) => (
          <Lantern key={i} delay={i * 2 + index} />
        ))}
      </div>

      {/* Content Layer with 'Liquid' Distortion */}
      <motion.div 
        style={{ 
          position: 'relative', 
          zIndex: 100, 
          textAlign: 'center', 
          padding: '0 2rem',
          opacity: useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0])
        }}
      >
        <span className="editorial-subtitle" style={{ letterSpacing: '0.6em' }}>{data.subtitle}</span>
        <h2 className="editorial-title" style={{ filter: 'url(#liquid-filter)' }}>{data.title}</h2>
        <div style={{ height: '1px', width: '80px', background: 'var(--accent)', margin: '0 auto 2.5rem' }} />
        <p className="editorial-body" style={{ filter: 'url(#liquid-filter)' }}>{data.body}</p>
        {data.cta && (
          <div style={{ marginTop: '3rem' }}>
            <a href="#" className="btn-cinematic">RSVP OUR UNION</a>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [freq, setFreq] = useState(0.012);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Animate the liquid filter base frequency for a shifting molten effect
  useEffect(() => {
    let frame;
    const animate = (time) => {
      setFreq(0.012 + Math.sin(time / 800) * 0.004);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main ref={containerRef} style={{ height: `${CONTENT.length * 100}vh`, position: 'relative' }}>
      <CustomCursor />
      
      {/* SVG Liquid Filter Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="liquid-filter">
          <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
        </filter>
      </svg>

      {/* Global Cinematic Elements */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.05)', zIndex: 1000 }} />
      
      <div className="nav-dots">
        {CONTENT.map((_, i) => (
          <div 
            key={i} 
            className="nav-dot"
            onClick={() => window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })}
          />
        ))}
      </div>

      <div className="stacked-container">
        {CONTENT.map((scene, idx) => (
          <Scene 
            key={scene.id} 
            data={scene} 
            index={idx} 
            scrollYProgress={smoothProgress}
          />
        ))}
      </div>

      {!isMobile && (
        <div style={{ position: 'fixed', left: '40px', bottom: '40px', zIndex: 100 }}>
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.3 }}
             style={{ transform: 'rotate(-90deg)', originX: 'left', fontSize: '0.6rem', letterSpacing: '0.6em' }}
           >
             SCROLL TO EXPLORE THE BLESSING
           </motion.div>
        </div>
      )}
    </main>
  );
}




