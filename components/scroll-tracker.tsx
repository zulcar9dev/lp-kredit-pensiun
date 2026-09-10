"use client";

import { useEffect } from "react";
import { generateEventId, trackPixel } from "@/lib/pixel";
import { PIXEL_CONTENT_NAME } from "@/lib/constants";

const FIRED_KEY = "lp-pensiunku:viewcontent-fired";

// PRD §4.2: ViewContent saat scroll ≥ 50%, 1× per sesi, dengan event_id.
// Implementasi memakai IntersectionObserver pada sentinel di setengah
// halaman (bukan scroll listener — hemat baterai & ramah reduced-motion).
export function ScrollTracker() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(FIRED_KEY) === "1") return;
    } catch {
      // sessionStorage tak tersedia — lanjut tanpa guard sesi
    }
    if (typeof IntersectionObserver === "undefined") return;

    function fire() {
      try {
        window.sessionStorage.setItem(FIRED_KEY, "1");
      } catch {
        // abaikan
      }
      trackPixel(
        "ViewContent",
        { content_name: PIXEL_CONTENT_NAME },
        { eventID: generateEventId() },
      );
    }

    let observer: IntersectionObserver | null = null;

    function placeSentinel() {
      observer?.disconnect();
      const doc = document.documentElement;
      // Halaman lebih pendek dari viewport: langsung anggap terlihat
      if (doc.scrollHeight <= window.innerHeight + 1) {
        fire();
        return;
      }
      const sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText =
        "position:absolute;top:50%;left:0;width:1px;height:1px;pointer-events:none;";
      document.body.appendChild(sentinel);
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            fire();
            observer?.disconnect();
            sentinel.remove();
          }
        },
        { threshold: 0 },
      );
      observer.observe(sentinel);
    }

    placeSentinel();
    window.addEventListener("resize", placeSentinel);
    window.addEventListener("load", placeSentinel);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", placeSentinel);
      window.removeEventListener("load", placeSentinel);
    };
  }, []);

  return null;
}
