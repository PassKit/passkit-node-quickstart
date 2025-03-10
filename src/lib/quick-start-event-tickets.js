const { ProjectStatus } = require("passkit-node-sdk/io/common/project_pb");
const {
    DefaultTemplateRequest,
    PassTemplate,
    PassProtocol
} = require("passkit-node-sdk/io/common/template_pb");
const { Id } = require("passkit-node-sdk/io/common/common_objects_pb");
const { FieldFilter, FilterGroup, Filters, Operator } = require("passkit-node-sdk/io/common/filter_pb");
const {
    ImageData,
    ImageIds,
    CreateImageInput,
} = require("passkit-node-sdk/io/image/image_pb");
const imageToBase64 = require("image-to-base64");
const { Person } = require("passkit-node-sdk/io/common/personal_pb");
const { Production } = require("passkit-node-sdk/io/event_tickets/production_pb");
const { Venue } = require("passkit-node-sdk/io/event_tickets/venue_pb");
const { Event } = require("passkit-node-sdk/io/event_tickets/event_pb")
const { TicketType } = require("passkit-node-sdk/io/event_tickets/ticket_type_pb");
const { IssueTicketRequest, ValidateTicketRequest, TicketId, Ticket, OrderNumberRequest, TicketNumberRequest, TicketListRequest, RedeemTicketRequest } = require("passkit-node-sdk/io/event_tickets/ticket_pb");
const { Timestamp } = require("google-protobuf/google/protobuf/timestamp_pb");

//Single Connection
//const PassKitGRPC = require("./client");
//Connection Pooling
const grpcPool = require("./poolingClient");
const helper = require("./helpers");

class QuickStartEventTickets {
    constructor() {
        //Single Connection
        //this.pkClient = new PassKitGRPC().getInstance();
        //Connection Pooling
        this.pkClient = grpcPool.getConnection();
        this.heroImageId = "";
        this.stripImageId = "";
        this.iconId = "";
        this.logoId = "";
        this.eventTemplate = new PassTemplate();
        this.eventTemplateId = "";
        this.ticketTypeId = "";
        this.productionId = "";
        this.venueId = "";
        this.eventId = "";
        this.ticketId = "";
        this.imageIds = new ImageIds();
    }

    async runQuickStart() {
        try {
            const imageData = new ImageData();
            const icon = await imageToBase64("./src/images/shared/icon.png");
            const logo = await imageToBase64("./src/images/shared/logo.png");
            const hero = await imageToBase64("./src/images/loyalty/hero.png");
            const strip = await imageToBase64("./src/images/loyalty/strip.png");

            imageData.setIcon(icon).setLogo(logo).setHero(hero).setStrip(strip);

            await this.createImages(imageData);
            await this.getEventTemplate();
            this.prepEventTemplate();
            await this.createEventTemplate();
            await this.createProduction();
            await this.createVenue();
            await this.createEvent();
            await this.createTicketType();
            await this.issueTicket();
            await this.validateTicket();
            await this.updateTicket();
            await this.getTicketById();
            await this.getTicketByOrderNumber();
            await this.getTicketByTicketNumber();
            await this.listTickets();
            await this.redeemTicket();
            await this.deleteTicket();
            return "done";
        } catch (error) {
            console.log("Error: ", error);
            return "done";
        }
    }

    async cleanUp() {
        try {
            await this.deleteProduction();
            await this.deleteTemplate(this.eventTemplateId);
            await this.deleteImage(this.imageIds.getIcon());
            await this.deleteImage(this.imageIds.getLogo());
            await this.deleteImage(this.imageIds.getHero());
            await this.deleteImage(this.imageIds.getStrip());
            await this.deleteImage(this.imageIds.getApplelogo());
            return "done";
        } catch (error) {
            console.log("Error: ", error);
            return "done";
        }
    }

    createImages(imageData) {
        console.log("Creating images");
        const request = new CreateImageInput();
        request.setImagedata(imageData);

        const callback = helper.createImagesResponse.bind(this);

        return new Promise((resolve, reject) => {
            //Single Connection
            //this.pkClient.getImagesClient().createImages(request, (err, response) => {
            // Connection Pooling    
            this.pkClient.imageClient.createImages(request, (err, response) => {
                if (err) {
                    reject(err);
                }
                resolve(callback(response));
            });
        });
    }

