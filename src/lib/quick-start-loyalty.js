const { ProjectStatus } = require("@passkit/node-sdk/io/common/project_pb");
const {
  DefaultTemplateRequest,
  PassTemplate,
  PassProtocol,
} = require("@passkit/node-sdk/io/common/template_pb");
const { MemberEvent } = require("@passkit/node-sdk/io/member/member_events_pb");
const {
  EarnBurnPointsRequest,
  Member,
  MemberCheckInOutRequest,
} = require("@passkit/node-sdk/io/member/member_pb");
const {
  BalanceType,
  PointsType,
  Program,
} = require("@passkit/node-sdk/io/member/program_pb");
const { Tier } = require("@passkit/node-sdk/io/member/tier_pb");
const Common = require("@passkit/node-sdk/io/common/common_objects_pb");
const {
  ImageData,
  ImageIds,
  CreateImageInput,
} = require("@passkit/node-sdk/io/image/image_pb");
const imageToBase64 = require("image-to-base64");
const { Person } = require("@passkit/node-sdk/io/common/personal_pb");

const PassKitGRPC = require("./client");
const helper = require("./helpers");

class QuickStartLoyalty {
  constructor() {
    this.pkClient = new PassKitGRPC().getInstance();
    this.heroImageId = "";
    this.stripImageId = "";
    this.iconId = "";
    this.logoId = "";
    this.profileId = "";
    this.bronzeTemplate = new PassTemplate();
    this.silverTemplate = new PassTemplate();
    this.bronzeTemplateId = "";
    this.silverTemplateId = "";
    this.bronzeTierId = "";
    this.silverTierId = "";
    this.programId = "";
    this.bronzeMemberId = "";
    this.silverMemberId = "";
    this.checkInEvent = new MemberEvent();
    this.checkOutEvent = new MemberEvent();
    this.imageIds = new ImageIds();
    this.shortCode = "";
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
      await this.getDefaultTemplate();
      this.prepTemplates();
      await this.createBronzeTemplate();
      await this.createSilverTemplate();
      await this.createProgram();
      await this.getShortCode();
      await this.createBronzeTier();
      await this.createSilverTier();
      await this.createBronzeMember();
      await this.createSilverMember();
      await this.checkInMember();
      await this.checkOutMember();
      await this.earnPoints();
      return "done";
    } catch (error) {
      console.log("Error: ", error);
      return "done";
    }
  }

  async cleanUp() {
    try {
      await this.deleteProgram();
      await this.deleteTemplate(this.bronzeTemplateId);
      await this.deleteTemplate(this.silverTemplateId);
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
      this.pkClient.getImagesClient().createImages(request, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(callback(response));
      });
    });
  }

  getDefaultTemplate() {
    console.log("Getting default template");
    const request = new DefaultTemplateRequest();
    request.setProtocol(PassProtocol.MEMBERSHIP);
    request.setRevision(1);
    const callback = helper.templateResponse.bind(this);

    return new Promise((resolve, reject) => {
      this.pkClient
        .getTemplateClient()
        .getDefaultTemplate(request, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  prepTemplates() {
    console.log("Prepping templates");
    this.bronzeTemplate
      .setName("Quickstart Bronze Tier")
      .setDescription("Quickstart Bronze Tier Pass")
      .setTimezone("Europe/London")
      .setImageids(this.imageIds)
      .clearImages();

    this.bronzeTemplate
      .setName("Quickstart Silver Tier")
      .setDescription("Quickstart Silver Tier Pass")
      .setTimezone("Europe/London")
      .setImageids(this.imageIds)
      .clearImages();
  }

  createBronzeTemplate() {
    console.log("Creating bronze template");
    const callback = helper.bronzeTemplateResponse.bind(this);

    return new Promise((resolve, reject) => {
      this.pkClient
        .getTemplateClient()
        .createTemplate(this.bronzeTemplate, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  createSilverTemplate() {
    console.log("Creating silver template");
    const callback = helper.silverTemplateResponse.bind(this);

    return new Promise((resolve, reject) => {
      this.pkClient
        .getTemplateClient()
        .createTemplate(this.silverTemplate, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  createProgram() {
    console.log("Creating program");
    const callback = helper.programResponse.bind(this);
    const program = new Program();
    program
      .setName("Quickstart Loyalty Program")
      .addStatus(ProjectStatus.PROJECT_DRAFT)
      .addStatus(ProjectStatus.PROJECT_ACTIVE_FOR_OBJECT_CREATION)
      .setPointstype(
        new PointsType().setBalancetype(BalanceType.BALANCE_TYPE_INT)
      );

    return new Promise((resolve, reject) => {
      this.pkClient
        .getMembershipClient()
        .createProgram(program, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  getShortCode() {
    console.log("Getting Short Code");
    const Id = new Common.Id();
    Id.setId(this.programId);
    const callback = helper.projectResponse.bind(this);

    return new Promise((resolve, reject) => {
      this.pkClient.getUsersClient().getProjectByUuid(Id, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(callback(response));
      });
    });
  }

  createBronzeTier() {
    console.log("Creating bronze tier");
    const callback = helper.bronzeTierResponse.bind(this);
    const tier = new Tier();
    tier
      .setId("bronze")
      .setName("Bronze")
      .setTierindex(1)
      .setPasstemplateid(this.bronzeTemplateId)
      .setProgramid(this.programId)
      .setTimezone("Europe/London");

    return new Promise((resolve, reject) => {
      this.pkClient.getMembershipClient().createTier(tier, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(callback(response));
      });
    });
  }

  createSilverTier() {
    console.log("Creating silver template");
    const callback = helper.silverTierResponse.bind(this);
    const tier = new Tier();
    tier
      .setId("silver")
      .setName("Silver")
      .setTierindex(2)
      .setPasstemplateid(this.silverTemplateId)
      .setProgramid(this.programId)
      .setTimezone("Europe/London");

    return new Promise((resolve, reject) => {
      this.pkClient.getMembershipClient().createTier(tier, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(callback(response));
      });
    });
  }

  createBronzeMember() {
    console.log("Creating bronze member");
    const callback = helper.createBronzeMemberResponse.bind(this);
    const member = new Member();
    member
      .setTierid(this.bronzeTierId)
      .setProgramid(this.programId)
      .setPerson(
        new Person()
          .setDisplayname("Bronze Billy")
          .setEmailaddress("bronze.billy@dummy.passkit.com")
      )
      .setPoints(100);

    return new Promise((resolve, reject) => {
      this.pkClient
        .getMembershipClient()
        .enrolMember(member, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  createSilverMember() {
    console.log("Creating silver member");
    const callback = helper.createSilverMemberResponse.bind(this);
    const member = new Member();
    member
      .setTierid(this.bronzeTierId)
      .setProgramid(this.programId)
      .setPerson(
        new Person()
          .setDisplayname("Silver Steve")
          .setEmailaddress("silver.steve@dummy.passkit.com")
      );

    return new Promise((resolve, reject) => {
      this.pkClient
        .getMembershipClient()
        .enrolMember(member, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  checkInMember() {
    console.log("Checking member in");
    const callback = helper.checkInResponse.bind(this);
    const event = new MemberCheckInOutRequest()
      .setMemberid(this.bronzeMemberId)
      .setLat(51.5014)
      .setLon(0.1419)
      .setAddress("Buckingham Palace, Westminster, London SW1A 1AA")
      .setExternaleventid("7253300199294");

    event.metadataMap = new Map([
      ["ticketType", "royalDayOut"],
      ["bookingReference", "4929910033527"],
    ]);

    return new Promise((resolve, reject) => {
      this.pkClient
        .getMembershipClient()
        .checkInMember(event, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  checkOutMember() {
    console.log("Checking member out");
    const callback = helper.checkOutResponse.bind(this);
    const event = new MemberCheckInOutRequest()
      .setMemberid(this.bronzeMemberId)
      .setLat(51.5014)
      .setLon(0.1419)
      .setExternaleventid("7253300199492")
      .setAddress("Buckingham Palace, Westminster, London SW1A 1AA");

    event.metadataMap = new Map([
      ["ticketType", "royalDayOut"],
      ["bookingReference", "4929910033527"],
      ["corgisSeen", "6"],
      ["visitorSatisfactionRating", "9"],
    ]);

    return new Promise((resolve, reject) => {
      this.pkClient
        .getMembershipClient()
        .checkOutMember(event, (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(callback(response));
        });
    });
  }

  earnPoints() {
    console.log("Add points to member");
    const event = new EarnBurnPointsRequest()
      .setId(this.bronzeMemberId)
      .setPoints(10);

    return new Promise((resolve, reject) => {
      this.pkClient.getMembershipClient().earnPoints(event, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  deleteProgram() {
    console.log("Delete Program");
    const Id = new Common.Id();
    Id.setId(this.programId);

    return new Promise((resolve, reject) => {
      this.pkClient.getMembershipClient().deleteProgram(Id, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  deleteTemplate(id) {
    console.log("Delete Template");
    const Id = new Common.Id();
    Id.setId(id);

    return new Promise((resolve, reject) => {
      this.pkClient.getTemplateClient().deleteTemplate(Id, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  deleteImage(id) {
    console.log("Delete Image: ", id);
    const Id = new Common.Id();
    Id.setId(id);

    return new Promise((resolve, reject) => {
      this.pkClient.getImagesClient().deleteImage(Id, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

module.exports = QuickStartLoyalty;
