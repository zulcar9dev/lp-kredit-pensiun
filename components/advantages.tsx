import {
  Buildings,
  ChatsCircle,
  HandCoins,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { ADVANTAGES } from "@/lib/constants";

const ICONS = {
  consult: ChatsCircle,
  banks: Buildings,
  accompany: HandCoins,
  safety: ShieldCheck,
} as const;

function AdvantageIcon({ icon }: { icon: keyof typeof ICONS }) {
  const Icon = ICONS[icon];
  return (
    <span
      aria-hidden="true"
      className="mb-5 flex size-14 shrink-0 items-center justify-center rounded-xl border border-bni-100 bg-bni-50 text-bni-700"
    >
      <Icon weight="duotone" className="size-7" />
    </span>
  );
}

export function Advantages() {
  const [first, second, third, fourth] = ADVANTAGES;

  const wideClass =
    "rounded-xl border p-6 md:p-8 md:flex md:items-center md:gap-8 md:col-span-2";
  const stdClass =
    "rounded-xl border bg-white p-6 shadow-card md:p-8";

  return (
    <section id="keunggulan" className="bg-white">
      <div className="container-page py-16 md:py-24">
        <h2 className="max-w-[24ch] text-3xl tracking-tight sm:text-4xl">
          Kenapa mengurus lewat kami?
        </h2>
        <p className="mt-4 max-w-[56ch] text-stone-700">
          Empat hal yang membuat Bapak/Ibu lebih tenang bersama kami.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
          <article
            className={`${wideClass} border-bni-100 bg-gradient-to-br from-bni-50 to-stone-50`}
          >
            <AdvantageIcon icon={first.icon} />
            <div>
              <h3 className="text-xl tracking-tight md:text-2xl">
                {first.title}
              </h3>
              <p className="mt-2 max-w-[62ch] text-stone-700">
                {first.description}
              </p>
            </div>
          </article>

          {[second, third].map((item) => (
            <article key={item.title} className={stdClass}>
              <AdvantageIcon icon={item.icon} />
              <h3 className="text-xl tracking-tight">{item.title}</h3>
              <p className="mt-2 text-stone-700">{item.description}</p>
            </article>
          ))}

          <article
            className={`${wideClass} border-navy-100 bg-gradient-to-br from-navy-50 to-white`}
          >
            <AdvantageIcon icon={fourth.icon} />
            <div>
              <h3 className="text-xl tracking-tight md:text-2xl">
                {fourth.title}
              </h3>
              <p className="mt-2 max-w-[62ch] text-stone-700">
                {fourth.description}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
