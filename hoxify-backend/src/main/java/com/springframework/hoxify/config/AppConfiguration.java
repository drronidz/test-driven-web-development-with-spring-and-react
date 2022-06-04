package com.springframework.hoxify.config;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/4/2022 3:23 PM
*/

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "hoaxify")
@Data
public class AppConfiguration {
    private String uploadPath;
    private String profileImageFolder = "profile";
    private String attachmentsFolder = "attachments";

    public String getFullProfileImagePath() {
        return this.uploadPath +  "/" + this.profileImageFolder;
    }

    public String getFullAttachmentsPath() {
        return this.uploadPath + "/" + this.attachmentsFolder;
    }
}
