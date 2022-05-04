package com.springframework.hoxify.model;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 4/29/2022 3:49 PM
*/

import com.springframework.hoxify.annotation.UniqueUsername;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@Entity
//@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User {

    @Id
    @GeneratedValue
    private long id;

    @NotNull(message = "{hoxify.constraints.username.NotNull.message}")
    @Size(min = 4, max = 255)
    @UniqueUsername
    private String username;

    @NotNull(message = "{hoxify.constraints.displayName.NotNull.message}")
    @Size(min = 4, max = 255)
    private String displayName;

    @NotNull(message = "{hoxify.constraints.password.NotNull.message}")
    @Size(min = 8, max = 255)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoxify.constraints.password.Pattern.message}")
    private String password;

}
