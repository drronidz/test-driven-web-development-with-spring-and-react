package com.springframework.hoxify.shared;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 4/29/2022 5:33 PM
*/

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GenericResponse {

    private String message;
    public GenericResponse(String message) {
        this.message = message;
    }
}
