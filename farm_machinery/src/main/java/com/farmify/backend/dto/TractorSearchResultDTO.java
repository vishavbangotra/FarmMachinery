package com.farmify.backend.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class TractorSearchResultDTO {
    @NotNull(message = "is4x4 is required")
    private Boolean is4x4;
    @NotNull(message = "Horsepower is required")
    private int horsePower;
}
