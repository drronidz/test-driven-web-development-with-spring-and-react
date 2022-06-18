package com.springframework.hoxify.repository;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 2:27 PM
*/

import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoxRepository extends JpaRepository <Hox, Long> {
    Page<Hox> findByUser(User user, Pageable pageable);
    Page<Hox> findByIdLessThan(long id, Pageable pageable);
    List<Hox> findByIdGreaterThan(long id, Sort sort);
    Page<Hox> findByIdLessThanAndUser(long id, User user, Pageable pageable);
    List<Hox> findByIdGreaterThanAndUser(long id, User user, Sort sort);
    long countByIdGreaterThan(long id);
    long countByIdGreaterThanAndUser(long id, User user);
//    Page<Hox> findByUserUsername(String username, Pageable pageable);
}
