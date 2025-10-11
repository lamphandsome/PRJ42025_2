package com.example.laundryapp.repository;

import com.example.laundryapp.entity.Role;
import org.springframework.data.repository.CrudRepository;

public interface IRoleRepo extends CrudRepository<Role, Integer> {
}
