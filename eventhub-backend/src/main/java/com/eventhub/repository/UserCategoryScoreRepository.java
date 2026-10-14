package com.eventhub.repository;

import com.eventhub.model.Category;
import com.eventhub.model.User;
import com.eventhub.model.UserCategoryScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCategoryScoreRepository
        extends JpaRepository<UserCategoryScore, Long> {

    boolean existsByUserAndCategory(
            User user,
            Category category);

    List<UserCategoryScore> findByUser(User user);

    Optional<UserCategoryScore> findByUserAndCategory(
            User user,
            Category category);
}