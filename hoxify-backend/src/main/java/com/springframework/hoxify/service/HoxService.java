package com.springframework.hoxify.service;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 2:34 PM
*/

import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.repository.HoxRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@Service
@RequestMapping("/api/1.0")
public class HoxService {

    private final HoxRepository hoxRepository;
    private final UserService userService;

    public HoxService(HoxRepository hoxRepository, UserService userService) {
        this.hoxRepository = hoxRepository;
        this.userService = userService;
    }

//    public void save(Hox hox) {
//        hox.setTimestamp(new Date());
//        hoxRepository.save(hox);
//    }

    public Hox save(User user, Hox hox) {
        hox.setTimestamp(new Date());
        hox.setUser(user);
        return hoxRepository.save(hox);
    }

    public Page<Hox> getAllHoxes(Pageable pageable) {
        return hoxRepository.findAll(pageable);
    }

    public Page<Hox> getHoxesOfUser(String username, Pageable pageable) {
        User userInDB = userService.getByUsername(username);
        return hoxRepository.findByUser(userInDB, pageable);
    }

    public Page<Hox> getOldHoxes(long id, Pageable pageable) {
        return hoxRepository.findByIdLessThan(id, pageable);
    }
}
