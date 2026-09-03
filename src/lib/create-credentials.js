const crypto = require("crypto");
const fs = require("fs");
const grpc = require("@grpc/grpc-js");

function createCredentials(config) {
  const privateKey = crypto.createPrivateKey({
    cipher: "aes-256-cbc",
    format: "pem",
    key: fs.readFileSync(config.privateKey),
    passphrase: config.passphrase,
    type: "pkcs8",
  });

  return grpc.credentials.createSsl(
    fs.readFileSync(config.rootCert),
    Buffer.from(privateKey.export({ format: "pem", type: "pkcs8" }).toString()),
    fs.readFileSync(config.certificate),
  );
}

module.exports = createCredentials;
