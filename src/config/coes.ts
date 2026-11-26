/**
 * Centers Of Excellence (CoEs) shown under the menu's "Centers Of Excellence (CoEs)".
 * Each one gets a page at /centers-of-excellence/<slug>.
 * Content and images are still to come from Antoine Smith; until then each page
 * shows only its name, its line from the E3 CoE tagline and a short notice.
 * To add content later, fill `body` (one string per paragraph) and `image`
 * (a path in public/images/, landscape about 1600x1000).
 */
export type CoE = {
  slug: string;
  name: string;
  line: string;
  body: string[];
  image?: string;
};

export const coes: CoE[] = [
  {
    slug: "education",
    name: "Education",
    line: "Enabling Through Education",
    body: []
  },
  {
    slug: "economic-development",
    name: "Economic Development",
    line: "Driving Change Through Economic Development",
    body: []
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    line: "Empowering Through Entrepreneurship",
    body: []
  }
];
