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
    duration = 0.6,
    stagger = 0.1,
    y = 30,
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
    duration = 0.5,
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
    duration = 0.8,
    stagger = 0.1,
    scale = 1.1,
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

export const parallax = (
  element: GSAPTarget,
  options: {
    yPercent?: number;
    ease?: string;
    scrub?: number | boolean;
  } = {}
) => {
  if (prefersReducedMotion()) return gsap.timeline();

  const { yPercent = 20, ease = 'none', scrub = 1 } = options;

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

export const hoverLift = (element: HTMLElement, lift = -8) => {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ paused: true });
  tl.to(element, { y: lift, duration: 0.3, ease: 'power2.out' });

  element.addEventListener('mouseenter', () => tl.play());
  element.addEventListener('mouseleave', () => tl.reverse());

  return () => {
    element.removeEventListener('mouseenter', () => tl.play());
    element.removeEventListener('mouseleave', () => tl.reverse());
    tl.kill();
  };
};

export const hoverImageZoom = (imageElement: HTMLElement, zoom = 1.05) => {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ paused: true });
  tl.to(imageElement, { scale: zoom, duration: 0.4, ease: 'power2.out' });

  imageElement.addEventListener('mouseenter', () => tl.play());
  imageElement.addEventListener('mouseleave', () => tl.reverse());

  return () => {
    imageElement.removeEventListener('mouseenter', () => tl.play());
    imageElement.removeEventListener('mouseleave', () => tl.reverse());
    tl.kill();
  };
};

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
    duration = 0.7,
    stagger = 0.1,
    y = 40,
    ease = 'power3.out',
    trigger = section,
    start = 'top 85%',
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