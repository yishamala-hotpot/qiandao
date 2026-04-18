package org.example.time.controller;

import dto.LoginRequestDTO;
import org.example.time.config.JwtUtil;
import org.example.time.entity.User;
import org.example.time.service.UserService;
import vo.LoginResponseVO;
import vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "认证管理", description = "认证相关接口")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录并获取JWT令牌")
    public ResponseEntity<LoginResponseVO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        log.info("用户登录: {}", loginRequestDTO.getUsername());

        // 根据用户名查询用户
        User user = userService.getUserByUsername(loginRequestDTO.getUsername());

        // 验证密码（这里简化处理，实际应该使用密码加密）
        if (!loginRequestDTO.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 生成JWT令牌
        String token = jwtUtil.generateToken(user);

        // 转换为VO
        UserVO userVO = userService.convertToVO(user);

        // 返回登录响应
        LoginResponseVO loginResponseVO = new LoginResponseVO(token, userVO);
        return ResponseEntity.ok(loginResponseVO);
    }
}
