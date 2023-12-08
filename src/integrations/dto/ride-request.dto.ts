interface StopOverDTO {
    duration: string;
    sequenceNumber: number;
    addressLine: string;
    countryCode: string;
    cityName: string;
    zipCode: string;
    googlePlaceId: string;
    name: string;
    geoCode: string;
    stateCode: string;
}

interface PassengerCharacteristicsDTO {
    passengerTypeCode: string;
    age: number;
}

interface ConnectedSegmentDTO {
    transportationType: string;
    transportationNumber: string;
    departure: {
        localDateTime: string;
        iataCode: string;
    };
    arrival: {
        localDateTime: string;
        iataCode: string;
    };
}

export interface RideRequestDTO {
    startLocationCode: string;
    endAddressLine: string;
    endCityName: string;
    endZipCode: string;
    endCountryCode: string;
    endName: string;
    endGooglePlaceId: string;
    endGeoCode: string;
    transferType: string;
    startDateTime: string;
    providerCodes: string;
    passengers: number;
    stopOvers: StopOverDTO[];
    startConnectedSegment: ConnectedSegmentDTO;
    passengerCharacteristics: PassengerCharacteristicsDTO[];
}