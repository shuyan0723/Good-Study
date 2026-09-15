package com.fullstack.demo.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户数据访问层 —— 对应 NestJS 中注入的 Repository<User>
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 根据用户名查询（登录时用）
    Optional<User> findByUsername(String username);

    // 根据邮箱查询（注册时检查邮箱是否被占用）
    Optional<User> findByEmail(String email);

    // 检查用户名或邮箱是否已存在（注册时用）
    boolean existsByUsernameOrEmail(String username, String email);
}
