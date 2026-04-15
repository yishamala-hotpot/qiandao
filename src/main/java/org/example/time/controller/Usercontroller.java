package org.example.time.controller;

import org.example.time.entity.User;
import dto.CreateUserDTO;
import dto.UpdateUserDTO;
import vo.UserVO;
import org.example.time.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {

    private final UserService userService;

    @PostMapping
    @Operation(summary = "创建用户")
    public ResponseEntity<UserVO> createUser(@Valid @RequestBody CreateUserDTO userDTO) {
        log.info("创建用户: {}", userDTO.getUsername());
        User user = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.convertToVO(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取用户")
    public ResponseEntity<UserVO> getUserById(@PathVariable Long id) {
        log.info("查询用户, ID: {}", id);
        User user = userService.getUserById(id);
        return ResponseEntity.ok(userService.convertToVO(user));
    }

    @GetMapping
    @Operation(summary = "获取所有用户")
    public ResponseEntity<List<UserVO>> getAllUsers() {
        log.info("查询所有用户");
        List<UserVO> users = userService.getAllUsers().stream()
                .map(userService::convertToVO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新用户")
    public ResponseEntity<UserVO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDTO userDTO) {
        log.info("更新用户, ID: {}", id);
        User user = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(userService.convertToVO(user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("删除用户, ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "根据用户名查询用户")
    public ResponseEntity<UserVO> getUserByUsername(@RequestParam String username) {
        log.info("根据用户名查询用户: {}", username);
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(userService.convertToVO(user));
    }
}