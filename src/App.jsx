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

  // RE-ENTER horizontal mode when scrolling back to top
  useEffect(() => {
    if (!horizontalComplete) return;

    const handleScroll = () => {
      if (window.scrollY <= 5) {
        setHorizontalComplete(false);
        setCurrentSlide(TOTAL_SLIDES - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [horizontalComplete]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ===== FULLSCREEN HORIZONTAL SLIDER ===== */}
      {!horizontalComplete && (
        <div className="horizontal-slider-fixed">
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
                <h1 className="couple-names">Albin & Anitha</h1>
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
        </div>
      )}

      {/* ===== REMAINING VERTICAL SECTIONS ===== */}
      <Section className="reception-section">
        <FloralDecor variant="reversed" />
        <div className="card">
          <p className="title-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Engagement Day</p>
          <div className="gold-line" style={{ width: '40px' }} />
          <p className="title-serif" style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', letterSpacing: '4px' }}>THE CELEBRATION</p>

          <div className="reception-date">
            <p className="day">Saturday,</p>
            <p className="full-date">09 MEI 2026</p>
          </div>

          <p className="title-serif" style={{ fontSize: '0.8rem', opacity: 0.7, letterSpacing: '1px' }}>
            Event: 11.00 AM - Onwards
          </p>

          <a href="#" className="btn-gold">Save the Date</a>
        </div>
      </Section>

      <Section className="location-section">
        <FloralDecor />
        <div className="card">
          <div style={{ marginBottom: '1.5rem' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="title-serif" style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', letterSpacing: '4px', marginBottom: '1.5rem' }}>THE LOCATION</p>
          <p className="title-serif" style={{ fontSize: '1.5rem', textTransform: 'none' }}>Hotel la Belle</p>
          <div className="gold-line" style={{ width: '30px', margin: '1rem auto' }} />
          <p className="title-serif" style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'none', lineHeight: '1.6' }}>
            597 Max Parkways, East Patience 82997,<br />
            France
          </p>
          <a href="#" className="btn-gold">View Location</a>
        </div>
      </Section>

      <Section className="wishes-section">
        <FloralDecor variant="reversed" />
        <div className="card" style={{ maxWidth: '500px' }}>
          <h2 className="title-script" style={{ fontSize: '3.5rem', color: '#fff' }}>Best Wishes</h2>
          <div className="gold-line" />
          <p className="title-serif" style={{ fontSize: '0.9rem', marginBottom: '2rem', opacity: 0.8 }}>
            Your presence means the world to us. Please leave us a message.
          </p>
          <textarea
            className="wishes-input"
            placeholder="Type your message here..."
            rows="4"
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-gold)', color: '#fff', marginBottom: '1rem' }}
          />
          <button className="btn-gold" style={{ width: '100%' }}>Send Wishes</button>
        </div>
      </Section>

      <footer style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--bg-dark)' }}>
        <p className="title-script" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Thank You</p>
        <div className="gold-line" />
        <p className="title-serif" style={{ fontSize: '0.7rem', letterSpacing: '4px', opacity: 0.5 }}>ALBIN & ANITHA • 2026</p>
      </footer>
    </motion.main>
  );
}
