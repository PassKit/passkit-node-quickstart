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
