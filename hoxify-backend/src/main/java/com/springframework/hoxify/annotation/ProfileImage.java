package com.springframework.hoxify.annotation;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/5/2022 1:56 PM
*/

import com.springframework.hoxify.validator.ProfileImageValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ProfileImageValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ProfileImage {
    String message() default "{hoxfiy.constraints.image.ProfileImage.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
