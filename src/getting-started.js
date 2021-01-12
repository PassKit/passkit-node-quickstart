const QuickStartLoyalty = require("./lib/quick-start-loyalty");

async function main() {
  const quickStart = new QuickStartLoyalty();
  await quickStart.runQuickStart();
  await quickStart.cleanUp();
}

main();
