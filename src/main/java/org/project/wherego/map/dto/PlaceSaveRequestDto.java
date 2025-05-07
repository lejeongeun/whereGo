package org.project.wherego.map.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceSaveRequestDto {
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private String description;
    private Long scheduleId;
    private String email;
    private int dayNumber;
    @JsonProperty("imageUrl")
    private String imageUrl;
}
