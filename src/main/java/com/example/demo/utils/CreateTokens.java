package com.example.demo.utils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class CreateTokens {
	
	public static final MacAlgorithm mac = MacAlgorithm.HS256;
	
	private String secretKey = "65499ade-35d0-4de8-94f4-7acdf4022557";
	
	@Autowired
	private JwtEncoder jwtEncoder;

	public String createAcToken(Authentication authentication) {
		Instant now = Instant.now();
		JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
				.issuedAt(now)
				.expiresAt(now.plus(30, ChronoUnit.HOURS))
				.subject(authentication.getName())
				.claim("user", authentication.getAuthorities().stream().map(x -> x.getAuthority()).toList())
				.build();
		
		JwsHeader jwsHeader = JwsHeader.with(mac).build();
		
		return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, jwtClaimsSet)).getTokenValue();
	}
	
	public String createRfToken(String email) {
		Instant now = Instant.now();
		JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
				.issuedAt(now)
				.expiresAt(now.plus(7, ChronoUnit.DAYS))
				.subject(email)
				.claim("user", email)
				.build();
		
		JwsHeader jwsHeader = JwsHeader.with(mac).build();
		
		return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, jwtClaimsSet)).getTokenValue();
	}
}
