const imageToBase64 = require("image-to-base64");
const {
  Date: PassKitDate,
  Id,
  LocalDateTime,
  Time,
} = require("passkit-node-sdk/io/common/common_objects_pb");
const { Person } = require("passkit-node-sdk/io/common/personal_pb");
const {
  DefaultTemplateRequest,
  PassProtocol,
} = require("passkit-node-sdk/io/common/template_pb");
const {
  CreateImageInput,
  ImageData,
  ImageIds,
} = require("passkit-node-sdk/io/image/image_pb");
const { AirportCode, Port } = require("passkit-node-sdk/io/flights/airport_pb");
const {
  BoardingPassRecord,
  BoardingPassRecordRequest,
} = require("passkit-node-sdk/io/flights/boarding_pass_pb");
const {
  FlightSchedule,
  FlightTimes,
} = require("passkit-node-sdk/io/flights/barcode_pb");
const {
  Carrier,
  CarrierCode,
} = require("passkit-node-sdk/io/flights/carrier_pb");
const {
  FlightDesignator,
  FlightDesignatorRequest,
} = require("passkit-node-sdk/io/flights/flight_designator_pb");
const {
  Flight,
  FlightRequest,
} = require("passkit-node-sdk/io/flights/flight_pb");
const { Passenger } = require("passkit-node-sdk/io/flights/passenger_pb");
const runCleanup = require("./cleanup");

const DESIGNATOR_REVISION = 1;

function rpc(client, method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) return reject(error);
      return resolve(response);
    });
  });
}

class QuickStartFlights {
  constructor(pkClient, options = {}) {
    this.pkClient = pkClient;
    this.appleCertificate = options.appleCertificate;
    this.recipientEmail = options.recipientEmail;
    this.carrierCode = options.flightCarrierCode || "YY";
    this.flightNumber =
      options.flightNumber || String(Math.floor(100 + Math.random() * 900));
    this.origin = options.flightOrigin || "YY4";
    this.destination = options.flightDestination || "ADP";
    this.imageIds = new ImageIds();
    this.templateId = "";
    this.departureDate = new PassKitDate();
    this.boardingPasses = [];
    this.carrierCreated = false;
    this.originCreated = false;
    this.destinationCreated = false;
    this.flightCreated = false;
    this.designatorCreated = false;
  }

  async runQuickStart() {
    try {
      this.departureDate = this.futureDepartureDate();
      await this.createImages();
      await this.createTemplate();
      await this.createCarrierAndPorts();
      await this.createFlightAndDesignator();
      await this.createBoardingPass();
      return "done";
    } catch (error) {
      throw new Error(`Flights quickstart failed: ${error.message}`, {
        cause: error,
      });
    }
  }

  async cleanUp() {
    const imageIds = [
      ["icon", this.imageIds.getIcon()],
      ["logo", this.imageIds.getLogo()],
      ["Apple logo", this.imageIds.getApplelogo()],
    ];
    await runCleanup([
      ...this.boardingPasses.map((pass) => [
        `boarding pass ${pass.id}`,
        pass.id,
        (id) => this.deleteBoardingPass(id),
      ]),
      ["flight", this.flightCreated, () => this.deleteFlight()],
      [
        "flight designator",
        this.designatorCreated,
        () => this.deleteFlightDesignator(),
      ],
      [
        "origin airport",
        this.originCreated,
        () => this.deletePort(this.origin),
      ],
      [
        "destination airport",
        this.destinationCreated,
        () => this.deletePort(this.destination),
      ],
      [
        "carrier propagation delay",
        this.carrierCreated,
        () => new Promise((resolve) => setTimeout(resolve, 5000)),
      ],
      ["carrier", this.carrierCreated, () => this.deleteCarrier()],
      ["template", this.templateId, (id) => this.deleteTemplate(id)],
      ...imageIds.map(([label, id]) => [
        label,
        id,
        (imageId) => this.deleteImage(imageId),
      ]),
    ]);
  }

