# AI usage

GitHub Copilot in VS Code generated the implementation, tests and documentation from the supplied four-page brief. The underlying model identifier was not exposed in the session. No repository-local agent instruction files or delegated agents were used. This log describes the assisted session, not a claim that the candidate has independently reviewed every line.

## Plan and steering moments

1. **Start from the reviewer path.** The brief asked for a working enquiry and setup in under ten minutes. Use one same-origin app and start a local SMTP inbox alongside it; a console log is not an email.
2. **Interpret “I have chosen 5”.** Put an ordered list of product IDs in the source. Test it separately from numerical scores, including category picks and the remaining products.
3. **Remove external availability from the demo.** Use nine local product fixtures and bundle their images. Keep a loader boundary for a future supplier, rather than implementing a speculative second provider.
4. **Test a failed send.** Inject delivery into the HTTP handler. Force an SMTP exception in the test and require an error response, not a thank-you. Check actual delivery separately with a unique marker in MailDev.
5. **Try the documented run command.** The first background launch used the parent workspace, where there was no package manifest. Terminal output identified the wrong working directory; the README explicitly starts from the repository root.

## Where the AI was wrong

The initial scaffold required Node 22 and used a Node 22 CLI option without checking that the review machine had it. npm's engine warning exposed Node 20.20.2. The project now supports Vite's Node 20.19+ line, loads an optional env file using Node's built-in API, and was typechecked and tested on the installed runtime. The first dependency install was also interrupted by reuse of the terminal; the missing test binary was diagnosed from the install log and the install and test were rerun in sequence.

Time is recorded below as approximate wall-clock effort (planning, implementation, checks and documentation overlap); it excludes any subsequent independent candidate review or publication work.

About **16 minutes** for this session (06:49 to approximately 07:05 UTC): planning and setup 3 min, building 7 min, testing and troubleshooting 4 min, review and submission notes 2 min. Add your own review and submission time before sending.

Verified on Node 20.20.2: production build, both isolated tests, all nine locally served images, a real SMTP capture with the expected recipient and product, and the browser path from category to search to product to thank-you. Home displayed five tiles, furniture had three objects across its two sections, and `reading` returned only the lamp.