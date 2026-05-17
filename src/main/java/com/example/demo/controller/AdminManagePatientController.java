package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AdminManagePatientDTO;
import com.example.demo.service.AdminManagePatientService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
public class AdminManagePatientController {

    @Autowired
    private AdminManagePatientService adminManagePatientService;

    @GetMapping("/admin-manage-patient")
    public ResponseEntity<?> getMethodName(@RequestParam int pageNum, @RequestParam int pageSize) {

        List<AdminManagePatientDTO> data = this.adminManagePatientService.getInforPatient(pageNum, pageSize);
        return ResponseEntity.ok(data);

    }

}
