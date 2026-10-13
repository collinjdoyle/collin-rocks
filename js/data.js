// Site content. The windowed view and the terminal both render from this.
const SITE = {
  profile: {
    name: "Collin Doyle",
    handle: "collin",
    role: "IT Operations & Automation Lead",
    location: "Fort Myers, Florida",
    summary:
      "IT operations lead with 10+ years of experience. I manage IT through " +
      "automation: systems that provision, track, train and report on themselves, " +
      "so a small team runs like a much larger one.",
    bio: [
      "I run and manage IT end to end: 365, Azure, Entra ID, Intune MDM, " +
        "SSO/SAML integrations, local networks, servers, VPNs, Exchange, and " +
        "other cloud services like AWS and Google Cloud. All kept secure, up to date and reliable.",
        "Beyond traditional IT I lean hard into automation, and my goal is to automate anything I can " +
        "with a mix of local AI, classic logic and a few closely kept secrets. Recently that meant a suite " +
        "of internal apps that took new-hire provisioning from 4–6 hours to under one. The writeups are " +
        "in projects and blog.",
    ],
    stack: [
      "Microsoft 365 - Entra ID, Intune, Application Management, Security, full suite",
      "Containers - Baremetal, Kubernetes, EKS, Docker",
      "SaaS Management - Trelica, Auvik SaaS",
      "Software Development - Node.js, TypeScript, React, Postgres",
      "Scripting - PowerShell, Bash, Terraform, others",
      "Cloud Computing - AWS, Azure, Google Cloud",
      "Networking - ZT-VPN, Wireguard, SMB Network Architecture and Deployment",
    ],
    currentFocus: "IT management through automation | Platforms on bare-metal Kubernetes | Local AI",
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

  // links: [] means private / no public link. post: slug of the writeup in posts.
  projects: [
    {
      title: "Zero-touch employee onboarding",
      summary:
        "One HR form and one IT approval: the Entra account, licence, groups, mail lists, " +
        "laptop reservation, Slack updates and first-week training all happen automatically.",
      tags: ["Automation", "Entra ID", "Jira SM", "Slack", "Webhooks"],
      links: [],
      post: "zero-touch-onboarding",
    },
    {
      title: "Bare-metal Kubernetes platform",
      summary:
        "On-prem RKE2 cluster I built from scratch as the default home for internal apps: pull-based GitOps, " +
        "nightly-backed storage, automatic TLS and DNS, hardened workloads and a local GPU for AI.",
      tags: ["Kubernetes", "RKE2", "Rancher Fleet", "Longhorn", "GitOps", "vLLM"],
      links: [],
      post: "bare-metal-kubernetes",
    },
    {
      title: "People platform",
      summary:
        "Employee directory and identity automation. It's the people source of truth: it syncs " +
        "from Entra ID, shows HR and Legal compliance views, and builds new-hire accounts on approval.",
      tags: ["React", "Node.js", "Postgres", "Microsoft Graph", "EKS"],
      links: [],
      post: "people-platform",
    },
    {
      title: "IT inventory",
      summary:
        "Scannable inventory (PWA) for every asset and consumable: QR labels, phone scanning, " +
        "shelf audits, checkouts, and Jamf / Intune device sync.",
      tags: ["React", "TypeScript", "Postgres", "PWA", "Jamf", "Intune"],
      links: [],
      post: "it-inventory",
    },
    {
      title: "Learning platform",
      summary:
        "Internal training and onboarding: training builder, self-grading quizzes, group " +
        "assignments via SCIM, Slack reminders and certificates.",
      tags: ["React", "TypeScript", "Postgres", "SCIM", "Slack"],
      links: [],
      post: "learning-platform",
    },
    {
      title: "Employee hub",
      summary:
        "Live conference-room status (calendars + Zoom Rooms) on a TV kiosk, a searchable " +
        "floor plan, an SSO app launcher and access requests.",
      tags: ["React", "Node.js", "Microsoft Graph", "Zoom"],
      links: [],
      post: "employee-hub",
    },
    {
      title: "Domain manager",
      summary:
        "Every domain across three registrars in one table: expiry tracking, renewal-cost " +
        "forecasts and weekly blacklist checks.",
      tags: ["TypeScript", "AWS Route 53", "APIs", "Scheduled jobs"],
      links: [],
      post: "domain-manager",
    },
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
        "Designed and built a suite of internal apps (React, Node.js, Postgres, Kubernetes): " +
          "a people platform, IT inventory, learning platform, employee hub and domain manager.",
        "Automated new-hire onboarding end to end: one HR form and one IT approval build the " +
          "account, reserve the laptop and assign training, cutting provisioning from 4–6 hours to under 1 hour.",
        "Build automation and local AI solutions; run CI/CD to EKS and on-prem Kubernetes.",
      ],
    },
    {
      org: "Collier County Sheriff's Office",
      title: "Systems Administrator / Network Technician",
      start: "Nov 2018",
      end: "Apr 2019",
      location: "Naples, FL",
      bullets: [
        "Managed and maintained servers, PCs, routers and switches.",
        "Installed, configured and administered network technologies.",
        "Monitored servers and network devices and resolved issues quickly across a wide range of systems.",
      ],
    },
    {
      org: "Softrim Corporation",
      title: "Network Engineer",
      start: "Jun 2017",
      end: "Sep 2018",
      location: "Fort Myers, FL",
      bullets: [
        "Led a team of technicians on a single-client help desk (Citrix XenApp, LANDESK/Autotask).",
        "Onsite network, server and desktop support for small-to-medium businesses.",
        "Maintained Exchange and backups for all clients; built a patch-management system for a large client.",
      ],
    },
    {
      org: "Florida Cancer Specialists & Research Institute",
      title: "Systems Administrator / Network Engineer",
      start: "Feb 2017",
      end: "Jun 2017",
      location: "Fort Myers, FL",
      bullets: [
        "Dispatched tickets to teams and local technicians and scheduled onsite visits to clinics across Florida.",
        "Ordered, tracked and received hardware for new clinic deployments (100 thin clients, 10 switches, " +
          "2 routers, 3 servers, 200 monitors).",
      ],
    },
    {
      org: "Greenwire Technology Solutions",
      title: "Network Support Engineer II",
      start: "Jan 2016",
      end: "Jan 2017",
      location: "Cape Coral, FL",
      bullets: [
        "Managed server deployments including AD DS, 3CX, Exchange and file servers.",
        "Built redundant networks tailored to each client; repaired neglected or incorrectly installed networks.",
      ],
    },
    {
      org: "ATOS (contractor for Lee County)",
      title: "Desktop Support Engineer",
      start: "2014",
      end: "2015",
      location: "Fort Myers, FL",
      bullets: [
        "Remote and onsite troubleshooting across a wide range of systems, hardware and applications.",
        "Owned priority issues through documentation, resolution and closure.",
      ],
    },
  ],

  certifications: [
    { name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance", year: "2025" },
    { name: "CompTIA Server+", issuer: "CompTIA", year: "" },
    { name: "MCSA", issuer: "Microsoft", year: "" },
    { name: "CompTIA Network+", issuer: "CompTIA", year: "" },
    { name: "CompTIA A+", issuer: "CompTIA", year: "" },
  ],

  education: [
    "Florida SouthWestern State College — Computer Science coursework (2015–2017)",
    "Dunbar High School, Academy of Technology Excellence — earned 32+ industry IT certifications, " +
      "the most in the 2014 graduating class",
  ],

  // Cookie-free page counts via GoatCounter (https://www.goatcounter.com). Put your site code here,
  // e.g. "collinrocks" for collinrocks.goatcounter.com, then rerun tools/build-writeups.js.
  // Empty = no analytics anywhere.
  analytics: { goatcounter: "" },

  resumePdf: "assets/resume.pdf",
  resumePdfFull: "assets/resume-full.pdf",

  posts: [
    {
      slug: "zero-touch-onboarding",
      title: "One form to a trained new hire: automating onboarding",
      date: "2026-10-12",
      file: "posts/zero-touch-onboarding.md",
      summary: "How one HR form and one approval replaced an hour of manual setup.",
    },
    {
      slug: "bare-metal-kubernetes",
      title: "Bare-metal Kubernetes: the platform the internal apps run on",
      date: "2026-10-12",
      file: "posts/bare-metal-kubernetes.md",
      summary: "RKE2, GitOps, backed-up storage and on-prem AI for internal apps.",
    },
    {
      slug: "people-platform",
      title: "People platform: the directory that builds the account",
      date: "2026-10-12",
      file: "posts/people-platform.md",
      summary: "Directory, compliance views and an approval-gated onboarding engine.",
    },
    {
      slug: "it-inventory",
      title: "IT inventory: every laptop and USB stick, scannable",
      date: "2026-10-12",
      file: "posts/it-inventory.md",
      summary: "QR labels, phone scanning, audits in minutes, MDM sync.",
    },
    {
      slug: "learning-platform",
      title: "Learning platform: assign once, everyone's trained",
      date: "2026-10-12",
      file: "posts/learning-platform.md",
      summary: "Trainings, quizzes and certificates, wired to SSO groups and Slack.",
    },
    {
      slug: "employee-hub",
      title: "Employee hub: rooms, desks and apps in one place",
      date: "2026-10-12",
      file: "posts/employee-hub.md",
      summary: "Live room status on a TV, a searchable floor plan and an app launcher.",
    },
    {
      slug: "domain-manager",
      title: "Domain manager: three registrars, one table",
      date: "2026-10-12",
      file: "posts/domain-manager.md",
      summary: "Expiry tracking, renewal forecasts and blacklist checks.",
    },
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
