package com.springframework.hoxify.view;

import com.springframework.hoxify.model.Hox;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/13/2022 3:01 PM
*/
@Data
@NoArgsConstructor
public class HoxVM {

    private long id;

    private String content;

    private long date;

    private UserVM user;

    public HoxVM(Hox hox) {
        this.setId(hox.getId());
        this.setContent(hox.getContent());
        this.setDate(hox.getTimestamp().getTime());
        this.setUser(new UserVM(hox.getUser()));
    }
}
