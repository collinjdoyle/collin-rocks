# IT inventory: every laptop and USB stick, scannable

IT gear was tracked in a ticketing add-on plus a spreadsheet. The honest answer to "where is that laptop?" was "let me go look." I built an inventory app where **every item and every shelf has a QR label**, so finding, stowing and auditing gear is a scan from a phone.

## What I built

- **Assets and consumables.** Serialized items get:
  - auto-numbered tags;
  - a status lifecycle (in stock → deployed → repair → retired);
  - warranty and purchase data;
  - custom fields per category.

  Bulk stock like cables and USB drives is counted per bin, with reorder thresholds.
- **Chaos storage that works.** Put anything anywhere: scan the shelf, scan the item, done. Search finds it later. Locations nest from site to room, rack, shelf and bin.
- **Scanning everywhere.** It's an installable PWA that scans with a phone camera (native barcode detection, with a WASM fallback on iOS) or a USB/Bluetooth scanner. Pointing a plain phone camera at a label opens the item's record.
- **Label printing.** QR and Code 128 sheets in common label sizes, plus ZPL for thermal printers.
- **Checkouts with accountability.** Check gear out to an employee (synced from Entra ID) or to a location, and keep the full custody history:
  - due dates and an overdue list;
  - condition in and out;
  - an optional service-desk ticket, opened or linked automatically. A ticket failure never blocks the checkout.
- **Audits in minutes.** Scan a shelf. Missing and unexpected items are flagged, strays are moved automatically, and the shelf is reconciled.
- **Device sync.** It pulls Macs, iPhones and iPads from Jamf, and Windows and Linux machines from Intune. Devices are matched by serial, so each physical device is one item. Conflicts go to a review queue instead of being overwritten.
- **New-hire hardware.** When the people platform announces a hire, the app suggests a laptop from stock. One click reserves it, and it's checked out on the start date.
- **Platform basics:**
  - SSO with admin, tech and viewer roles;
  - audit log;
  - scoped REST API with OpenAPI docs;
  - signed outbound webhooks;
  - CSV import and export.

## How it saves time

- **"Where is it?" takes seconds, not a walk.** Scan or search instead of hunting.
- **Shelf audits take minutes, not an afternoon.** Scan everything and the app reconciles it.
- **Receiving new gear is one pass**: enter serials, print labels, scan them onto a shelf.
- **No double entry.** MDM and directory syncs keep devices and owners current.

## How it saves money

- **Replaces a paid asset-management add-on** with an app on existing infrastructure.
- **Less lost hardware.** Every move is on the record. Leavers who still hold gear stay visible until it comes back.
- **Smarter buying.** Accurate stock counts and low-stock alerts mean returned laptops get reused before new ones are ordered, and nobody panic-buys accessories that are already on a shelf.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Mantine, TanStack Query, Vite PWA |
| Backend | Node.js 22, TypeScript, Express 5, Prisma, PostgreSQL 16 |
| Integrations | Microsoft Graph, Jamf Pro, Intune, Jira Service Management, Slack |
| Deploy | Docker, GitHub Actions, Rancher Fleet on on-prem Kubernetes |
