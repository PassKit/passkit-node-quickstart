const rpc = require("./rpc");

const METHODS = {
  loyalty: {
    client: "membersClient",
    stream: [
      "listPrograms",
      "listTiers",
      "listMembers",
      "listMemberEvents",
      "getMessageHistoryForMember",
      "getMetaKeysForProgram",
      "getMemberEventMetaKeysForProgram",
    ],
    unary: [
      "createProgram",
      "getProgram",
      "updateProgram",
      "deleteProgram",
      "createTier",
      "getTier",
      "updateTier",
      "deleteTier",
      "enrolMember",
      "getMemberRecordById",
      "getMemberRecordByExternalId",
      "updateMember",
      "patchPerson",
      "deleteMember",
      "countMembers",
      "changeMemberTier",
      "earnPoints",
      "burnPoints",
      "setPoints",
      "updateMemberExpiry",
      "renewMembersExpiry",
      "countMemberEvents",
      "checkInMember",
      "checkOutMember",
      "deleteMemberEvent",
      "deleteEventsForMember",
      "getProgramEnrolment",
    ],
  },
  coupons: {
    client: "couponsClient",
    stream: [
      "listCouponCampaigns",
      "listCouponOffers",
      "listCouponsByCouponCampaign",
      "streamCouponUpdates",
      "streamCouponRedemptions",
      "getMetaKeysForCampaign",
    ],
    unary: [
      "createCouponCampaign",
      "getCouponCampaign",
      "updateCouponCampaign",
      "deleteCouponCampaign",
      "createCouponOffer",
      "getCouponOffer",
      "updateCouponOffer",
      "deleteCouponOffer",
      "createCoupon",
      "getCouponById",
      "getCouponByExternalId",
      "updateCoupon",
      "updateCouponExternalId",
      "patchPerson",
      "redeemCoupon",
      "voidCoupon",
      "countCouponsByCouponCampaign",
      "getAnalytics",
    ],
  },
  eventTickets: {
    client: "ticketsClient",
    stream: [
      "listProductions",
      "listVenues",
      "listEvents",
      "listTicketTypes",
      "listTickets",
    ],
    unary: [
      "createProduction",
      "getProduction",
      "updateProduction",
      "patchProduction",
      "deleteProduction",
      "createVenue",
      "getVenueById",
      "updateVenue",
      "patchVenue",
      "deleteVenue",
      "createEvent",
      "getEventById",
      "getEventByStartDateAndVenue",
      "updateEvent",
      "patchEvent",
      "deleteEvent",
      "createTicketType",
      "getTicketTypeById",
      "getTicketTypeByUserDefinedId",
      "updateTicketType",
      "patchTicketType",
      "deleteTicketType",
      "issueTicket",
      "issueTicketById",
      "getTicketById",
      "getTicketByTicketNumber",
      "getTicketsByOrderNumber",
      "getEventTicketPass",
      "updateTicket",
      "patchPerson",
      "validateTicket",
      "redeemTicket",
      "redeemTicketsByOrderNumber",
      "deleteTicket",
      "deleteTicketsByOrderNumber",
      "countTickets",
      "getAnalytics",
    ],
  },
  flights: {
    client: "flightsClient",
    stream: [],
    unary: [
      "createCarrier",
      "getCarrier",
      "updateCarrier",
      "deleteCarrier",
      "createPort",
      "getPort",
      "updatePort",
      "deletePort",
      "createFlightDesignator",
      "getFlightDesignator",
      "updateFlightDesignator",
      "deleteFlightDesignator",
      "createFlight",
      "getFlight",
      "updateFlight",
      "deleteFlight",
      "createBoardingPass",
      "getBoardingPass",
      "getBoardingPassRecord",
      "updateBoardingPass",
      "deleteBoardingPass",
    ],
  },
  templates: {
    client: "templateClient",
    stream: ["listTemplates", "listLocations", "listBeacons", "listLinks"],
    unary: [
      "createTemplate",
      "getTemplate",
      "getDefaultTemplate",
      "updateTemplate",
      "copyTemplate",
      "deleteTemplate",
      "countTemplates",
      "createLocation",
      "getLocation",
      "updateLocation",
      "copyLocation",
      "deleteLocation",
      "countLocations",
      "createBeacon",
      "getBeacon",
      "updateBeacon",
      "copyBeacon",
      "deleteBeacon",
      "countBeacons",
      "createLink",
      "getLink",
      "updateLink",
      "copyLink",
      "deleteLink",
      "countLinks",
    ],
  },
  images: {
    client: "imageClient",
    stream: ["listImages"],
    unary: [
      "createImages",
      "getImageBundle",
      "getImageData",
      "getImageURL",
      "getLocalizedImageURL",
      "updateImage",
      "deleteImage",
      "deleteLocalizedImage",
      "countImages",
      "getProfileImage",
      "getProfileImageById",
      "setProfileImage",
      "getStampImageConfig",
      "updateStampImageConfig",
      "getStampImagePreview",
      "getStampImageURL",
    ],
  },
  analytics: { client: "analyticsClient", stream: [], unary: ["getAnalytics"] },
  distribution: {
    client: "distributionClient",
    stream: [],
    unary: [
      "getSmartPassLink",
      "getDataCollectionPageFields",
      "validateBarcode",
      "sendWelcomeEmail",
      "addMessage",
      "getMessage",
      "getMessages",
      "updateMessage",
      "cancelMessage",
    ],
  },
  integrations: {
    client: "integrationsClient",
    stream: ["listSinkSubscriptions"],
    unary: [
      "createSinkSubscription",
      "getSinkSubscription",
      "updateSinkSubscription",
      "deleteSinkSubscription",
      "getSampleSubscriptionEvent",
    ],
  },
  scanners: {
    client: "userClient",
    stream: [],
    unary: ["getScannerConfig", "createScannerConfig", "updateScannerConfig"],
  },
  certificates: {
    client: "certificatesClient",
    stream: ["listAppleCertificates"],
    unary: ["getAppleCertificateData", "countAppleCertificates"],
  },
  raw: {
    client: "rawClient",
    stream: [
      "streamPassUpdates",
      "listPassesByPassProject",
      "listPassesByPassTemplate",
    ],
    unary: [
      "createPassProject",
      "getPassProject",
      "updatePassProject",
      "copyPassProject",
      "deletePassProject",
      "createPass",
      "getPassById",
      "getPassByExternalId",
      "updatePass",
      "deletePass",
    ],
  },
};

