"use client";

import { useEffect, useRef } from "react";
import { trackPixel } from "@/lib/pixel";

export function ScrollTracker() {
  const firedRef = useRef(false);

  useEffect(() => {
    function handleScroll() {
      if (firedRef.current) return;
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.5) {
        firedRef.current = true;
        trackPixel("ViewContent", { content_name: "Kredit Pensiun" });
        window.removeEventListener("scroll", handleScroll);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