    getEventTemplate() {
        console.log("Getting event template");
        const request = new DefaultTemplateRequest();
        request.setProtocol(PassProtocol.EVENT_TICKETING);
        request.setRevision(1);
        const callback = helper.createEventTemplateResponse.bind(this);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getTemplateClient()
                // Connection Pooling    
                .templateClient
                .getDefaultTemplate(request, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    prepEventTemplate() {
        console.log("Prepping event template");
        this.eventTemplate
            .setName("Quickstart Event Tickets")
            .setDescription("Quickstart Event Tickets")
            .setTimezone("Europe/London")
            .setImageids(this.imageIds)
            .clearImages()
            .getColors()
            .setBackgroundcolor("#cd7f32");
    }

    createEventTemplate() {
        console.log("Creating event template");
        const callback = helper.eventTemplateResponse.bind(this);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getTemplateClient()
                // Connection Pooling   
                .templateClient
                .createTemplate(this.eventTemplate, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createProduction() {
        console.log("Creating production");
        const callback = helper.productionResponse.bind(this);
        const production = new Production();
        production
            .setName("Quickstart Event Tickets Test")
            .setFineprint("Quickstart Fine Print")
            .setAutoinvalidateticketsuponeventend(1) // 1 is ON, 2 is OFF
            .addStatus(ProjectStatus.PROJECT_DRAFT)
            .addStatus(ProjectStatus.PROJECT_ACTIVE_FOR_OBJECT_CREATION);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .createProduction(production, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createVenue() {
        console.log("Creating venue");
        const callback = helper.createVenueResponse.bind(this);
        const venue = new Venue();
        venue
            .setName("Quickstart Venue")
            .setAddress("123 ABC Street")
            .setTimezone("Europe/London");

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection

                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .createVenue(venue, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    createEvent() {
        console.log("Creating event");
        const callback = helper.createEventResponse.bind(this);

        const production = new Production();
        production.setId(this.productionId);
        production.setName("Quickstart Event Production");

        const venue = new Venue();
        venue.setId(this.venueId);
        venue.setName("Quickstart Venue");
        venue.setAddress("123 ABC Street");

        const doorsOpenTimestamp = new Timestamp();
        doorsOpenTimestamp
            .fromDate(new Date("2025-06-15T18:00:00Z"));

        const endDateTimestamp = new Timestamp();
        endDateTimestamp
            .fromDate(new Date("2025-06-16T02:00:00Z"));

        const relevantDateTimestamp = new Timestamp();
        relevantDateTimestamp
            .fromDate(new Date("2025-06-15T12:00:00Z"));

        const event = new Event();
        event
            .setProduction(production)
            .setVenue(venue)
            .setDoorsopen(doorsOpenTimestamp)
            .setEnddate(endDateTimestamp)
            .setScheduledstartdate(relevantDateTimestamp);


        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //.getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .createEvent(event, (err, response) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(callback(response));
                });
        });
    }

    createTicketType() {
        console.log("Creating ticket type");
        const callback = helper.ticketTypeResponse.bind(this);
        const ticketType = new TicketType();
        ticketType
            .setName("Quickstart Ticket Type")
            .setBeforeredeempasstemplateid(this.eventTemplateId)
            .setProductionid(this.productionId)
            .setUid("");

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .createTicketType(ticketType, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    issueTicket() {
        console.log("Issuing Ticket");
        const callback = helper.issueTicketResponse.bind(this);

        const person = new Person();
        person
            .setDisplayname("Bronze Billy")
            .setEmailaddress("bronze.billy@dummy.passkit.com");

        const request = new IssueTicketRequest();
        request
            .setEventid(this.eventId)
            .setTickettypeid(this.ticketTypeId)
            .setTicketnumber("1")
            .setOrdernumber("1")
            .setPerson(person);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .issueTicket(request, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(callback(response));
                });
        });
    }

    validateTicket() {
        console.log("Validating Ticket");
        const ticket = new TicketId();
        ticket.setTicketid(this.ticketId);

        const ticketToValidate = new ValidateTicketRequest();
        ticketToValidate
            .setTicket(ticket)
            .setMaxnumberofvalidations(3);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .validateTicket(ticketToValidate, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }


    updateTicket() {
        console.log("Updating Event Ticket");
        const ticket = new Ticket();
        ticket
            .setId(this.ticketId)
            .setPerson(
                new Person()
                    .setDisplayname("Bronze")
            );

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .updateTicket(ticket, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });

    }

    getTicketById() {
        console.log("Getting Event Ticket by Id");
        const ticketId = new Id();
        ticketId.setId(this.ticketId);
        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .getTicketById(ticketId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    getTicketByOrderNumber() {
        console.log("Gettting Event Ticket by Order Number");
        const orderNumber = new OrderNumberRequest();
        orderNumber
            .setOrdernumber("1")
            .setProductionid(this.productionId);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .getTicketsByOrderNumber(orderNumber, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    getTicketByTicketNumber() {
        console.log("Getting Event Ticket By Ticket Number");
        const ticketNumber = new TicketNumberRequest();
        ticketNumber
            .setProductionid(this.productionId)
            .setTicketnumber("1");
        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .getTicketByTicketNumber(ticketNumber, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    listTickets() {
        console.log("Listing tickets");

        return new Promise((resolve, reject) => {
            const listRequest = new TicketListRequest();
            const filters = new Filters();
            const filterGroup = new FilterGroup();
            const fieldFilter = new FieldFilter();
            const fieldFilter2 = new FieldFilter();

            filterGroup.setCondition(Operator.AND);
            fieldFilter.setFilterfield("passStatus");
            fieldFilter.setFiltervalue("PASS_ISSUED");
            fieldFilter.setFilteroperator("eq");
            fieldFilter2.setFilterfield("ticketId");
            fieldFilter2.setFiltervalue(this.ticketId);
            fieldFilter2.setFilteroperator("eq");

            filterGroup.setFieldfiltersList([fieldFilter, fieldFilter2]);
            filters.setFiltergroupsList([filterGroup]);
            filters.setLimit(-1);
            listRequest.setFilters(filters);
            listRequest.setProductionid(this.productionId);

            //Single Connection
            //const ticketStream = this.pkClient.getEventTicketsClient().listTickets(listRequest);
            // Connection Pooling  
            const ticketStream = this.pkClient.ticketsClient.listTickets(listRequest);
            const tickets = [];

            ticketStream.on('data', (data) => {
                console.log('Received Ticket:', data.toObject());
                tickets.push(data.toObject());
            });

            ticketStream.on('end', () => {
                console.log('Stream ended');
                resolve(tickets);
            });

            ticketStream.on('error', (err) => {
                console.error('Stream error:', err);
                reject(err);
            });
        });
    }

    redeemTicket() {
        console.log("Redeeming Ticket");
        const redeemId = new TicketId();
        redeemId.setTicketid(this.ticketId);

        const ticket = new RedeemTicketRequest();
        ticket
            .setTicket(redeemId);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .redeemTicket(ticket, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    deleteTicket() {
        console.log("Deleting Ticket");
        const deleteId = new TicketId();
        deleteId.setTicketid(this.ticketId);

        return new Promise((resolve, reject) => {

            this.pkClient
                // Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .deleteTicket(deleteId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    deleteProduction() {
        console.log("Delete Production");
        const deleteId = new Id();
        deleteId.setId(this.productionId);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getEventTicketsClient()
                // Connection Pooling  
                .ticketsClient
                .deleteProduction(deleteId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    deleteTemplate(id) {
        console.log("Delete Template");
        const deleteId = new Id();
        deleteId.setId(id);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getTemplateClient()
                // Connection Pooling  
                .templateClient
                .deleteTemplate(deleteId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }

    deleteImage(id) {
        console.log("Delete Image: ", id);
        const deleteId = new Id();
        deleteId.setId(id);

        return new Promise((resolve, reject) => {
            this.pkClient
                //Single Connection
                //    .getImagesClient()
                // Connection Pooling  
                .imageClient
                .deleteImage(deleteId, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    }
}

module.exports = QuickStartEventTickets;
