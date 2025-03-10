const { ProjectStatus } = require("passkit-node-sdk/io/common/project_pb");
const {
    DefaultTemplateRequest,
    PassTemplate,
    PassProtocol
} = require("passkit-node-sdk/io/common/template_pb");
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb');
const { Id } = require("passkit-node-sdk/io/common/common_objects_pb");
const { FieldFilter, FilterGroup, Filters, Operator } = require("passkit-node-sdk/io/common/filter_pb");
const {
    ImageData,
    ImageIds,
    CreateImageInput,
} = require("passkit-node-sdk/io/image/image_pb");
const imageToBase64 = require("image-to-base64");
const { Person } = require("passkit-node-sdk/io/common/personal_pb");
const { CouponCampaign } = require("passkit-node-sdk/io/single_use_coupons/campaign_pb")
const { CouponOffer } = require("passkit-node-sdk/io/single_use_coupons/offer_pb")
const { ListRequest, Coupon } = require("passkit-node-sdk/io/single_use_coupons/coupon_pb")

//Single Connection
//const PassKitGRPC = require("./client");
//Connection Pooling
const grpcPool = require("./poolingClient");
const helper = require("./helpers");

class QuickStartCoupons {
    constructor() {
        //Single Connection
        //this.pkClient = new PassKitGRPC().getInstance();
        //Connection Pooling
        this.pkClient = grpcPool.getConnection();
        this.heroImageId = "";
        this.stripImageId = "";
        this.iconId = "";
        this.logoId = "";
        this.profileId = "";
        this.baseTemplate = new PassTemplate();
        this.vipTemplate = new PassTemplate();
        this.baseTemplateId = "";
        this.vipTemplateId = "";
        this.baseOfferId = "";
        this.vipOfferId = "";
        this.campaignId = "";
        this.baseCouponId = "";
        this.vipCouponId = "";
        this.imageIds = new ImageIds();

    }

    async runQuickStart() {
        try {
            const imageData = new ImageData();
            const icon = await imageToBase64("./src/images/shared/icon.png");
            const logo = await imageToBase64("./src/images/shared/logo.png");
            const hero = await imageToBase64("./src/images/loyalty/hero.png");
            const strip = await imageToBase64("./src/images/loyalty/strip.png");

            imageData.setIcon(icon).setLogo(logo).setHero(hero).setStrip(strip);

            await this.createImages(imageData);
            await this.getbaseTemplate();
            await this.getvipTemplate();
            this.prepbaseTemplate();
            this.prepvipTemplate();
            await this.createbaseTemplate();
            await this.createvipTemplate();
            await this.createCampaign();
            await this.createBaseOffer();
            await this.createVipOffer();
            await this.createBaseCoupon();
            await this.createVipCoupon();
            await this.updateCoupon();
            await this.getCoupon();
            await this.listCoupons();
            await this.redeemCoupon();
            await this.voidCoupon();
            return "done";
        } catch (error) {
            console.log("Error: ", error);
            return "done";
        }
    }

    async cleanUp() {
        try {
            await this.deleteCampaign();
            await this.deleteTemplate(this.baseTemplateId);
            await this.deleteTemplate(this.vipTemplateId);
            await this.deleteImage(this.imageIds.getIcon());
            await this.deleteImage(this.imageIds.getLogo());
            await this.deleteImage(this.imageIds.getHero());
            await this.deleteImage(this.imageIds.getStrip());
            await this.deleteImage(this.imageIds.getApplelogo());
            return "done";
        } catch (error) {
            console.log("Error: ", error);
            return "done";
        }
    }

    createImages(imageData) {
        console.log("Creating images");
        const request = new CreateImageInput();
        request.setImagedata(imageData);

        const callback = helper.createImagesResponse.bind(this);

        return new Promise((resolve, reject) => {
            //Single Connection
            //this.pkClient.getImagesClient().createImages(request, (err, response) => {
            // Connection Pooling    
            this.pkClient.imageClient.createImages(request, (err, response) => {
                if (err) {
                    reject(err);
                }
                resolve(callback(response));
            });
        });
    }

