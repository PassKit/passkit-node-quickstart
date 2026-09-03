const PassKitClient = require("./client");

const services = [
  "userClient",
  "templateClient",
  "membersClient",
  "imageClient",
  "couponsClient",
  "ticketsClient",
  "flightsClient",
  "analyticsClient",
  "rawClient",
  "certificatesClient",
  "distributionClient",
  "integrationsClient",
];

class GrpcConnectionPool {
  constructor(config) {
    this.connections = Array.from(
      { length: config.poolSize },
      () => new PassKitClient(config),
    );
    this.currentIndex = 0;
    this.client = Object.fromEntries(
      services.map((service) => [service, this.createServiceProxy(service)]),
    );
  }

  next() {
    const connection = this.connections[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.connections.length;
    return connection;
  }

  createServiceProxy(service) {
    return new Proxy(
      {},
      {
        get:
          (_target, method) =>
          (...args) => {
            const serviceClient = this.next()[service];
            return serviceClient[method](...args);
          },
      },
    );
  }

  getConnection() {
    return this.client;
  }

  close() {
    this.connections.forEach((connection) => connection.close());
    this.connections = [];
  }
}

module.exports = GrpcConnectionPool;
