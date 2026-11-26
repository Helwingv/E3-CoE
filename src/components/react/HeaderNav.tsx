import { useState } from "react";
import { nav } from "../../config/nav";
import MegaMenu from "./MegaMenu";
import MobileDrawer from "./MobileDrawer";
import { site } from "../../config/site";

export default function HeaderNav() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      <div className="flex items-center justify-between h-16">
        <a href="/" data-astro-prefetch className="flex items-center gap-3 py-2" aria-label={`${site.fullName} home`}>
          <img src={site.logos.small} alt="" width={56} height={56} className="h-14 w-14" />
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight text-e3-900">{site.displayName}</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-e3-700">Center Of Excellence</span>
          </span>
        </a>
        <nav className="hidden xl:flex items-center gap-5">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button className="text-sm whitespace-nowrap hover:text-e3-600 py-2">{item.label}</button>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <MegaMenu items={item.children} />
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : { "data-astro-prefetch": true })}
                className="text-sm whitespace-nowrap hover:text-e3-600"
              >
                {item.label}
              </a>
            )
          )}
          <a href="/about/make-a-difference" data-astro-prefetch className="ml-2 inline-flex items-center whitespace-nowrap rounded-md bg-e3-700 px-3 py-2 text-sm font-semibold text-white hover:bg-e3-800">Make A Difference</a>
        </nav>
        <button aria-label="Open menu" className="xl:hidden" onClick={() => setOpen(open ? null : "drawer")}>
          ☰
        </button>
      </div>
      <MobileDrawer open={open === "drawer"} onClose={() => setOpen(null)} />
    </div>
  );
}
