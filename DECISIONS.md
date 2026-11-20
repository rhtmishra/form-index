# Decisions and assumptions

| Decision | Reason and consequence |
| --- | --- |
| Five owner-selected IDs, not the five largest numerical ratings | The brief says “I have chosen”. Order is editorial; the displayed score is metadata. Category picks are the intersection with those IDs. Additional objects exclude the picks. No merchandiser login for five IDs. |
| Nine locally curated products, three categories | Fake Store is permitted, not required. Bundling a fixture and photos makes every acceptance path reproducible offline after install. The async loader can later call a supplier or database without changing the client or mail code. |
| Search on submit, not on every keystroke | Match a trimmed case-insensitive substring in name, description or category. Empty search returns all objects. Search is catalogue-wide. Downloading and filtering nine products is cheap; switch to a paged backend query before this becomes a large feed. |
| Separate product URLs using query parameters | Refresh, direct linking and browser history work without a router or server rewrite rules. There is a page load per navigation. |
| Name and email required; note optional | Sales needs a way to reply. The API validates lengths and addresses, looks up the product itself and controls the mail headers and recipient. No contact database, checkout or authentication. |
| SMTP acceptance before confirmation | A transport error returns 503; the form retains the customer's input. Acceptance is not proof of final delivery by a real provider. MailDev is the inspectable local sales inbox; it is deliberately not a production mail service. |
| CSS and stable product contracts, no design framework | Creative work is pending. Layout and palette can change without altering catalogue selection or delivery. No cloud resources provisioned. |

## With another day

First add browser-level regression tests for keyboard navigation, form retry and back/forward. Before public exposure add rate limiting, a durable enquiry/outbox with idempotent retry, delivery monitoring and a retention policy for contact information. Confirm image rights, currency and curation rules with the owner. Defer a CMS, provider-specific SDK and AWS deployment until the actual data, editorial workflow and delivery requirements are known.