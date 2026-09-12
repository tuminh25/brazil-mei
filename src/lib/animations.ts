'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type GSAPTarget = Element | Element[] | string | NodeListOf<Element>;

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Fade in up - Editorial entrance animation
 */
export const fadeInUp = (
  elements: GSAPTarget,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    y?: number;
    ease?: string;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return gsap.timeline();
  }

  const {
    delay = 0,
    duration = 0.8,
    stagger = 0.1,
    y = 40,
    ease = 'power3.out',
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

/**
 * Fade in - Simple opacity reveal
 */
export const fadeIn = (
  elements: GSAPTarget,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1 });
    return gsap.timeline();
  }

  const {
    delay = 0,
    duration = 0.6,
    stagger = 0.08,
    ease = 'power2.out',
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0 },
    {
      opacity: 1,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

/**
 * Image reveal with scale - Premium image entrance
 */
export const imageReveal = (
  elements: GSAPTarget,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    scale?: number;
    ease?: string;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, scale: 1 });
    return gsap.timeline();
  }

  const {
    delay = 0,
    duration = 1.2,
    stagger = 0.1,
    scale = 1.15,
    ease = 'power3.out',
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, scale },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

/**
 * Parallax scroll effect - Subtle, cinematic
 */
export const parallax = (
  element: GSAPTarget,
  options: {
    yPercent?: number;
    ease?: string;
    scrub?: number | boolean;
  } = {}
) => {
  if (prefersReducedMotion()) return gsap.timeline();

  const { yPercent = 15, ease = 'none', scrub = 1 } = options;

  return gsap.to(element, {
    yPercent,
    ease,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub,
    },
  });
};

/**
 * Hover lift - Premium card hover
 */
export const hoverLift = (element: HTMLElement, lift = -8) => {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ paused: true });
  tl.to(element, { y: lift, duration: 0.4, ease: 'power2.out' });

  element.addEventListener('mouseenter', () => tl.play());
  element.addEventListener('mouseleave', () => tl.reverse());

  return () => {
    element.removeEventListener('mouseenter', () => tl.play());
    element.removeEventListener('mouseleave', () => tl.reverse());
    tl.kill();
  };
};

/**
 * Hover image zoom - Subtle image zoom on card hover
 */
export const hoverImageZoom = (imageElement: HTMLElement, zoom = 1.04) => {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ paused: true });
  tl.to(imageElement, { scale: zoom, duration: 0.6, ease: 'power2.out' });

  imageElement.addEventListener('mouseenter', () => tl.play());
  imageElement.addEventListener('mouseleave', () => tl.reverse());

  return () => {
    imageElement.removeEventListener('mouseenter', () => tl.play());
    imageElement.removeEventListener('mouseleave', () => tl.reverse());
    tl.kill();
  };
};

/**
 * Magnetic button effect - Cursor follows button
 */
export const magneticButton = (button: HTMLElement, strength = 0.3) => {
  if (prefersReducedMotion()) return;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(button, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Stagger reveal for container children
 */
export const staggerReveal = (
  container: HTMLElement,
  selector: string,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    y?: number;
    ease?: string;
  } = {}
) => {
  const elements = container.querySelectorAll(selector);
  if (elements.length === 0) return gsap.timeline();

  return fadeInUp(elements, options);
};

/**
 * Section reveal on scroll - Editorial scroll animations
 */
export const sectionReveal = (
  section: HTMLElement,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    y?: number;
    ease?: string;
    trigger?: HTMLElement;
    start?: string;
    end?: string;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(section, { opacity: 1, y: 0 });
    return gsap.timeline();
  }

  const {
    delay = 0,
    duration = 0.8,
    stagger = 0.1,
    y = 50,
    ease = 'power3.out',
    trigger = section,
    start = 'top 80%',
    end = 'bottom 20%',
  } = options;

  const children = trigger.querySelectorAll('[data-animate]');
  if (children.length === 0) return gsap.timeline();

  return gsap.fromTo(
    children,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: {
        trigger,
        start,
        end,
        toggleActions: 'play none none reverse',
      },
    }
  );
};

/**
 * Headline reveal - Character/word by word
 */
export const headlineReveal = (
  element: HTMLElement,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    type?: 'chars' | 'words' | 'lines';
    ease?: string;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return gsap.timeline();
  }

  const { delay = 0, duration = 0.8, stagger = 0.05, type = 'words', ease = 'power3.out' } = options;

  // Split text into spans
  const text = element.textContent || '';
  element.innerHTML = '';
  
  let splitElements: HTMLElement[] = [];
  
  if (type === 'chars') {
    splitElements = text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(100%)';
      element.appendChild(span);
      return span;
    });
  } else if (type === 'words') {
    splitElements = text.split(' ').map((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + (i < text.split(' ').length - 1 ? ' ' : '');
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(100%)';
      element.appendChild(span);
      return span;
    });
  } else {
    splitElements = text.split('\n').map(line => {
      const span = document.createElement('span');
      span.textContent = line;
      span.style.display = 'block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(100%)';
      element.appendChild(span);
      return span;
    });
  }

  return gsap.to(splitElements, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    stagger,
    ease,
  });
};

