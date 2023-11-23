import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IncludedCheckedBagsDto {
  @IsNumber()
  weight: number;

  @IsString()
  weightUnit: string;
}

class DepartureDto {
  @IsString()
  iataCode: string;

  @IsString()
  terminal: string;

  @IsDateString()
  at: string;
}

class ArrivalDto {
  @IsString()
  iataCode: string;

  @IsString()
  terminal: string;

  @IsDateString()
  at: string;
}

class SegmentDto {
  @ValidateNested()
  @Type(() => DepartureDto)
  departure: DepartureDto;

  @ValidateNested()
  @Type(() => ArrivalDto)
  arrival: ArrivalDto;

  @IsString()
  carrierCode: string;

  @IsNumber()
  number: number;

  @IsString()
  duration: string;

  @IsString()
  id: string;

  @IsNumber()
  numberOfStops: number;

  @IsBoolean()
  blacklistedInEU: boolean;

  @ValidateNested()
  @Type(() => IncludedCheckedBagsDto)
  includedCheckedBags: IncludedCheckedBagsDto;
}

class ItineraryDto {
  @IsString()
  duration: string;

  @ValidateNested({ each: true })
  @Type(() => SegmentDto)
  segments: SegmentDto[];
}

class FeeDto {
  @IsNumber()
  amount: number;

  @IsString()
  type: string;
}

class PriceDto {
  @IsString()
  currency: string;

  @IsNumber()
  total: number;

  @IsNumber()
  base: number;

  @ValidateNested({ each: true })
  @Type(() => FeeDto)
  fees: FeeDto[];

  @IsString()
  grandTotal: string;
}

class FareDetailsDto {
  @IsString()
  segmentId: string;

  @IsString()
  cabin: string;

  @IsString()
  fareBasis: string;

  @IsString()
  class: string;

  @ValidateNested()
  @Type(() => IncludedCheckedBagsDto)
  includedCheckedBags: IncludedCheckedBagsDto;
}

class TravelerPricingDto {
  @IsString()
  travelerId: string;

  @IsString()
  fareOption: string;

  @IsString()
  travelerType: string;

  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @ValidateNested({ each: true })
  @Type(() => FareDetailsDto)
  fareDetailsBySegment: FareDetailsDto[];
}

class PricingOptionsDto {
  @IsString({ each: true })
  fareType: string[];

  @IsBoolean()
  includedCheckedBagsOnly: boolean;
}

class FlightOfferDto {
  @IsString()
  type: string;

  @IsString()
  id: string;

  @IsString()
  source: string;

  @IsBoolean()
  instantTicketingRequired: boolean;

  @IsBoolean()
  nonHomogeneous: boolean;

  @IsBoolean()
  oneWay: boolean;

  @IsString()
  lastTicketingDate: string;

  @IsNumber()
  numberOfBookableSeats: number;

  @ValidateNested({ each: true })
  @Type(() => ItineraryDto)
  itineraries: ItineraryDto[];

  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @ValidateNested()
  @Type(() => PricingOptionsDto)
  pricingOptions: PricingOptionsDto;

  @IsString({ each: true })
  validatingAirlineCodes: string[];

  @ValidateNested({ each: true })
  @Type(() => TravelerPricingDto)
  travelerPricings: TravelerPricingDto[];
}

class LocationDto {
    @IsString()
    cityCode: string;
    
    @IsString()
    countryCode: string;
}

class LocationsDto {
    @ValidateNested()
    @Type(() => LocationDto)
    SYD: LocationDto;
    
    @ValidateNested()
    @Type(() => LocationDto)
    SIN: LocationDto;
    
    @ValidateNested()
    @Type(() => LocationDto)
    DMK: LocationDto;
}

export class DictionariesDto {
    @ValidateNested({ each: true })
    @Type(() => LocationsDto)
    locations: LocationsDto;
}

class FlightOffersPricingDto {
    @IsString()
    type: string;
    
    @ValidateNested({ each: true })
    @Type(() => FlightOfferDto)
    flightOffers: FlightOfferDto[];
}

export default class BookingRequestDto {
  @ValidateNested()
  @Type(() => FlightOffersPricingDto)
  data: FlightOffersPricingDto;
}