package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.InforDetailPatient;
import com.example.demo.dto.SaveInforPatient;
import com.example.demo.service.ResultPatientService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
public class ResultPatientController {

    @Autowired
    private ResultPatientService resultPatientService;

    @PostMapping("/patient-create")
    public ResponseEntity<?> postMethodName(@ModelAttribute SaveInforPatient saveInforPatient) {

        this.resultPatientService.savePatientInfor(saveInforPatient);

        return ResponseEntity.status(HttpStatus.CREATED.value()).body("saved successfully!");
    }

    @GetMapping("/get-detail")
    public ResponseEntity<?> finds() {
        InforDetailPatient inf = this.resultPatientService.getInforDetalPatient();

        return ResponseEntity.ok().body(inf);
    }

}
