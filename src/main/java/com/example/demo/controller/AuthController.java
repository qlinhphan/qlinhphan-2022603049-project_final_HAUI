package com.example.demo.controller;

import java.net.http.HttpHeaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginSuccess;
import com.example.demo.dto.UserLogin;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.example.demo.utils.CreateTokens;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class AuthController {

	@Autowired
	private AuthenticationManagerBuilder authenticationManagerBuilder;

	@Autowired
	private UserService userService;

	@Autowired
	private CreateTokens createTokens;

	@PostMapping("/login-app")
	public ResponseEntity<?> postMethodName(@ModelAttribute UserLogin userLogin) {
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				userLogin.getEmail(), userLogin.getPassword());
		Authentication authentication = this.authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		User userByEmail = this.userService.findUserByEmail(userLogin.getEmail());

		String acToken = this.createTokens.createAcToken(authentication);
		String rfToken = this.createTokens.createRfToken(userByEmail.getEmail());

		LoginSuccess ls = new LoginSuccess();
		ls.setEmail(userByEmail.getEmail());
		ls.setName(userByEmail.getName());
		ls.setAccessToken(acToken);
		ls.setRefreshToken(rfToken);

		userByEmail.setRefreshToken(rfToken);
		this.userService.saveUserService(userByEmail);

		ResponseCookie springCookie = ResponseCookie.from("user", rfToken)
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(36500)
				.build();

		return ResponseEntity
				.ok()
				.header(org.springframework.http.HttpHeaders.SET_COOKIE, springCookie.toString())
				.body(ls);
	}

	@GetMapping("/login-rf")
	public ResponseEntity<?> postMethodName(@CookieValue(name = "user", defaultValue = "default-user-id") String cook) {

		User userByEmail = this.userService.findUserByRefreshToken(cook); // ngai sua
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				userByEmail.getEmail(), userByEmail.getPassword());
		// Authentication authentication =
		// this.authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		// SecurityContextHolder.getContext().setAuthentication(authentication);

		// User userByEmail = this.userService.findUserByEmail(userLogin.getEmail());

		String acToken = this.createTokens.createAcToken(authenticationToken);
		String rfToken = this.createTokens.createRfToken(userByEmail.getEmail());

		LoginSuccess ls = new LoginSuccess();
		ls.setEmail(userByEmail.getEmail());
		ls.setName(userByEmail.getName());
		ls.setAccessToken(acToken);
		ls.setRefreshToken(rfToken);

		userByEmail.setRefreshToken(rfToken);
		this.userService.saveUserService(userByEmail);

		ResponseCookie springCookie = ResponseCookie.from("user", rfToken)
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(36500)
				.build();

		return ResponseEntity
				.ok()
				.header(org.springframework.http.HttpHeaders.SET_COOKIE, springCookie.toString())
				.body(ls);
	}

	@PostMapping("/logout-app")
	public String logout() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();

		return email;
	}

}
