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
import com.springframework.hoxify.shared.GenericResponse;
import com.springframework.hoxify.view.HoxVM;
import com.sun.org.apache.regexp.internal.RE;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @GetMapping({"/hoxes/{id:[0-9]+}", "/users/{username}/hoxes/{id:[0-9]+}"})
    public ResponseEntity<?>
    getHoxesRelative(@PathVariable long id,
                     @PathVariable(required = false) String username,
                     Pageable pageable,
                     @RequestParam(name="direction", defaultValue = "after")
                             String direction,
                     @RequestParam(name="count", defaultValue = "false", required = false)
                             boolean count) {
//        if (!direction.equalsIgnoreCase("after")) {
//            return ResponseEntity.ok(hoxService.getOldHoxes(id, pageable).map(HoxVM::new));
//        }
//        else {
//            List<HoxVM> newHoxes = hoxService.getNewHoxes(id, pageable)
//                    .stream()
//                    .map(HoxVM::new)
//                    .collect(Collectors.toList());
//            return ResponseEntity.ok(newHoxes);
//        }

        if (count == true) {
            long newHoxCount = hoxService.getNewHoxesCount(id, username);
            return ResponseEntity.ok(Collections.singletonMap("count", newHoxCount));
        }


        return (!direction.equalsIgnoreCase("after")
                ? ResponseEntity.ok(hoxService.getOldHoxes(id, username, pageable).map(HoxVM::new))
                : ResponseEntity.ok(
                hoxService.getNewHoxes(id, username, pageable)
                        .stream()
                        .map(HoxVM::new)
                        .collect(Collectors.toList())
        ));
    }

    @DeleteMapping("/hoxes/{id:[0-9]+}")
    @PreAuthorize("@hoxSecurityService.isAllowedToDelete(#id, principal)")
    GenericResponse deleteHox(@PathVariable long id) {
        hoxService.deleteHox(id);
        return new GenericResponse("Hox is removed");
    }

//    @GetMapping("/users/{username}/hoxes/{id:[0-9]+}")
//    public ResponseEntity<?>
//    getHoxesRelativeToUser(
//            @PathVariable
//                    String username,
//            @PathVariable
//                    long id,
//            Pageable pageable,
//            @RequestParam(name="direction", defaultValue = "after")
//                    String direction,
//            @RequestParam(name="count", defaultValue = "false", required = false)
//                    boolean count) {
////        if (!direction.equalsIgnoreCase("after")) {
////            return ResponseEntity.ok(hoxService.getOldHoxesOfUser(id, username, pageable).map(HoxVM::new));
////        }
////        else {
////            List<HoxVM> newHoxes = hoxService.getNewHoxesOfUser(id, username, pageable)
////                    .stream()
////                    .map(HoxVM::new)
////                    .collect(Collectors.toList());
////            return ResponseEntity.ok(newHoxes);
////        }
//
//        if (count == true) {
//            long newHoxCount = hoxService.getNewHoxesCountOfUser(id, username);
//            return ResponseEntity.ok(Collections.singletonMap("count",newHoxCount));
//        }
//
//        return (!direction.equalsIgnoreCase("after")
//                ? ResponseEntity.ok(hoxService.getOldHoxesOfUser(id, username, pageable).map(HoxVM::new))
//                : ResponseEntity.ok(hoxService.getNewHoxesOfUser(id, username, pageable)
//                .stream()
//                .map(HoxVM::new)
//                .collect(Collectors.toList()))
//        );
//
//    }
}
