package com.springframework.hoxify.service;

import com.springframework.hoxify.config.AppConfiguration;
import com.springframework.hoxify.model.FileAttachment;
import com.springframework.hoxify.repository.FileAttachmentRepository;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;

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

    @MockBean
    FileAttachmentRepository fileAttachmentRepository;

    @Before
    public void init() {
        appConfiguration = new AppConfiguration();
        appConfiguration.setUploadPath("uploads-test");

        fileService = new FileService(appConfiguration, fileAttachmentRepository);

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

    @Test
    public void cleanupStorage_whenOldFilesExist_removesFilesFromStorage() throws IOException {
        String fileName = "random-file";
        String filePath = appConfiguration.getFullAttachmentsPath() + "/" + fileName;

        File source = new ClassPathResource("profile.png").getFile();
        File target = new File(filePath);
        FileUtils.copyFile(source, target);

        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setId(5);
        fileAttachment.setName(fileName);

        Mockito
                .when(fileAttachmentRepository
                        .findByDateBeforeAndHoxIsNull(Mockito.any(Date.class)))
                .thenReturn(Arrays.asList(fileAttachment));

        fileService.cleanupStorage();
        File storedImage = new File(filePath);

        assertThat(storedImage.exists()).isFalse();
    }

    @Test
    public void cleanupStorage_whenOldFilesExist_removesFilesFromDB() throws IOException {
        String fileName = "random-file";
        String filePath = appConfiguration.getFullAttachmentsPath() + "/" + fileName;

        File source = new ClassPathResource("profile.png").getFile();
        File target = new File(filePath);
        FileUtils.copyFile(source, target);

        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setId(5);
        fileAttachment.setName(fileName);

        Mockito
                .when(fileAttachmentRepository
                        .findByDateBeforeAndHoxIsNull(Mockito.any(Date.class)))
                .thenReturn(Arrays.asList(fileAttachment));

        fileService.cleanupStorage();

        Mockito.verify(fileAttachmentRepository).deleteById(5L);
    }

    @After
    public void cleanup() throws IOException {
        FileUtils.cleanDirectory(new File(appConfiguration.getFullProfileImagesPath()));
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }
}