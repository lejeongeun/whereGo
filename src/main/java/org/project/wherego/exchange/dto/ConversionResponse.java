package org.project.wherego.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConversionResponse { // 금액 변환 API의 응답데이터를 저장
    private String from;
    private String to;
    private Double amount;
    private Double result;
    private String date;

    public ConversionResponse(String from, String to, Double amount, Double result) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.result = result;
    }
}
