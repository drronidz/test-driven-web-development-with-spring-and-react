package com.springframework.hoxify.controller;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 5/7/2022 1:13 AM
*/


import com.fasterxml.jackson.annotation.JsonView;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.shared.CurrentUser;
import com.springframework.hoxify.view.Views;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @PostMapping("/api/1.0/login")
    @JsonView(Views.Base.class)
    public User handleLogin(@CurrentUser User loggedInUser) {
//        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        User loggedInUser = (User) authentication.getPrincipal();
//        Map<String, Object> userMap = new HashMap<>();
//        userMap.put("id", loggedInUser.getId());
//        userMap.put("image", loggedInUser.getImage());
//        userMap.put("displayName", loggedInUser.getDisplayName());
        return loggedInUser;
    }

//    @ExceptionHandler({AccessDeniedException.class})
//    @ResponseStatus(HttpStatus.UNAUTHORIZED)
//    public ApiError handleAccessDeniedException() {
//        return new ApiError(401, "Access error", "/api/1.0/login");
//    }
}