  async createImages() {
    console.log("Creating flight images");
    const [icon, logo] = await Promise.all([
      imageToBase64("./src/images/shared/icon.png"),
      imageToBase64("./src/images/shared/logo.png"),
    ]);
    const imageData = new ImageData();
    imageData.setIcon(icon).setLogo(logo).setApplelogo(logo);
    const request = new CreateImageInput();
    request.setImagedata(imageData);
    this.imageIds = await rpc(
      this.pkClient.imageClient,
      "createImages",
      request,
    );
  }

  async createTemplate() {
    console.log("Creating flight template");
    const request = new DefaultTemplateRequest();
    request.setProtocol(PassProtocol.FLIGHT_PROTOCOL).setRevision(1);
    const template = await rpc(
      this.pkClient.templateClient,
      "getDefaultTemplate",
      request,
    );
    template
      .setName("Quickstart Flight Ticket")
      .setDescription("Quickstart Economy Flight Ticket")
      .setTimezone("Europe/London")
      .setImageids(this.imageIds);
    template
      .getColors()
      .setTextcolor("000000")
      .setLabelcolor("000000")
      .setStripcolor("000000")
      .setBackgroundcolor("FFEA6C");
    const id = await rpc(
      this.pkClient.templateClient,
      "createTemplate",
      template,
    );
    this.templateId = id.getId();
  }

  async createCarrierAndPorts() {
    console.log("Creating carrier and airports");
    const carrier = new Carrier();
    carrier
      .setAirlinename("Quickstart Airline")
      .setIatacarriercode(this.carrierCode)
      .setPasstypeidentifier(this.appleCertificate);
    try {
      await rpc(this.pkClient.flightsClient, "createCarrier", carrier);
      this.carrierCreated = true;
    } catch (error) {
      if (error.code !== 6) throw error;
      console.log(`Carrier ${this.carrierCode} already exists; reusing it.`);
    }

    this.originCreated = await this.createPort({
      airportName: "Quickstart Origin Airport",
      cityName: "Origin",
      iata: this.origin,
      icao: "YYYY",
      countryCode: "GB",
      timezone: "Europe/London",
    });
    this.destinationCreated = await this.createPort({
      airportName: "Quickstart Destination Airport",
      cityName: "Destination",
      iata: this.destination,
      icao: "VHHH",
      countryCode: "HK",
      timezone: "Asia/Hong_Kong",
    });
  }

  async createPort({
    airportName,
    cityName,
    iata,
    icao,
    countryCode,
    timezone,
  }) {
    const port = new Port();
    port
      .setAirportname(airportName)
      .setCityname(cityName)
      .setIataairportcode(iata)
      .setIcaoairportcode(icao)
      .setCountrycode(countryCode)
      .setTimezone(timezone);
    try {
      await rpc(this.pkClient.flightsClient, "createPort", port);
      return true;
    } catch (error) {
      if (error.code !== 6) throw error;
      console.log(`Airport ${iata} already exists; reusing it.`);
      return false;
    }
  }

  async createFlightAndDesignator() {
    console.log("Creating flight and flight designator");
    const date = this.isoDepartureDate();
    const departure = new LocalDateTime();
    departure.setDatetime(`${date}T13:00:00`);
    const arrival = new LocalDateTime();
    arrival.setDatetime(`${date}T21:00:00`);
    const flight = new Flight();
    flight
      .setCarriercode(this.carrierCode)
      .setFlightnumber(this.flightNumber)
      .setBoardingpoint(this.origin)
      .setDeplaningpoint(this.destination)
      .setDeparturedate(this.departureDate)
      .setScheduleddeparturetime(departure)
      .setScheduledarrivaltime(arrival)
      .setPasstemplateid(this.templateId);
    await rpc(this.pkClient.flightsClient, "createFlight", flight);
    this.flightCreated = true;

    const schedule = new FlightSchedule();
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((day) => schedule[`set${day}`](this.flightTimes()));
    const designator = new FlightDesignator();
    designator
      .setCarriercode(this.carrierCode)
      .setFlightnumber(this.flightNumber)
      .setRevision(DESIGNATOR_REVISION)
      .setActive(true)
      .setOrigin(this.origin)
      .setDestination(this.destination)
      .setPasstemplateid(this.templateId)
      .setSchedule(schedule);
    await rpc(
      this.pkClient.flightsClient,
      "createFlightDesignator",
      designator,
    );
    this.designatorCreated = true;
  }

