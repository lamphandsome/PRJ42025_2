package com.example.laundryapp.repository;

import com.example.laundryapp.entity.LaundryOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LaundryOrderRepository extends JpaRepository<LaundryOrder, Long> {
    List<LaundryOrder> findAllByUser_Id(Integer user_id);
}