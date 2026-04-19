package com.example.demo.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
	public static final MacAlgorithm mac = MacAlgorithm.HS256;
	
	private String secretKey = "65499ade-35d0-4de8-94f4-7acdf4022557";
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) {
	    http
	        .csrf(x->x.disable())
	        .authorizeHttpRequests((requests) -> requests
					.requestMatchers("/", "/login-app", "/login-rf", "/v1.1/users/**").permitAll()
					.anyRequest().authenticated()
				)
	        .oauth2ResourceServer((oauth2) -> oauth2.jwt(Customizer.withDefaults()))
	        .sessionManagement((session) -> session
	            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	        );
	    
	    return http.build();
	}
	
	@Bean
	public JwtEncoder encoder() {
		byte[] by = secretKey.getBytes();
		SecretKey sk = new SecretKeySpec(by, secretKey);
		return NimbusJwtEncoder.withSecretKey(sk).build();
	}
	
	@Bean JwtDecoder decoder() {
		byte[] by = secretKey.getBytes();
		SecretKey sk = new SecretKeySpec(by, secretKey);
		return NimbusJwtDecoder.withSecretKey(sk).build();
	}
	
}
