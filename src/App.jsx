import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useCallback, useState } from 'react';
import SplitText from './SplitText';

const Section = ({ children, className, id, style }) => (
  <motion.section
    id={id}
    className={className}
    style={style}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    {children}
    <div className="hero-vignette" style={{ zIndex: 0, opacity: 0.6 }} />
  </motion.section>
);

const FloralDecor = ({ variant = 'default' }) => (
  <>
    {variant === 'default' && (
      <>
        <img src="/assets/leftF.webp" className="floral-bg floral-top-left" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
        <img src="/assets/rightF.webp" className="floral-bg floral-bottom-right" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
      </>
    )}
    {variant === 'reversed' && (
      <>
        <img src="/assets/rightF.webp" className="floral-bg floral-top-right" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
        <img src="/assets/leftF.webp" className="floral-bg floral-bottom-left" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
      </>
    )}
    {variant === 'top-only' && (
      <>
        <img src="/assets/leftF.webp" className="floral-bg floral-top-left" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
        <img src="/assets/rightF.webp" className="floral-bg floral-top-right" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
      </>
    )}
  </>
);

const Preloader = ({ progress, visible }) => {
  // Generate particles
  const particles = Array.from({ length: 12 });

  return (
    <motion.div
      className="preloader-overlay"
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 1.2,
        pointerEvents: visible ? 'auto' : 'none'
      }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {/* Ghostly Florals */}
      <motion.img
        src="/assets/leftF.webp"
        className="preloader-floral left"
        animate={{ rotate: [0, 5, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.img
        src="/assets/rightF.webp"
        className="preloader-floral right"
        animate={{ rotate: [0, -5, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Floating Gold Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="gold-particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            y: [null, '-100vh'],
            opacity: [0, 0.6, 0],
            x: [null, `+=${(Math.random() - 0.5) * 100}px`]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}

      <div className="preloader-central">
        <div className="monogram-container">
          {/* Growing Vine Flourish */}
          <svg className="vine-flourish" viewBox="0 0 400 100">
            <motion.path
              d="M 50 80 Q 150 20 200 50 T 350 20"
              stroke="var(--accent-gold)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="400"
              animate={{ strokeDashoffset: 400 - (400 * progress) / 100 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
              style={{ opacity: 0.4 }}
            />
          </svg>

          <motion.div
            className="preloader-heart"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 100 100" width="72" height="72" fill="none">
              {/* Sparkle dots */}
              {[
                { cx: 50, cy: 7, delay: 0 },
                { cx: 19, cy: 18, delay: 0.4 },
                { cx: 81, cy: 18, delay: 0.8 },
                { cx: 4, cy: 46, delay: 1.2 },
                { cx: 96, cy: 46, delay: 1.6 },
                { cx: 50, cy: 98, delay: 2.0 },
              ].map(({ cx, cy, delay }, i) => (
                <motion.circle
                  key={i}
                  cx={cx} cy={cy} r="1.4"
                  fill="var(--accent-gold)"
                  animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.4, delay, ease: 'easeInOut' }}
                />
              ))}

              {/* Heart outline — draws itself in */}
              <motion.path
                d="M50 35 C50 28,40 20,30 20 C18 20,12 32,12 42 C12 58,26 68,50 82 C74 68,88 58,88 42 C88 32,82 20,70 20 C60 20,50 28,50 35Z"
                stroke="var(--accent-gold)"
                strokeWidth="1.4"
                fill="rgba(197,160,89,0.07)"
                strokeDasharray="280"
                animate={{ strokeDashoffset: [280, 0, 0, 280] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.55, 0.75, 1], ease: 'easeInOut' }}
              />

            </svg>
          </motion.div>

          <div className="liquid-text-wrapper">
            <h1 className="liquid-text">
              ALBIN <span className="amp">&</span> ANITHA
              <div
                className="liquid-fill"
                style={{ width: `${progress}%` }}
              >
                <div className="liquid-fill-inner">
                  ALBIN <span className="amp">&</span> ANITHA
                </div>
                <div className="text-shimmer" />
              </div>
            </h1>
          </div>
        </div>

        <div className="date-badge">
          <motion.span
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.98, 1.02, 0.98]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            MAY 09 • 2026
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

const TOTAL_SLIDES = 3;
const SWIPE_THRESHOLD = 40;

const CRITICAL_ASSETS = [
  '/assets/topborder.webp',
  '/assets/client.webp',
  '/assets/borderside.webp',
  '/assets/song.mp3',
  '/assets/leftF.webp',
  '/assets/rightF.webp'
];

const SECONDARY_ASSETS = [
  '/assets/one.webp',
  '/assets/two.webp',
  '/assets/drawcouple.webp',
  '/assets/bottomframe1.webp',
  '/assets/clienthero.webp',
  '/assets/client_details.webp'
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [horizontalComplete, setHorizontalComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartRef = useRef(0);
  const isAnimating = useRef(false);
  const frameRef = useRef(null);
  const audioRef = useRef(null);

  const handleAddToCalendar = (e) => {
    e.preventDefault();
    const event = {
      title: "Albin & Anitha Engagement",
      start: "20260509T120000",
      end: "20260509T150000",
      location: "Marth Mariyam Town Church, Muttom",
      description: "Join us for the Engagement Ceremony of Albin & Anitha."
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      `LOCATION:${event.location}`,
      `DESCRIPTION:${event.description}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Albin_Anitha_Engagement.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = CRITICAL_ASSETS.length;

    const preloadItem = (src) => {
      return new Promise((resolve) => {
        const isAudio = src.endsWith('.mp3');
        if (isAudio) {
          const audio = new Audio();
          audio.src = src;
          audio.oncanplaythrough = audio.onerror = () => {
            loadedCount++;
            setLoadingProgress((loadedCount / totalAssets) * 100);
            resolve();
          };
        } else {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => {
            loadedCount++;
            setLoadingProgress((loadedCount / totalAssets) * 100);
            resolve();
          };
        }
      });
    };

    // Load Critical Assets First
    Promise.all(CRITICAL_ASSETS.map(src => preloadItem(src))).then(() => {
      setTimeout(() => setIsLoading(false), 1500);

      // Start background preloading of secondary assets once critical path is clear
      SECONDARY_ASSETS.forEach(src => {
        if (src.endsWith('.mp3')) {
          new Audio().src = src;
        } else {
          new Image().src = src;
        }
      });
    });
  }, []);

  // Attempt autoplay when loader finishes
  useEffect(() => {
    if (!isLoading && isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked - waiting for interaction");
      });
    }
  }, [isLoading, isPlaying]);

  const goToSlide = useCallback((index) => {
    if (isAnimating.current) return;
    if (index < 0 || index >= TOTAL_SLIDES) return;

    isAnimating.current = true;
    setCurrentSlide(index);
    if (audioRef.current && audioRef.current.paused && isPlaying) {
      audioRef.current.play().catch(() => { });
    }
    setTimeout(() => { isAnimating.current = false; }, 1200);
  }, [isPlaying]);

  // HORIZONTAL MODE: Lock scroll and capture swipes
  useEffect(() => {
    if (horizontalComplete) return;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleWheel = (e) => {
      e.preventDefault();
      if (isAnimating.current) return;

      if (e.deltaY > 0) {
        if (currentSlide < TOTAL_SLIDES - 1) {
          goToSlide(currentSlide + 1);
        } else {
          // Last slide → release to vertical scroll
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.overflow = '';
          document.body.style.touchAction = '';
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          window.scrollTo(0, 0);
          document.documentElement.style.scrollBehavior = '';
          setHorizontalComplete(true);
        }
      } else if (e.deltaY < 0) {
        if (currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
      }
    };

    const handleTouchStart = (e) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (isAnimating.current) return;
      const deltaY = touchStartRef.current - e.changedTouches[0].clientY;

      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

      if (deltaY > 0) {
        // Swiped UP → next slide
        if (currentSlide < TOTAL_SLIDES - 1) {
          goToSlide(currentSlide + 1);
        } else {
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.overflow = '';
          document.body.style.touchAction = '';
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          window.scrollTo(0, 0);
          document.documentElement.style.scrollBehavior = '';
          setHorizontalComplete(true);
        }
      } else {
        // Swiped DOWN → prev slide
        if (currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [currentSlide, horizontalComplete, goToSlide]);

  // Force scroll to top when 4th section appears
  useEffect(() => {
    if (!horizontalComplete) return;
    const resetScroll = () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
      if (frameRef.current) frameRef.current.scrollTop = 0;
      document.documentElement.style.scrollBehavior = '';
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
  }, [horizontalComplete]);

  // Re-enter horizontal mode when user scrolls back to very top
  useEffect(() => {
    if (!horizontalComplete) return;

    let canReEnter = false;
    const timer = setTimeout(() => { canReEnter = true; }, 1000);

    const handleScroll = () => {
      if (canReEnter && window.scrollY <= 2) {
        canReEnter = false;
        window.scrollTo(0, 0);
        setHorizontalComplete(false);
        setCurrentSlide(TOTAL_SLIDES - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [horizontalComplete]);

  return (
    <>
      <Preloader progress={loadingProgress} visible={isLoading} />

      <audio
        ref={audioRef}
        src="/assets/song.mp3"
        loop
      />


      <motion.main
        ref={frameRef}
        key="main"
        className="app-frame"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 1.05 : 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <motion.div
          className="music-control"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isLoading ? 0 : 1, x: 0 }}
          transition={{ delay: 2.5 }}
          onClick={(e) => {
            e.stopPropagation();
            if (isPlaying) {
              audioRef.current.pause();
              setIsPlaying(false);
            } else {
              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
            }
          }}
          title={isPlaying ? "Stop Music" : "Play Music"}
        >
          <div className="music-icon-wrapper">
            <div className={`speaker-icon ${!isPlaying ? 'muted' : ''}`}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
            </div>
          </div>
        </motion.div>
        {/* ===== FULLSCREEN MORPH SLIDER ===== */}
        <AnimatePresence>
          {!horizontalComplete && (
            <motion.div className="horizontal-slider-fixed" key="slider-wrapper" exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>

              {/* Scroll to Explore Indicator */}
              <motion.div
                className={`scroll-indicator slide-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: (!isLoading && currentSlide < 3) ? 1 : 0, y: 0 }}
                transition={{ delay: 3, duration: 1 }}
              >
                <div className="scroll-arrows-group">
                  <div className="arrow-chevron-pulse v1"></div>
                  <div className="arrow-chevron-pulse v2"></div>
                  <div className="arrow-chevron-pulse v3"></div>
                </div>
                <span className="scroll-text">Scroll to Explore</span>
              </motion.div>

              {/* SLIDE 1: HERO */}
              <AnimatePresence>
                {currentSlide === 0 && (
                  <motion.section
                    key="slide-0"
                    className="hero-section morph-slide"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.img
                      src="/assets/topborder.webp"
                      className="top-border-asset"
                      initial={{ y: -200, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -200, opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeIn' }}
                      alt=""
                    />
                    <div className="hero-image-container">
                      <div className="gold-frame" />
                      <div className="hero-image-wrapper">
                        <img src="/assets/client.webp" className="hero-image" alt="Albin and Anitha" />
                        <div className="hero-gradient-overlay" />
                        <div className="hero-vignette" />
                      </div>
                    </div>
                    <motion.div
                      className="hero-text-overlay"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <p className="wedding-of-text">The Engagement of</p>
                      <div className="couple-names-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <SplitText
                          text="Albin"
                          className="couple-names"
                          delay={35}
                          duration={1.5}
                          ease="expo.out"
                          from={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                          to={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        />
                        <motion.span
                          className="heart-icon heart-size"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          style={{ display: 'inline-block', color: 'var(--accent-gold)' }}
                        >❤</motion.span>
                        <SplitText
                          text="Anitha"
                          className="couple-names"
                          delay={35}
                          duration={1.5}
                          ease="expo.out"
                          from={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                          to={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        />
                      </div>
                      <div className="date-separator">
                        <div className="line" />
                        <span className="date-text">09 May 2026</span>
                        <div className="line" />
                      </div>
                    </motion.div>
                  </motion.section>
                )}

                {/* SLIDE 2: THE JOURNEY */}
                {currentSlide === 1 && (
                  <motion.section
                    key="slide-1"
                    className="hero-section morph-slide"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <FloralDecor variant="top-only" />
                    <div className="hero-image-container">
                      <div className="gold-frame" />
                      <div className="hero-image-wrapper">
                        <img src="/assets/one.webp" className="hero-image" alt="Love Story" />
                        <div className="hero-gradient-overlay" />
                        <div className="hero-vignette" />
                      </div>
                    </div>
                    <motion.div
                      className="hero-text-overlay"
                      style={{ marginBottom: '3rem' }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <p className="wedding-of-text">Two Hearts</p>
                      <SplitText
                        text="One Journey"
                        className="couple-names couple-names-slide"
                        delay={30}
                        duration={1.5}
                        ease="expo.out"
                      />
                    </motion.div>
                  </motion.section>
                )}

                {/* SLIDE 3: THE PROMISE */}
                {currentSlide === 2 && (
                  <motion.section
                    key="slide-2"
                    className="hero-section morph-slide"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <FloralDecor variant="reversed" />
                    <div className="hero-image-container">
                      <div className="gold-frame" />
                      <div className="hero-image-wrapper">
                        <img src="/assets/two.webp" className="hero-image" alt="Engagement Day" />
                        <div className="hero-gradient-overlay" />
                        <div className="hero-vignette" />
                      </div>
                    </div>
                    <motion.div
                      className="hero-text-overlay"
                      style={{ marginBottom: '3rem' }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <p className="wedding-of-text">Silent Vows</p>
                      <SplitText
                        text="Endless Love"
                        className="couple-names couple-names-slide"
                        delay={30}
                        duration={1.5}
                        ease="expo.out"
                      />
                    </motion.div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Side borders — outside slide section so they stack above the bottom frame */}
              <AnimatePresence>
                {currentSlide === 0 && (
                  <>
                    <motion.img
                      key="side-left"
                      src="/assets/borderside.webp"
                      className="side-border-left"
                      initial={{ x: -100, opacity: 0, scaleX: -1 }}
                      animate={{ x: 0, opacity: 1, scaleX: -1 }}
                      exit={{ y: 200, opacity: 0, scaleX: -1 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{ zIndex: 55 }}
                      alt=""
                    />
                    <motion.img
                      key="side-right"
                      src="/assets/borderside.webp"
                      className="side-border-right"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ y: 200, opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{ zIndex: 55 }}
                      alt=""
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Persistent Bottom Frame — stays across slide 2 & 3 transitions */}
              <motion.img
                src="/assets/bottomframe1.webp"
                className="bottom-border-asset"
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: currentSlide >= 1 ? 0 : 300, opacity: currentSlide >= 1 ? 1 : 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ zIndex: 50 }}
                alt=""
              />

            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== CONSOLIDATED INVITATION ===== */}
        <motion.section
          className="reception-section"
          id="reception"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: horizontalComplete ? 1 : 0, y: horizontalComplete ? 0 : 40 }}
          transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        >
          <div className="premium-reception-container">

            {/* Corner Florals (clipped inside box) */}
            <img src="/assets/rightF.webp" className="box-floral box-floral-top-right" alt="" />
            <img src="/assets/leftF.webp" className="box-floral box-floral-bottom-left" alt="" />

            {/* Couple Sketch */}
            <div className="reception-hero-block">
              <div className="reception-integrated-illustration">
                <img src="/assets/drawcouple.webp" alt="Couple Sketch" className="couple-sketch-integrated" />
              </div>
              <div className="reception-header">
                <span className="subtitle-gold">SAVE THE DATE FOR THE</span>
                <SplitText
                  text="Engagement Day"
                  className="title-serif-large"
                  delay={40}
                  duration={1.8}
                  ease="expo.out"
                />
              </div>
            </div>

            <div className="ornamental-divider"><div className="line" /><div className="diamond" /><div className="line" /></div>

            {/* Date & Time */}
            <div className="reception-grid">
              <div className="date-block-premium">
                <p className="month">MAY</p>
                <div className="day-number-wrapper">
                  <div className="side-line" />
                  <p className="day-number">09</p>
                  <div className="side-line" />
                </div>
                <p className="year">2026</p>
                <p className="day-name">SATURDAY</p>
              </div>

              <div className="info-block-premium">
                <div className="time-info">
                  <p className="label">JOIN US AT</p>
                  <p className="value">12:00 <span className="time-period">PM</span></p>
                  <p className="sub-value">MIDDAY</p>
                </div>
                <a
                  href="#"
                  onClick={handleAddToCalendar}
                  className="btn-luxury"
                >
                  <span>ADD TO CALENDAR</span>
                </a>
              </div>
            </div>

            <div className="ornamental-divider"><div className="line" /><div className="diamond" /><div className="line" /></div>

            {/* Location */}
            <div className="location-info-integrated">
              <span className="subtitle-gold">THE LOCATION</span>
              <h3 className="title-serif" style={{ fontSize: '1.8rem', color: '#fff', margin: '0.3rem 0' }}>Marth Mariyam Town Church</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.6, margin: '0.3rem 0 1.5rem' }}>
                Muttom<br />Thodupuzha, Kerala
              </p>
              <a href="https://maps.app.goo.gl/pbD51AZLsYnMMdgL7" target="_blank" rel="noopener noreferrer" className="btn-luxury"><span>VIEW ON MAP</span></a>
            </div>

            {/* Sign-off */}
            <div className="simple-signoff">
              <p className="title-script" style={{ fontSize: '2.5rem', color: '#fff' }}>Thank You</p>
              <p className="subtitle-gold" style={{ opacity: 0.5, marginTop: '0.3rem' }}>Albin, Anitha & Family</p>
            </div>

          </div>
        </motion.section>
      </motion.main>
    </>
  );
}
