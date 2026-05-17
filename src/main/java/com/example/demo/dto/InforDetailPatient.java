package com.example.demo.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InforDetailPatient {
    private long patientIsManaging;
    private long sumSeeTheDoctor;
    private List<Patient> patients;

    @Getter
    @Setter
    public static class Patient {
        private String name;
        private String gender;
        private long age;
        private String phone;
        // private String time;
        // private String description;
        // private String nameType;
        private List<Result> results;
    }

    @Getter
    @Setter
    public static class Result {
        private String typeName;
        private long area;
    }
}
