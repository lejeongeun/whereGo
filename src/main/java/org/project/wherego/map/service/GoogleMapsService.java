//package org.project.wherego.map.service;
//
//import com.google.maps.GeoApiContext;
//import com.google.maps.PlacesApi;
//import com.google.maps.model.PlaceDetails;
//import com.google.maps.model.PlacesSearchResponse;
//import lombok.NoArgsConstructor;
//import lombok.RequiredArgsConstructor;
//import org.project.wherego.map.domain.Place;
//import org.project.wherego.map.dto.PlaceSaveRequestDto;
//import org.project.wherego.map.dto.PlaceSearchResponse;
//import org.project.wherego.map.repository.PlaceRepository;
//import org.project.wherego.member.domain.Member;
//import org.project.wherego.member.repository.MemberRepository;
//import org.project.wherego.schedule.domain.Schedule;
//import org.project.wherego.schedule.repository.ScheduleRepository;
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
//    private final MemberRepository memberRepository;
//    private final ScheduleRepository scheduleRepository;
//
//    public GoogleMapsService(@Value("${google.map.api_key}") String apiKey,
//                             PlaceRepository placeRepository,
//                             MemberRepository memberRepository,
//                             ScheduleRepository scheduleRepository) {
//        this.context = new GeoApiContext.Builder().apiKey(apiKey).build();
//        this.placeRepository = placeRepository;
//        this.memberRepository = memberRepository;
//        this.scheduleRepository = scheduleRepository;
//    }
//    public PlaceDetails getPlaceDetails(String placeId) throws Exception{
//        return PlacesApi.placeDetails(context, placeId).await();
//    }
//
//    public Place savePlace(PlaceSaveRequestDto requestDto){
//        Member member = memberRepository.findByEmail(requestDto.getEmail()).orElseThrow(()-> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
//        Schedule schedule = scheduleRepository.findById(requestDto.getScheduleId()).orElseThrow("일정을 찾을 수 없습니다.");
//
//        Place place = Place.builder()
//                .name(requestDto.getName())
//                .address(requestDto.getAddress())
//                .latitude(requestDto.getLatitude())
//                .longitude(requestDto.getLongitude())
//                .member(member)
//                .schedule(schedule)
//                .build();
//
//        return placeRepository.save(place);
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
//                        .build())
//                .collect(Collectors.toList());
//    }
//    public Place savePlace(Place place){
//        return placeRepository.save(place);
//    }
//}
