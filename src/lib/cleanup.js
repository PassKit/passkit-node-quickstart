async function runCleanup(steps) {
  const failures = [];
  for (const [label, value, remove] of steps) {
    if (!value) continue;
    try {
      await remove(value);
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }
  if (failures.length) {
    throw new Error(
      `Cleanup could not remove every resource:\n- ${failures.join("\n- ")}`,
    );
  }
}

module.exports = runCleanup;
