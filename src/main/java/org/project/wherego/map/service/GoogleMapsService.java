package org.project.wherego.map.service;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.model.PlaceDetails;
import org.project.wherego.map.domain.Place;
import org.project.wherego.map.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GoogleMapsService {
    private final GeoApiContext context;
    private final PlaceRepository placeRepository;

    public GoogleMapsService(@Value("${google.map.api_key}") String apiKey, PlaceRepository placeRepository) {
        this.context = new GeoApiContext.Builder().apiKey(apiKey).build();
        this.placeRepository = placeRepository;
    }
    public PlaceDetails getPlaceDetails(String placeId) throws Exception{
        return PlacesApi.placeDetails(context, placeId).await();
    }
    public Place savePlace(Place place){
        return placeRepository.save(place);
    }

}
