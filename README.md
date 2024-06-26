# PassKit Node Quickstart

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://img.shields.io/npm/v/passkit-node-sdk)](https://www.npmjs.com/package/passkit-node-sdk)

### Overview

This quickstart aims to help get NodeJs developers up and running with the PassKit SDK as quickly as possible.

### Prerequisites

You will need the following:

- A PassKit account (signup for free at https://app.passkit.com)
- Your PassKit SDK Credentials (available from the https://app.passkit.com/app/account/developer-tools)
- Nodejs 11.6.0 or above (https://nodejs.org/en/)

### Configuration

1. Download or clone this quickstart repository.

2. Create a new folder inside `src` called `certs` and add the following three PassKit credential files into it. Files can be found in the sdk credentials email you receive on signup:

   - certificate.pem
   - ca-chain.pem
   - key.pem

3. Add the on time password you used to generate your SDK credentials into the `src/config/config.js` PASSPHRASE variable and check the API region of your account [here](https://app.passkit.com/app/account/developer-tools) and change it accordingly. For Europe/Pub1 use `ADDRESS = "grpc.pub1.passkit.io"` and for USA/Pub2 use `ADDRESS = "grpc.pub2.passkit.io"`.

4. If you wish to receive enrolment emails, edit lines 281 and 307 of the QuickStartLoyalty class to provide an address where you can receive mail.

6. Run `npm i`

### Running the tests

Run `npm run test`

The Loyalty tests will create a membership program with 2 tiers, 2 members and 3 member events.

The tests will display URLs to the generated passes and to the enrolment page. It will pause for a period determined in the test file on line 64.

The tests will then delete and clean-up all assets that it created.

If you don't want you assets to be deleted, comment out lines 10 - 12 in the `test/quick-start-loyalty.test.js` file.

### Notes

For implementing in your own projects, use the PassKitClient class to manage connection to the PassKit gRPC endpoints.

The quickstart uses the PassKit official node sdk found here: https://www.npmjs.com/package/passkit-node-sdk
