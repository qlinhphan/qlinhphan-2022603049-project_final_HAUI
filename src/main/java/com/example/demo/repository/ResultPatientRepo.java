package com.example.demo.repository;

import java.util.List;

import org.springframework.boot.data.autoconfigure.web.DataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.ResultPatient;
import com.example.demo.model.User;

public interface ResultPatientRepo extends JpaRepository<ResultPatient, String> {
    public List<ResultPatient> findByUser(User user);

    public Page<ResultPatient> findAll(org.springframework.data.domain.Pageable pageable);
}
