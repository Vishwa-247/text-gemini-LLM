
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Hook for animating chat messages
export const useMessageAnimation = (selector: string, delay: number = 0) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    gsap.fromTo(elements, 
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        delay
      }
    );
  }, [selector, delay]);
};

// Hook for animating sidebar items
export const useSidebarItemAnimation = (selector: string, delay: number = 0) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    gsap.fromTo(elements, 
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
        delay
      }
    );
  }, [selector, delay]);
};

// Hook for empty state animation
export const useEmptyStateAnimation = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(elementRef.current, 
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.2
        }
      );
    }
  }, []);
  
  return elementRef;
};

// Hook for input send button animation
export const useSendButtonAnimation = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (buttonRef.current) {
      const button = buttonRef.current;
      
      // Hover animation
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.2
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2
        });
      });
      
      // Click animation
      button.addEventListener('mousedown', () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1
        });
      });
      
      button.addEventListener('mouseup', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.1
        });
      });
    }
    
    return () => {
      if (buttonRef.current) {
        const button = buttonRef.current;
        button.removeEventListener('mouseenter', () => {});
        button.removeEventListener('mouseleave', () => {});
        button.removeEventListener('mousedown', () => {});
        button.removeEventListener('mouseup', () => {});
      }
    };
  }, []);
  
  return buttonRef;
};

// New hook for message container scrolling management
export const useScrollToBottom = (dependencies: any[] = []) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [...dependencies]);
  
  return { containerRef, scrollToBottom };
};

// New hook for toast animation
export const useToastAnimation = () => {
  useEffect(() => {
    const toasts = document.querySelectorAll('.toast');
    
    gsap.fromTo(toasts, 
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
        stagger: 0.1
      }
    );
  }, []);
};
