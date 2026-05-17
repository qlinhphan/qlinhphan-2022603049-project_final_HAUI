package com.example.demo.dto;

import com.example.demo.model.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveInforPatient {
    private String name;
    private String address;
    private int age;
    private String phone;
    private Role role;
    private String gender;
    private long area;
    private String description;
    private String nameType;
    private long time;
    private String idPatient;
    private String idDoctor;
    private String idResultPatient;

}
