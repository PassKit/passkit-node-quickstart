const QuickStartEventTickets = require("../lib/quick-start-event-tickets");
const createClient = require("../lib/client-factory");
const { loadConfig, validateConfig } = require("../config/config");

const connection = createClient(validateConfig(loadConfig()));
const quickStart = new QuickStartEventTickets(connection.client);

// Test will hang for two minutes so you can check urls
jest.setTimeout(120000);

beforeAll(async () => quickStart.runQuickStart());

afterAll(async () => {
  await quickStart.cleanUp();
  connection.close();
});

describe("quick start event tickets", () => {
  it("has all image assets", () => {
    expect(quickStart.imageIds.getIcon()).toBeTruthy();
    expect(quickStart.imageIds.getLogo()).toBeTruthy();
    expect(quickStart.imageIds.getHero()).toBeTruthy();
    expect(quickStart.imageIds.getStrip()).toBeTruthy();
  });

  it("has template assets", () => {
    expect(quickStart.eventTemplateId).toBeTruthy();
    expect(quickStart.eventTemplateId.length).toBe(22);
  });

  it("has program assets", () => {
    expect(quickStart.productionId).toBeTruthy();
    expect(quickStart.productionId.length).toBe(22);
  });

  it("has venue assets", () => {
    expect(quickStart.venueId).toBeTruthy();
  });

  it("has ticket type assets", () => {
    expect(quickStart.ticketTypeId).toBeTruthy();
  });

  it("has ticket assets", () => {
    expect(quickStart.ticketId).toBeTruthy();
  });

  it("shows urls", () => {
    console.log(
      "Event Ticket Url: ",
      `https://pub1.pskt.io/${quickStart.ticketId}`,
    );
  });
});
