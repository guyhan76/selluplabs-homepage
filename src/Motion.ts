import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Content stays visible without observers or animation support.
export function useScrollReveal() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const animation = entry.target.animate(
          [{ opacity: 0.35, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }],
          { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll(".section-eyebrow, .section-heading, .service-intro, .workflow-step, .service-output, .about-grid, .contact-grid, .install-copy").forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reduced]);
}
