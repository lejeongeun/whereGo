package org.project.wherego.checklist.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckListDto {
    private Long id;
    private String itemName;
    private Boolean isChecked;
    private Long userId;


}
