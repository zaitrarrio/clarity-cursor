# AGENTS.md

## Cursor Cloud specific instructions

### Repository overview

This is a **design-phase** repository for **Clarity**, a Strategic Intelligence & Go-To-Market Operating System. It contains:

- `clarity.html` — A self-contained static HTML/CSS prototype (~450 KB, ~8,900 lines) with ~35 screens/pages. Uses Tailwind CSS v4, Iconify, and Google Fonts loaded via CDN. Navigation is hash-based (`#page-*`).
- `prd.md` — An auto-compiled PRD (~122 KB) combining product brief, feature hierarchy, domain model, UI flow, and architecture docs.

There are **no build tools, package managers, linters, tests, or backend services**. No `package.json`, `Makefile`, `docker-compose.yml`, or similar exists.

### Running the prototype

Serve the HTML file with any static HTTP server:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080/clarity.html` in a browser.

### Gotchas

- The prototype includes a modal overlay (`CreateProjectTaskBoard` section) that may render on top of other content when the page first loads. This is part of the prototype design — do **not** modify the file to hide it; simply navigate to a different page section via the left sidebar.
- All external assets (Tailwind CSS, fonts, icons) are loaded from CDNs, so an internet connection is required for correct rendering.
