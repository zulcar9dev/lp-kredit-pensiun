"use client";

import { useRef } from "react";
import {
  Star,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Testimonial } from "@/lib/types/database";
import { pensionDbToLabel } from "@/lib/constants";

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="w-[85%] shrink-0 snap-start rounded-xl border border-stone-200 bg-white p-6 shadow-card sm:w-[55%] lg:w-[38%] md:p-8">
      <div
        className="flex gap-1 text-brand-500"
        role="img"
        aria-label={`Rating ${item.rating} dari 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            weight={i < item.rating ? "fill" : "light"}
            className="size-5"
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="mt-4">
        <p className="text-lg font-medium leading-relaxed text-navy-900">
          &ldquo;{item.content}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-5 border-t border-stone-100 pt-4">
        <p className="font-bold text-navy-900">{item.name}</p>
        {item.pension_type && (
          <p className="text-sm text-stone-600">
            {pensionDbToLabel(item.pension_type)}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  // PRD §3.4: slider manual dengan tombol navigasi besar (min 56px,
  // ramah motorik lansia) — tanpa autoplay.
  function scrollByDir(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("figure");
    const step =
      card instanceof HTMLElement ? card.offsetWidth + 20 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section id="testimoni" className="bg-white">
      <div className="container-page py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-[26ch] text-3xl tracking-tight sm:text-4xl">
            Cerita pensiunan yang sudah didampingi kami.
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              aria-label="Lihat testimoni sebelumnya"
              className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-xl border-2 border-navy-200 text-navy-800 transition-colors hover:border-brand-400 hover:text-brand-700 active:scale-[0.98]"
            >
              <CaretLeft weight="bold" className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              aria-label="Lihat testimoni berikutnya"
              className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-xl border-2 border-navy-200 text-navy-800 transition-colors hover:border-brand-400 hover:text-brand-700 active:scale-[0.98]"
            >
              <CaretRight weight="bold" className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
