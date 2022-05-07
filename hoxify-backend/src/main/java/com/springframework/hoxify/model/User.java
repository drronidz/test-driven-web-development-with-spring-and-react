package com.springframework.hoxify.model;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 4/29/2022 3:49 PM
*/

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.springframework.hoxify.annotation.UniqueUsername;
import com.springframework.hoxify.security.CustomAuthorityDeserializer;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Collection;

@Data
@Entity
//@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User implements UserDetails {

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

    @Override
    @JsonDeserialize(using = CustomAuthorityDeserializer.class)
    @Transient
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return AuthorityUtils.createAuthorityList("Role_USER");
    }

    @Override
    @Transient
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @Transient
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @Transient
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @Transient
    public boolean isEnabled() {
        return true;
    }
}
