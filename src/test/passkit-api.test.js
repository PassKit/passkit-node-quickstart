const { EventEmitter } = require("node:events");
const { ADVANCED, METHODS, createPassKitApi } = require("../lib/passkit-api");

function makeClient() {
  const client = {};
  for (const definition of Object.values(METHODS)) {
    client[definition.client] ||= {};
    for (const method of definition.unary) {
      client[definition.client][method] = jest.fn((request, callback) =>
        callback(null, { method, request }),
      );
    }
    for (const method of definition.stream) {
      client[definition.client][method] = jest.fn((request) => {
        const stream = new EventEmitter();
        process.nextTick(() => {
          stream.emit("data", { method, request });
          stream.emit("end");
        });
        return stream;
      });
    }
  }
  for (const [domain, methods] of Object.entries(ADVANCED)) {
    for (const method of methods) {
      client[METHODS[domain].client][method] = jest.fn((request, callback) =>
        callback(null, { method, request }),
      );
    }
  }
  return client;
}

test("exposes every configured unary method as a Promise", async () => {
  const client = makeClient();
  const api = createPassKitApi(client);

  for (const [domain, definition] of Object.entries(METHODS)) {
    for (const method of definition.unary) {
      await expect(api[domain][method]({ id: 1 })).resolves.toMatchObject({
        method,
      });
    }
  }
});

test("offers async iteration and array collection for streams", async () => {
  const client = makeClient();
  const api = createPassKitApi(client);
  const request = { id: "program-id" };

  await expect(api.loyalty.listMembersToArray(request)).resolves.toEqual([
    { method: "listMembers", request },
  ]);

  const values = [];
  for await (const value of api.loyalty.listMembers(request))
    values.push(value);
  expect(values).toEqual([{ method: "listMembers", request }]);
});

test("advanced bulk methods require an explicit opt-in", async () => {
  const client = makeClient();
  const request = { id: "program-id" };

  expect(() =>
    createPassKitApi(client).advanced.loyalty.bulkDeleteMembers(request),
  ).toThrow("allowDestructive: true");
  await expect(
    createPassKitApi(client, {
      allowDestructive: true,
    }).advanced.loyalty.bulkDeleteMembers(request),
  ).resolves.toMatchObject({ method: "bulkDeleteMembers" });
});
