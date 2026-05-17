package com.example.demo.service.Except;

public class ExceptDuplicate extends RuntimeException {
    public ExceptDuplicate(String mess) {
        super(mess);
    }
}
