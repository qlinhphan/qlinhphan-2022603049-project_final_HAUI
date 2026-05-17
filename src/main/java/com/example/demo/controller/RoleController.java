package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
public class RoleController {
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/get-role")
    public ResponseEntity<?> getMethodName() {
        List<Role> data = this.roleRepository.findAll();
        return ResponseEntity.ok().body(data);
    }

}
