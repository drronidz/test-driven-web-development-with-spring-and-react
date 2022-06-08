package com.springframework.hoxify.model;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 2:00 PM
*/

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Hox {

    @Id
    @GeneratedValue
    private long id;

    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;
}
