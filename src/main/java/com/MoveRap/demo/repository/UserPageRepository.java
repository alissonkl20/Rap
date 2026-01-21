package com.MoveRap.demo.repository;

import com.MoveRap.demo.model.UserPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPageRepository extends JpaRepository<UserPage, Long> {
    @Query("SELECT up FROM UserPage up WHERE up.user.id = :userId")
    Optional<UserPage> findByUserId(@Param("userId") Long userId);
}