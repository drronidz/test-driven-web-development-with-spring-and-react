package com.springframework.hoxify.view;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 5/21/2022 3:26 PM
*/

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class UserUpdateVM {

    @NotNull
    @Size(min = 4, max = 255)
    private String displayName;
    private String image;
}
