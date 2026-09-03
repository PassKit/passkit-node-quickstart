const QuickStartFlights = require("../lib/quick-start-flights");
const { loadConfig, validateConfig } = require("../config/config");

describe("flights", () => {
  it("builds a departure date seven days in the future", () => {
    const before = new Date();
    before.setUTCDate(before.getUTCDate() + 7);
    const date = new QuickStartFlights({}).futureDepartureDate();
    expect([date.getYear(), date.getMonth(), date.getDay()]).toEqual([
      before.getUTCFullYear(),
      before.getUTCMonth() + 1,
      before.getUTCDate(),
    ]);
  });

  it("requires an Apple pass certificate only for flights", () => {
    const config = loadConfig({ PASSKIT_PASSPHRASE: "secret" });
    expect(() =>
      validateConfig(config, {
        checkFiles: false,
        requireAppleCertificate: true,
      }),
    ).toThrow("PASSKIT_APPLE_CERTIFICATE is required for flights");
  });
});
