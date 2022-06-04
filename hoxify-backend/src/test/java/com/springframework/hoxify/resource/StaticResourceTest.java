package com.springframework.hoxify.resource;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/4/2022 3:06 PM
*/

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StaticResourceTest {

    @Test
    public void checkStaticFolder_whenAppIsInitialized_uploadFolderMustExist() {
        File uploadFolder = new File("uploads-test");
        boolean uploadFolderExist = uploadFolder.exists() && uploadFolder.isDirectory();
        assertThat(uploadFolderExist).isTrue();
    }
}
