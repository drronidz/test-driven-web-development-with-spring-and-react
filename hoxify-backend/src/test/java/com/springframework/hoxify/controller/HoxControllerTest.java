package com.springframework.hoxify.controller;

import com.springframework.hoxify.error.ApiError;
import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.repository.UserRepository;
import com.springframework.hoxify.service.UserService;
import com.springframework.hoxify.tools.TestTools;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 1:52 PM
*/

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class HoxControllerTest {

    public static final String API_1_0_HOXES = "/api/1.0/hoxes";
    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Before
    public void cleanup() {
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    private void authenticate(String username) {
        testRestTemplate
                .getRestTemplate()
                .getInterceptors()
                .add(new BasicAuthenticationInterceptor(username, TestTools.TEST_PASSWORD));
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsUnauthorized_receiveUnauthorized() {
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    public void postHOX_whenHOXIsValidAndUserIsUnauthorized_receiveAPIError() {
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<ApiError> responseEntity = postHOX(hox, ApiError.class);
        assertThat(responseEntity.getBody().getStatus())
                .isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    private <T> ResponseEntity<T> postHOX(Hox hox, Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_HOXES, hox, responseType);
    }
}