package com.example.laundryapp.dto;

import com.example.laundryapp.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AccountToken {
    private int id;
    private String username;
    private String token;
    private List<Role> roles;
}
