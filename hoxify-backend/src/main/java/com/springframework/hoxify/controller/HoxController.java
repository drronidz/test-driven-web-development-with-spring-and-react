package com.springframework.hoxify.controller;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 1:52 PM
*/

import com.springframework.hoxify.error.ApiError;
import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.service.HoxService;
import com.springframework.hoxify.shared.CurrentUser;
import com.springframework.hoxify.view.HoxVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/1.0")
public class HoxController {

    public final HoxService hoxService;

    public HoxController(HoxService hoxService) {
        this.hoxService = hoxService;
    }

    @PostMapping("/hoxes")
    public HoxVM createHOX(@Valid @RequestBody Hox hox, @CurrentUser User user) {
        return new HoxVM(hoxService.save(user, hox));
    }

    @GetMapping("/hoxes")
    public Page<HoxVM> getAllHoxes(Pageable pageable) {
        return hoxService.getAllHoxes(pageable).map(HoxVM::new);
    }

    @GetMapping("/users/{username}/hoxes")
    public Page<HoxVM> getHoxesOfUser(@PathVariable String username, Pageable pageable) {
        return hoxService.getHoxesOfUser(username, pageable).map(HoxVM::new);
    }
}