const ADVANCED = {
  loyalty: [
    "batchUpdate",
    "bulkDeleteMembers",
    "updateMembersBySegment",
    "deleteMembersBySegment",
    "copyProgram",
  ],
  coupons: ["bulkVoidCoupons", "copyCouponCampaign"],
  eventTickets: ["bulkDeleteTickets", "copyProduction"],
};

function makeGroup(client, definition) {
  const group = {};
  for (const method of definition.unary) {
    group[method] = (request) => rpc.unary(client, method, request);
  }
  for (const method of definition.stream) {
    group[method] = (request) => rpc.iterate(client, method, request);
    group[`${method}ToArray`] = (request) =>
      rpc.collect(client, method, request);
  }
  return group;
}

function createPassKitApi(client, { allowDestructive = false } = {}) {
  const api = {};
  for (const [domain, definition] of Object.entries(METHODS)) {
    api[domain] = makeGroup(client[definition.client], definition);
  }

  api.advanced = {};
  for (const [domain, methods] of Object.entries(ADVANCED)) {
    const service = client[METHODS[domain].client];
    api.advanced[domain] = Object.fromEntries(
      methods.map((method) => [
        method,
        (request) => {
          if (!allowDestructive) {
            throw new Error(
              `${method} is an advanced bulk operation. Pass { allowDestructive: true } to createPassKitApi to enable it.`,
            );
          }
          return rpc.unary(service, method, request);
        },
      ]),
    );
  }
  return api;
}

module.exports = { ADVANCED, METHODS, createPassKitApi };
