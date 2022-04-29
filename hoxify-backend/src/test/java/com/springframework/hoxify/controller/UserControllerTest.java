package com.springframework.hoxify.controller;

import com.springframework.hoxify.model.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 4/29/2022 3:44 PM
*/

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    TestRestTemplate testRestTemplate;


    @Test
    public void postUser_whenUserIsValid_receiveOk() {
        User user = new User();
        user.setUsername("test-user");
        user.setDisplayName("test-display");
        user.setPassword("PAssword");

        ResponseEntity<Object> response = testRestTemplate.postForEntity("/api/1.0/users", user, Object.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}