package com.springframework.hoxify.repository;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 4/29/2022 4:13 PM
*/

import com.springframework.hoxify.model.User;
import com.springframework.hoxify.projection.UserProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    @Query(value = "SELECT * FROM USER", nativeQuery = true)
    Page<UserProjection> getAllUsersProjection(Pageable pageable);
}
