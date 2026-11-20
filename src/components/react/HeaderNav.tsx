import { useState } from "react";
import { nav } from "../../config/nav";
import MegaMenu from "./MegaMenu";
import MobileDrawer from "./MobileDrawer";
import ShinyText from "./ShinyText";

export default function HeaderNav() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      <div className="flex items-center justify-between h-16">
        <a href="/" data-astro-prefetch className="flex flex-col items-center py-2">
          <img src="/images/vision828logo1_blackwithtaglinegraphicready.png" alt="Vision 8:28" className="h-10" />
          <ShinyText
            text="Serving with Purpose"
            speed={3}
            delay={1}
            color="#6b7280"
            shineColor="#1f2937"
            spread={120}
            className="text-sm mt-1 italic"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-6">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button className="text-sm hover:text-brand py-2">{item.label}</button>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <MegaMenu items={item.children} />
                </div>
              </div>
            ) : (
              <a key={item.label} href={item.href} data-astro-prefetch className="text-sm hover:text-brand">{item.label}</a>
            )
          )}
          <a href="/donate" data-astro-prefetch className="ml-2 inline-flex items-center rounded-md bg-brand-accent px-3 py-2 text-sm font-semibold text-white hover:opacity-90">Donate</a>
        </nav>
        <button aria-label="Open menu" className="lg:hidden" onClick={() => setOpen(open ? null : "drawer")}>
          ☰
        </button>
      </div>
      <MobileDrawer open={open === "drawer"} onClose={() => setOpen(null)} />
    </div>
  );
}
