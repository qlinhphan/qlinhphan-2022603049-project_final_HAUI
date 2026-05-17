package com.example.demo.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InforAllUsers {

    @Getter
    @Setter
    public static class AllUsers {
        private String idUser;
        private String name;
        private String email;
        private String phone;
        private String roleName;
    }

    private int totalPages;
    private int totalObj;
    private List<AllUsers> allUser;

}
