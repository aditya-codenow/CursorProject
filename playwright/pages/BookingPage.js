class BookingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.source = page.locator("#source");
    this.destination = page.locator("#destination");
    this.date = page.locator("#date");
    this.time = page.locator("#time");
    this.rideType = page.locator("#rideType");
    this.submit = page.getByRole("button", { name: "Book cab" });
    this.reset = page.getByRole("button", { name: "Reset fields" });
    this.result = page.locator("#result");
  }

  async goto() {
    await this.page.goto("/");
  }

  async waitForLocationsLoaded() {
    // The app replaces "Loading locations…" with real options.
    await this.source.waitFor({ state: "visible" });
    await this.destination.waitFor({ state: "visible" });

    // Wait until we have at least 2 options (placeholder + at least one real location).
    await this.page.waitForFunction(() => {
      const s = document.querySelector("#source");
      const d = document.querySelector("#destination");
      if (!s || !d) return false;
      return s.options.length >= 2 && d.options.length >= 2 && !s.disabled && !d.disabled;
    });
  }

  async getSourceOptionsText() {
    return await this.source.locator("option").allTextContents();
  }

  async getDestinationOptionsText() {
    return await this.destination.locator("option").allTextContents();
  }

  async selectSource(name) {
    await this.source.selectOption({ label: name });
  }

  async selectDestination(name) {
    await this.destination.selectOption({ label: name });
  }

  async setDate(dateIso) {
    await this.date.fill(dateIso);
  }

  async setTime(time24h) {
    await this.time.fill(time24h);
  }
}

module.exports = { BookingPage };

