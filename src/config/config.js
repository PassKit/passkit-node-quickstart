const fs = require("fs");
const path = require("path");

const fromRoot = (value) => path.resolve(process.cwd(), value);

function loadConfig(env = process.env) {
  return {
    rootCert: fromRoot(env.PASSKIT_ROOT_CERT || "./src/certs/ca-chain.pem"),
    privateKey: fromRoot(env.PASSKIT_PRIVATE_KEY || "./src/certs/key.pem"),
    certificate: fromRoot(
      env.PASSKIT_CERTIFICATE || "./src/certs/certificate.pem",
    ),
    address: env.PASSKIT_ADDRESS || "grpc.pub1.passkit.io",
    port: Number(env.PASSKIT_PORT || 443),
    passphrase: env.PASSKIT_PASSPHRASE,
    connectionMode: env.PASSKIT_CONNECTION_MODE || "pool",
    poolSize: Number(env.PASSKIT_POOL_SIZE || 5),
    keepAssets: env.PASSKIT_KEEP_ASSETS === "true",
    recipientEmail: env.PASSKIT_RECIPIENT_EMAIL,
    appleCertificate: env.PASSKIT_APPLE_CERTIFICATE,
  };
}

function validateConfig(
  config,
  { checkFiles = true, requireAppleCertificate = false } = {},
) {
  const errors = [];
  if (!config.passphrase) errors.push("PASSKIT_PASSPHRASE is required");
  if (!config.address) errors.push("PASSKIT_ADDRESS is required");
  if (
    !Number.isInteger(config.port) ||
    config.port < 1 ||
    config.port > 65535
  ) {
    errors.push("PASSKIT_PORT must be an integer from 1 to 65535");
  }
  if (!["single", "pool"].includes(config.connectionMode)) {
    errors.push('PASSKIT_CONNECTION_MODE must be "single" or "pool"');
  }
  if (!Number.isInteger(config.poolSize) || config.poolSize < 1) {
    errors.push("PASSKIT_POOL_SIZE must be a positive integer");
  }
  if (
    config.recipientEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.recipientEmail)
  ) {
    errors.push("PASSKIT_RECIPIENT_EMAIL must be a valid email address");
  }
  if (requireAppleCertificate && !config.appleCertificate) {
    errors.push(
      "PASSKIT_APPLE_CERTIFICATE is required for flights (for example, pass.com.your-airline)",
    );
  }
  if (checkFiles) {
    [config.rootCert, config.privateKey, config.certificate].forEach((file) => {
      if (!fs.existsSync(file))
        errors.push(`Credential file not found: ${file}`);
    });
  }
  if (errors.length) {
    throw new Error(`Invalid PassKit configuration:\n- ${errors.join("\n- ")}`);
  }
  return config;
}

module.exports = { loadConfig, validateConfig };
