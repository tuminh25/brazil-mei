'use client';

import { useEffect, useRef } from 'react';

export default function HomePageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP animations on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initAnimations = async () => {
      const {
        prefersReducedMotion,
        fadeInUp,
        imageReveal,
        parallax,
        staggerReveal,
        hoverLift,
        hoverImageZoom,
        magneticButton,
        headlineReveal,
        floatingParticles,
        clipReveal,
        initPageAnimations
      } = await import('@/lib/animations');

      if (prefersReducedMotion()) return;

      // Hero headline reveal - word by word
      const heroHeadline = document.querySelector('.hero-headline');
      if (heroHeadline) {
        headlineReveal(heroHeadline as HTMLElement, {
          type: 'words',
          duration: 1.2,
          stagger: 0.08,
          delay: 0.3
        });
      }

      // Hero subtitle fade up
      fadeInUp('.hero-subtitle', { delay: 0.8, stagger: 0.1, duration: 0.8 });

      // Hero CTAs
      fadeInUp('.hero-cta', { delay: 1.2, stagger: 0.1, duration: 0.8 });

      // Trust indicators
      fadeInUp('.hero-trust', { delay: 1.6, stagger: 0.08, duration: 0.6 });

      // Hero image parallax
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        parallax(heroImage, { yPercent: 20, scrub: 1 });
      }

      // Hero image clip reveal
      clipReveal(heroImage as HTMLElement, {
        delay: 0.2,
        duration: 1.5,
        direction: 'top'
      });

      // Floating particles in hero
      if (particlesRef.current) {
        floatingParticles(particlesRef.current, {
          count: 15,
          color: '#2563eb',
          size: 2,
          speed: 30
        });
      }

      // Magnetic buttons
      const magneticButtons = document.querySelectorAll('[data-magnetic]');
      magneticButtons.forEach(btn => {
        magneticButton(btn as HTMLElement, 0.15);
      });

      // Section reveal animations
      const sections = document.querySelectorAll('section[data-section]');
      sections.forEach((section) => {
        staggerReveal(section as HTMLElement, '[data-animate]', {
          delay: 0.1,
          stagger: 0.06,
          duration: 0.7
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
    };

    initAnimations();
  }, []);

  return (
    <>
      {/* Floating Particles Container for Hero - client-side only */}
      <div className="absolute inset-0 -z-5 particles-container" ref={particlesRef} />
    </>
  );
}