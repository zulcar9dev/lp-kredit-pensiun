import { Star } from "@phosphor-icons/react/dist/ssr";
import type { Testimonial } from "@/lib/types/database";

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
          <p className="text-sm text-stone-600">{item.pension_type}</p>
        )}
      </figcaption>
    </figure>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section id="testimoni" className="bg-white">
      <div className="container-page py-16 md:py-24">
        <h2 className="max-w-[26ch] text-3xl tracking-tight sm:text-4xl">
          Cerita pensiunan yang sudah didampingi kami.
        </h2>

        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
