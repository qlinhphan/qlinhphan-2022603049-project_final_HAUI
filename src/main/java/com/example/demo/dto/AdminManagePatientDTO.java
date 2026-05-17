package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminManagePatientDTO {
    private String id_result_patient;
    private String name_type;
    private long area;
    private String desceiption;
    private String doctor_name;
    private AddInfor addInfor;

    @Getter
    @Setter
    public static class AddInfor {
        private int totalPage;
        private int sizeInPage;
        private int totalObject;
    }
}
