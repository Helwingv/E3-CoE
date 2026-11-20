type Child = { label: string; href: string; desc?: string };

export default function MegaMenu({ items }: { items: Child[] }) {
  return (
    <div className="absolute left-0 top-full mt-2 w-[520px] rounded-xl border border-e3-200 border-t-4 border-t-e3 bg-white shadow-lg p-4 grid grid-cols-2 gap-3">
      {items.map((c) => (
        <a key={c.href} href={c.href} className="rounded-lg p-3 hover:bg-e3-50">
          <div className="text-sm font-semibold">{c.label}</div>
          {c.desc && <div className="text-xs text-gray-600 mt-1">{c.desc}</div>}
        </a>
      ))}
    </div>
  );
}