    getbaseTemplate() {
        console.log("Getting base template");
        const request = new DefaultTemplateRequest();
        request.setProtocol(PassProtocol.SINGLE_USE_COUPON);
        request.setRevision(1);
        const callback = helper.createBaseResponse.bind(this);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getTemplateClient()
                //Connection Pooling    
                .templateClient
                .getDefaultTemplate(request, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    getvipTemplate() {
        console.log("Getting vip template");
        const request = new DefaultTemplateRequest();
        request.setProtocol(PassProtocol.SINGLE_USE_COUPON);
        request.setRevision(1);
        const callback = helper.createVipResponse.bind(this);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getTemplateClient()
                //Connection Pooling    
                .templateClient
                .getDefaultTemplate(request, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    prepvipTemplate() {
        console.log("Prepping vip template");

        this.vipTemplate
            .setName("Quickstart vip Offer")
            .setDescription("Quickstart vip Offer Pass")
            .setTimezone("Europe/London")
            .setImageids(this.imageIds)
            .clearImages();
    }

    prepbaseTemplate() {
        console.log("Prepping base template");
        this.baseTemplate
            .setName("Quickstart base Offer")
            .setDescription("Quickstart base Offer Pass")
            .setTimezone("Europe/London")
            .setImageids(this.imageIds)
            .clearImages();
    }

    createbaseTemplate() {
        console.log("Creating base template");
        const callback = helper.baseTemplateResponse.bind(this);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getTemplateClient()
                //Connection Pooling    
                .templateClient
                .createTemplate(this.baseTemplate, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createvipTemplate() {
        console.log("Creating vip template");
        const callback = helper.vipTemplateResponse.bind(this);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getTemplateClient()
                //Connection Pooling    
                .templateClient
                .createTemplate(this.vipTemplate, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createCampaign() {
        console.log("Creating campaign");
        const callback = helper.campaignResponse.bind(this);
        const campaign = new CouponCampaign();
        campaign
            .setName("Quickstart Campaign")
            .addStatus(ProjectStatus.PROJECT_DRAFT)
            .addStatus(ProjectStatus.PROJECT_ACTIVE_FOR_OBJECT_CREATION);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .createCouponCampaign(campaign, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    listCoupons() {
        console.log("Listing coupons");

        return new Promise((resolve, reject) => {
            const listRequest = new ListRequest();
            const filters = new Filters();
            const filterGroup = new FilterGroup();
            const fieldFilter = new FieldFilter();
            const fieldFilter2 = new FieldFilter();

            filterGroup.setCondition(Operator.AND);
            fieldFilter.setFilterfield("passStatus");
            fieldFilter.setFiltervalue("PASS_ISSUED");
            fieldFilter.setFilteroperator("eq");
            fieldFilter2.setFilterfield("passkitId");
            fieldFilter2.setFiltervalue(this.baseCouponId);
            fieldFilter2.setFilteroperator("eq");

            filterGroup.setFieldfiltersList([fieldFilter, fieldFilter2]);
            filters.setFiltergroupsList([filterGroup]);
            filters.setLimit(-1);
            listRequest.setFilters(filters);
            listRequest.setCouponcampaignid(this.campaignId);

            //Single Connection
            //const couponStream = this.pkClient.getCouponsClient().listCouponsByCouponCampaign(listRequest);

            //gRPC Connection
            const couponStream = this.pkClient.couponsClient.listCouponsByCouponCampaign(listRequest);

            const coupons = [];

            couponStream.on('data', (data) => {
                console.log('Received Coupon:', data.toObject());
                coupons.push(data.toObject());
            });

            couponStream.on('end', () => {
                console.log('Stream ended');
                resolve(coupons);
            });

            couponStream.on('error', (err) => {
                console.error('Stream error:', err);
                reject(err);
            });
        });
    }


    createBaseOffer() {
        console.log("Creating base offer");
        const callback = helper.baseOfferResponse.bind(this);
        // Get the current timestamp for IssueStartDate (Now)
        const issueStartDate = new Timestamp();
        issueStartDate.fromDate(new Date());
        // Get the timestamp for IssueEndDate (1 day later)
        const issueEndDate = new Timestamp();
        issueEndDate.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Adds 1 day   
        const offer = new CouponOffer();
        offer
            .setCampaignid(this.campaignId)
            .setId("base")
            .setBeforeredeempasstemplateid(this.baseTemplateId)
            .setOffertitle("Quickstart base Offer")
            .setOffershorttitle("base Offer")
            .setOfferdetails("Your Quickstart Offer")
            .setIssuestartdate(issueStartDate)
            .setIssueenddate(issueEndDate)
            .setIanatimezone("Europe/London");

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .createCouponOffer(offer, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createVipOffer() {
        console.log("Creating vip tier");
        const callback = helper.vipOfferResponse.bind(this);
        // Get the current timestamp for IssueStartDate (Now)
        const issueStartDate = new Timestamp();
        issueStartDate.fromDate(new Date());
        // Get the timestamp for IssueEndDate (1 day later)
        const issueEndDate = new Timestamp();
        issueEndDate.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Adds 1 day  

        const offer = new CouponOffer();
        offer
            .setId("vip")
            .setBeforeredeempasstemplateid(this.vipTemplateId)
            .setCampaignid(this.campaignId)
            .setOffertitle("Quickstart Vip Offer")
            .setOffershorttitle("Vip Offer")
            .setOfferdetails("Your Quickstart Offer")
            .setIssuestartdate(issueStartDate)
            .setIssueenddate(issueEndDate)
            .setIanatimezone("Europe/London");

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .createCouponOffer(offer, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createBaseCoupon() {
        console.log("Creating base coupon");
        const callback = helper.createBaseCouponResponse.bind(this);
        const coupon = new Coupon();
        coupon
            .setOfferid(this.baseOfferId)
            .setCampaignid(this.campaignId)
            .setPerson(
                new Person()
                    .setDisplayname("base Billy")
                    .setEmailaddress("base.billy@dummy.passkit.com")
            );

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .createCoupon(coupon, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createVipCoupon() {
        console.log("Creating vip coupon");
        const callback = helper.createVipCouponResponse.bind(this);
        const coupon = new Coupon();
        coupon
            .setOfferid(this.vipOfferId)
            .setCampaignid(this.campaignId)
            .setPerson(
                new Person()
                    .setDisplayname("vip Steve")
                    .setEmailaddress("vip.steve@dummy.passkit.com")
            );

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .createCoupon(coupon, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    deleteCampaign() {
        console.log("Delete Campaign");
        const deleteId = new Id();
        deleteId.setId(this.campaignId);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .deleteCouponCampaign(deleteId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    updateCoupon() {
        console.log("Update Coupon Record");
        const coupon = new Coupon();
        coupon
            .setId(this.baseCouponId)
            .setPerson(
                new Person()
                    .setDisplayname("base")
            );

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .updateCoupon(coupon, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });

    }

    getCoupon() {
        console.log("Get Coupon Record");
        const couponId = new Id();
        couponId.setId(this.baseCouponId);
        console.log(couponId.getId)
        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .getCouponById(couponId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    redeemCoupon() {
        console.log("Redeem Coupon");
        const coupon = new Coupon();
        coupon
            .setId(this.baseCouponId);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .redeemCoupon(coupon, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    voidCoupon() {
        console.log("Void Coupon");
        const coupon = new Coupon();
        coupon
            .setId(this.baseCouponId);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getCouponsClient()
                // Connection Pooling  
                .couponsClient
                .voidCoupon(coupon, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    deleteTemplate(id) {
        console.log("Delete Template");
        const deleteId = new Id();
        deleteId.setId(id);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getTemplateClient()
                //Connection Pooling  
                .templateClient
                .deleteTemplate(deleteId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    deleteImage(id) {
        console.log("Delete Image: ", id);
        const deleteId = new Id();
        deleteId.setId(id);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getImagesClient()
                //Connection Pooling  
                .imageClient
                .deleteImage(deleteId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }
}

module.exports = QuickStartCoupons;
