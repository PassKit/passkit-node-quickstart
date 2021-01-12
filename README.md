# PassKit Node Quickstart

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Overview

This quickstart aims to help get NodeJs developers up and running with the PassKit SDK as quickly as possible.

### Prerequisites

You will need the following:

- A PassKit account (signup for free at https://app.passkit.com)
- Your PassKit SDK Credentials (available from the https://app.passkit.com/app/account/developer-tools)
- Nodejs 10 or above (https://nodejs.org/en/)

### Configuration

1. Download or clone this quickstart repository, create a folder `src/certs` and add the following three PassKit credential files:

   - certificate.pem
   - ca-chain.pem
   - key.pem

   You will need to decrypt your key using ssl. You can use this command:
   `openssl ec -in key.pem -out key.pem`

2. If you wish to receive enrolment emails, edit lines 281 and 307 of the QuickStartLoyalty class to provide an address where you can receive mail.

### Running the tests

Run `npm run test`

The Loyalty tests will create a membership program with 2 tiers, 1 member and two member events.

The tests will display URLs to the generated passes and to the enrolment page. It will pause for a period determined in the test file on line 6.

The tests will then delete and clean-up all assets that it created.

### Notes

For implementing in your own projects, use the PassKitClient class to manage connection to the PassKit gRPC endpoints.

The quickstart uses the PassKit official node sdk found here: https://www.npmjs.com/package/@passkit/node-sdk
