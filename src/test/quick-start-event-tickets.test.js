const QuickStartEventTickets = require("../lib/quick-start-event-tickets");

const quickStart = new QuickStartEventTickets();

// Test will hang for two minutes so you can check urls
jest.setTimeout(120000);

beforeAll(async () => quickStart.runQuickStart());

afterAll(async () => {
    await quickStart.cleanUp();
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

    it("shows urls", async () => {
        console.log(
            "Event Ticket Url: ",
            `https://pub1.pskt.io/${quickStart.ticketId}`
        );

        console.log("Data will be removed in 1 minutes");

        await new Promise((r) => setTimeout(r, 60000));
    });
});
