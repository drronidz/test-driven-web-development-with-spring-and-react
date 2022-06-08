package com.springframework.hoxify.controller;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 1:52 PM
*/

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/1.0")
public class HoxController {

    @PostMapping("/hoxes")
    public void createHOX() {

    }
}
