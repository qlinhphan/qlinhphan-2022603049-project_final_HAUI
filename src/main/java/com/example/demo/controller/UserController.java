package com.example.demo.controller;

import com.example.demo.repository.UserRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.InforAllUsers;
import com.example.demo.dto.ResponseDTO;
import com.example.demo.dto.InforAllUsers.AllUsers;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.UserService;
import com.example.demo.service.Except.ExceptDuplicate;

import jakarta.persistence.Entity;

@RestController
@RequestMapping("/v1.1/users")
@CrossOrigin(origins = "http://localhost:3000/")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RoleRepository roleRepository;

	@PostMapping
	public ResponseEntity<?> saveUser(@ModelAttribute User user, @RequestParam String roleName) {

		Boolean checkUserExist = this.userRepository.existsByEmail(user.getEmail());

		if (checkUserExist) {
			throw new ExceptDuplicate("Email is existed in DB");
		}

		User userToSave = new User();
		userToSave.setIdUser(UUID.randomUUID().toString());
		userToSave.setName(user.getName());
		userToSave.setEmail(user.getEmail());
		userToSave.setPassword(this.passwordEncoder.encode(user.getPassword()));
		userToSave.setAddress(user.getAddress());
		userToSave.setAge(user.getAge());
		userToSave.setGender(user.getGender());
		userToSave.setPhone(user.getPhone());

		Role rolefind = this.roleRepository.findByName(roleName);

		userToSave.setRole(rolefind);

		this.userService.saveUserService(userToSave);

		return ResponseEntity.status(HttpStatus.CREATED.value()).body(userToSave);
	}

	@DeleteMapping
	public ResponseEntity<?> deleteUser(@RequestParam("id") String id) {
		Optional<User> userById = this.userService.findUserById(id);
		userById.ifPresent(x -> {
			this.userRepository.delete(x);
		});

		return ResponseEntity.ok().body("delete user successfully");
	}

	// id
	@GetMapping("/{id}")
	public ResponseEntity<?> find(@PathVariable("id") String id) {
		return ResponseEntity.ok().body(userService.findUserById(id));
	}

	// email
	@GetMapping
	public ResponseEntity<?> findByEmail(@RequestParam("email") String email) {
		User user = this.userService.findUserByEmail(email);
		return ResponseEntity.ok().body(user);
	}

	@PutMapping
	public ResponseEntity<?> buildUp(@ModelAttribute User user) {
		Optional<User> userUpdate = this.userService.findUserById(user.getIdUser());
		userUpdate.ifPresent(x -> {
			x.setName(user.getName());
			x.setEmail(user.getEmail());
			x.setAddress(user.getAddress());
			x.setPassword(this.passwordEncoder.encode(user.getPassword()));

			this.userService.saveUserService(x);
		});

		return ResponseEntity.ok().body(userUpdate);
	}

	@GetMapping("/all")
	public ResponseEntity<?> getAll(@RequestParam("page") String page, @RequestParam("limit") String limit) {
		int page_int = Integer.parseInt(page);
		int limit_int = Integer.parseInt(limit);
		Pageable pageable = PageRequest.of(page_int - 1, limit_int);

		Page<User> page_users = this.userService.findAllUsers(pageable);
		int totalPages = page_users.getTotalPages();
		List<User> list_users = page_users.getContent();

		InforAllUsers inforAll = new InforAllUsers();

		List<AllUsers> infor = new ArrayList<>();
		list_users.forEach(x -> {
			AllUsers inf = new AllUsers();
			inf.setIdUser(x.getIdUser());
			inf.setName(x.getName());
			inf.setEmail(x.getEmail());
			inf.setPhone(x.getPhone());
			inf.setRoleName(x.getRole().getName());
			infor.add(inf);
		});

		List<User> usersNoPage = this.userService.findAllUsersNoPages();
		inforAll.setTotalObj(usersNoPage.size());
		inforAll.setTotalPages(totalPages);
		inforAll.setAllUser(infor);

		return ResponseEntity.ok().body(inforAll);

	}

}
