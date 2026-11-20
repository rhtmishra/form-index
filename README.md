# Form Index

A small catalogue of furniture, objects and tableware. Browse the owner's five picks, explore a category, search, or send sales an enquiry from an object page.

## Run locally

From the **repository root** with Node 20.19+ on the 20.x line, or Node 22.12+ and npm installed:

```sh
npm ci
npm start
```

Open **http://127.0.0.1:3000** for the catalogue and **http://127.0.0.1:1080** for the sales inbox. Leave the terminal running. `npm start` typechecks and builds React, then runs the Node server and MailDev together. Stop both with Ctrl-C. The first install needs internet; the running catalogue does not. No Docker, accounts, API keys, database or environment file required.

Default ports: 3000 (web/API), 1025 (SMTP), 1080 (inbox). Keep the demo bound to loopback. MailDev captures actual SMTP messages in memory; it does not forward to the internet. Messages disappear on restart. Use fictitious contact details.

## Review the critical path

1. Home shows five curated tiles. Click **Furniture** to see featured furniture and a separate additional item.
2. Enter `reading` and submit search. Only Studio Table Lamp matches (in its description). A nonsense query returns an empty state.
3. Open an object tile, choose **Enquire**, enter a name and email, and submit. Check the thank-you confirmation, then the sales inbox for the product reference, contact details, reply-to and message.

```sh
npm test                     # isolated catalogue and HTTP contract tests
npm run build                # strict TypeScript check and Vite production build
node tests/mail-smoke.mjs    # with npm start running and default mail settings
```

The smoke check sends one synthetic enquiry and verifies its recipient, subject and unique message in MailDev. This is intentionally separate from the isolated tests.

## Structure and configuration

React + TypeScript provides a browser-based review path with no emulator. Node + TypeScript keeps product contracts shared without coupling the UI to Express, SMTP or the fixture. Vite builds static assets; one same-origin Express server handles API and assets.

- `src/server/source.ts`: catalogue provider and merchandising selection.
- `src/catalogue.ts`: wire types and pure selection/search rules.
- `src/server/app.ts`: validated API with injected catalogue loader and delivery function. `start.ts` connects SMTP and serves the build.
- `src/client/`: React views and CSS. Product data only enters through `GET /api/catalogue`; images are served locally.
- `.env.example`: optional server settings. Copy to `.env` for overrides. For a different SMTP service set host, port, TLS/auth, sender and sales address. To run without MailDev, build and run `npx tsx src/server/start.ts`.

Photographs: [DummyJSON product catalogue](https://dummyjson.com/products), bundled from its sample furniture, home-decoration and kitchen-accessories image collections for this demo. Display names, USD prices, scores and copy are illustrative, not offers. Replace demo assets with approved creative before publication.

See [DECISIONS.md](DECISIONS.md) and [AI_USAGE.md](AI_USAGE.md) for trade-offs and the work log.