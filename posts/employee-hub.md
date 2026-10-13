# Employee hub: rooms, desks and apps in one place

Three questions eat a surprising amount of office time: *Is a room free? Where does that person sit? How do I get access to that app?* I built an employee hub that answers all three behind one sign-on.

## What I built

- **Live conference-room status.** The hub combines Outlook room calendars with Zoom Rooms presence to show whether each room is free or busy, what's on, and when it frees up. It appears on every employee's home page and on a TV kiosk outside the rooms. When a meeting ends, the board flips to free.
- **Honest data.** A room with no calendar shows *NO DATA*, not *free*. Telling people a room is open when you don't actually know is how they end up walking into meetings.
- **Interactive floor plan.** Search for a name, team or department and the matching desks light up.
- **App launcher.** Every SSO app you're assigned, pulled from Entra ID and one click away.
- **Request access.** For an app you don't have yet, write a justification and it becomes a service-desk ticket you can track from the hub.
- **Read-only by design.** The hub reports what rooms are doing but never books them. It holds only read permissions in the directory and mail system, which kept the security review short.

## How it saves time

- **Nobody walks the hallway** to check rooms, and there are fewer double-booked "quick syncs."
- **New hires find people on day one** without asking around.
- **App requests arrive complete.** Each request names the app, the person and the reason, so IT doesn't have to go back and ask.

## How it saves money

- **Replaces commercial room-display systems**, which usually charge per room per month and need dedicated tablets. This one runs on a TV the office already had.
- **Fewer help-desk round trips** asking "how do I get access to X?"
- **Better use of existing space.** Rooms don't sit empty because people assume they're taken.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Mantine, MSAL |
| Backend | Node.js 22, Express, Sequelize, PostgreSQL |
| Integrations | Microsoft Graph (users, groups, apps, room calendars), Zoom Rooms |
| Deploy | Docker, Kubernetes |
