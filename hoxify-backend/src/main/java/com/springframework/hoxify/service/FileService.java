package com.springframework.hoxify.service;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/4/2022 5:17 PM
*/

import com.springframework.hoxify.config.AppConfiguration;
import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class FileService {

    private final AppConfiguration appConfiguration;

    private final Tika tika;

    public FileService(AppConfiguration appConfiguration) {
        this.appConfiguration = appConfiguration;
        this.tika = new Tika();
    }

    public String saveProfileImage(String base64Image) throws IOException {
        String imageName = UUID.randomUUID().toString().replaceAll("-","");
        byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
        File target = new File(appConfiguration.getFullProfileImagesPath() + "/" + imageName);
        FileUtils.writeByteArrayToFile(target, decodedBytes);
        return imageName;
    }

    public String getType(byte[] fileArray) {
        return tika.detect(fileArray);
    }
}
