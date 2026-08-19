# qa-playwright-framework

A Playwright + TypeScript test automation framework demonstrating a clean, scalable
structure for UI and API testing. It runs against public sandboxes so anyone can
clone and run it with no setup or credentials.

- **UI**: [Sauce Demo](https://www.saucedemo.com) store, tested through the Page Object Model.
- **API**: [restful-booker](https://restful-booker.herokuapp.com) sandbox, tested through a small typed client.

## Structure

```
src/
  pages/        Page Objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
  fixtures/     Custom Playwright fixtures — inject page objects, provide a `loggedIn` state
  api/          Typed API client (auth token handling, CRUD helpers)
  data/         Test data (users, checkout details)
tests/
  ui/           Browser tests (login, end-to-end checkout)
  api/          API tests (health check, create/read/delete booking)
playwright.config.ts   Two projects: `ui` and `api`, with env-overridable base URLs
.github/workflows/     CI: install, run, upload the HTML report
```

## Running

```bash
npm ci
npx playwright install --with-deps chromium
npm test          # everything
npm run test:ui   # UI project only
npm run test:api  # API project only
npm run report    # open the last HTML report
```

Base URLs default to the public sandboxes and can be overridden with `UI_BASE_URL`
and `API_BASE_URL` (see `.env.example`).

## Design notes

- **Page Object Model** keeps selectors and page behaviour out of the specs, so
  tests read as intent and UI changes touch one file.
- **Fixtures** inject page objects and a pre-authenticated `loggedIn` state,
  removing setup boilerplate from each test.
- **Stable selectors** use Sauce Demo's `data-test` attributes rather than CSS
  or text, so tests survive styling and copy changes.
- **API and UI share one runner** via separate Playwright projects, with retries
  and traces enabled only in CI.
