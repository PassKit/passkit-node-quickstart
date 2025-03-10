exports.createSilverResponse = function (template) {
  this.silverTemplate = template;
};

exports.createBronzeResponse = function (template) {
  this.bronzeTemplate = template;
};

exports.createBaseResponse = function (template) {
  this.baseTemplate = template;
};

exports.createEventTemplateResponse = function (template) {
  this.eventTemplate = template;
};

exports.createVipResponse = function (template) {
  this.vipTemplate = template;
};

exports.bronzeTemplateResponse = function (id) {
  this.bronzeTemplateId = id.getId();
};

exports.silverTemplateResponse = function (id) {
  this.silverTemplateId = id.getId();
};

exports.baseTemplateResponse = function (id) {
  this.baseTemplateId = id.getId();
};

exports.vipTemplateResponse = function (id) {
  this.vipTemplateId = id.getId();
};

exports.eventTemplateResponse = function (id) {
  this.eventTemplateId = id.getId();
};

exports.programResponse = function (id) {
  this.programId = id.getId();
};

exports.campaignResponse = function (id) {
  this.campaignId = id.getId();
};

exports.productionResponse = function (id) {
  this.productionId = id.getId();
};

exports.projectResponse = function (project) {
  this.shortCode = project.getShortcode();
};

exports.bronzeTierResponse = function (id) {
  this.bronzeTierId = id.getId();
};

exports.silverTierResponse = function (id) {
  this.silverTierId = id.getId();
};

exports.baseOfferResponse = function (id) {
  this.baseOfferId = id.getId();
};

exports.vipOfferResponse = function (id) {
  this.vipOfferId = id.getId();
};

exports.createVenueResponse = function (id) {
  this.venueId = id.getId();
};

exports.createEventResponse = function (id) {
  this.eventId = id.getId();
};

exports.ticketTypeResponse = function (id) {
  this.ticketTypeId = id.getId();
};

exports.createBronzeMemberResponse = function (id) {
  this.bronzeMemberId = id.getId();
};

exports.createSilverMemberResponse = function (id) {
  this.silverMemberId = id.getId();
};
exports.createBaseCouponResponse = function (id) {
  this.baseCouponId = id.getId();
};

exports.createVipCouponResponse = function (id) {
  this.vipCouponId = id.getId();
};

exports.issueTicketResponse = function (id) {
  this.ticketId = id.getId();
};

exports.checkInResponse = function (id) {
  this.checkInEvent = id.getId();
};

exports.checkOutResponse = function (id) {
  this.checkOutEvent = id.getId();
};

exports.createImagesResponse = function (imageIds) {
  this.imageIds = imageIds;
};

exports.listEventsResponse = function (eventsResponse) {
  this.eventsResponse = eventsResponse;
}

exports.transformEventsResponse = function (data) {
  const result = {
    id: data.array,
    member: data.member,
    eventType: data.eventtype,
    address: data.address,
    lat: data.lat,
    lon: data.lon,
    alt: data.alt,
    externalId: data.externalid,
    externalUserId: data.externaluserid,
    externalDeviceId: data.externaldeviceid,
    externalServiceId: data.externalserviceid,
    metaData: data.metadataMap,
    notes: data.notes,
    date: data.date,
    retainedUntilDate: data.retaineduntildate,
    created: data.created
  };

  const error = {
    code: 0,
    message: "string",
    details: [
      {
        "@type": "string",
        property1: null,
        property2: null
      }
    ]
  };

  return { result, error };
}
