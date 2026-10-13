# Learning platform: assign once, everyone's trained

Training lived in a shared drive, plus the occasional "did you read the doc?" message. Nobody could tell who had finished, and paying per seat for an enterprise LMS to host a handful of internal courses didn't make sense. So I built a learning platform that fits how the company already works: **SSO, directory groups and Slack**.

## What I built

- **Training builder.** A training is a flow of modules and steps. A step can be:
  - rich text;
  - a slide deck (PowerPoint files are converted automatically);
  - an embedded step-by-step guide;
  - a video;
  - a quiz.

  Steps live in a shared library and can be reused in any training.
- **Self-grading quizzes** with pass thresholds and instant feedback.
- **Assignments to people or whole directory groups**, with due dates. Group assignments stay live: anyone who joins the group later is enrolled automatically on their next sign-in. Users and groups are provisioned over SCIM.
- **Slack built in:**
  - DMs for new assignments and reminders;
  - completion announcements;
  - an optional DM to the manager each time someone on their team finishes.
- **Certificates.** Finishing a training can award a shareable completion certificate.
- **Manager views.** Team managers see their team's progress and assignments without needing admin access.
- **Feedback loop.** In-app feedback goes to Slack and can open a ticket automatically.

## How it saves time

- **Onboarding training happens without anyone setting it up.** A new hire lands in the right group, so their first-week training is already waiting.
- **Managers stop chasing.** Slack tells them when each person finishes, and the team view shows who's behind.
- **Build once, reuse everywhere.** A security module written once can be added to every training that needs it.

## How it saves money

- **No per-seat LMS licence.** Commercial learning platforms usually charge per user, per month. This runs on infrastructure the company already has.
- **Faster ramp-up.** New hires get structured, trackable training in week one instead of piecing it together themselves.
- **Compliance evidence on demand.** Completion records and quiz results answer "who's been trained?" without a scramble.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind, MSAL |
| Backend | Node.js 22, Express, Prisma, PostgreSQL 16 |
| Identity | Entra ID SSO and SCIM |
| Integrations | Slack API, LibreOffice for slide conversion |
| Deploy | GitHub Actions, GHCR, Rancher Fleet |
