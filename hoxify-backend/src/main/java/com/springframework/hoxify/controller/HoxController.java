package com.springframework.hoxify.controller;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 1:52 PM
*/

import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.service.HoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/1.0")
public class HoxController {

    public final HoxService hoxService;

    public HoxController(HoxService hoxService) {
        this.hoxService = hoxService;
    }

    @PostMapping("/hoxes")
    public void createHOX(@RequestBody Hox hox) {
        hoxService.save(hox);
    }
}
