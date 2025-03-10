const QuickStartCoupons = require("../lib/quick-start-coupons");

const quickStart = new QuickStartCoupons();

// Test will hang for two minutes so you can check urls
jest.setTimeout(120000);

beforeAll(async () => quickStart.runQuickStart());

afterAll(async () => {
    await quickStart.cleanUp();
});

describe("quick start coupons", () => {
    it("has all image assets", () => {
        expect(quickStart.imageIds.getIcon()).toBeTruthy();
        expect(quickStart.imageIds.getLogo()).toBeTruthy();
        expect(quickStart.imageIds.getHero()).toBeTruthy();
        expect(quickStart.imageIds.getStrip()).toBeTruthy();
    });

    it("has template assets", () => {
        expect(quickStart.vipTemplateId).toBeTruthy();
        expect(quickStart.baseTemplateId).toBeTruthy();
        expect(quickStart.vipTemplateId.length).toBe(22);
        expect(quickStart.baseTemplateId.length).toBe(22);
    });

    it("has campaign assets", () => {
        expect(quickStart.campaignId).toBeTruthy();
        expect(quickStart.campaignId.length).toBe(22);
    });

    it("has offer assets", () => {
        expect(quickStart.vipOfferId).toBeTruthy();
        expect(quickStart.baseOfferId).toBeTruthy();
    });

    it("has coupon assets", () => {
        expect(quickStart.baseCouponId).toBeTruthy();
        expect(quickStart.vipCouponId).toBeTruthy();
    });

    it("shows urls", async () => {
        console.log(
            "Base Coupon Url: ",
            `https://pub1.pskt.io/${quickStart.baseCouponId}`
        );
        console.log(
            "VIP Coupon Url: ",
            `https://pub1.pskt.io/${quickStart.vipCouponId}`
        );

        console.log("Data will be removed in 1 minutes");

        await new Promise((r) => setTimeout(r, 60000));
    });
});
