package com.example.travelserver.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class LLMUtils {

    private static final HttpClient httpClient = HttpClient.newHttpClient();
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String callSiliconFlowApi(String apiUrl, String apiKey, String model, String prompt) throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(
            Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("temperature", 0.7);

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(apiUrl))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + apiKey)
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .timeout(Duration.ofSeconds(60))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("API调用失败，状态码: " + response.statusCode() + ", 响应: " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        String content = root.path("choices").get(0).path("message").path("content").asText();
        log.debug("收到响应: {}", content);
        return content;
    }

    public static JsonNode parseJson(String jsonString) throws Exception {
        return objectMapper.readTree(jsonString);
    }

    public static <T> T convertJsonToObject(JsonNode node, Class<T> clazz) throws Exception {
        return objectMapper.treeToValue(node, clazz);
    }

    public static <T> List<T> convertJsonToList(JsonNode node, Class<T> clazz) throws Exception {
        return objectMapper.convertValue(
            node,
            objectMapper.getTypeFactory().constructCollectionType(List.class, clazz)
        );
    }

    public static void callSiliconFlowApiStream(String apiUrl, String apiKey, String model, String prompt, 
                                                java.util.function.Consumer<String> onChunk,
                                                java.util.function.Consumer<Throwable> onError,
                                                Runnable onComplete) throws JsonProcessingException {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(
            Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("temperature", 0.7);
        requestBody.put("stream", true);

        String jsonBody = objectMapper.writeValueAsString(requestBody);
        log.debug("发送流式请求: {}", jsonBody);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(apiUrl))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + apiKey)
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .timeout(Duration.ofSeconds(120))
            .build();

        httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofLines())
            .thenApply(HttpResponse::body)
            .thenAccept(lines -> {
                try {
                    java.util.concurrent.atomic.AtomicBoolean done = new java.util.concurrent.atomic.AtomicBoolean(false);
                    lines.forEach(line -> {
                        if (done.get()) {
                            return;
                        }
                        if (line.isEmpty()) {
                            return;
                        }
                        if (line.startsWith("data: ")) {
                            String data = line.substring(6);
                            if ("[DONE]".equals(data)) {
                                done.set(true);
                                return;
                            }
                            try {
                                JsonNode root = objectMapper.readTree(data);
                                String chunk = root.path("choices").get(0).path("delta").path("content").asText();
                                if (chunk != null && !chunk.isEmpty() && onChunk != null) {
                                    onChunk.accept(chunk);
                                }
                            } catch (Exception e) {
                                log.warn("解析SSE数据失败: {}", line);
                            }
                        }
                    });
                    if (onComplete != null) {
                        onComplete.run();
                    }
                } catch (Exception e) {
                    if (onError != null) {
                        onError.accept(e);
                    }
                }
            })
            .exceptionally(e -> {
                if (onError != null) {
                    onError.accept(e);
                }
                return null;
            });
    }
}