package com.MoveRap.demo.repository;

import com.MoveRap.demo.model.UserPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPageRepository extends JpaRepository<UserPage, Long> {
    Optional<UserPage> findByUserId(Long userId);
}