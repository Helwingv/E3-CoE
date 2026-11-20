import type { APIRoute } from "astro";
import { site } from "../config/site";
import { nav } from "../config/nav";

// A plain-text summary of the site for AI assistants (https://llmstxt.org).
// Built from the same config as the header, so it stays in sync with the menu.
export const GET: APIRoute = ({ site: base }) => {
  const url = (href: string) => (href.startsWith("http") ? href : new URL(href, base).href);
  const lines: string[] = [
    `# ${site.fullName}`,
    "",
    `> ${site.headline}`,
    "",
    `Tagline: ${site.tagline}`,
    "",
    `Mission: ${site.mission}`,
    "",
    `Vision: ${site.vision}`,
    "",
    `Purpose: ${site.purpose}`,
    "",
    `Contact: ${site.address}, ${site.phone}, ${site.email}`,
    ""
  ];
  for (const item of nav) {
    lines.push(`## ${item.label}`, "");
    if (item.children) {
      for (const c of item.children) lines.push(`- [${c.label}](${url(c.href)})`);
    } else if (item.href) {
      lines.push(`- [${item.label}](${url(item.href)})`);
    }
    lines.push("");
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
