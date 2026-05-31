/* =============================================================================
   data.js — SINGLE SOURCE OF TRUTH for all site content.
   -----------------------------------------------------------------------------
   Editing the site = editing this file. The windowed view AND the terminal
   both render from this one object. You should rarely need to touch the HTML.

   HOW TO EDIT (quick reference — see README.md for more):
     • Update your bio/role/stack ........ profile { }
     • Add a project ..................... add an object to projects [ ]
     • Add a job ......................... add an object to experience [ ]
     • Add a blog post ................... add an object to posts [ ] + a file
                                           in /posts (see posts/hello-world.md)
     • Add/change links .................. links [ ]
   ========================================================================== */

const SITE = {
  profile: {
    name: "Collin Doyle",
    handle: "collin",                 // shown as collin@rocks in the prompt
    role: "Systems Administrator & Team Lead",
    location: "Fort Myers, Florida",
    // 1–2 sentence summary shown in the about window + `whoami`.
    summary:
      "Systems & network administrator with over a decade of experience " +
      "leading IT operations and building secure, scalable infrastructure. " +
      "I live in the space between enterprise ops and the homelab.",
    // Longer "about" prose (rendered in the about window under the summary).
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
    // neofetch-style ASCII art. Keep lines the same length-ish for clean output.
    asciiLogo: [
      "        .--.        ",
      "       |o_o |       ",
      "       |:_/ |       ",
      "      //   \\ \\      ",
      "     (|     | )     ",
      "    /'\\_   _/`\\     ",
      "    \\___)=(___/     ",
    ],
  },

  links: [
    { label: "GitHub",   href: "https://github.com/CollinJDoyle",            icon: "" },
    { label: "Email",    href: "mailto:cj.doyle@outlook.com",                icon: "" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/collinjdoyle/",  icon: "" },
  ],

  /* ---------------------------------------------------------------------------
     PROJECTS — add as many as you like. Only `title` and `summary` are required.
     `tags` shows as little chips. `links` is a list of { label, href }.
     Leave `links: []` for private/internal projects.

         {
           title:   "My new project",
           summary: "One line about what it is / does.",
           tags:    ["Tag1", "Tag2"],
           links:   [{ label: "Repo", href: "https://github.com/..." }],
         },
  --------------------------------------------------------------------------- */
  projects: [
    {
      title: "Unraid home server",
      summary:
        "Primary personal server: a stack of Dockerized apps, a Postgres " +
        "database, and a full self-hosted media stack — all on Unraid.",
      tags: ["Unraid", "Docker", "PostgreSQL", "Self-hosted", "Media"],
      links: [], // private homelab — add a writeup link here anytime
    },
    {
      title: "Local Kubernetes cluster",
      summary:
        "A self-managed Kubernetes cluster in the homelab for running " +
        "containerized workloads and experimenting with cloud-native tooling.",
      tags: ["Kubernetes", "Linux", "Containers", "Homelab"],
      links: [],
    },

    // ▼▼▼ ADD MORE PROJECTS HERE ▼▼▼
    // Copy the block above, fill it in. That's it — the window and the
    // `projects` terminal command pick it up automatically.
  ],

  /* ---------------------------------------------------------------------------
     EXPERIENCE — most recent first. `end: "Present"` for the current role.
  --------------------------------------------------------------------------- */
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

  // Optional: shown in the resume window above experience.
  certifications: [
    { name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance", year: "2025" },
  ],

  // Path to your resume PDF (placeholder committed; swap the file, keep the name).
  resumePdf: "assets/resume.pdf",

  /* ---------------------------------------------------------------------------
     BLOG POSTS — newest first. `file` is a Markdown file in /posts.
     To add a post: create posts/my-slug.md, then add an entry here.
  --------------------------------------------------------------------------- */
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

// Expose globally so the (non-module) scripts can read it. No build step needed.
window.SITE = SITE;
