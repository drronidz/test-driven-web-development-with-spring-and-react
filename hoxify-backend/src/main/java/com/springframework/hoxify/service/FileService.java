package com.springframework.hoxify.service;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/4/2022 5:17 PM
*/

import com.springframework.hoxify.config.AppConfiguration;
import com.springframework.hoxify.model.FileAttachment;
import com.springframework.hoxify.repository.FileAttachmentRepository;
import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Service
public class FileService {

    private final AppConfiguration appConfiguration;
    private final FileAttachmentRepository fileAttachmentRepository;

    private final Tika tika;

    public FileService(AppConfiguration appConfiguration,
                       FileAttachmentRepository fileAttachmentRepository) {
        this.appConfiguration = appConfiguration;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.tika = new Tika();
    }

    public String detectType(byte[] fileArray) {
        return tika.detect(fileArray);
    }


    public String saveProfileImage(String base64Image) throws IOException {
        String imageName = getRandomName();

        byte[] decodedBytes = Base64
                .getDecoder()
                .decode(base64Image);

        File target = new File(appConfiguration
                .getFullProfileImagesPath() + "/" + imageName);

        FileUtils.writeByteArrayToFile(target, decodedBytes);

        return imageName;
    }

    public String getType(byte[] fileArray) {
        return tika.detect(fileArray);
    }

    public void deleteExistingProfileImage(String image) throws IOException {
        Files.deleteIfExists(Paths.get(appConfiguration
                .getFullProfileImagesPath() + "/" + image));
    }

    public FileAttachment saveAttachment(MultipartFile file) throws IOException {
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setDate(new Date());

        String randomName = getRandomName();

        fileAttachment.setName(randomName);

        File targetFile =
                new File(appConfiguration
                        .getFullAttachmentsPath() + "/" + randomName);

        byte[] fileAsByte = file.getBytes();

        FileUtils.writeByteArrayToFile(targetFile, fileAsByte);
        fileAttachment.setFileType(detectType(fileAsByte));

        return fileAttachmentRepository.save(fileAttachment);
    }

    private String getRandomName() {
        return UUID
                .randomUUID()
                .toString()
                .replaceAll("-", "");
    }
}
