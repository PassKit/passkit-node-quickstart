const {
  TemplatesClient,
} = require("passkit-node-sdk/io/core/a_rpc_templates_grpc_pb");
const {
  ImagesClient,
} = require("passkit-node-sdk/io/core/a_rpc_images_grpc_pb");
const {
  UsersClient,
} = require("passkit-node-sdk/io/core/a_rpc_others_grpc_pb");
const { MembersClient } = require("passkit-node-sdk/io/member/a_rpc_grpc_pb");
const {
  SingleUseCouponsClient,
} = require("passkit-node-sdk/io/single_use_coupons/a_rpc_grpc_pb");
const {
  EventTicketsClient,
} = require("passkit-node-sdk/io/event_tickets/a_rpc_grpc_pb");
const { FlightsClient } = require("passkit-node-sdk/io/flights/a_rpc_grpc_pb");
const {
  AnalyticsClient,
} = require("passkit-node-sdk/io/analytics/a_rpc_grpc_pb");
const { RawClient } = require("passkit-node-sdk/io/raw/a_rpc_grpc_pb");
const {
  CertificatesClient,
} = require("passkit-node-sdk/io/core/a_rpc_certificates_grpc_pb");
const {
  DistributionClient,
} = require("passkit-node-sdk/io/core/a_rpc_distribution_grpc_pb");
const {
  IntegrationsClient,
} = require("passkit-node-sdk/io/core/a_rpc_others_grpc_pb");
const createCredentials = require("./create-credentials");

class PassKitClient {
  constructor(config) {
    const credentials = createCredentials(config);
    const endpoint = `${config.address}:${config.port}`;
    this.userClient = new UsersClient(endpoint, credentials);
    this.templateClient = new TemplatesClient(endpoint, credentials);
    this.membersClient = new MembersClient(endpoint, credentials);
    this.imageClient = new ImagesClient(endpoint, credentials);
    this.couponsClient = new SingleUseCouponsClient(endpoint, credentials);
    this.ticketsClient = new EventTicketsClient(endpoint, credentials);
    this.flightsClient = new FlightsClient(endpoint, credentials);
    this.analyticsClient = new AnalyticsClient(endpoint, credentials);
    this.rawClient = new RawClient(endpoint, credentials);
    this.certificatesClient = new CertificatesClient(endpoint, credentials);
    this.distributionClient = new DistributionClient(endpoint, credentials);
    this.integrationsClient = new IntegrationsClient(endpoint, credentials);
  }

  close() {
    Object.values(this).forEach((client) => client.close?.());
  }
}

module.exports = PassKitClient;