  async createBoardingPass() {
    console.log("Creating boarding pass");
    const person = new Person();
    person
      .setForename("Flight")
      .setSurname("Passenger")
      .setEmailaddress(
        this.recipientEmail || "flight.passenger@dummy.passkit.com",
      );
    const passenger = new Passenger();
    passenger.setPassengerdetails(person);
    const record = new BoardingPassRecord();
    record
      .setOperatingcarrierpnr("P8F8R8")
      .setBoardingpoint(this.origin)
      .setDeplaningpoint(this.destination)
      .setCarriercode(this.carrierCode)
      .setFlightnumber(this.flightNumber)
      .setDeparturedate(this.departureDate)
      .setPassenger(passenger)
      .setSequencenumber(123)
      .setSeatnumber("12A")
      .setClass("Economy");
    const response = await rpc(
      this.pkClient.flightsClient,
      "createBoardingPass",
      record,
    );
    this.boardingPasses = response.getBoardingpassesList().map((pass) => ({
      id: pass.getId(),
      url: pass.getUrl() || pass.getGooglepayurl(),
    }));
  }

  flightTimes() {
    const time = (hour, minute = 0) =>
      new Time().setHour(hour).setMinute(minute);
    return new FlightTimes()
      .setScheduleddeparturetime(time(13))
      .setBoardingtime(time(12, 15))
      .setGateclosingtime(time(12, 30))
      .setScheduledarrivaltime(time(21));
  }

  futureDepartureDate() {
    const date = new global.Date();
    date.setUTCDate(date.getUTCDate() + 7);
    return new PassKitDate()
      .setYear(date.getUTCFullYear())
      .setMonth(date.getUTCMonth() + 1)
      .setDay(date.getUTCDate());
  }

  isoDepartureDate() {
    return [
      this.departureDate.getYear(),
      String(this.departureDate.getMonth()).padStart(2, "0"),
      String(this.departureDate.getDay()).padStart(2, "0"),
    ].join("-");
  }

  deleteBoardingPass(id) {
    const request = new BoardingPassRecordRequest();
    request.setPassid(new Id().setId(id));
    return rpc(this.pkClient.flightsClient, "deleteBoardingPass", request);
  }

  deleteFlight() {
    const request = new FlightRequest();
    request
      .setCarriercode(this.carrierCode)
      .setFlightnumber(this.flightNumber)
      .setBoardingpoint(this.origin)
      .setDeplaningpoint(this.destination)
      .setDeparturedate(this.departureDate);
    return rpc(this.pkClient.flightsClient, "deleteFlight", request);
  }

  deleteFlightDesignator() {
    const request = new FlightDesignatorRequest();
    request
      .setCarriercode(this.carrierCode)
      .setFlightnumber(this.flightNumber)
      .setRevision(DESIGNATOR_REVISION);
    return rpc(this.pkClient.flightsClient, "deleteFlightDesignator", request);
  }

  deletePort(code) {
    return rpc(
      this.pkClient.flightsClient,
      "deletePort",
      new AirportCode().setAirportcode(code),
    );
  }

  deleteCarrier() {
    return rpc(
      this.pkClient.flightsClient,
      "deleteCarrier",
      new CarrierCode().setCarriercode(this.carrierCode),
    );
  }

  deleteTemplate(id) {
    return rpc(
      this.pkClient.templateClient,
      "deleteTemplate",
      new Id().setId(id),
    );
  }

  deleteImage(id) {
    return rpc(this.pkClient.imageClient, "deleteImage", new Id().setId(id));
  }
}

module.exports = QuickStartFlights;
