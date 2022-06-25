package com.springframework.hoxify.controller;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/24/2022 5:15 PM
*/

import com.springframework.hoxify.model.FileAttachment;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/1.0")
public class FileUploadController {

    @PostMapping("/hoxes/upload")
    public FileAttachment uploadFileHox() {
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setDate(new Date());
        String randomName =
                UUID.randomUUID().toString().replaceAll("-","");
        fileAttachment.setName(randomName);
        return fileAttachment;
    }
}
