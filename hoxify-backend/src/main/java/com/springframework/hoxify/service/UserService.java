package com.springframework.hoxify.service;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 4/29/2022 4:15 PM
*/

import com.springframework.hoxify.error.NotFoundException;
import com.springframework.hoxify.exception.DuplicateUsernameException;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.repository.UserRepository;
import com.springframework.hoxify.view.UserUpdateVM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User save (User user) {
        // Checking if we have user in Database with this username ...
        User userInDB = userRepository.findByUsername(user.getUsername());

        if (userInDB != null) {
            throw new DuplicateUsernameException();
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Page<User> getUsers(User loggedInUser, Pageable pageable) {
        if (loggedInUser != null) {
            return userRepository.findByUsernameNot(loggedInUser.getUsername(), pageable);
        }
        return userRepository.findAll(pageable);
    }

    public User getByUsername(String username) {
        User inDB = userRepository.findByUsername(username);
        if (inDB == null) {
            throw new NotFoundException(username);
        }
        return inDB;
    }

    public User update(long id, UserUpdateVM userUpdateVM) {
        User userInDB = userRepository.getOne(id);
        userInDB.setDisplayName(userUpdateVM.getDisplayName());
        String savedImageName = userInDB.getUsername() + UUID.randomUUID().toString().replaceAll("-","");
        userInDB.setImage(savedImageName);
        return userRepository.save(userInDB);
    }
}
