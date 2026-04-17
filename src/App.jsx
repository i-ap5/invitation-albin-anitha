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

const TOTAL_SLIDES = 3;
const SWIPE_THRESHOLD = 40;

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [horizontalComplete, setHorizontalComplete] = useState(false);
  const touchStartRef = useRef(0);
  const isAnimating = useRef(false);

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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
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
                <p className="value">11:00 AM</p>
                <p className="sub-value">ONWARDS</p>
              </div>
              <a href="#" className="btn-luxury"><span>ADD TO CALENDAR</span></a>
            </div>
          </div>

          <div className="ornamental-divider"><div className="line" /><div className="diamond" /><div className="line" /></div>

          {/* Location */}
          <div className="location-info-integrated">
            <span className="subtitle-gold">THE LOCATION</span>
            <h3 className="title-serif" style={{ fontSize: '1.8rem', color: '#fff', margin: '0.3rem 0' }}>Hotel la Belle</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.6, margin: '0.3rem 0 1.5rem' }}>
              597 Max Parkways, East Patience 82997,<br />France
            </p>
            <a href="#" className="btn-luxury"><span>VIEW ON MAP</span></a>
          </div>

          {/* Sign-off */}
          <div className="simple-signoff">
            <p className="title-script" style={{ fontSize: '2.5rem', color: '#fff' }}>Thank You</p>
            <p className="subtitle-gold" style={{ opacity: 0.5, marginTop: '0.3rem' }}>ALBIN & ANITHA • 2026</p>
          </div>

        </div>
      </section>
    </motion.main>
  );
}
