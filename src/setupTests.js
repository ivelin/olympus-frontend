// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import "react-router-dom";

import { i18n } from "@lingui/core";
import { setupServer } from "msw/node";

import handlers from "./testHandlers";
i18n.activate("en");
import { fetchLocale } from "./locales";
const DEFAULT_LOCALE = "en";
// import { launchDApp, launchNode } from "./e2e/puppeteer/testHelpers";

// TODO add jest-puppeteer preset
// jest.setTimeout(60000);

global.CSS = { supports: jest.fn() };

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  const _useLocation = jest.fn().mockReturnValue({
    pathname: "/another-route",
    search: "",
    hash: "",
    state: null,
    key: "5nvxpbdafa",
  });

  return {
    __esModule: true,
    ...originalModule,
    useLocation: () => {
      return { pathname: "/" };
    },
  };
});

const server = setupServer(...handlers);

fetchLocale(DEFAULT_LOCALE);

beforeAll(() => {
  // Enable API mocking before tests.
  server.listen({ onUnhandledRequest: "bypass" });
  i18n.activate(DEFAULT_LOCALE);
});

// Reset any runtime request handlers we may add during the tests.
// beforeEach(() => {});

// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  server.resetHandlers();
  jest.resetAllMocks();
});

// Disable API mocking after the tests are done.
afterAll(() => server.close());

// jest.setTimeout(60000);

/**
let node;

beforeAll(async () => {
  node = launchNode();
  await launchDApp();
});

afterAll(() => {
  node?.kill();
});
 */

// re-export everything
// export * from "./testUtils";
