require("dotenv").config({ quiet: true });

const QuickStartLoyalty = require("./lib/quick-start-loyalty");
const QuickStartCoupons = require("./lib/quick-start-coupons");
const QuickStartEventTickets = require("./lib/quick-start-event-tickets");
const QuickStartFlights = require("./lib/quick-start-flights");
const createClient = require("./lib/client-factory");
const { loadConfig, validateConfig } = require("./config/config");

const examples = {
  loyalty: QuickStartLoyalty,
  coupons: QuickStartCoupons,
  tickets: QuickStartEventTickets,
  flights: QuickStartFlights,
};

function printResults(name, example, address) {
  const region = address.includes("pub2") ? "pub2" : "pub1";
  const passUrl = (id) => id && `https://${region}.pskt.io/${id}`;
  const results = {
    loyalty: {
      enrollmentUrl:
        example.shortCode && `https://${region}.pskt.io/c/${example.shortCode}`,
      bronzePassUrl: passUrl(example.bronzeMemberId),
      silverPassUrl: passUrl(example.silverMemberId),
    },
    coupons: {
      baseCouponUrl: passUrl(example.baseCouponId),
      vipCouponUrl: passUrl(example.vipCouponId),
    },
    tickets: { eventTicketUrl: passUrl(example.ticketId) },
    flights: Object.fromEntries(
      (example.boardingPasses || []).map((pass, index) => [
        `boardingPass${index + 1}Url`,
        pass.url || passUrl(pass.id),
      ]),
    ),
  };
  console.log("\nCreated resources:");
  Object.entries(results[name]).forEach(([label, value]) => {
    if (value) console.log(`  ${label}: ${value}`);
  });
}

async function run(name = process.argv[2] || "loyalty") {
  const Example = examples[name];
  if (!Example) {
    throw new Error(
      `Unknown example "${name}". Choose: ${Object.keys(examples).join(", ")}`,
    );
  }

  const config = validateConfig(loadConfig(), {
    requireAppleCertificate: name === "flights",
  });
  const connection = createClient(config);
  const example = new Example(connection.client, config);

  try {
    await example.runQuickStart();
    printResults(name, example, config.address);
  } finally {
    try {
      if (config.keepAssets) {
        console.log(
          "PASSKIT_KEEP_ASSETS=true; generated resources were not deleted.",
        );
      } else {
        console.log("Cleaning up generated resources...");
        await example.cleanUp();
      }
    } finally {
      connection.close();
    }
  }
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { examples, printResults, run };
