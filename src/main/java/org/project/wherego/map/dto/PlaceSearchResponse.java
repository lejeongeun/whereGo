package org.project.wherego.map.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaceSearchResponse {
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private double rating; // 평점 추가
    private String email;
}