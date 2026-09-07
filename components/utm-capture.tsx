"use client";

import { useEffect } from "react";
import { captureFbc, captureUtm } from "@/lib/utm";

export function UtmCapture() {
  useEffect(() => {
    captureUtm();
    captureFbc();
  }, []);
  return null;
}
