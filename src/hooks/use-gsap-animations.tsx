
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useMessageAnimation = (selector: string, staggerTime: number = 0.1) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements && elements.length > 0) {
      gsap.fromTo(
        elements,
        { 
          y: 20, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          stagger: staggerTime, 
          duration: 0.4, 
          ease: "power2.out",
          clearProps: "all"
        }
      );
    }
  }, [selector, staggerTime]);
};

export const useSidebarItemAnimation = (selector: string, staggerTime: number = 0.05) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements && elements.length > 0) {
      gsap.fromTo(
        elements,
        { 
          x: -20, 
          opacity: 0 
        },
        { 
          x: 0, 
          opacity: 1, 
          stagger: staggerTime, 
          duration: 0.3, 
          ease: "power2.out",
          delay: 0.1,
          clearProps: "all"
        }
      );
    }
  }, [selector, staggerTime]);
};

export const useEmptyStateAnimation = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      gsap.to(elementRef.current, {
        opacity: 1, 
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.2
      });
    }
  }, []);
  
  return elementRef;
};

export const useSendButtonAnimation = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    
    const enterAnimation = () => {
      gsap.to(button, {
        scale: 1.1,
        duration: 0.2,
        ease: "power1.inOut"
      });
    };
    
    const leaveAnimation = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power1.inOut"
      });
    };
    
    button.addEventListener("mouseenter", enterAnimation);
    button.addEventListener("mouseleave", leaveAnimation);
    
    return () => {
      button.removeEventListener("mouseenter", enterAnimation);
      button.removeEventListener("mouseleave", leaveAnimation);
    };
  }, []);
  
  return buttonRef;
};

export const useScrollToBottom = (dependencies: any[] = []) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      gsap.to(containerRef.current, {
        scrollTop: scrollHeight - clientHeight,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [...dependencies]);

  return { containerRef, scrollToBottom };
};
