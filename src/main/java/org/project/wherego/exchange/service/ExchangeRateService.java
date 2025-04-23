package org.project.wherego.exchange.service;

import lombok.RequiredArgsConstructor;

import org.project.wherego.exchange.dto.ConversionResponse;
import org.project.wherego.exchange.dto.ExchangeRateResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;

    @Service
    @RequiredArgsConstructor
    public class ExchangeRateService {
        private final WebClient webClient;
        private final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);
        private static final Set<String> VALID_CURRENCIES = Set.of("USD", "KRW", "EUR", "JPY", "VND");

        public Mono<ExchangeRateResponse> getExchangeRate(String base, String target) {
            logger.info("Fetching exchange rate for base: {}, target: {}", base, target);
            validateCurrency(base, target);

            return webClient.get()
                    .uri(uriBuilder -> uriBuilder // 외부 API 호출
                            .path("/latest")
                            .queryParam("base", base)
                            .queryParam("symbols", target)
                            .build())
                    .retrieve() // API 응답 받아오기
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), // onStatus(조건 검증 람다식, 조건 만족 시 수행할 람다식)
                            response -> {
                                logger.error("API error: {}", response.statusCode());
                                return Mono.error(new RuntimeException("API error: " + response.statusCode()));
                            })
                    .bodyToMono(Map.class)
                    .map(response -> {
                        if (!(Boolean) response.getOrDefault("success", false)) {
                            logger.error("API request failed: {}", response);
                            throw new RuntimeException("API request failed");
                        }
                        Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                        if (rates == null || !rates.containsKey(target)) {
                            logger.error("Target currency not found: {}", target);
                            throw new RuntimeException("Target currency not found: " + target);
                        }
                        double rate = Double.parseDouble(rates.get(target).toString());
                        ExchangeRateResponse exchangeRateResponse = new ExchangeRateResponse(base, target, rate);
                        exchangeRateResponse.setTimestamp((String)response.get("date"));
                        return exchangeRateResponse;
                    })
                    .onErrorMap(ex -> {
                        logger.error("Failed to fetch exchange rate: {}", ex.getMessage());
                        return new RuntimeException("Failed to fetch exchange rate: " + ex.getMessage(), ex);
                    });
        }

        public Mono<ConversionResponse> convertAmount(String from, String to, Double amount) {
            logger.info("Converting amount: {} from {} to {}", amount, from, to);
            validateCurrency(from, to);
            if (amount <= 0) {
                throw new IllegalArgumentException("Amount must be positive");
            }

            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/convert")
                            .queryParam("from", from)
                            .queryParam("to", to)
                            .queryParam("amount", amount)
                            .build())
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            response -> {
                                logger.error("API error: {}", response.statusCode());
                                return Mono.error(new RuntimeException("API error: " + response.statusCode()));
                            })
                    .bodyToMono(Map.class)
                    .map(response -> {
                        if (!(Boolean) response.getOrDefault("success", false)) {
                            logger.error("API request failed: {}", response);
                            throw new RuntimeException("API request failed");
                        }
                        Object resultObj = response.get("result");
                        if (resultObj == null) {
                            logger.error("Result not found in API response: {}", response);
                            throw new RuntimeException("Result not found in API response");
                        }
                        double result = Double.parseDouble(resultObj.toString());
                        ConversionResponse conversionResponse = new ConversionResponse(from, to, amount, result);
                        conversionResponse.setDate((String) response.get("date"));
                        return conversionResponse;
                    })
                    .onErrorMap(ex -> {
                        logger.error("Failed to convert amount: {}", ex.getMessage());
                        return new RuntimeException("Failed to convert amount: " + ex.getMessage(), ex);
                    });
        }

        private void validateCurrency(String base, String target) {
            if (!VALID_CURRENCIES.contains(base) || !VALID_CURRENCIES.contains(target)) {
                throw new IllegalArgumentException("Invalid currency code: " + base + " or " + target);
            }
        }
}