package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AdminManagePatientDTO;
import com.example.demo.dto.AdminManagePatientDTO.AddInfor;
import com.example.demo.dto.InforDetailPatient.Result;
import com.example.demo.model.ResultDoctor;
import com.example.demo.model.ResultPatient;
import com.example.demo.repository.ResultDoctorRepo;
import com.example.demo.repository.ResultPatientRepo;
import com.example.demo.repository.UserRepository;

@Service
public class AdminManagePatientService {

    @Autowired
    private ResultPatientRepo resultPatientRepo;

    @Autowired
    private ResultDoctorRepo resultDoctorRepo;

    // get all patient with pagination for admin
    public List<AdminManagePatientDTO> getInforPatient(int pageNum, int pageSize) {
        List<AdminManagePatientDTO> data = new java.util.ArrayList<>();

        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<ResultPatient> list_respa_pageable = this.resultPatientRepo.findAll(pageable);
        List<ResultPatient> list_respa = list_respa_pageable.getContent();

        list_respa.forEach(x -> {
            AdminManagePatientDTO dto = new AdminManagePatientDTO();
            dto.setId_result_patient(x.getIdResultPatient());
            dto.setName_type(x.getNameType());
            dto.setArea(x.getArea());
            dto.setDesceiption(x.getDescription());

            ResultDoctor res_doc = this.resultDoctorRepo.findByResultPatient(x);
            String doctor_name = res_doc.getUser().getName();
            dto.setDoctor_name(doctor_name);

            AddInfor add = new AddInfor();
            add.setTotalObject((int) list_respa_pageable.getTotalElements());
            add.setTotalPage(list_respa_pageable.getTotalPages());
            add.setSizeInPage(list_respa_pageable.getSize());

            dto.setAddInfor(add);
            data.add(dto);
        });

        return data;

    }

}
