// Site content. The windowed view and the terminal both render from this.
const SITE = {
  profile: {
    name: "Collin Doyle",
    handle: "collin",
    role: "Systems Administrator & Team Lead",
    location: "Fort Myers, Florida",
    summary:
      "Systems & network administrator with over a decade of experience " +
      "leading IT operations and building secure, scalable infrastructure. " +
      "I live in the space between enterprise ops and the homelab.",
    bio: [
      "I run IT end to end: Microsoft 365, Entra ID and Intune administration, " +
        "SSO/SAML integrations, network and VPN design, Exchange, and AWS — " +
        "kept secure and reliable.",
      "Beyond traditional IT I lean hard into automation, local AI, and custom " +
        "development. I build tools and workflows in Node.js and write scripts " +
        "that delete the boring parts of the job. The goal never changes: make " +
        "systems faster, smarter, and easier for people to use.",
    ],
    stack: [
      "Microsoft 365 / Entra ID / Intune",
      "Kubernetes",
      "Docker",
      "Linux",
      "PowerShell",
      "Node.js",
      "AWS",
      "Networking / VPN",
    ],
    currentFocus: "Local AI on the homelab cluster + IT automation at scale",
    asciiLogo: [
      "   ____ ____   ",
      "  / ___|  _ \\  ",
      " | |   | | | | ",
      " | |___| |_| | ",
      "  \\____|____/  ",
      "  c o l l i n  ",
    ],
  },

  links: [
    { label: "GitHub",   href: "https://github.com/CollinJDoyle" },
    { label: "Email",    href: "mailto:cj.doyle@outlook.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/collinjdoyle/" },
  ],

  // links: [] means private / no public link.
  projects: [
    {
      title: "Unraid home server",
      summary:
        "Primary personal server: a stack of Dockerized apps, a Postgres " +
        "database, and a full self-hosted media stack — all on Unraid.",
      tags: ["Unraid", "Docker", "PostgreSQL", "Self-hosted", "Media"],
      links: [],
    },
    {
      title: "Local Kubernetes cluster",
      summary:
        "A self-managed Kubernetes cluster in the homelab for running " +
        "containerized workloads and experimenting with cloud-native tooling.",
      tags: ["Kubernetes", "Linux", "Containers", "Homelab"],
      links: [],
    },
  ],

  experience: [
    {
      org: "Eightpoint",
      title: "Systems Administrator, Team Lead",
      start: "Jan 2020",
      end: "Present",
      location: "Cape Coral, FL",
      bullets: [
        "Lead IT operations and a systems administration team.",
        "M365 / Entra ID / Intune administration, SSO & SAML integrations.",
        "Build automation, local AI solutions, and internal tools in Node.js.",
      ],
    },
    {
      org: "Collier County Sheriff's Office",
      title: "Network Technician",
      start: "Nov 2018",
      end: "Apr 2019",
      location: "Naples, FL",
      bullets: [],
    },
    {
      org: "Softrim Corporation",
      title: "System & Network Engineer",
      start: "Jun 2017",
      end: "Sep 2018",
      location: "Estero, FL",
      bullets: [],
    },
    {
      org: "Florida Cancer Specialists & Research Institute",
      title: "System Administrator",
      start: "Feb 2017",
      end: "Jun 2017",
      location: "",
      bullets: [],
    },
    {
      org: "Greenwire Technology Solutions",
      title: "System & Network Administrator",
      start: "Jan 2016",
      end: "Jan 2017",
      location: "",
      bullets: [],
    },
  ],

  certifications: [
    { name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance", year: "2025" },
  ],

  resumePdf: "assets/resume.pdf",
  resumePdfFull: "assets/resume-full.pdf",

  posts: [
    {
      slug: "hello-world",
      title: "Hello, world",
      date: "2026-05-30",
      file: "posts/hello-world.md",
      summary: "Why this site exists and what to expect here.",
    },
  ],
};

window.SITE = SITE;
