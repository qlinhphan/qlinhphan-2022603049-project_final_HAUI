package com.example.demo.utils;

import org.jspecify.annotations.Nullable;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.example.demo.dto.ResponseDTO;

@RestControllerAdvice
public class SetupResponse implements ResponseBodyAdvice<Object>{

	@Override
	public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public @Nullable Object beforeBodyWrite(Object body, MethodParameter returnType,
			MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType,
			ServerHttpRequest request, ServerHttpResponse response) {
		
		int stt = ((ServletServerHttpResponse) response).getServletResponse().getStatus();
		if (body instanceof String) {
			return body;
		}
		if(stt < 400) {
			ResponseDTO dto = new ResponseDTO();
			dto.setStt(stt);
			dto.setError(false);
			dto.setMessage(body);
			return dto;
		}else {
			return body;
		}
	}
	
}
