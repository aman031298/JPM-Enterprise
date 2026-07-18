import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.slice(1);

    function scrollToTarget() {
      const element = document.getElementById(id);
      if (!element) {
        return false;
      }
      const headerOffset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
      return true;
    }

    // The target section may not be laid out yet on first paint (route just mounted,
    // fonts still loading, etc.) — retry briefly instead of a single fixed-delay attempt.
    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (scrollToTarget() || attempts > 20) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [location.pathname, location.hash, location.key]);

  return null;
}
