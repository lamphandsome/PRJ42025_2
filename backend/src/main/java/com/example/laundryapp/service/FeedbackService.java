package com.example.laundryapp.service;

import com.example.laundryapp.entity.Feedback;
import com.example.laundryapp.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {
    private final FeedbackRepository repository;

    public FeedbackService(FeedbackRepository repository) {
        this.repository = repository;
    }

    public Feedback createFeedback(Feedback feedback) {
        return repository.save(feedback);
    }

    public List<Feedback> getFeedbackByOrder(Long orderId) {
        return repository.findByOrderId(orderId);
    }
}
