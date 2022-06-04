package com.springframework.hoxify.config;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/4/2022 3:10 PM
*/

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Bean
    CommandLineRunner createUploadFolder() {
        return args -> {
            File uploadFolder = new File("uploads-test");
            boolean uploadFolderExist = uploadFolder.exists() && uploadFolder.isDirectory();
            if (!uploadFolderExist) {
                uploadFolder.mkdir();
            }
        };
    }
}
