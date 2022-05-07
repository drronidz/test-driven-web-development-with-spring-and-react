package com.springframework.hoxify.controller;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 5/7/2022 1:13 AM
*/


import com.springframework.hoxify.model.User;
import com.springframework.hoxify.shared.CurrentUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
public class LoginController {

    @PostMapping("/api/1.0/login")
    public Map<String, Object> handleLogin(@CurrentUser User loggedInUser) {
//        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        User loggedInUser = (User) authentication.getPrincipal();
        return Collections.singletonMap("id", loggedInUser.getId());
    }

//    @ExceptionHandler({AccessDeniedException.class})
//    @ResponseStatus(HttpStatus.UNAUTHORIZED)
//    public ApiError handleAccessDeniedException() {
//        return new ApiError(401, "Access error", "/api/1.0/login");
//    }
}
