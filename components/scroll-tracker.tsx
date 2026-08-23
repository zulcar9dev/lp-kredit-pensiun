"use client";

import { useEffect, useRef } from "react";
import { trackPixel } from "@/lib/pixel";

export function ScrollTracker() {
  const sentRef = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const node = sentRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            trackPixel("ViewContent", { content_name: "Kredit Pensiun" });
            observer.disconnect();
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={sentRef} aria-hidden="true" className="h-px w-full" />;
}
