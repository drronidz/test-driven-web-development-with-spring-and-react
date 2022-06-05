package com.springframework.hoxify.service;

import com.springframework.hoxify.config.AppConfiguration;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/5/2022 12:40 AM
*/

@RunWith(SpringRunner.class)
@ActiveProfiles("test")
public class FileServiceTest {
    FileService fileService;

    AppConfiguration appConfiguration;

    @Before
    public void init() {
        appConfiguration = new AppConfiguration();
        appConfiguration.setUploadPath("uploads-test");

        fileService = new FileService(appConfiguration);

        new File(appConfiguration.getUploadPath()).mkdir();
        new File(appConfiguration.getFullProfileImagesPath()).mkdir();
        new File(appConfiguration.getFullAttachmentsPath()).mkdir();
    }

    @Test
    public void getType_whenPngFileProvided_returnsImagePng() throws IOException {
        ClassPathResource resourceFile = new ClassPathResource("test-png.png");
        byte[] fileArray = FileUtils.readFileToByteArray(resourceFile.getFile());
        String fileType = fileService.getType(fileArray);
        assertThat(fileType).isEqualToIgnoringCase("image/png");
    }

    @Test
    public void getType_whenJPGFileProvided_returnsImageJPG() throws IOException {
        ClassPathResource resourceFile = new ClassPathResource("test-jpg.jpg");
        byte[] fileArray = FileUtils.readFileToByteArray(resourceFile.getFile());
        String fileType = fileService.getType(fileArray);
        assertThat(fileType).isEqualToIgnoringCase("image/jpeg");
    }

    @After
    public void cleanup() throws IOException {
        FileUtils.cleanDirectory(new File(appConfiguration.getFullProfileImagesPath()));
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }
}