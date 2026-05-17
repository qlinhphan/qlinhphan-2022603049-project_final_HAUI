package com.example.demo.model;

import java.awt.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "resultPatients")
public class ResultPatient {
    @Id
    private String idResultPatient;

    private long area; // dien tich
    private String description;
    private long time; // so lan kham
    private String nameType; // loai khoi u

    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;

    @OneToMany(mappedBy = "resultPatient")
    private java.util.List<ResultDoctor> resultDoctor;

    public String getIdResultPatient() {
        return idResultPatient;
    }

    public void setIdResultPatient(String idResultPatient) {
        this.idResultPatient = idResultPatient;
    }

    public long getArea() {
        return area;
    }

    public void setArea(long area) {
        this.area = area;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public String getNameType() {
        return nameType;
    }

    public void setNameType(String nameType) {
        this.nameType = nameType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public java.util.List<ResultDoctor> getResultDoctor() {
        return resultDoctor;
    }

    public void setResultDoctor(java.util.List<ResultDoctor> resultDoctor) {
        this.resultDoctor = resultDoctor;
    }

}
