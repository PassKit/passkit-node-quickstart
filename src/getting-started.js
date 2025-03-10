const QuickStartLoyalty = require("./lib/quick-start-loyalty");
const QuickStartCoupons = require("./lib/quick-start-coupons");
const QuickstartEventTickets = require("./lib/quick-start-event-tickets");

async function main() {
  const quickStart = new QuickStartLoyalty();
  await quickStart.runQuickStart();
  await quickStart.cleanUp();

  const couponsQuickStart = new QuickStartCoupons();
  await couponsQuickStart.runQuickStart();
  await couponsQuickStart.cleanUp();

  const ticketsQuickStart = new QuickstartEventTickets();
  await ticketsQuickStart.runQuickStart();
  await ticketsQuickStart.cleanUp();
}

main();
