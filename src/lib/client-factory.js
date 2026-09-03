const PassKitClient = require("./client");
const GrpcConnectionPool = require("./poolingClient");

function createClient(config) {
  if (config.connectionMode === "single") {
    const client = new PassKitClient(config);
    return { client, close: () => client.close() };
  }
  const pool = new GrpcConnectionPool(config);
  return { client: pool.getConnection(), close: () => pool.close() };
}

module.exports = createClient;
