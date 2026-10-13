# Bare-metal Kubernetes: the platform the internal apps run on

Every app in these writeups needs a place to run, and most of them only serve people inside the office. Paying cloud prices for always-on internal tools didn't make sense, and neither did a rack of hand-managed VMs. So I designed and built an **on-prem Kubernetes platform from scratch**. It's the default home for new internal apps (I've shipped 20+ since mid-2025, across this cluster and AWS), and deploying one is a pull request.

## What I built

- **The cluster.** RKE2, managed through Rancher, on bare metal. kube-vip hands out LoadBalancer IPs, and ingress-nginx routes traffic to each app.
- **TLS and DNS with no hand-editing.**
  - cert-manager issues Let's Encrypt certificates through DNS-01 challenges.
  - external-dns writes each app's DNS record from its ingress.

  A new app gets its hostname and certificate as part of its own manifests.
- **Persistent storage with backups.** Longhorn provides replicated block storage for databases and app data. A recurring job backs every volume up to a NAS each night and keeps a rolling week of restore points. A shared PostgreSQL gives every app its own database and role.
- **Pull-based GitOps.**
  - GitHub Actions runs typecheck, lint, tests, secret scanning (gitleaks) and manifest validation (kustomize + kubeconform).
  - It builds the image and pushes it to a container registry.
  - It pins the exact commit SHA into the app's manifests in a pull request.
  - Rancher Fleet watches git and applies the change.

  **CI never holds cluster credentials.**
- **Rollbacks in about a minute.** Reverting the pin commit puts the previous build back, and database migrations are expand-only for a release so the old version still works.
- **Secure by default.** Every app ships with:
  - non-root containers with a read-only root filesystem, all capabilities dropped and seccomp on;
  - resource requests and limits;
  - startup, liveness and readiness probes;
  - two replicas with a disruption budget and zero-downtime rolling updates.

  Admin-only tools are restricted at the ingress to the office and the zero-trust VPN.
- **Observability.** Structured JSON logs ship from every pod to a central log platform. HTTP and cron-heartbeat monitors watch every app, and failures alert in Slack.
- **On-prem AI next to the cluster.** A GPU node serves an open-weight LLM through vLLM behind an OpenAI-compatible API, reachable only on the LAN. Tuning prefix caching gave about 5× throughput: a 73,000-record classification job now finishes in about 36 minutes, with no per-token cost and no data leaving the building.

## The standards behind it

A platform is only as good as what gets deployed to it, so I also wrote the **engineering standards and templates** every app follows, drawn from 30+ repos:

- immutable image tags;
- no secrets in git, images or frontend bundles;
- SSO tokens verified properly;
- health endpoints wired to probes;
- real database migrations;
- validated config;
- a consistent manifest layout with a deploy runbook.

New apps start from template repos that already follow them.

One rule came from experience. An early `:latest` + `imagePullPolicy: Always` setup let a restarted pod pull an image nobody had reviewed. That outage is why every deploy is now pinned to a reviewed commit.

## How it saves time

- **Shipping is a merge.** No SSH, no manual `kubectl`. The pipeline tests, builds, pins and deploys.
- **New apps start in hours, not days.** The template repo comes with CI, manifests, health checks and a runbook.
- **Recovery is boring.** Undo a bad deploy with a git revert, and restore lost data from last night's volume backup.

## How it saves money

- **Owned hardware instead of always-on cloud bills** for internal tools that only need to serve the office. Heavy and long-running compute is cheaper on hardware you already own.
- **No per-token AI costs.** Large classification and labeling jobs run on a local GPU instead of a metered API.
- **One platform for many apps.** There's no per-app hosting, certificate or DNS management.

## Stack

| Layer | Tech |
|---|---|
| Cluster | RKE2, Rancher, kube-vip, ingress-nginx |
| Storage | Longhorn (replicated volumes, nightly NAS backups), PostgreSQL |
| Delivery | GitHub Actions, container registry, kustomize, kubeconform, Rancher Fleet |
| Certs & DNS | cert-manager (Let's Encrypt, DNS-01), external-dns, Route 53 |
| Security | gitleaks, Trufflehog, branch protection, hardened pod specs, zero-trust VPN |
| Ops | structured logging via Vector, uptime and heartbeat monitors, Slack alerts |
| AI | vLLM on a local GPU, OpenAI-compatible API |
