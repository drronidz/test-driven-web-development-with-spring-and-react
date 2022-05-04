package com.springframework.hoxify.repository;

import com.springframework.hoxify.model.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 5/5/2022 12:47 AM
*/

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    TestEntityManager testEntityManager;

    @Autowired
    UserRepository userRepository;

    // Creating a Valid User
    private User createValidUser() {
        User user = new User();
        user.setUsername("test-username");
        user.setDisplayName("test-display-name");
        user.setPassword("PAssword12");
        return user;
    }

    @Test
    public void findByUsername_whenUserExists_returnsUser() {
        testEntityManager.persist(createValidUser());
        User userInDB = userRepository.findByUsername("test-username");
        assertThat(userInDB).isNotNull();
    }

    @Test
    public void findByUsername_whenUserExists_returnsNull() {
        User userInDB = userRepository.findByUsername("non-existing-username");
        assertThat(userInDB).isNull();
    }

}