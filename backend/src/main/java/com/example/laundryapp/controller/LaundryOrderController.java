package com.example.laundryapp.controller;

import com.example.laundryapp.entity.LaundryOrder;
import com.example.laundryapp.entity.User;
import com.example.laundryapp.repository.IAccountRepo;
import com.example.laundryapp.repository.LaundryOrderRepository;
import com.example.laundryapp.service.EmailService;
import com.example.laundryapp.service.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class LaundryOrderController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private IAccountService accountService;


    @Autowired
    private LaundryOrderRepository repository;


    @PostMapping
    public LaundryOrder createOrder(@RequestBody LaundryOrder order, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        User user = accountService.findByUsername(username);
        order.setOrderDate(LocalDate.now());
        order.setStatus("Đang Giặt");
        LaundryOrder saved = repository.save(order);
        emailService.notifyOrderComplete(user.getEmail(), order.getId());
        return saved;
    }


    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @GetMapping
    public List<LaundryOrder> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public List<LaundryOrder> getAllById(@PathVariable Integer id) {
        return repository.findAllByUser_Id(id);
    }

    @PutMapping("/{id}/complete")
    public LaundryOrder markComplete(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        LaundryOrder order = repository.findById(id).orElseThrow();
        order.setStatus("Hoàn Tất");
        repository.save(order);
        String username = userDetails.getUsername();
        User user = accountService.findByUsername(username);
        emailService.notifyOrderComplete(user.getEmail(), order.getId());
        return order;
    }
}