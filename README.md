# Civic League of Gulfport, Mississippi — Website

Static website for the Civic League of Gulfport. No build step, no framework — just HTML/CSS/JS.

## Pages

| Page | File | Notes |
|---|---|---|
| Home | `index.html` | Hero, countdown to the Tour of Homes, projects, stats |
| History | `history.html` | Founding story, timeline, charter members, past presidents |
| Tour of Homes | `tour.html` | Countdown, ticket info, QR code slot |
| Gallery | `gallery.html` | Add photos to `images/gallery/` and list them in the `GALLERY_IMAGES` array in `gallery.html` |
| Members | `members.html` | Password-protected directory (see below) |

## The member password

The member directory (roster, phone numbers, addresses, emails, meeting programs)
is **encrypted with AES-256** and only unlocked in the browser with the shared
member password. The deployed site never contains the plain-text roster.

- **Current password:** `civic1947`
- The plain-text source data lives in `tools/members-source.json` — this file is
  excluded from git (`.gitignore`) and from Vercel deploys (`.vercelignore`).
  Keep it private; it is the only unencrypted copy.

### To change the password or update member info

1. Edit `tools/members-source.json` (roster, officers, meetings, reminders).
2. Run:

   ```
   node tools/encrypt-members.mjs "YourNewPassword"
   ```

3. Redeploy. Members use the new password immediately.

## The Tour of Homes QR code

Save the ticket QR code image as `images/tour-qr.png` and it will appear
automatically on the Tour of Homes page. Until then, the page shows a
"QR code coming soon" placeholder.

## Countdown date

The countdown targets **Sunday, December 6, 2026, 1:00 PM Central** — edit the
date at the top of the countdown block in `js/main.js` for future years.

## Local preview

```
npx serve C:\Users\JTZak\gulfport-civic-league
```

## Deploying

The folder deploys as-is to Vercel (or any static host). `.vercelignore`
keeps the `tools/` folder (with the plain-text roster) out of the deployment.
