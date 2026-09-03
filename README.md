# PassKit Node Quickstart

[![CI](https://github.com/PassKit/passkit-node-quickstart/actions/workflows/ci.yml/badge.svg)](https://github.com/PassKit/passkit-node-quickstart/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/passkit-node-sdk)](https://www.npmjs.com/package/passkit-node-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Create working PassKit membership cards, coupons, event tickets, and flight boarding passes with the official Node.js SDK. Each example can be run independently and cleans up the resources it creates by default.

## Requirements

- Node.js 20 or later
- A free [PassKit account](https://app.passkit.com)
- SDK credentials from [Developer Tools](https://app.passkit.com/app/account/developer-tools)

## Setup

```sh
git clone https://github.com/PassKit/passkit-node-quickstart.git
cd passkit-node-quickstart
npm ci
mkdir -p src/certs
cp .env.example .env
```

Put these credential files in `src/certs`:

- `certificate.pem`
- `ca-chain.pem`
- `key.pem`

Open `.env` and replace `PASSKIT_PASSPHRASE` with the one-time password used to generate the credentials. `.env` and `src/certs` are ignored by Git.

## Run an example

```sh
npm run example -- loyalty
npm run example -- coupons
npm run example -- tickets
npm run example -- flights
```

The command validates configuration before connecting, prints created pass URLs, and removes created resources even if the example fails partway through. Set `PASSKIT_KEEP_ASSETS=true` only when you want to inspect resources and delete them manually later.

## Configuration

| Variable                    | Default                       | Purpose                                                  |
| --------------------------- | ----------------------------- | -------------------------------------------------------- |
| `PASSKIT_PASSPHRASE`        | Required                      | SDK private-key passphrase                               |
| `PASSKIT_ADDRESS`           | `grpc.pub1.passkit.io`        | API endpoint; use `grpc.pub2.passkit.io` for USA/Pub2    |
| `PASSKIT_PORT`              | `443`                         | gRPC port                                                |
| `PASSKIT_ROOT_CERT`         | `./src/certs/ca-chain.pem`    | CA chain path                                            |
| `PASSKIT_PRIVATE_KEY`       | `./src/certs/key.pem`         | Private key path                                         |
| `PASSKIT_CERTIFICATE`       | `./src/certs/certificate.pem` | Client certificate path                                  |
| `PASSKIT_CONNECTION_MODE`   | `pool`                        | `pool` or `single`                                       |
| `PASSKIT_POOL_SIZE`         | `5`                           | Number of pooled connections                             |
| `PASSKIT_RECIPIENT_EMAIL`   | Empty                         | Optional recipient for generated pass emails             |
| `PASSKIT_APPLE_CERTIFICATE` | Empty                         | Uploaded Apple pass certificate ID; required for flights |
| `PASSKIT_KEEP_ASSETS`       | `false`                       | Preserve generated resources instead of cleaning up      |

Use pooled connections for concurrent applications. Use `single` for the smallest local example or while debugging; no source changes are necessary.

## What each example creates

- `loyalty`: images, two templates, a program, two tiers, and two members; it also demonstrates check-in/out, points, updates, listing, and deletion.
- `coupons`: images, two templates, a campaign, two offers, and two coupons; it demonstrates updates, listing, redemption, and voiding.
- `tickets`: images, a template, production, venue, event, ticket type, and ticket; it demonstrates lookup, validation, updates, listing, and redemption.
- `flights`: images, a flight template, carrier, origin and destination airports, dated flight, weekly flight designator, and boarding pass.

The implementations are in [`src/lib`](src/lib), with one shared entry point at [`src/getting-started.js`](src/getting-started.js).

## Use the wider API

[`src/lib/passkit-api.js`](src/lib/passkit-api.js) provides Promise-based methods for the wider PassKit API while retaining the SDK's generated protobuf request and response types. It covers:

- memberships and loyalty, coupons, event tickets, and flights
- templates, locations, beacons, links, and images
- analytics, SmartPass distribution and messaging
- sink/webhook subscriptions and scanner configuration
- read-only Apple certificate inspection
- raw pass projects and passes

Create it from the same client used by the examples:

```js
const { createPassKitApi } = require("./src/lib/passkit-api");
const { ListRequest } = require("passkit-node-sdk/io/member/member_pb");

const api = createPassKitApi(client);
const programs = await api.loyalty.listProgramsToArray(new ListRequest());

for await (const member of api.loyalty.listMembers(memberListRequest)) {
  console.log(member.toObject());
}
```

Every server-streaming method has both its SDK name, which returns an async iterator, and a `ToArray` variant for small result sets. Unary methods return Promises.

Potentially broad operations such as segment deletion, bulk voiding, and production copying are grouped under `api.advanced` and disabled by default:

```js
const api = createPassKitApi(client, { allowDestructive: true });
await api.advanced.coupons.bulkVoidCoupons(request);
```

The facade deliberately excludes account deletion, password/API-secret management, team administration, certificate upload or renewal, and NFC credential submission. Those administrative operations should live in dedicated, tightly controlled tooling rather than an introductory quickstart.

## Tests and project checks

```sh
npm test                 # offline unit tests; no credentials needed
npm run lint
npm run format:check
npm run check            # all offline checks
npm run security         # production and development dependency audit
```

The live integration suite creates and deletes PassKit resources and requires a configured `.env`:

```sh
npm run test:integration
```

CI runs offline checks and the security audit on supported Node.js versions. It never receives PassKit credentials or runs integration tests.

## Documentation and support

- [Membership API](https://docs.passkit.io/protocols/member)
- [Coupons API](https://docs.passkit.io/protocols/coupon)
- [Event Tickets API](https://docs.passkit.io/protocols/event-tickets)
- [Boarding Pass API](https://docs.passkit.io/protocols/boarding)
- [PassKit support](mailto:support@passkit.com)

See [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.
