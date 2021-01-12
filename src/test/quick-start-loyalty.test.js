const QuickStartLoyalty = require("../lib/quick-start-loyalty");

const quickStart = new QuickStartLoyalty();

// Test will hang for one minute so you can check urls
jest.setTimeout(60000);

beforeAll(async () => quickStart.runQuickStart());

afterAll(async () => {
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

  // quickStart.cleanUp();
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
});
