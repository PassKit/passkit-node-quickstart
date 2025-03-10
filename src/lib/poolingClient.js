const grpc = require("@grpc/grpc-js");
const fs = require("fs");
const crypto = require("crypto");
const config = require("../config/config");

const {
    TemplatesClient,
} = require("passkit-node-sdk/io/core/a_rpc_templates_grpc_pb");
const { MembersClient } = require("passkit-node-sdk/io/member/a_rpc_grpc_pb");
const { SingleUseCouponsClient } = require("passkit-node-sdk/io/single_use_coupons/a_rpc_grpc_pb");
const { EventTicketsClient } = require("passkit-node-sdk/io/event_tickets/a_rpc_grpc_pb");
const { UsersClient } = require("passkit-node-sdk/io/core/a_rpc_others_grpc_pb");
const {
    ImagesClient
} = require("passkit-node-sdk/io/core/a_rpc_images_grpc_pb");

class GrpcConnectionPool {
    constructor(poolSize = 5) {
        if (!GrpcConnectionPool.instance) {
            this.poolSize = poolSize;
            this.connections = [];
            this.currentIndex = 0;
            this._initializeConnections();
            GrpcConnectionPool.instance = this;
        }
        return GrpcConnectionPool.instance;
    }

    _initializeConnections() {
        const privateKeyEncBytes = fs.readFileSync(config.PRIVATE_KEY);
        const privateKey = crypto.createPrivateKey({
            cipher: "aes-256-cbc",
            format: "pem",
            key: privateKeyEncBytes,
            passphrase: config.PASSPHRASE,
            type: "pkcs8",
        });

        const channelCredential = grpc.credentials.createSsl(
            fs.readFileSync(config.ROOT_CERT),
            Buffer.from(privateKey.export({ format: "pem", type: "pkcs8" }).toString()),
            fs.readFileSync(config.CERTIFICATE)
        );

        const grpcAddress = `${config.ADDRESS}:${config.PORT}`;

        for (let i = 0; i < this.poolSize; i++) {
            this.connections.push({
                userClient: new UsersClient(grpcAddress, grpc.credentials.combineChannelCredentials(channelCredential)),
                templateClient: new TemplatesClient(grpcAddress, grpc.credentials.combineChannelCredentials(channelCredential)),
                membersClient: new MembersClient(grpcAddress, grpc.credentials.combineChannelCredentials(channelCredential)),
                imageClient: new ImagesClient(grpcAddress, grpc.credentials.combineChannelCredentials(channelCredential)),
                couponsClient: new SingleUseCouponsClient(grpcAddress, grpc.credentials.combineChannelCredentials(channelCredential)),
                ticketsClient: new EventTicketsClient(grpcAddress, grpc.credentials.combineChannelCredentials(channelCredential)),
            });
        }
    }

    getConnection() {
        const connection = this.connections[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.poolSize;
        return connection;
    }

    shutdown() {
        this.connections = [];
    }
}

module.exports = new GrpcConnectionPool();