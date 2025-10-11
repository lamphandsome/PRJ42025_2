package com.example.laundryapp.entity;


import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.*;

@Entity
@Data
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    private String description;

    @Override
    public String getAuthority() {
        return name;
    }
}