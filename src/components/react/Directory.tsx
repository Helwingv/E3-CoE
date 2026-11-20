import { useMemo, useState } from "react";

type Partner = { orgName: string; sector: string; county: string; url?: string };

export default function Directory({ data }: { data: Partner[] }) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const [county, setCounty] = useState("All");

  const sectors = useMemo(() => ["All", ...Array.from(new Set(data.map(d => d.sector)))], [data]);
  const counties = useMemo(() => ["All", ...Array.from(new Set(data.map(d => d.county)))], [data]);

  const filtered = data.filter(d =>
    (sector === "All" || d.sector === sector) &&
    (county === "All" || d.county === county) &&
    (q === "" || d.orgName.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          placeholder="Search organizations…"
          className="border rounded-md px-3 py-2"
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-2"
          value={sector}
          onChange={e=>setSector(e.target.value)}
        >
          {sectors.map(s=><option key={s}>{s}</option>)}
        </select>
        <select
          className="border rounded-md px-3 py-2"
          value={county}
          onChange={e=>setCounty(e.target.value)}
        >
          {counties.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <ul className="grid md:grid-cols-2 gap-3">
        {filtered.map((p, i) => (
          <li key={i} className="border rounded-lg p-4">
            <div className="font-semibold">{p.orgName}</div>
            <div className="text-sm text-gray-600">{p.sector} • {p.county}</div>
            {p.url && <a className="text-sm underline" href={p.url}>Website</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
