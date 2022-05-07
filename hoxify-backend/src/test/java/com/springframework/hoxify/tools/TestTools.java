package com.springframework.hoxify.tools;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 5/7/2022 3:45 PM
*/

import com.springframework.hoxify.model.User;

public class TestTools {

    public static final String TEST_USERNAME = "test-username";
    public static final String TEST_PASSWORD = "PAssword12";

    public static User createValidUser() {
        User user = new User();
        user.setUsername("test-username");
        user.setDisplayName("test-display-name");
        user.setPassword("PAssword12");
        return user;
    }
}
