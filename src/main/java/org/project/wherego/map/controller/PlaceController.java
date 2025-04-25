package org.project.wherego.map.controller;

import com.google.maps.model.PlaceDetails;
import lombok.RequiredArgsConstructor;
import org.project.wherego.map.domain.Place;
import org.project.wherego.map.dto.PlaceSaveRequestDto;
import org.project.wherego.map.dto.PlaceSearchResponse;
import org.project.wherego.map.service.PlaceService;
import org.project.wherego.member.config.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {
    private final PlaceService placeService;

    // 장소 검색
    @GetMapping("/search")
    public ResponseEntity<List<PlaceSearchResponse>> searchPlaces(@RequestParam String query) throws Exception {
        return ResponseEntity.ok(placeService.searchPlaces(query));
    }
    // 장소 저장
    @PostMapping("/save")
    public ResponseEntity<Place> savePlace(@RequestBody PlaceSaveRequestDto requestDto,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        requestDto.setEmail(userDetails.getMember().getEmail());
        return ResponseEntity.ok(placeService.savePlace(requestDto));
    }
    // 장소 정보
    @GetMapping("/{placeId}/details")
    public ResponseEntity<PlaceDetails> getPlaceDetails(@PathVariable String placeId) throws Exception {
        return ResponseEntity.ok(placeService.getPlaceDetails(placeId));
    }

    @DeleteMapping("/{placeId}/delete")
    public ResponseEntity<Void> deletePlace(@PathVariable Long placeId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String email = userDetails.getMember().getEmail();
        placeService.deletePlace(placeId, email);
        return ResponseEntity.ok().build();
    }


}