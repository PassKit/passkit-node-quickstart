const { printResults } = require("../getting-started");

describe("example output", () => {
  it("uses the account region in generated URLs", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    printResults("tickets", { ticketId: "ticket-id" }, "grpc.pub2.passkit.io");
    expect(log).toHaveBeenCalledWith(
      "  eventTicketUrl: https://pub2.pskt.io/ticket-id",
    );
    log.mockRestore();
  });
});
