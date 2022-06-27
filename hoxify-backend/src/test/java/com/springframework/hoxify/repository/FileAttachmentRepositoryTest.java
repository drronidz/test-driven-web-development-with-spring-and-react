package com.springframework.hoxify.repository;

import com.springframework.hoxify.model.FileAttachment;
import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.tools.TestTools;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/26/2022 3:29 PM
*/

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class FileAttachmentRepositoryTest {

    @Autowired
    TestEntityManager testEntityManager;

    @Autowired
    FileAttachmentRepository fileAttachmentRepository;

    @Test
    public void findByDateBeforeAndHoxIsNull_whenAttachmentDateOlderThanOneHour_returnsAll() {
        testEntityManager.persist(getOneHourOldFileAttachment());
        testEntityManager.persist(getOneHourOldFileAttachment());
        testEntityManager.persist(getOneHourOldFileAttachment());

        Date oneHourAgo = new Date(System.currentTimeMillis() - ( 60 * 60 * 1000));
        List<FileAttachment> attachments =
                fileAttachmentRepository
                        .findByDateBeforeAndHoxIsNull(oneHourAgo);

        assertThat(attachments.size()).isEqualTo(3);
    }

    @Test
    public void findByDateBeforeAndHoxIsNull_whenAttachmentDateOlderThanOneHourButHaveHox_returnsNone() {
        Hox hoxOne = testEntityManager.persist(TestTools.createValidHOX());
        Hox hoxTwo = testEntityManager.persist(TestTools.createValidHOX());
        Hox hoxThree = testEntityManager.persist(TestTools.createValidHOX());

        testEntityManager.persist(getOldFileAttachmentWithHox(hoxOne));
        testEntityManager.persist(getOldFileAttachmentWithHox(hoxTwo));
        testEntityManager.persist(getOldFileAttachmentWithHox(hoxThree));

        Date oneHourAgo = new Date(System.currentTimeMillis() - ( 60 * 60 * 1000));
        List<FileAttachment> attachments =
                fileAttachmentRepository
                        .findByDateBeforeAndHoxIsNull(oneHourAgo);

        assertThat(attachments.size()).isEqualTo(0);
    }

    @Test
    public void findByDateBeforeAndHoxIsNull_whenAttachmentsDateWithinOneHour_returnsNone() {
        testEntityManager.persist(getFileAttachmentWithinOneHour());
        testEntityManager.persist(getFileAttachmentWithinOneHour());
        testEntityManager.persist(getFileAttachmentWithinOneHour());

        Date oneHourAgo = new Date(System.currentTimeMillis() - ( 60 * 60 * 1000));

        List<FileAttachment> attachments =
                fileAttachmentRepository
                        .findByDateBeforeAndHoxIsNull(oneHourAgo);

        assertThat(attachments.size()).isEqualTo(0);
    }

    @Test
    public void findByDateBeforeAndBoxIsNull_whenSomeAttachmentsOldSomeNewAndSomeWithBox_returnsAttachmentsWithOlderAndNoBoxAssigned() {
        Hox hoxOne = testEntityManager.persist(TestTools.createValidHOX());

        testEntityManager.persist(getOldFileAttachmentWithHox(hoxOne));
        testEntityManager.persist(getOneHourOldFileAttachment());
        testEntityManager.persist(getFileAttachmentWithinOneHour());

        Date oneHourAgo = new Date(System.currentTimeMillis() - ( 60 * 60 * 1000));

        List<FileAttachment> attachments =
                fileAttachmentRepository
                        .findByDateBeforeAndHoxIsNull(oneHourAgo);

        assertThat(attachments.size()).isEqualTo(1);
    }

    private FileAttachment getOneHourOldFileAttachment() {
        Date date = new Date(System.currentTimeMillis() - ( 60 * 60 * 1000) - 1);
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setDate(date);
        return fileAttachment;
    }

    private FileAttachment getOldFileAttachmentWithHox(Hox hox) {
        FileAttachment fileAttachment = getOneHourOldFileAttachment();
        fileAttachment.setHox(hox);
        return fileAttachment;
    }

    private FileAttachment getFileAttachmentWithinOneHour() {
        Date date = new Date(System.currentTimeMillis() - ( 60 * 1000));
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setDate(date);
        return fileAttachment;
    }
}