package com.example.travelserver.controller;

import com.example.travelserver.dto.TravelRequest;
import com.example.travelserver.service.TravelService;
import com.example.travelserver.vo.Result;
import com.example.travelserver.vo.TravelRecommendResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    @Autowired
    private TravelService travelService;

    @PostMapping("/recommend")
    public Result<TravelRecommendResponse> recommend(@RequestBody TravelRequest request) {
        TravelRecommendResponse response = travelService.recommend(request);
        if (Boolean.TRUE.equals(response.getSuccess())) {
            return Result.success("成功", response);
        } else {
            return Result.error(500, response.getMessage());
        }
    }

    @PostMapping(value = "/recommend/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter recommendStream(@RequestBody TravelRequest request) throws JsonProcessingException {
        return travelService.recommendStream(request);
    }
}