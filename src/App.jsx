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
  const start = index / CONTENT.length;
  const end = (index + 1) / CONTENT.length;
  
  // Continuous Overlap Logic: 
  // Next scene starts at 'start - 0.3' so it's visible while previous is active
  // Current scene exits at 'end + 0.2' so it fully passes the camera
  const scale = useTransform(scrollYProgress, [start - 0.4, start, end, end + 0.4], [0.1, 1, 1.2, 5]);
  const opacity = useTransform(scrollYProgress, [start - 0.3, start, start + 0.1, end - 0.1, end, end + 0.2], [0, 0, 1, 1, 0.5, 0]);
  const blur = useTransform(scrollYProgress, [start - 0.4, start, start + 0.2], [20, 0, 0]);
  const zIndex = index + 10;

  return (
    <motion.section 
      className="scene"
      style={{ 
        scale,
        opacity,
        zIndex,
        filter: `blur(${blur}px)`,
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
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

      {/* 3D Floating Lanterns (Dynamic count for depth) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(10)].map((_, i) => (
          <Lantern key={i} delay={i * 2 + index} />
        ))}
      </div>

      {/* Content Layer with 'Pull' Effect */}
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
        <h2 className="editorial-title">{data.title}</h2>
        <div style={{ height: '1px', width: '80px', background: 'var(--accent)', margin: '0 auto 2.5rem' }} />
        <p className="editorial-body">{data.body}</p>
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main ref={containerRef} style={{ height: `${CONTENT.length * 100}vh`, position: 'relative' }}>
      <CustomCursor />
      
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

      {/* Aesthetic Side Labels - Hidden on Mobile */}
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



