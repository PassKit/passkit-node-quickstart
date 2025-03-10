const {
  TemplatesClient
} = require("passkit-node-sdk/io/core/a_rpc_templates_grpc_pb");
const {
  ImagesClient
} = require("passkit-node-sdk/io/core/a_rpc_images_grpc_pb");
const { MembersClient } = require("passkit-node-sdk/io/member/a_rpc_grpc_pb");
const { SingleUseCouponsClient } = require("passkit-node-sdk/io/single_use_coupons/a_rpc_grpc_pb");
const { EventTicketsClient } = require("passkit-node-sdk/io/event_tickets/a_rpc_grpc_pb");
const fs = require("fs");
const {
  UsersClient,
} = require("passkit-node-sdk/io/core/a_rpc_others_grpc_pb");
const crypto = require("crypto");
const config = require("../config/config");
const grpc = require("@grpc/grpc-js");

class PassKitClient {
  constructor() {
    const privateKeyEncBytes = fs.readFileSync(config.PRIVATE_KEY);
    const privateKey = crypto.createPrivateKey({
      cypher: "aes-256-cbc",
      format: "pem",
      key: privateKeyEncBytes,
      passphrase: config.PASSPHRASE,
      type: "pkcs8",
    });

    const channelCredential = grpc.credentials.createSsl(
      fs.readFileSync(config.ROOT_CERT),
      Buffer.from(
        privateKey.export({ format: "pem", type: "pkcs8" }).toString()
      ),
      fs.readFileSync(config.CERTIFICATE)
    );

    const grpcAddress = `${config.ADDRESS}:${config.PORT}`;
    this.userClient = new UsersClient(grpcAddress, channelCredential);
    this.templateClient = new TemplatesClient(grpcAddress, channelCredential);
    this.membersClient = new MembersClient(grpcAddress, channelCredential);
    this.imageClient = new ImagesClient(grpcAddress, channelCredential);
    this.couponsClient = new SingleUseCouponsClient(grpcAddress, channelCredential);
    this.ticketsClient = new EventTicketsClient(grpcAddress, channelCredential);
  }

  getTemplateClient() {
    return this.templateClient;
  }

  getMembershipClient() {
    return this.membersClient;
  }

  getCouponsClient() {
    return this.couponsClient;
  }

  getEventTicketsClient() {
    return this.ticketsClient;
  }

  getImagesClient() {
    return this.imageClient;
  }

  getUsersClient() {
    return this.userClient;
  }
}

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new PassKitClient();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}

module.exports = Singleton;