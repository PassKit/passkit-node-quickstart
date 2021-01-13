const {
  TemplatesClient,
} = require("passkit-node-sdk/io/core/a_rpc_templates_grpc_pb");
const {
  ImagesClient,
} = require("passkit-node-sdk/io/core/a_rpc_images_grpc_pb");
const { MembersClient } = require("passkit-node-sdk/io/member/a_rpc_grpc_pb");
const fs = require("fs");
const grpc = require("grpc");
const {
  UsersClient,
} = require("passkit-node-sdk/io/core/a_rpc_others_grpc_pb");

const ROOT_CERT = "./src/certs/ca-chain.pem";
const PRIVATE_KEY = "./src/certs/key.pem";
const CERTIFICATE = "./src/certs/certificate.pem";
const ADDRESS = "grpc.pub1.passkit.io";
const PORT = 443;

class PassKitClient {
  constructor() {
    const channelCredential = grpc.credentials.createSsl(
      fs.readFileSync(ROOT_CERT),
      fs.readFileSync(PRIVATE_KEY),
      fs.readFileSync(CERTIFICATE)
    );

    this.userClient = new UsersClient(`${ADDRESS}:${PORT}`, channelCredential);

    this.templateClient = new TemplatesClient(
      `${ADDRESS}:${PORT}`,
      channelCredential
    );

    this.membersClient = new MembersClient(
      `${ADDRESS}:${PORT}`,
      channelCredential
    );

    this.imageClient = new ImagesClient(
      `${ADDRESS}:${PORT}`,
      channelCredential
    );
  }

  getTemplateClient() {
    return this.templateClient;
  }

  getMembershipClient() {
    return this.membersClient;
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
