package com.springframework.hoxify.validator;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 5/5/2022 1:09 AM
*/

import com.springframework.hoxify.annotation.UniqueUsername;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    @Autowired
    UserRepository userRepository;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        User userInDB = userRepository.findByUsername(value);
        return userInDB == null;
    }
}
