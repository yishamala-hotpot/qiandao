package org.example.time.repository;

import org.example.time.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 通过用户名查询用户
    Optional<User> findByUsername(String username);

    // 通过邮箱查询用户
    Optional<User> findByEmail(String email);

    // 查询所有活跃用户
    List<User> findByStatus(User.UserStatus status);

    // 自定义查询：通过用户名模糊查询
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchByKeyword(@Param("keyword") String keyword);

    // 检查用户名是否存在
    boolean existsByUsername(String username);

    // 检查邮箱是否存在
    boolean existsByEmail(String email);
}