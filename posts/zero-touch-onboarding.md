# One form to a trained new hire: automating employee onboarding

Onboarding a new hire used to touch five systems and three teams. HR filed a ticket, IT built the account by hand, someone remembered (or forgot) the laptop, and training lived in a shared folder. I designed and built the apps and automations that turn all of that into **one HR form and one IT approval**.

This post is the overview. Each app has its own writeup.

## The flow

- **HR submits one form** in the service desk portal: name, start date, manager, team, location.
- **Automation fans it out.** A ticket rule opens a dedicated Slack channel for the hire, posts a welcome, and sends the request to my people platform as a *staged* plan.
- **IT reviews, then clicks once.** The plan is pre-filled from the form and directory rules: username, manager, licence, security groups, distribution lists, trainings. IT can adjust anything, then hit **Approve & create**. Nothing touches the identity provider until a human approves.
- **The account builds itself.** The Entra ID user, licence, manager, groups, Exchange lists, a first-day Temporary Access Pass (encrypted, never emailed) and the employee record are all created in order. Every step is logged and can be retried.
- **Every other app hears about it.** A signed `employee.onboarded` event goes to the inventory, learning and employee hub apps.
- **Hardware is reserved from stock.** The inventory app suggests a laptop that fits the role. One click reserves it, and it's checked out on the start date.
- **Day one, training is already waiting.** The hire signs in with SSO, works through first-week training with self-grading quizzes, and earns a certificate. Their manager gets a Slack DM when they finish.
- **Slack keeps everyone posted** at each stage: staged, complete, hardware assigned, fully onboarded.

## How it saves time

- **New-hire provisioning dropped from 4–6 hours to under an hour**, and the account itself is now a few minutes of review. Done by hand, it was 15+ separate steps across admin portals, the ticket and Slack. Now IT reads the plan, adjusts it if needed, and approves.
- **No chasing.** HR, the manager and IT watch progress in one Slack channel instead of pinging each other.
- **No missed steps.** Groups, lists and trainings come from rules, not memory, so the "forgot to add them to X" follow-up tickets disappear.
- **Retries instead of restarts.** If one step fails (a slow API, a missing permission), the run records it and IT retries just that step.

## How it saves money

- **Built on tools the company already pays for**: the identity provider, the service desk, Slack and a Kubernetes cluster. There's no new onboarding subscription.
- **A productive first day.** The laptop, account and training are ready before the hire walks in, so nobody is paid to wait for access.
- **Fewer security gaps.** The first-day pass never sits in an inbox, every reveal is audited, and access matches the role from the start. That means less clean-up at audit time.

## Stack

- **Apps:** Node.js, React, PostgreSQL and Prisma
- **Identity:** Microsoft Graph and Exchange Online
- **Workflow:** Jira Service Management automation and the Slack API
- **Between services:** signed webhooks
- **Deploys:** Docker, Kubernetes, Argo CD and Fleet

## The apps

- [People platform](#post/people-platform): the directory, compliance views and the onboarding engine
- [IT inventory](#post/it-inventory): every asset, scannable and synced with MDM
- [Learning platform](#post/learning-platform): trainings, quizzes and certificates
- [Employee hub](#post/employee-hub): rooms, desks and apps in one place
- [Domain manager](#post/domain-manager): every domain across three registrars
- [Bare-metal Kubernetes](#post/bare-metal-kubernetes): the platform all of them run on
