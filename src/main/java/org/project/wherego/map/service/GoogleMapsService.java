//package org.project.wherego.map.service;
//
//import com.google.maps.GeoApiContext;
//import com.google.maps.PlacesApi;
//import com.google.maps.model.PlaceDetails;
//import com.google.maps.model.PlacesSearchResponse;
//import org.project.wherego.map.domain.Place;
//import org.project.wherego.map.dto.PlaceSearchResponse;
//import org.project.wherego.map.repository.PlaceRepository;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.util.Arrays;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class GoogleMapsService {
//    private final GeoApiContext context;
//    private final PlaceRepository placeRepository;
//
//    public GoogleMapsService(@Value("${google.map.api_key}") String apiKey, PlaceRepository placeRepository) {
//        this.context = new GeoApiContext.Builder().apiKey(apiKey).build();
//        this.placeRepository = placeRepository;
//    }
//    public PlaceDetails getPlaceDetails(String placeId) throws Exception{
//        return PlacesApi.placeDetails(context, placeId).await();
//    }
//
//    public List<PlaceSearchResponse> searchPlaces(String query) throws Exception {
//        PlacesSearchResponse response = PlacesApi.textSearchQuery(context, query).await();
//
//        return Arrays.stream(response.results)
//                .map(result -> PlaceSearchResponse.builder()
//                        .name(result.name)
//                        .address(result.formattedAddress)
//                        .latitude(result.geometry.location.lat)
//                        .longitude(result.geometry.location.lng)
//                        .rating((double) result.rating)
//                        .build())
//                .collect(Collectors.toList());
//    }
//    public Place savePlace(Place place){
//        return placeRepository.save(place);
//    }
//
//
//
//
//
//}
