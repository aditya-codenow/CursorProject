const { test, expect } = require("@playwright/test");
const { BookingPage } = require("../pages/BookingPage");

test.describe("SwiftCab booking landing page", () => {
  test("1) Check title and visibility of form fields", async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();

    await expect(page).toHaveTitle(/SwiftCab/);

    await expect(booking.source).toBeVisible();
    await expect(booking.destination).toBeVisible();
    await expect(booking.date).toBeVisible();
    await expect(booking.time).toBeVisible();
    await expect(booking.rideType).toBeVisible();
    await expect(booking.submit).toBeVisible();
    await expect(booking.reset).toBeVisible();
  });

  test("2) Verify API populates #source and #destination selects", async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.waitForLocationsLoaded();

    const sourceOptions = await booking.getSourceOptionsText();
    const destOptions = await booking.getDestinationOptionsText();

    // Placeholder + seeded locations from SQLite via /api/locations.
    expect(sourceOptions.length).toBeGreaterThan(2);
    expect(destOptions.length).toBeGreaterThan(2);

    expect(sourceOptions).toContain("Airport");
    expect(destOptions).toContain("Airport");
  });

  test("3) Fill form and check for submit button enablement", async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.waitForLocationsLoaded();

    await expect(booking.submit).toBeEnabled();

    // Choose two different locations.
    await booking.selectSource("Airport");
    await booking.selectDestination("MG Road");

    // Pick a near-future date/time (today + 30 minutes).
    const now = new Date();
    const t = new Date(now.getTime());
    t.setMinutes(t.getMinutes() + 30);
    const yyyy = String(t.getFullYear());
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    const hh = String(t.getHours()).padStart(2, "0");
    const mi = String(t.getMinutes()).padStart(2, "0");

    await booking.setDate(`${yyyy}-${mm}-${dd}`);
    await booking.setTime(`${hh}:${mi}`);

    await expect(booking.submit).toBeEnabled();

    await booking.submit.click();
    await expect(booking.result).toBeVisible();
    await expect(booking.result).toContainText(/Confirmed:/);

    // Reset should clear the confirmation.
    await booking.reset.click();
    await expect(booking.result).toBeHidden();
  });
});

