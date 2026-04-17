import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const SplitText = ({
  text = "",
  className = "",
  delay = 0,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
  showCallback = false
}) => {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useGSAP(() => {
    if (!inView) return;

    const elements = containerRef.current.querySelectorAll('.split-item');
    
    gsap.fromTo(elements, from, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      onComplete: () => {
        if (onLetterAnimationComplete) onLetterAnimationComplete();
        if (showCallback) console.log('All letters have animated!');
      }
    });
  }, { scope: containerRef, dependencies: [inView] });

  // Simple manual split since we don't have the official SplitText plugin
  const items = text.split(splitType === 'words' ? ' ' : '');

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ 
        textAlign, 
        display: 'inline-block',
        whiteSpace: splitType === 'words' ? 'normal' : 'pre' 
      }}
    >
      {items.map((item, i) => (
        <span 
          key={i} 
          className="split-item" 
          style={{ display: 'inline-block' }}
        >
          {item}{splitType === 'words' && i < items.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
