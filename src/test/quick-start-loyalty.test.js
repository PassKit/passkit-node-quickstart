const QuickStartLoyalty = require("../lib/quick-start-loyalty");

const quickStart = new QuickStartLoyalty();

// Test will hang for two minutes so you can check urls
jest.setTimeout(120000);

beforeAll(async () => quickStart.runQuickStart());

afterAll(async () => {
  await quickStart.cleanUp();
});

describe("quick start loyalty", () => {
  it("has all image assets", () => {
    expect(quickStart.imageIds.getIcon()).toBeTruthy();
    expect(quickStart.imageIds.getLogo()).toBeTruthy();
    expect(quickStart.imageIds.getHero()).toBeTruthy();
    expect(quickStart.imageIds.getStrip()).toBeTruthy();
  });

  it("has template assets", () => {
    expect(quickStart.silverTemplateId).toBeTruthy();
    expect(quickStart.silverTemplateId).toBeTruthy();
    expect(quickStart.silverTemplateId.length).toBe(22);
    expect(quickStart.bronzeTemplateId.length).toBe(22);
  });

  it("has program assets", () => {
    expect(quickStart.programId).toBeTruthy();
    expect(quickStart.programId.length).toBe(22);
  });

  it("has tier assets", () => {
    expect(quickStart.silverTierId).toBeTruthy();
    expect(quickStart.bronzeTierId).toBeTruthy();
  });

  it("has member assets", () => {
    expect(quickStart.bronzeMemberId).toBeTruthy();
    expect(quickStart.silverMemberId).toBeTruthy();
  });

  it("has event assets", () => {
    expect(quickStart.checkInEvent).toBeTruthy();
  });

  it("shows urls", async () => {
    console.log(
      "Enrollment URL: ",
      `https://pub1.pskt.io/c/${quickStart.shortCode}`
    );
    console.log(
      "Bronze Pass Url: ",
      `https://pub1.pskt.io/${quickStart.bronzeMemberId}`
    );
    console.log(
      "Silver Pass Url: ",
      `https://pub1.pskt.io/${quickStart.silverMemberId}`
    );

    console.log("Data will be removed in 1 minutes");

    await new Promise((r) => setTimeout(r, 60000));
  });
});
