package com.example.laundryapp.repository;

import com.example.laundryapp.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByOrderId(Long orderId);
}
