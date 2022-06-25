package com.springframework.hoxify.controller;

import com.springframework.hoxify.config.AppConfiguration;
import com.springframework.hoxify.model.FileAttachment;
import com.springframework.hoxify.repository.FileAttachmentRepository;
import com.springframework.hoxify.repository.UserRepository;
import com.springframework.hoxify.service.UserService;
import com.springframework.hoxify.tools.TestTools;
import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.File;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/24/2022 5:15 PM
*/

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class FileUploadControllerTest {

    private static final String API_1_0_HOXES_UPLOAD = "/api/1.0/hoxes/upload";

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FileAttachmentRepository fileAttachmentRepository;

    @Autowired
    UserService userService;

    @Autowired
    AppConfiguration appConfiguration;

    @Before
    public void init() throws IOException {
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }

    private void authenticate(String username) {
        testRestTemplate
                .getRestTemplate()
                .getInterceptors()
                .add(new BasicAuthenticationInterceptor(username, TestTools.TEST_PASSWORD));
    }

    private HttpEntity<MultiValueMap<String, Object>> getRequestEntity() {
        ClassPathResource imageResource = new ClassPathResource("profile.png");

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("file", imageResource);

        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, httpHeaders);

        return requestEntity;
    }

    public <T> ResponseEntity<T> uploadFile(HttpEntity<?> requestEntity, Class<T> responseType) {
        return testRestTemplate
                .exchange(API_1_0_HOXES_UPLOAD, HttpMethod.POST, requestEntity, responseType);
    }

    @Test
    public void uploadFile_withImageFromAuthorizedUser_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        ResponseEntity<Object> response = uploadFile(getRequestEntity(), Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void uploadFile_withImageFromUnauthorizedUser_receiveUnauthorized() {
        ResponseEntity<Object> response = uploadFile(getRequestEntity(), Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void uploadFile_withImageFromAuthorizedUser_receiveFileAttachmentWithDate() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        ResponseEntity<FileAttachment> response =
                uploadFile(getRequestEntity(), FileAttachment.class);
        assertThat(response.getBody().getDate()).isNotNull();
    }

    @Test
    public void uploadFile_withImageFromAuthorizedUser_receiveFileAttachmentWithRandomName() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        ResponseEntity<FileAttachment> response =
                uploadFile(getRequestEntity(), FileAttachment.class);
        assertThat(response.getBody().getName()).isNotNull();
        assertThat(response.getBody().getName()).isNotEqualTo("profile.png");
    }

    @Test
    public void uploadFile_withImageFromAuthorizedUser_imageSavedToFolder() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        ResponseEntity<FileAttachment> response =
                uploadFile(getRequestEntity(), FileAttachment.class);
        String imagePath =
                appConfiguration.getFullAttachmentsPath() + "/" + response.getBody().getName();
        File storedImage = new File(imagePath);
        assertThat(storedImage.exists()).isTrue();
    }

    @Test
    public void uploadFile_withImageFromAuthorizedUser_fileAttachmentSaveToDB() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        uploadFile(getRequestEntity(), FileAttachment.class);
        assertThat(fileAttachmentRepository.count()).isEqualTo(1);
    }

    @Test
    public void uploadFile_withImageFromAuthorizedUser_fileAttachmentStoredWithFileType() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        uploadFile(getRequestEntity(), FileAttachment.class);
        FileAttachment storedFile = fileAttachmentRepository.findAll().get(0);
        assertThat(storedFile.getFileType()).isEqualTo("image/jpeg");
    }
}