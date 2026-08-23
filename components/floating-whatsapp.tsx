"use client";

import { useEffect, useRef, useState } from "react";
import { WaButton } from "@/components/wa-button";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      <div
        className={`fixed bottom-4 right-4 z-40 transition-all duration-300 md:bottom-6 md:right-6 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <WaButton size="lg" className="shadow-card-lg" />
      </div>
    </>
  );
}
