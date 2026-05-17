package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "resultDoctors")
public class ResultDoctor {

    @Id
    private String idResultDoctor;

    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;

    @ManyToOne
    @JoinColumn(name = "idResultPatient")
    private ResultPatient resultPatient;

    public String getIdResultDoctor() {
        return idResultDoctor;
    }

    public void setIdResultDoctor(String idResultDoctor) {
        this.idResultDoctor = idResultDoctor;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ResultPatient getResultPatient() {
        return resultPatient;
    }

    public void setResultPatient(ResultPatient resultPatient) {
        this.resultPatient = resultPatient;
    }

}
