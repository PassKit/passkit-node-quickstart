exports.createSilverResponse = function (template) {
  this.silverTemplate = template;
};

exports.createBronzeResponse = function (template) {
  this.bronzeTemplate = template;
};

exports.bronzeTemplateResponse = function (id) {
  this.bronzeTemplateId = id.getId();
};

exports.silverTemplateResponse = function (id) {
  this.silverTemplateId = id.getId();
};

exports.programResponse = function (id) {
  this.programId = id.getId();
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

exports.createBronzeMemberResponse = function (id) {
  this.bronzeMemberId = id.getId();
};

exports.createSilverMemberResponse = function (id) {
  this.silverMemberId = id.getId();
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
