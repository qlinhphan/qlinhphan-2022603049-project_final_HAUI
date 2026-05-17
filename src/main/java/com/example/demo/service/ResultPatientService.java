package com.example.demo.service;

import java.awt.List;
import java.util.ArrayList;
import java.util.ListIterator;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.InforDetailPatient;
import com.example.demo.dto.SaveInforPatient;
import com.example.demo.dto.InforDetailPatient.Patient;
import com.example.demo.dto.InforDetailPatient.Result;
import com.example.demo.model.ResultDoctor;
import com.example.demo.model.ResultPatient;
import com.example.demo.model.User;
import com.example.demo.repository.ResultDoctorRepo;
import com.example.demo.repository.ResultPatientRepo;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;

@Service
public class ResultPatientService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResultDoctorRepo resultDoctorRepo;

    @Autowired
    private ResultPatientRepo resultPatientRepo;

    @Autowired
    private RoleRepository roleRepository;

    public void savePatientInfor(SaveInforPatient info) {

        User userByPhone = this.userRepository.findByPhone(info.getPhone()); // find patient
        if (userByPhone == null) {
            User user = new User();
            user.setIdUser(UUID.randomUUID().toString());
            user.setName(info.getName());
            user.setAddress(info.getAddress());
            user.setAge(info.getAge());
            user.setPhone(info.getPhone());
            user.setRole(this.roleRepository.findByName("patient"));
            user.setGender(info.getGender());
            User userP = this.userRepository.save(user);

            ResultPatient rp = new ResultPatient();
            rp.setIdResultPatient(UUID.randomUUID().toString());
            rp.setArea(info.getArea());
            rp.setDescription(info.getDescription());
            rp.setNameType(info.getNameType());
            rp.setTime(1);
            rp.setUser(userP);
            ResultPatient resp = this.resultPatientRepo.save(rp);

            ResultDoctor rd = new ResultDoctor();
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            rd.setIdResultDoctor(UUID.randomUUID().toString());
            rd.setResultPatient(resp);
            rd.setUser(this.userRepository.findByEmail(email));
            this.resultDoctorRepo.save(rd);
        } else {
            // User user = new User();
            // user.setIdUser(UUID.randomUUID().toString());
            // user.setAddress(info.getAddress());
            // user.setAge(info.getAge());
            // user.setPhone(info.getPhone());
            // user.setRole(this.roleRepository.findByName("patient"));
            // user.setGender(info.getGender());
            // User userP = this.userRepository.save(user);
            java.util.List<ResultPatient> rpByUser = this.resultPatientRepo.findByUser(userByPhone);
            long times = rpByUser.size();

            ResultPatient rp = new ResultPatient();
            rp.setIdResultPatient(UUID.randomUUID().toString());
            rp.setArea(info.getArea());
            rp.setDescription(info.getDescription());
            rp.setNameType(info.getNameType());
            rp.setTime(times + 1);
            rp.setUser(userByPhone);
            ResultPatient resp = this.resultPatientRepo.save(rp);

            ResultDoctor rd = new ResultDoctor();
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            rd.setIdResultDoctor(UUID.randomUUID().toString());
            rd.setResultPatient(resp);
            rd.setUser(this.userRepository.findByEmail(email));
            this.resultDoctorRepo.save(rd);
        }

    }

    public InforDetailPatient getInforDetalPatient() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = this.userRepository.findByEmail(email);

        java.util.List<ResultDoctor> findByUser = this.resultDoctorRepo.findByUser(userByEmail);
        java.util.List<String> idRsPatients = new ArrayList<>();
        findByUser.forEach(x -> {
            idRsPatients.add(x.getResultPatient().getIdResultPatient());
        });

        java.util.List<ResultPatient> resultPatiens = new ArrayList<>();
        idRsPatients.forEach(x -> {
            resultPatiens.add(this.resultPatientRepo.findById(x).get());
        });

        java.util.List<String> idPatient = new ArrayList<>();
        resultPatiens.forEach(x -> {
            if (!idPatient.contains(x.getUser().getIdUser())) {
                idPatient.add(x.getUser().getIdUser());
            }

        });

        // tim ra cac user la benh nhan
        java.util.List<User> userPatient = new ArrayList<>();
        idPatient.forEach(x -> {
            userPatient.add(this.userRepository.findById(x).get());
        });

        java.util.List<Patient> patients = new ArrayList<>();
        userPatient.forEach(x -> {
            Patient pa = new Patient();
            pa.setName(x.getName());
            pa.setGender(x.getGender());
            pa.setAge(x.getAge());
            pa.setPhone(x.getPhone());

            java.util.List<Result> rss = new ArrayList<>();
            java.util.List<ResultPatient> www = this.resultPatientRepo.findByUser(x);
            www.forEach(xs -> {
                Result r = new Result();
                r.setTypeName(xs.getNameType());
                r.setArea(xs.getArea());
                rss.add(r);
            });
            pa.setResults(rss);

            patients.add(pa);
        });

        InforDetailPatient idp = new InforDetailPatient();
        idp.setSumSeeTheDoctor(findByUser.size());
        idp.setPatientIsManaging(idPatient.size());
        idp.setPatients(patients);

        return idp;

    }

}
