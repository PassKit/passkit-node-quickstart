# PassKit Node Quickstart

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://img.shields.io/npm/v/passkit-node-sdk)](https://www.npmjs.com/package/passkit-node-sdk)

### Overview

This quickstart aims to help get Node.js developers up and running with the PassKit SDK as quickly as possible.

### Prerequisites

You will need the following:

- A PassKit account (signup for free at [PassKit](https://app.passkit.com))
- Your PassKit SDK Credentials (available from the [Developer Tools Page](https://app.passkit.com/app/account/developer-tools))
- Node.js 11.6.0 or above ([Download Node.js](https://nodejs.org/en/))
- A recommended code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### Configuration

1. Download or clone this quickstart repository.
2. Create a new folder inside `src` called `certs` and add the following three PassKit credential files into it. These files can be found in the SDK credentials email you receive upon signup:
   - `certificate.pem`
   - `ca-chain.pem`
   - `key.pem`
3. Add the one-time password you used to generate your SDK credentials into the `src/config/config.js` PASSPHRASE variable.
4. Check the API region of your account [here](https://app.passkit.com/app/account/developer-tools) and update the address accordingly:
   - For Europe/Pub1, use `ADDRESS = "grpc.pub1.passkit.io"`
   - For USA/Pub2, use `ADDRESS = "grpc.pub2.passkit.io"`
5. If you wish to receive enrolment emails, edit lines 281 and 307 of the `QuickStartLoyalty` class to provide an address where you can receive mail.
6. Run `npm install` to install dependencies.

### Running the Tests

Run the following command:
```sh
npm run test
```

If you do not want your assets to be deleted, comment out lines 10-12 in `test/quick-start-loyalty.test.js` or `test/quick-start-coupons.test.js` or `test/quick-start-event-tickets.test.js`.

### Notes

For implementing in your own projects, use the `GrpcConnectionPool` or `PassKitClient` class to manage connections to the PassKit gRPC endpoints.
By default, this quickstart uses gRPC connection pooling to optimize performance and manage multiple requests efficiently. However, if you prefer to use the single-connection method, follow the steps below:

1. Open the relevant quickstart file, such as `quick-start-loyalty.js` or `quick-start-coupons.js` or `quick-start-event-tickets.js`.
2. Comment out the gRPC client import and uncomment the single connection import:
```
//Single Connection
//const PassKitGRPC = require("./client");
//Connection Pooling
const grpcPool = require("./poolingClient");
```
3. Locate the following section in the constructor and comment out the connection pooling line and uncomment the single connection line
```
//Single Connection
//this.pkClient = new PassKitGRPC().getInstance();
//Connection Pooling
this.pkClient = grpcPool.getConnection();
```
4. In each method, comment pooled client accces and uncomment the single connection method


When to Use Each Mehod:
- gRPC Connection Pooling (Default) -	Recommended for production environments with high concurrency and multiple requests. Improves performance by reusing connections.
- Single Connection	- Useful for simple applications, debugging, or when only a few API calls are needed.

This quickstart uses the official PassKit Node.js SDK: [passkit-node-sdk](https://www.npmjs.com/package/passkit-node-sdk).

## Examples

All quickstarts are found in the `quickstarts` folder.

### Membership Cards
`QuickStartLoyalty` will create a membership program with two tiers: base and VIP. It will enrol two members, one in each tier.

#### Methods:
- `createProgram()` - Creates a new membership program.
- `createTier()` - Creates a tier and links it to the program.
- `enrolMember()` - Enrols a new member and sends an email with the membership card URL.
- `checkInMember()` - Checks a member in at an event.
- `checkOutMember()` - Checks a member out of an event.
- `addPoints()` - Adds points to a member's account.
- `burnPoints()` - Burns a specified number of points from a member's account.
- `getMember()` - Retrieves details of a member.
- `updateMember()` - Updates an existing member's details.
- `listMembers()` - Lists all members of a program.
- `listMemberEvents()` - Lists events related to a specific member.
- `getShortcode()` - Retrieves the shortcode associated with a program.
- `deleteProgram()` - Deletes a program and all associated tiers and members.

### Coupons
`QuickStartCoupons` will create a campaign with two offers: base and VIP. It will create and redeem a coupon.

#### Methods:
- `createCampaign()` - Creates a new coupon campaign.
- `createOffer()` - Creates an offer and links it to the campaign.
- `createCoupon()` - Creates a new coupon and sends an email with the coupon URL.
- `getCoupon()` - Retrieves details of a coupon.
- `updateCoupon()` - Updates an existing coupon's details.
- `listCoupons()` - Lists all coupons in a campaign.
- `redeemCoupon()` - Redeems a coupon.
- `voidCoupon()` - Voids a coupon.
- `deleteCampaign()` - Deletes a campaign and all associated offers and coupons.

### Event Tickets
`QuickStartEventTickets` will create a venue, production, event, ticket type, and issue a ticket.

#### Methods:
- `createTemplate()` - Creates an event ticket template.
- `createVenue()` - Creates a venue for the event.
- `createProduction()` - Creates a production.
- `createEvent()` - Creates an event.
- `createTicketType()` - Creates a ticket type linked to the event.
- `issueTicket()` - Issues an event ticket and sends an email with the ticket URL.
- `getTicketById()` - Retrieves a ticket by ID.
- `getTicketByOrderNumber()` - Retrieves a ticket by order number.
- `getTicketByTicketNumber()` - Retrieves a ticket by ticket number.
- `updateTicket()` - Updates an existing ticket's details.
- `listTickets()` - Lists all issued tickets.
- `validateTicket()` - Validates an event ticket.
- `redeemTicket()` - Redeems a ticket.
- `deleteTicket()` - Deletes a ticket.

## Documentation
- [PassKit Membership API Documentation](https://docs.passkit.io/protocols/member)
- [PassKit Coupons API Documentation](https://docs.passkit.io/protocols/coupon)
- [PassKit Boarding Pass API Documentation](https://docs.passkit.io/protocols/boarding)
- [PassKit Event Tickets API Documentation](https://docs.passkit.io/protocols/event-tickets)

## Getting Help
- Email: [support@passkit.com](mailto:support@passkit.com)
- [Online Chat Support](https://passkit.com/)

