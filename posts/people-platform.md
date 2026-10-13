# People platform: the directory that builds the account

Every company has a "source of truth" for people. Usually it's three spreadsheets plus the identity provider, and none of them agree. I built a people platform that syncs from Entra ID and holds the extra fields HR and Legal need. Then I took it further: it **onboards new hires itself**.

## What I built

- **Employee directory** synced from Entra ID on a schedule. It holds the fields the identity provider doesn't: department history, contractor status, start dates, security-training results and data-access flags.
- **Compliance views for HR and Legal.** A dedicated role shows who has passed security training, who is overdue, and who can reach source code or protected data. Reports export to CSV for auditors.
- **Full audit log.** Every change records who made it, with the before and after values.
- **Onboarding engine.** A service-desk ticket arrives as a staged plan. IT reviews it and approves, and the platform creates:
  - the Entra user, licence and manager;
  - groups and Exchange distribution lists;
  - an encrypted Temporary Access Pass;
  - the employee record.

  Every step is idempotent and can be retried. Old runs can be archived, and their logs are kept.
- **Event fan-out.** Signed webhooks such as `employee.onboarded` keep the other internal apps in sync. People data starts in one place.

## Engineering highlights

- **A human approves first.** Nothing writes to the identity provider until someone approves the plan.
- **Secrets handled properly.** The first-day pass is encrypted at rest and never emailed. Only admins can reveal it, and every reveal is audited.
- **Built for messy real-world APIs.**
  - Run state survives restarts.
  - Job locks stop duplicate schedules when several replicas boot at once.
  - Upstream error text is scrubbed of control characters, so one bad response can't break a run.

## How it saves time

- **New-hire provisioning went from 4–6 hours to under an hour**, and building the account itself is a few minutes of review.
- **Compliance questions are answered in seconds.** "Who hasn't passed training?" is a filter and an export, not a week of emails.
- **One sync serves many apps.** The other apps subscribe to events instead of each building its own directory sync.

## How it saves money

- **No separate provisioning tool** is needed for the core joiner workflow. It runs on licences the company already has.
- **Audit-ready by default.** Fewer hours go into pulling evidence together at audit time.
- **Fewer access mistakes.** Group membership follows rules, so there are fewer over-provisioned accounts to find and fix later.

## Stack

| Layer | Tech |
|---|---|
| App | React, Node.js/Express |
| Data | PostgreSQL with Prisma |
| Identity & mail | Microsoft Graph, Exchange Online |
| Workflow | Jira Service Management automation, Slack |
| Deploy | Docker, Kubernetes on AWS EKS, Argo CD |
