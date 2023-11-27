export class FlightResponseDTO {
  meta: {
    count: number;
  };
  data: FlightOffer[];
  dictionaries: {
    locations: Record<string, Location>;
    aircraft: Record<string, string>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

export class FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export class Itinerary {
  duration: string;
  segments: Segment[];
}

export class Segment {
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export class Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}

export class Fee {
  amount: string;
  type: string;
}

export class PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export class TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: FareDetails[];
}

export class FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: {
    quantity: number;
  };
}

export class Location {
  cityCode: string;
  countryCode: string;
}
