package com.example.demo.repository;

import java.awt.print.Pageable;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.User;

public interface UserRepository extends JpaRepository<User, String> {
	public User findByEmail(String email);

	public User findByRefreshToken(String refreshToken);

	public Page<User> findAll(org.springframework.data.domain.Pageable pageable);

	public User findByPhone(String phone);

	public Boolean existsByEmail(String email);
}
