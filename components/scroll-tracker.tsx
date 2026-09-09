"use client";

import { useEffect, useRef } from "react";
import { generateEventId, trackPixel } from "@/lib/pixel";
import { PIXEL_CONTENT_NAME } from "@/lib/constants";

const FIRED_KEY = "lp-pensiunku:viewcontent-fired";

export function ScrollTracker() {
  const firedRef = useRef(false);

  useEffect(() => {
    // 1× per sesi (bukan per mount) sesuai PRD §4.2
    try {
      if (window.sessionStorage.getItem(FIRED_KEY) === "1") {
        firedRef.current = true;
        return;
      }
    } catch {
      // sessionStorage tak tersedia — lanjut dengan guard memori saja
    }

    function handleScroll() {
      if (firedRef.current) return;
      const scrollable =
        document.body.scrollHeight - window.innerHeight;
      // Halaman lebih pendek dari viewport: anggap langsung terlihat
      const scrollPercent =
        scrollable <= 0 ? 1 : window.scrollY / scrollable;
      if (scrollPercent >= 0.5) {
        firedRef.current = true;
        try {
          window.sessionStorage.setItem(FIRED_KEY, "1");
        } catch {
          // abaikan
        }
        // PRD §4.1: ViewContent memakai event_id untuk dedup CAPI
        trackPixel(
          "ViewContent",
          { content_name: PIXEL_CONTENT_NAME },
          { eventID: generateEventId() },
        );
        window.removeEventListener("scroll", handleScroll);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Cek sekali saat mount (pengguna memuat ulang di tengah halaman)
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
