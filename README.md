# KINGS AXIS ERP — public UI simulation

This repository publishes the static Kings Axis ERP interface demonstration at `www.kingsaxis.com`.

## Important limitations

- All displayed people, identifiers, vehicles, payments and operating records are illustrative synthetic examples.
- The page is a UI simulation only. Authentication, invitations, 2FA, server authorization, session control, database writes, IoT connections and live operational integrations are not active.
- The demonstration must never contain personal information, production credentials, live customer or employee data, or realistic government/vehicle identifiers.
- A browser-side access-code gate is not security and is intentionally not used.

## Files

- `index.html` — the complete static ERP interface demonstration.
- `CNAME` — configures GitHub Pages for `www.kingsaxis.com`.
- `scripts/check-public-demo-safety.mjs` — privacy and misleading-security regression check.
- `.github/workflows/public-demo-safety.yml` — runs the safety check for pull requests and changes to `main`.

## Updating the demonstration

1. Work on a branch and open a pull request.
2. Run `node scripts/check-public-demo-safety.mjs`.
3. Confirm the Public Demo Safety workflow passes.
4. Review the rendered demonstration before merging.

Do not commit directly to `main`.
