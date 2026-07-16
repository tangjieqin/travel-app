package com.example.travelserver.service;

import com.example.travelserver.dto.TravelRequest;
import com.example.travelserver.vo.TravelRecommendResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface TravelService {
    TravelRecommendResponse recommend(TravelRequest request);
    
    SseEmitter recommendStream(TravelRequest request) throws JsonProcessingException;
}