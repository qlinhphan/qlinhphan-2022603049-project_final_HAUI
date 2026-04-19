package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
public class User {
	@Id
	private String idUser;
	private String name;
	private String email;
	private String password;
	private String address;
	private int age;
	private String sex; // gioi tinh

	// n user -> 1 role
	@ManyToOne
	@JoinColumn(name = "idRole")
	@JsonIgnore
	private Role role;

	// 1 user -> n result
	@OneToMany(mappedBy = "user")
	@JsonIgnore
	private java.util.List<Result> results;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	private String refreshToken;

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public String getIdUser() {
		return idUser;
	}

	public void setIdUser(String idUser) {
		this.idUser = idUser;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public java.util.List<Result> getResults() {
		return results;
	}

	public void setResults(java.util.List<Result> results) {
		this.results = results;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

}
