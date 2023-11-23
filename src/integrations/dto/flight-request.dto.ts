export class FlightRequestDTO {
    currencyCode: string;
    originDestinations: OriginDestination[];
    travelers: Traveler[];
    sources: string[];
    searchCriteria: SearchCriteria;
  }
  
  class OriginDestination {
    id: string;
    originLocationCode: string;
    destinationLocationCode: string;
    departureDateTimeRange: DateTimeRange;
  }
  
  class DateTimeRange {
    date: string;
    time: string;
  }
  
  class Traveler {
    id: string;
    travelerType: string;
  }
  
  class SearchCriteria {
    maxFlightOffers: number;
    flightFilters: {
      cabinRestrictions: CabinRestriction[];
    };
  }
  
  class CabinRestriction {
    cabin: string;
    coverage: string;
    originDestinationIds: string[];
  }
  