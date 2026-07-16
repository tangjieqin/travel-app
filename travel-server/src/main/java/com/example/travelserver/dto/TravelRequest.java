package com.example.travelserver.dto;

import lombok.Data;

@Data
public class TravelRequest {
    private String city;
    private Integer budget;
    private Integer days;
}