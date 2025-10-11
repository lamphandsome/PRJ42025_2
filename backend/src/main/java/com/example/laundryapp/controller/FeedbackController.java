package com.example.laundryapp.controller;

import com.example.laundryapp.entity.Feedback;
import com.example.laundryapp.entity.LaundryOrder;
import com.example.laundryapp.entity.User;
import com.example.laundryapp.repository.LaundryOrderRepository;
import com.example.laundryapp.service.EmailService;
import com.example.laundryapp.service.FeedbackService;
import com.example.laundryapp.service.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {
    @Autowired
    private IAccountService accountService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private LaundryOrderRepository laundryOrderRepository;

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        return service.createFeedback(feedback);
    }


    @PostMapping("/{id}")
    public ResponseEntity<?> sendFeedback(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nội dung phản hồi không được để trống"));
        }

        LaundryOrder order = laundryOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        User user = accountService.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Người dùng không hợp lệ"));
        }

        // Lưu feedback
        Feedback feedback = new Feedback();
        feedback.setComment(content);
        feedback.setOrder(order);
        feedback.setUser(user);
        Feedback saved = service.createFeedback(feedback);

        // Gửi mail (nên try/catch để không làm thất bại lưu feedback nếu mail lỗi)
        try {
            emailService.sendSimpleMail(
                    "admin@laundryapp.com",
                    "Phản hồi từ khách hàng " + order.getCustomerName(),
                    "Nội dung phản hồi cho đơn #" + id + ":\n\n" + content
            );
        } catch (Exception ex) {
            return (ResponseEntity<?>) ResponseEntity.badRequest();
        }

        // Trả về JSON (message + id feedback)
        return ResponseEntity.ok(Map.of(
                "message", "Đã gửi phản hồi thành công",
                "feedbackId", saved.getId()
        ));
    }


    @GetMapping("/order/{orderId}")
    public List<Feedback> getFeedbackByOrder(@PathVariable Long orderId) {
        return service.getFeedbackByOrder(orderId);
    }
}
