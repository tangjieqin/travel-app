package com.example.travelserver.service.impl;

import com.example.travelserver.service.ChatService;
import com.example.travelserver.util.LLMUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ChatServiceImpl implements ChatService {

    @Value("${siliconflow.api-url}")
    private String apiUrl;

    @Value("${siliconflow.api-key}")
    private String apiKey;

    @Value("${siliconflow.model}")
    private String model;

    @Override
    public SseEmitter streamChat(String message) throws JsonProcessingException {
        SseEmitter emitter = new SseEmitter(TimeUnit.SECONDS.toMillis(120));

        String prompt = "你是一个专业的AI旅游助手，请根据用户的问题提供详细、实用的旅游建议。用户问题：" + message;

        LLMUtils.callSiliconFlowApiStream(
            apiUrl,
            apiKey,
            model,
            prompt,
            chunk -> {
                try {
                    emitter.send(SseEmitter.event().data(chunk));
                } catch (Exception e) {
                    log.error("发送SSE事件失败", e);
                    emitter.completeWithError(e);
                }
            },
            error -> {
                log.error("流式调用失败", error);
                emitter.completeWithError(error);
            },
            () -> {
                emitter.complete();
                log.info("流式响应完成");
            }
        );

        emitter.onCompletion(() -> log.info("SSE连接完成"));
        emitter.onTimeout(() -> log.warn("SSE连接超时"));
        emitter.onError(e -> log.error("SSE连接错误", e));

        return emitter;
    }
}