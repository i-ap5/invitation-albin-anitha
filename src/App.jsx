import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useCallback, useState } from 'react';

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
        <img src="/assets/leftF.png" className="floral-bg floral-top-left" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
        <img src="/assets/rightF.png" className="floral-bg floral-bottom-right" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
      </>
    )}
    {variant === 'reversed' && (
      <>
        <img src="/assets/rightF.png" className="floral-bg floral-top-right" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
        <img src="/assets/leftF.png" className="floral-bg floral-bottom-left" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
      </>
    )}
    {variant === 'top-only' && (
      <>
        <img src="/assets/leftF.png" className="floral-bg floral-top-left" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
        <img src="/assets/rightF.png" className="floral-bg floral-top-right" style={{ scale: '1.2', opacity: 0.6 }} alt="" />
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
        src="/assets/leftF.png" 
        className="preloader-floral left"
        animate={{ rotate: [0, 5, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.img 
        src="/assets/rightF.png" 
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

          <h1 className="liquid-text">
            ALBIN <span className="amp">&</span> ANITHA
            {/* The gold filling layer */}
            <div 
              className="liquid-fill" 
              style={{ width: `${progress}%` }}
            >
              ALBIN <span className="amp">&</span> ANITHA
              {/* Shimmer sweep effect */}
              <div className="text-shimmer" />
            </div>
          </h1>
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

const ASSETS = [
  '/assets/topborder.png',
  '/assets/hhh.png',
  '/assets/borderside.png',
  '/assets/one.png',
  '/assets/bottomframe1.png',
  '/assets/two.png',
  '/assets/drawcouple.png',
  '/assets/leftF.png',
  '/assets/rightF.png',
  '/assets/clienthero.png',
  '/assets/client_details.png'
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [horizontalComplete, setHorizontalComplete] = useState(false);
  const touchStartRef = useRef(0);
  const isAnimating = useRef(false);

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
    const totalAssets = ASSETS.length;

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress((loadedCount / totalAssets) * 100);
          resolve();
        };
        img.onerror = resolve; // Continue even if one fails
      });
    };

    Promise.all(ASSETS.map(src => preloadImage(src))).then(() => {
      setTimeout(() => setIsLoading(false), 1000); // Small buffer for smoothness
    });
  }, []);

  const goToSlide = useCallback((index) => {
    if (isAnimating.current) return;
    if (index < 0 || index >= TOTAL_SLIDES) return;

    isAnimating.current = true;
    setCurrentSlide(index);
    setTimeout(() => { isAnimating.current = false; }, 700);
  }, []);

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
          setHorizontalComplete(true);
          document.body.style.overflow = '';
          document.body.style.touchAction = '';
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
          setHorizontalComplete(true);
          document.body.style.overflow = '';
          document.body.style.touchAction = '';
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

      <motion.main
        key="main"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 1.05 : 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
      {/* ===== FULLSCREEN HORIZONTAL SLIDER ===== */}
      <AnimatePresence>
        {!horizontalComplete && (
          <motion.div
            className="horizontal-slider-fixed"
            key="horizontal-slider"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div
              className="horizontal-belt"
              style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
            >
              {/* SLIDE 1: HERO */}
              <section className="hero-section">
                <motion.img
                  src="/assets/topborder.png"
                  className="top-border-asset"
                  animate={{ y: currentSlide > 0 ? -200 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  alt=""
                />
                <div className="hero-image-container">
                  <div className="gold-frame" />
                  <div className="hero-image-wrapper">
                    <img src="/assets/hhh.png" className="hero-image" alt="Albin and Anitha" />
                    <div className="hero-gradient-overlay" />
                    <div className="hero-vignette" />
                  </div>
                </div>
                <img src="/assets/borderside.png" className="side-border-left" alt="" />
                <img src="/assets/borderside.png" className="side-border-right" alt="" />
                <div className="hero-text-overlay">
                  <p className="wedding-of-text">The Engagement of</p>
                  <h1 className="couple-names">
                    Albin
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                      style={{
                        display: 'inline-block',
                        margin: '0 0.5rem',
                        color: 'var(--accent-gold)',
                        fontSize: '0.8em'
                      }}
                    >
                      ❤
                    </motion.span>
                    Anitha
                  </h1>
                  <div className="date-separator">
                    <div className="line" />
                    <span className="date-text">09/05/2026</span>
                    <div className="line" />
                  </div>
                </div>
              </section>

              {/* SLIDE 2: THE JOURNEY */}
              <section className="hero-section">
                <FloralDecor variant="top-only" />
                <div className="hero-image-container">
                  <div className="gold-frame" />
                  <div className="hero-image-wrapper">
                    <img src="/assets/one.png" className="hero-image" alt="Love Story" />
                    <div className="hero-gradient-overlay" />
                    <div className="hero-vignette" />
                  </div>
                </div>
                <motion.img
                  src="/assets/borderside.png"
                  className="side-border-left"
                  animate={{ y: currentSlide >= 1 ? 200 : 0, scaleX: -1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  alt=""
                />
                <motion.img
                  src="/assets/borderside.png"
                  className="side-border-right"
                  animate={{ y: currentSlide >= 1 ? 200 : 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  alt=""
                />
                <motion.img
                  src="/assets/bottomframe1.png"
                  className="bottom-border-asset"
                  animate={{ y: currentSlide >= 1 ? 0 : 300 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  alt=""
                />
                <div className="hero-text-overlay" style={{ marginBottom: '3rem' }}>
                  <p className="wedding-of-text">Our Journey</p>
                  <h2 className="couple-names" style={{ fontSize: 'clamp(2.4rem, 10vw, 5rem)' }}>Beautiful Moments</h2>
                </div>
              </section>

              {/* SLIDE 3: THE PROMISE */}
              <section className="hero-section">
                <FloralDecor variant="reversed" />
                <div className="hero-image-container">
                  <div className="gold-frame" />
                  <div className="hero-image-wrapper">
                    <img src="/assets/two.png" className="hero-image" alt="Engagement Day" />
                    <div className="hero-gradient-overlay" />
                    <div className="hero-vignette" />
                  </div>
                </div>
                <motion.img
                  src="/assets/borderside.png"
                  className="side-border-left"
                  animate={{ y: currentSlide >= 2 ? 200 : 0, scaleX: -1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  alt=""
                />
                <motion.img
                  src="/assets/borderside.png"
                  className="side-border-right"
                  animate={{ y: currentSlide >= 2 ? 200 : 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  alt=""
                />
                <motion.img
                  src="/assets/bottomframe1.png"
                  className="bottom-border-asset"
                  animate={{ y: currentSlide >= 2 ? 0 : 300 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  alt=""
                />
                <div className="hero-text-overlay" style={{ marginBottom: '3rem' }}>
                  <p className="wedding-of-text">Eternal Promise</p>
                  <h2 className="couple-names" style={{ fontSize: 'clamp(2.4rem, 10vw, 5rem)' }}>Together Forever</h2>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CONSOLIDATED INVITATION ===== */}
      <section className="reception-section" id="reception">
        <div className="premium-reception-container">

          {/* Corner Florals (clipped inside box) */}
          <img src="/assets/rightF.png" className="box-floral box-floral-top-right" alt="" />
          <img src="/assets/leftF.png" className="box-floral box-floral-bottom-left" alt="" />

          {/* Couple Sketch */}
          <div className="reception-hero-block">
            <div className="reception-integrated-illustration">
              <img src="/assets/drawcouple.png" alt="Couple Sketch" className="couple-sketch-integrated" />
            </div>
            <div className="reception-header">
              <span className="subtitle-gold">SAVE THE DATE FOR THE</span>
              <h2 className="title-serif-large">Engagement Day</h2>
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
                <p className="value">12:00 PM</p>
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
              Muttom<br />Idukki, Kerala
            </p>
            <a href="https://maps.app.goo.gl/pbD51AZLsYnMMdgL7" target="_blank" rel="noopener noreferrer" className="btn-luxury"><span>VIEW ON MAP</span></a>
          </div>

          {/* Sign-off */}
          <div className="simple-signoff">
            <p className="title-script" style={{ fontSize: '2.5rem', color: '#fff' }}>Thank You</p>
            <p className="subtitle-gold" style={{ opacity: 0.5, marginTop: '0.3rem' }}>ALBIN & ANITHA • 2026</p>
          </div>

        </div>
      </section>
        </motion.main>
    </>
  );
}
