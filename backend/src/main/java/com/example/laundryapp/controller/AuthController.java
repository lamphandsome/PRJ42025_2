package com.example.laundryapp.controller;

import com.example.laundryapp.dto.AccountToken;
import com.example.laundryapp.entity.Role;
import com.example.laundryapp.entity.User;
import com.example.laundryapp.service.IAccountService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("*")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    IAccountService accountService;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("login")
    public AccountToken login(@RequestBody User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = createToken(user.getUsername());
            User user1 = accountService.findByUsername(user.getUsername());
            return new AccountToken(user1.getId(), user1.getUsername(), token, user1.getRoles());
        } catch (Exception e) {
            return null;
        }
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<String> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (accountService.findByUsername(user.getUsername()) == null) {
            Role role = new Role();
            role.setId(2);
            List<Role> roles = new ArrayList<>();
            roles.add(role);
            user.setRoles(roles);
            accountService.save(user);
//            Cart cart = new Cart();
//            cart.setUser(user);
//            cart.setCreatedDate(LocalDate.now());
//            iCartRepo.save(cart);
            return new ResponseEntity<>("Đăng ký thành công", HttpStatus.OK);
        }
        return new ResponseEntity<>("Username trùng", HttpStatus.NO_CONTENT);

    }


    public static final String PRIVATE_KEY = "123456789999887abc";
    private static final long EXPIRE_TIME = 86400L;

    // hàm tạo ra token
    public String createToken(String username) {
        return Jwts.builder()
                .setSubject((username))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + EXPIRE_TIME * 1000))
                .signWith(SignatureAlgorithm.HS512, PRIVATE_KEY)
                .compact();
    }
}
