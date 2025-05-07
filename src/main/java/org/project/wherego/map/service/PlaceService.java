package org.project.wherego.map.service;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.model.PlaceDetails;
import com.google.maps.model.PlacesSearchResponse;
import org.project.wherego.map.domain.Place;
import org.project.wherego.map.dto.PlaceSaveRequestDto;
import org.project.wherego.map.dto.PlaceSearchResponse;
import org.project.wherego.map.dto.PlaceOrderUpdateRequest;
import org.project.wherego.map.repository.PlaceRepository;
import org.project.wherego.member.domain.Member;
import org.project.wherego.member.repository.MemberRepository;
import org.project.wherego.schedule.domain.Schedule;
import org.project.wherego.schedule.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PlaceService {
    private final PlaceRepository placeRepository;
    private final MemberRepository memberRepository;
    private final ScheduleRepository scheduleRepository;
    private final GeoApiContext context;

    public PlaceService(@Value("${google.map.api_key}") String apiKey,
                       PlaceRepository placeRepository,
                       MemberRepository memberRepository,
                       ScheduleRepository scheduleRepository) {
        this.context = new GeoApiContext.Builder().apiKey(apiKey).build();
        this.placeRepository = placeRepository;
        this.memberRepository = memberRepository;
        this.scheduleRepository = scheduleRepository;
    }

    // 장소 검색
    public List<PlaceSearchResponse> searchPlaces(String query) throws Exception {
        PlacesSearchResponse response = PlacesApi.textSearchQuery(context, query).await();
        return Arrays.stream(response.results)
                .map(result -> PlaceSearchResponse.builder()
                        .name(result.name)
                        .address(result.formattedAddress)
                        .latitude(result.geometry.location.lat)
                        .longitude(result.geometry.location.lng)
                        .rating(result.rating)
                        .build())
                .collect(Collectors.toList());
    }
    // 장소 저장
    @Transactional
    public Place savePlace(PlaceSaveRequestDto dto) {
        Member member = memberRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        Schedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new IllegalArgumentException("일정 정보를 찾을 수 없습니다."));

        int count = placeRepository.findByScheduleIdAndDayNumberOrderByOrderAsc(dto.getScheduleId(), dto.getDayNumber()).size();

        Place place = Place.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .imageUrl(dto.getImageUrl())
                .member(member)
                .schedule(schedule)
                .dayNumber(dto.getDayNumber())
                .order(count + 1)
                .build();

        return placeRepository.save(place);
    }

    public List<Place> getPlacesByScheduleAndDay(Long scheduleId, int dayNumber, String email) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다."));
        if (!schedule.getMember().getEmail().equals(email)) {
            throw new IllegalArgumentException("본인 일정만 조회할 수 있습니다.");
        }
        return placeRepository.findByScheduleIdAndDayNumberOrderByOrderAsc(scheduleId, dayNumber);
    }

    // 장소 정보 조회(PlacesApi 사용)  Google Place ID
    public PlaceDetails getPlaceDetails(String placeId) throws Exception {
        return PlacesApi.placeDetails(context, placeId).await();
    }

    // 장소 삭제
    @Transactional
    public void deletePlace(Long placeId, String email) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다."));
        
        if (!place.getMember().getEmail().equals(email)) {
            throw new IllegalArgumentException("본인의 장소만 삭제할 수 있습니다.");
        }

        placeRepository.delete(place);
    }

    @Transactional
    public void reorderPlaces(List<PlaceOrderUpdateRequest> orderList) {
        for (PlaceOrderUpdateRequest req : orderList) {
            Place place = placeRepository.findById(req.getId())
                .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다."));
            place.setOrder(req.getOrder());
            // JPA dirty checking으로 자동 저장
        }
    }
}