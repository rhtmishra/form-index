## What this delivers

A local-first React and Node catalogue with five editorial picks, scoped category lists, submitted text search and product enquiries delivered over SMTP. The browser never calls a supplier. MailDev lets the reviewer inspect a real sales message without creating an account.

## Review path

Run `npm ci` and `npm start` from the repository root. Open the catalogue on port 3000, search for `reading`, open the lamp, and send an enquiry. Check the message on port 1080. Browse Furniture to see the featured/additional split. Run `npm test` for selection and HTTP contracts and `node tests/mail-smoke.mjs` for live delivery.

## Trade-offs

The source is a reproducible nine-object fixture, not a live vendor integration. Search runs locally over one backend response. The inbox is ephemeral, not a production queue. The catalogue loader and delivery function are replaceable without changing the product pages. See DECISIONS.md for the next production steps and AI_USAGE.md for the assisted work log.