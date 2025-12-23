'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * Hook for triggering animations when elements enter the viewport
 * Uses Intersection Observer for performance
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // On mobile, check if element is already in viewport on mount
    // This fixes the issue where elements below the fold don't trigger on initial load
    const isMobile = window.innerWidth < 640;
    if (isMobile && !hasTriggered.current) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Check if any part of the element is visible in the viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        hasTriggered.current = true;
        if (delay > 0) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(true);
        }
        if (triggerOnce) {
          return; // No need for observer if already visible and triggerOnce
        }
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          hasTriggered.current = false;
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref, isVisible };
}

/**
 * Hook for staggered reveal animations on multiple children
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  options: UseScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...revealOptions } = options;
  const { ref, isVisible } = useScrollReveal<T>(revealOptions);
  
  const getItemDelay = useCallback((index: number) => {
    return isVisible ? index * staggerDelay : 0;
  }, [isVisible, staggerDelay]);

  return { ref, isVisible, getItemDelay };
}

/**
 * Hook for parallax effects using GSAP ScrollTrigger
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.5
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * Hook for hero fade out effect on scroll
 */
export function useHeroFade<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        opacity: 0,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}


