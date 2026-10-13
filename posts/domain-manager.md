# Domain manager: three registrars, one table

The company's domains were spread across three registrars and a cloud DNS provider. Finding out what was about to expire meant logging into each one, and the worst way to learn a domain lapsed is a customer saying the site is down. I built a domain manager that puts **every domain on one screen**.

## What I built

- **Multi-registrar sync.** Every domain is pulled from GoDaddy, AWS Route 53 and Internet.bs into one table, showing registrar, account, expiry date and auto-renew status.
- **Expiry tracking.** Countdown pills and filters (such as "next 30 days") show what needs attention.
- **Renewal-cost forecasts.** Projected spend over the next 30, 90, 180 and 365 days, priced per TLD, so renewals are budgeted ahead of time.
- **Reputation checks.** Each domain is checked against blacklists through a reputation API, with a risk score and a report.
- **Runs itself.** A full registrar sync runs nightly, and reputation is re-checked weekly.
- **SSO sign-in** through the company's identity provider.

## How it saves time

- **One screen replaces three logins.** A renewal review that took an hour across portals is now a glance.
- **Problems surface before they hurt.** Expiring domains and blacklistings are flagged automatically instead of being discovered during an outage.

## How it saves money

- **Prevents lapsed domains.** A lost domain can mean downtime, broken email, and a premium to buy it back.
- **No surprise renewals.** The forecast shows what's coming, and unused domains are easy to spot and drop.
- **Protects email deliverability.** Catching a blacklisting early keeps outbound mail out of spam folders.

## Stack

| Layer | Tech |
|---|---|
| App | React, TypeScript, Tailwind, Node.js, scheduled jobs |
| Integrations | GoDaddy, AWS Route 53 and Internet.bs APIs, a reputation API |
| Identity | Entra ID SSO |
