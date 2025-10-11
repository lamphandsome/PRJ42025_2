package com.example.laundryapp.service;

import com.example.laundryapp.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IAccountService extends UserDetailsService {
    User findByUsername(String username);
    User save(User user);


}
