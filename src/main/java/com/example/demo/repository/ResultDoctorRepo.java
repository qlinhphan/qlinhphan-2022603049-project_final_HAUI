package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.ResultDoctor;
import com.example.demo.model.ResultPatient;
import com.example.demo.model.User;

public interface ResultDoctorRepo extends JpaRepository<ResultDoctor, String> {
    public List<ResultDoctor> findByUser(User user);

    public ResultDoctor findByResultPatient(ResultPatient rp);
}
