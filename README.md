# PassKit Node Quickstart

[![CI](https://github.com/PassKit/passkit-node-quickstart/actions/workflows/ci.yml/badge.svg)](https://github.com/PassKit/passkit-node-quickstart/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/passkit-node-sdk)](https://www.npmjs.com/package/passkit-node-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Create a working PassKit membership card, coupon, event ticket, or flight boarding pass with the official Node.js SDK. Each example runs with one command—no source-code changes are required.

The examples print wallet pass URLs and automatically remove the test resources they create.

## Quick start

You need:

- [Node.js 20](https://nodejs.org/) or later
- a free [PassKit account](https://app.passkit.com/signup)
- PassKit SDK credentials

### 1. Download this project

```sh
git clone https://github.com/PassKit/passkit-node-quickstart.git
cd passkit-node-quickstart
npm ci
```

You can also download the repository as a ZIP from GitHub, extract it, and open a terminal in the extracted folder.

### 2. Get your PassKit credentials

1. Sign in to [PassKit](https://app.passkit.com).
2. Open **Developer Tools** from the account menu.
3. Under **Account Credentials**, select **SDK Credentials**.
4. Choose a strong password when prompted. This encrypts your private key; it is not your PassKit account password.
5. Download the three files sent to your registered email address:

   - `certificate.pem`
   - `key.pem`
   - `ca-chain.pem`

Keep the password safe. PassKit does not store your private key or certificate. Generating another credential set invalidates the existing credentials.

### 3. Add the credential files

Create `src/certs`, copy all three files into it, and create your local `.env` file.

macOS or Linux:

```sh
mkdir -p src/certs
cp /path/to/downloads/certificate.pem src/certs/
cp /path/to/downloads/key.pem src/certs/
cp /path/to/downloads/ca-chain.pem src/certs/
cp .env.example .env
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force src/certs
Copy-Item "$HOME\Downloads\certificate.pem" src/certs\
Copy-Item "$HOME\Downloads\key.pem" src/certs\
Copy-Item "$HOME\Downloads\ca-chain.pem" src/certs\
Copy-Item .env.example .env
```

Your folder should look like this:

```text
passkit-node-quickstart/
├── .env
└── src/
    └── certs/
        ├── ca-chain.pem
        ├── certificate.pem
        └── key.pem
```

These files and `.env` are ignored by Git. Never commit or share them.

### 4. Complete `.env`

Open `.env` in a text editor. Replace `your_passphrase` with the password you chose when generating the SDK credentials:

```dotenv
PASSKIT_PASSPHRASE=your_passphrase
PASSKIT_ADDRESS=grpc.pub1.passkit.io
PASSKIT_PORT=443
PASSKIT_ROOT_CERT=./src/certs/ca-chain.pem
PASSKIT_PRIVATE_KEY=./src/certs/key.pem
PASSKIT_CERTIFICATE=./src/certs/certificate.pem
PASSKIT_CONNECTION_MODE=pool
PASSKIT_POOL_SIZE=5
PASSKIT_KEEP_ASSETS=false
```

Check **Developer Tools → API Region** in PassKit:

- use `grpc.pub1.passkit.io` for the European server
- use `grpc.pub2.passkit.io` for the US server

Your PassKit account and its data belong to one region, so `PASSKIT_ADDRESS` must match your account. The quickstart loads `.env` automatically.

### 5. Run an example

Start with the loyalty example:

```sh
npm run example -- loyalty
```

Or choose any example directly:

```sh
npm run example -- loyalty
npm run example -- coupons
npm run example -- tickets
npm run example -- flights
```

When successful, the quickstart prints one or more URLs similar to:

```text
Created resources:
  bronzePassUrl: https://pub1.pskt.io/4MEIqDFudziP4ZFKx5osw3
```

Open a pass URL on a phone to add the pass to Apple Wallet or Google Wallet. On a desktop, the PassKit page displays a QR code you can scan with a phone.

## Keeping the generated resources

By default, cleanup runs even when an example fails partway through. To inspect the generated records in your PassKit account, change this setting in `.env`:

```dotenv
PASSKIT_KEEP_ASSETS=true
```

You will then need to delete those resources manually. Change it back to `false` for normal quickstart use.

## Running the flights example

Flights require an Apple pass certificate uploaded to PassKit. Add its pass type identifier to `.env`:

```dotenv
PASSKIT_APPLE_CERTIFICATE=pass.com.example.airline
```

If this value is empty, the flights example explains the requirement and exits before connecting to PassKit.

## What the examples demonstrate

- `loyalty`: images, templates, a program, tiers, enrolment, external-ID lookup, check-in/out, and earning and burning points
- `coupons`: images, templates, a campaign, offers, coupons, lookup, redemption, and voiding
- `tickets`: images, a template, production, venue, event, ticket type, issuance, validation, and redemption
- `flights`: images, a template, carrier, airports, flight, scheduled designator, and passenger boarding passes

The implementations are in [`src/lib`](src/lib), with a shared entry point at [`src/getting-started.js`](src/getting-started.js).

## Configuration reference

Most users only need to set the API address and passphrase.

| Variable                    | Default                       | Purpose                                                             |
| --------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| `PASSKIT_PASSPHRASE`        | Required                      | SDK private-key passphrase                                          |
| `PASSKIT_ADDRESS`           | `grpc.pub1.passkit.io`        | `grpc.pub1.passkit.io` for Europe or `grpc.pub2.passkit.io` for USA |
| `PASSKIT_PORT`              | `443`                         | gRPC port                                                           |
| `PASSKIT_ROOT_CERT`         | `./src/certs/ca-chain.pem`    | PassKit CA chain used for TLS validation                            |
| `PASSKIT_PRIVATE_KEY`       | `./src/certs/key.pem`         | PEM private-key path                                                |
| `PASSKIT_CERTIFICATE`       | `./src/certs/certificate.pem` | PEM client-certificate path                                         |
| `PASSKIT_CONNECTION_MODE`   | `pool`                        | `pool` for reusable connections or `single` for one connection      |
| `PASSKIT_POOL_SIZE`         | `5`                           | Number of pooled connections                                        |
| `PASSKIT_RECIPIENT_EMAIL`   | Empty                         | Optional recipient for generated pass emails                        |
| `PASSKIT_APPLE_CERTIFICATE` | Empty                         | Apple pass type identifier required for flights                     |
| `PASSKIT_KEEP_ASSETS`       | `false`                       | Preserve generated PassKit resources                                |

Values already set in your terminal take precedence over `.env`. Use pooled connections for concurrent applications; use `single` for the smallest local example or while debugging.

## Troubleshooting

### A credential file cannot be found

Confirm that all three `.pem` files are inside `src/certs`, that their names have not changed, and that you are running the command from the repository folder.

### The private key or certificate cannot be loaded

Check `PASSKIT_PASSPHRASE`. It must be the password chosen when generating **SDK Credentials**, not your PassKit login password. Generate a new credential set if the password or files have been lost, then replace all three local files together.

### Authentication or connection fails

Check your API region under **Developer Tools → API Region**. Use `grpc.pub1.passkit.io` for Europe or `grpc.pub2.passkit.io` for the US. Also check whether a corporate firewall or VPN blocks outbound HTTPS/gRPC traffic.

### The pass URL uses the wrong region

The pass URL begins with `https://pub1.pskt.io/` for Europe or `https://pub2.pskt.io/` for the US. Correct `PASSKIT_ADDRESS` in `.env` and rerun the example.

### No credentials email arrived

Check spam and quarantine folders. Corporate mail systems may block certificate attachments. Follow the guidance in the PassKit help centre or contact PassKit support if the email is still missing.

### Flights are skipped

Upload an Apple pass certificate to PassKit and set `PASSKIT_APPLE_CERTIFICATE` to its pass type identifier.

### Resources remain after a failed run

The quickstart attempts cleanup even after a failure. Remove any remaining resources in the PassKit portal, then verify that `PASSKIT_KEEP_ASSETS=false`.

## Using the wider API

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

The facade deliberately excludes account deletion, password/API-secret management, team administration, certificate upload or renewal, and NFC credential submission. Keep those administrative operations in dedicated, access-controlled tooling.

## Tests and project checks

These checks do not connect to PassKit or require credentials:

```sh
npm test
npm run lint
npm run format:check
npm run check
npm run security
```

The live integration suite creates and deletes PassKit resources and requires a configured `.env`:

```sh
npm run test:integration
```

CI runs offline checks and the security audit on supported Node.js versions. It never receives PassKit credentials or runs integration tests.

## Documentation and support

- [Getting started as a developer](https://help.passkit.com/en/articles/5360063-how-to-get-started-as-a-developer)
- [Working with the pass URL](https://help.passkit.com/en/articles/11891934-working-with-the-pass-url)
- [Membership API](https://docs.passkit.io/protocols/member)
- [Coupons API](https://docs.passkit.io/protocols/coupon)
- [Event Tickets API](https://docs.passkit.io/protocols/event-tickets)
- [Boarding Pass API](https://docs.passkit.io/protocols/boarding)
- [PassKit support](mailto:support@passkit.com)

See [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.
