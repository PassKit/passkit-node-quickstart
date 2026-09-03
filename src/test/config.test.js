const { loadConfig, validateConfig } = require("../config/config");

describe("configuration", () => {
  it("provides safe defaults", () => {
    const config = loadConfig({ PASSKIT_PASSPHRASE: "secret" });
    expect(config.address).toBe("grpc.pub1.passkit.io");
    expect(config.port).toBe(443);
    expect(config.connectionMode).toBe("pool");
    expect(config.keepAssets).toBe(false);
  });

  it("rejects missing passphrases before connecting", () => {
    const config = loadConfig({});
    expect(() => validateConfig(config, { checkFiles: false })).toThrow(
      "PASSKIT_PASSPHRASE is required",
    );
  });

  it("rejects unsupported connection modes", () => {
    const config = loadConfig({
      PASSKIT_PASSPHRASE: "secret",
      PASSKIT_CONNECTION_MODE: "other",
    });
    expect(() => validateConfig(config, { checkFiles: false })).toThrow(
      "PASSKIT_CONNECTION_MODE",
    );
  });
});
