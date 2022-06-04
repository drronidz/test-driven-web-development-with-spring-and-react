package com.springframework.hoxify.config;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/4/2022 3:10 PM
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Autowired
    AppConfiguration appConfiguration;

    @Bean
    CommandLineRunner createUploadFolder() {
        return args -> {
            createNonExistingFolder(appConfiguration.getUploadPath());
            createNonExistingFolder(appConfiguration.getFullProfileImagePath());
            createNonExistingFolder(appConfiguration.getFullAttachmentsPath());
        };
    }

    private void createNonExistingFolder(String path) {
        File folder = new File(path);
        boolean folderExist = folder.exists() && folder.isDirectory();
        if (!folderExist) {
            folder.mkdir();
        }
    }
}