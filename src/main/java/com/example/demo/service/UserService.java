package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;

	public User saveUserService(User user) {
		return this.userRepository.save(user);
	}

	public User findUserByEmail(String email) {
		return this.userRepository.findByEmail(email);
	}

	public User findUserByRefreshToken(String refreshToken) {
		return this.userRepository.findByRefreshToken(refreshToken);
	}

	public Optional<User> findUserById(String id) {
		return this.userRepository.findById(id);
	}

	public Page<User> findAllUsers(Pageable p) {
		return this.userRepository.findAll(p);
	}
}
