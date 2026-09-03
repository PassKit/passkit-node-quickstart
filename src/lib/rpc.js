function unary(client, method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

async function* iterate(client, method, request) {
  const stream = client[method](request);
  const values = [];
  let ended = false;
  let failure;

  stream.on("data", (value) => values.push(value));
  stream.on("error", (error) => {
    failure = error;
    ended = true;
  });
  stream.on("end", () => {
    ended = true;
  });

  while (!ended || values.length) {
    if (failure) throw failure;
    if (values.length) yield values.shift();
    else await new Promise((resolve) => setImmediate(resolve));
  }
  if (failure) throw failure;
}

async function collect(client, method, request) {
  const values = [];
  for await (const value of iterate(client, method, request))
    values.push(value);
  return values;
}

module.exports = { collect, iterate, unary };
