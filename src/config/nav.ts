export type NavItem = {
  label: string;
  href?: string;
  external?: boolean;
  children?: { label: string; href: string; desc?: string }[];
};

export const nav: NavItem[] = [
  {
    label: "About",
    children: [
      { label: "Who We Are", href: "/about/who-we-are" },
      { label: "What We Do", href: "/about/what-we-do" },
      { label: "Board & Team", href: "/about/board-and-team" },
      { label: "Get Involved", href: "/about/get-involved" },
      { label: "In the News", href: "/about/in-the-news" }
    ]
  },
  {
    label: "Programs",
    children: [
      { label: "Community Impact", href: "/programs/community-impact" },
      { label: "Food Program", href: "/programs/food-program" },
      { label: "Small Business & EDC", href: "/programs/small-business-edc" },
      { label: "Local & Regional", href: "/programs/local-regional" },
      { label: "Advocacy & Leadership", href: "/programs/advocacy-leadership" },
      { label: "Success Stories", href: "/programs/success-stories" }
    ]
  },
  {
    label: "Projects",
    href: "/projects"
  },
  {
    label: "Events",
    href: "/events"
  },
  {
    label: "Resources",
    children: [
      { label: "Guides & Toolkits", href: "/resources/guides-toolkits" },
      { label: "Data & Reports", href: "/resources/data-reports" },
      { label: "Funding & Grants", href: "/resources/funding-grants" },
      { label: "Partner Directory", href: "/resources/partner-directory" },
      { label: "Policy Priorities", href: "/resources/policy-priorities" },
      { label: "Collaboration", href: "/resources/collaboration" }
    ]
  },
  {
    label: "Partnership",
    children: [
      { label: "Benefits", href: "/partnership/benefits" },
      { label: "Join", href: "/partnership/join" },
      { label: "Directory", href: "/partnership/directory" },
      { label: "Supporters", href: "/partnership/supporters" }
    ]
  },
  {
    label: "NOAH",
    href: "https://noah.e3coe.com",
    external: true
  },
  { label: "News", href: "/news" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" }
];
