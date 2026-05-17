package com.example.demo.service.Except;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.demo.dto.ResponseDTO;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(value = ExceptDuplicate.class)
    public ResponseEntity<?> handle(ExceptDuplicate ex) {
        ResponseDTO dto = new ResponseDTO();
        dto.setMessage(ex.getMessage());
        dto.setError(true);
        dto.setStt(409);

        return ResponseEntity.status(409).body(dto);
    }
}
