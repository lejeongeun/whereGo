package org.project.wherego.map.controller;

import com.google.maps.model.PlaceDetails;
import lombok.RequiredArgsConstructor;
import org.project.wherego.map.domain.Place;
import org.project.wherego.map.service.GoogleMapsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class GoogleMapsController {
    private final GoogleMapsService googleMapsService;

    @GetMapping("/details/{placeId}")
    public ResponseEntity<PlaceDetails> getPlaceDetails(@PathVariable String placeId) throws Exception{
        PlaceDetails details = googleMapsService.getPlaceDetails(placeId);
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<Place> savePlace(@RequestBody Place place) {
        Place savedPlace = googleMapsService.savePlace(place);
        return ResponseEntity.ok(savedPlace);
    }
}
