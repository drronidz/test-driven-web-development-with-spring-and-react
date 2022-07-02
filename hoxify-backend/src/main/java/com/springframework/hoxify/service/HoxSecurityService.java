package com.springframework.hoxify.service;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 7/2/2022 6:03 PM
*/

import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.repository.HoxRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HoxSecurityService {

    private final HoxRepository hoxRepository;

    public HoxSecurityService(HoxRepository hoxRepository) {
        this.hoxRepository = hoxRepository;
    }

    public boolean isAllowedToDelete(long hoxId, User loggedInUser) {
        Optional<Hox> optionalHox = hoxRepository.findById(hoxId);
        if (optionalHox.isPresent()) {
            Hox hoxInDB = optionalHox.get();
            return hoxInDB.getUser().getId() == loggedInUser.getId();
        }
        return false;
    }
}
