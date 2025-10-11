package com.example.laundryapp.repository;

import com.example.laundryapp.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IAccountRepo extends CrudRepository<User, Integer> {
    List<User> findAllByUsernameContaining(String username);

    @Query(value = "select a from User a where a.username like concat('%',:name,'%')")
    List<User> findAllByUsernameHQL(@Param("name") String username);

    User findByUsername(String username);

}
