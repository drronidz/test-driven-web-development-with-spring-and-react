package com.springframework.hoxify.controller;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 4/29/2022 3:44 PM
*/

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @PostMapping("/api/1.0/users")
    void createUser() {

    }
}
