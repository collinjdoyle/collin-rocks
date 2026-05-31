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
      "I run and manage IT end to end: 365, Azure, Entra ID, Intune MDM," +
        "SSO/SAML integrations, local networks, servers, VPNs, Exchange, and " +
        "other cloud services like AWS and Google Cloud. All kept secure, up to date and reliable.",
        "Beyond traditional IT I lean hard into automations and have made it my goal to automate" +
        "anything I can using a combination of local AI, classic logic, and some close kept secrets!",
    ],
    stack: [
      "Microsoft 365 - Entra ID, Intune, Application Management, Security, full suite",
      "Containers - Baremetal, Kubernetes, EKS, Docker",
      "SaaS Management - Trelica, Auvik SaaS",
      "Software Development - Node.ks, React, Postgres",
      "Scripting - PowerShell, Bash, Terraform, others",
      "Cloud Computing - AWS, Azure, Google Cloud",
      "Networking - ZT-VPN, Wireguard, SMB Network Architecture and Deployment",
    ],
    currentFocus: "Classic and AI automations | Local AI Projects | Systems Administration",
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
      title: "Homelab - Unraid Server",
      summary:
        "Primary personal server: a stack of Dockerized apps, a Postgres " +
        "database, and a full self-hosted media stack running on an Unraid Server.",
      tags: ["Unraid", "Docker", "PostgreSQL", "Self-hosted", "Media"],
      links: [],
    },
    {
      title: "Homelab - Kubernetes cluster",
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
      summary: "Hello.",
    },
  ],
};

window.SITE = SITE;