/**
 * Clip path reveal - Premium image/text reveal
 */
export const clipReveal = (
  element: HTMLElement,
  options: {
    delay?: number;
    duration?: number;
    ease?: string;
    direction?: 'top' | 'bottom' | 'left' | 'right';
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { clipPath: 'inset(0 0 0 0)' });
    return gsap.timeline();
  }

  const { delay = 0, duration = 1, ease = 'power3.out', direction = 'top' } = options;

  const clipPaths = {
    top: 'inset(100% 0 0 0)',
    bottom: 'inset(0 0 100% 0)',
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
  };

  gsap.set(element, { clipPath: clipPaths[direction] });

  return gsap.to(element, {
    clipPath: 'inset(0 0 0 0)',
    duration,
    delay,
    ease,
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
};

/**
 * Image zoom on scroll - Cinematic parallax zoom
 */
export const imageZoomScroll = (
  element: HTMLElement,
  options: {
    scale?: number;
    scrub?: number | boolean;
  } = {}
) => {
  if (prefersReducedMotion()) return gsap.timeline();

  const { scale = 1.2, scrub = 1 } = options;

  return gsap.to(element, {
    scale,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub,
    },
  });
};

/**
 * Progress bar animation - Scroll progress indicator
 */
export const progressBar = (
  progressElement: HTMLElement,
  options: {
    trigger?: HTMLElement;
    start?: string;
    end?: string;
  } = {}
) => {
  if (prefersReducedMotion()) return gsap.timeline();

  const { trigger = document.body, start = 'top top', end = 'bottom bottom' } = options;

  return gsap.to(progressElement, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: true,
    },
  });
};

/**
 * Floating particles - Subtle ambient animation
 */
export const floatingParticles = (
  container: HTMLElement,
  options: {
    count?: number;
    color?: string;
    size?: number;
    speed?: number;
  } = {}
) => {
  if (prefersReducedMotion()) return;

  const { count = 20, color = '#2563eb', size = 3, speed = 20 } = options;

  const particles: HTMLElement[] = [];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      opacity: ${0.1 + Math.random() * 0.3};
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `;
    container.appendChild(particle);
    particles.push(particle);
  }

  particles.forEach((particle, i) => {
    gsap.to(particle, {
      y: `-=${100 + Math.random() * 200}`,
      x: `+=${-50 + Math.random() * 100}`,
      rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
      duration: speed + Math.random() * speed,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      delay: Math.random() * speed,
    });
  });

  return () => {
    particles.forEach(p => {
      gsap.killTweensOf(p);
      p.remove();
    });
  };
};

/**
 * Initialize all scroll animations for a page
 */
export const initPageAnimations = () => {
  if (prefersReducedMotion()) return;

  // Refresh ScrollTrigger
  ScrollTrigger.refresh();

  // Add scroll-triggered animations to sections
  const sections = document.querySelectorAll('section[data-section]');
  sections.forEach((section, index) => {
    const animatedElements = section.querySelectorAll('[data-animate]');
    if (animatedElements.length > 0) {
      gsap.fromTo(
        animatedElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  });

  // Parallax for hero images
  const heroImages = document.querySelectorAll('.hero-image, [data-parallax]');
  heroImages.forEach(img => {
    gsap.to(img, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });

  // Card hover effects
  const cards = document.querySelectorAll('.card, .card-elevated, .card-glass, .premium-card');
  cards.forEach(card => {
    const image = card.querySelector('img');
    if (image) {
      hoverLift(card as HTMLElement, -6);
      hoverImageZoom(image as HTMLElement, 1.03);
    }
  });

  // Magnetic buttons
  const magneticButtons = document.querySelectorAll('.btn-magnetic, [data-magnetic]');
  magneticButtons.forEach(btn => {
    magneticButton(btn as HTMLElement, 0.2);
  });
};

/**
 * Cleanup all animations
 */
export const killAllAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
};

export default {
  prefersReducedMotion,
  fadeInUp,
  fadeIn,
  imageReveal,
  parallax,
  hoverLift,
  hoverImageZoom,
  magneticButton,
  staggerReveal,
  sectionReveal,
  headlineReveal,
  clipReveal,
  imageZoomScroll,
  progressBar,
  floatingParticles,
  initPageAnimations,
  killAllAnimations,
};