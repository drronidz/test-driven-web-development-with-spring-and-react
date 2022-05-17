package com.springframework.hoxify;

import com.springframework.hoxify.model.User;
import com.springframework.hoxify.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import java.util.stream.IntStream;

@SpringBootApplication
public class HoxifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(HoxifyApplication.class, args);
    }

    @Bean
    @Profile("!test")
    CommandLineRunner run(UserService userService) {
        return (args -> {
            IntStream.rangeClosed(1, 15)
                    .mapToObj(i -> {
                User user = new User();
                user.setUsername("user" + i);
                user.setDisplayName("display" + i);
                user.setPassword("AZerty" + i + "" + (i+1));
                return user;
            }).forEach(userService::save);
        });
    }
}
