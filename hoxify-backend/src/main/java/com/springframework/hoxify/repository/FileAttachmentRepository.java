package com.springframework.hoxify.repository;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/25/2022 5:02 PM
*/

import com.springframework.hoxify.model.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
    List<FileAttachment> findByDateBeforeAndHoxIsNull(Date date);
}
