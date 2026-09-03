const QuickStartFlights = require("../lib/quick-start-flights");
const createClient = require("../lib/client-factory");
const { loadConfig, validateConfig } = require("../config/config");

const config = validateConfig(loadConfig(), { requireAppleCertificate: true });
const connection = createClient(config);
const quickStart = new QuickStartFlights(connection.client, config);

jest.setTimeout(120000);

beforeAll(async () => quickStart.runQuickStart());

afterAll(async () => {
  try {
    await quickStart.cleanUp();
  } finally {
    connection.close();
  }
});

describe("quick start flights", () => {
  it("creates images and a flight template", () => {
    expect(quickStart.imageIds.getIcon()).toBeTruthy();
    expect(quickStart.imageIds.getLogo()).toBeTruthy();
    expect(quickStart.templateId).toBeTruthy();
  });

  it("makes the carrier and airports available and creates the flight", () => {
    expect(typeof quickStart.carrierCreated).toBe("boolean");
    expect(typeof quickStart.originCreated).toBe("boolean");
    expect(typeof quickStart.destinationCreated).toBe("boolean");
    expect(quickStart.flightCreated).toBe(true);
    expect(quickStart.designatorCreated).toBe(true);
  });

  it("creates at least one boarding pass URL", () => {
    expect(quickStart.boardingPasses.length).toBeGreaterThan(0);
    expect(quickStart.boardingPasses[0].url).toBeTruthy();
  });
});
