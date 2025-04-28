package org.project.wherego.exchange.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.project.wherego.exchange.dto.ConversionResponse;
import org.project.wherego.exchange.dto.ExchangeRateResponse;
import org.project.wherego.exchange.dto.ListResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

    @Service
    @RequiredArgsConstructor
    public class ExchangeRateService {
        private final WebClient webClient;
        private final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);
        private Set<String> validCurrencies = Set.of("USD", "EUR", "KRW", "JPY", "VND");

        @Value("${exchangerate.api.key}")
        private String apiKey;

        @PostConstruct
        public void init() {
            getSupportedCurrencies()
                    .blockOptional()
                    .filter(currencies -> !currencies.isEmpty())
                    .ifPresentOrElse(
                            currencies -> {
                                validCurrencies = (Set<String>) currencies;
                                logger.info("Currencies: {}", currencies);
                            },
                            () -> logger.warn("Using default currencies: {}", validCurrencies)
                    );
        }

        private Mono<Set<?>> getSupportedCurrencies() {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/list")
                            .queryParam("access_key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(ListResponse.class) // API 응답 JSON -> ListResponse 객체 변환 -> Mono<ListResponse>
                    .map(response -> {
                        if (!response.isSuccess()) {
                            throw new RuntimeException("API error");
                        }
                        return response.getCurrencies() != null
                                ? Set.copyOf(response.getCurrencies().keySet())
                                : Set.of();
                    })
                    .onErrorResume(e -> {
                        logger.error("Fetch currencies failed: {}", e.getMessage());
                        return Mono.just(Set.<String>of());
                    });
        }


        public Mono<ExchangeRateResponse> getExchangeRate(String base, String target) {
            logger.info("Fetching exchange rate for base: {}, target: {}", base, target);
            validateCurrency(base, target);

            return webClient.get()
                    .uri(uriBuilder -> uriBuilder // 외부 API 호출
                            .path("/live")
                            .queryParam("source", base)
                            .queryParam("currencies", target)
                            .queryParam("access_key", apiKey)
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
                            Map<String, Object> error = (Map<String, Object>) response.get("error");
                            String errorMsg = error != null ? error.toString() : "Unknown error";
                            logger.error("API request failed: {}", response);
                            throw new RuntimeException("API request failed" + errorMsg);
                        }
                        Map<String, Object> quotes = (Map<String, Object>) response.get("quotes");
                        String quoteKey = base + target;
                        if (quotes == null || !quotes.containsKey(quoteKey)) {
                            logger.error("Target currency not found: {}", target);
                            throw new RuntimeException("Target currency not found: " + target);
                        }
                        double rate = Double.parseDouble(quotes.get(quoteKey).toString());
                        ExchangeRateResponse exchangeRateResponse = new ExchangeRateResponse(base, target, rate);
                        Object timestampObj = response.get("timestamp");
                        String timestamp = timestampObj != null ? timestampObj.toString() : "Unknown timestamp";
                        exchangeRateResponse.setTimestamp(timestamp);
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
                            .queryParam("access_key", apiKey)
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
            if (!validCurrencies.contains(base) || !validCurrencies.contains(target)) {
                throw new IllegalArgumentException("Invalid currency code: " + base + " or " + target);
            }
        }
}