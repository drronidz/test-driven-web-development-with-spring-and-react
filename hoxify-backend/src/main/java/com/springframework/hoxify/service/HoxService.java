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
import net.bytebuddy.asm.Advice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@Service
@RequestMapping("/api/1.0")
public class HoxService {

    private final HoxRepository hoxRepository;

    public HoxService(HoxRepository hoxRepository) {
        this.hoxRepository = hoxRepository;
    }

//    public void save(Hox hox) {
//        hox.setTimestamp(new Date());
//        hoxRepository.save(hox);
//    }

    public void save(User user, Hox hox) {
        hox.setTimestamp(new Date());
        hox.setUser(user);
        hoxRepository.save(hox);
    }
}
