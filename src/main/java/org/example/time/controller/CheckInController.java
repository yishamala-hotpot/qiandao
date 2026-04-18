package org.example.time.controller;

import org.example.time.entity.CheckInRecord;
import org.example.time.entity.User;
import org.example.time.service.CheckInService;
import org.example.time.service.UserService;
import vo.CheckInRecordVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/checkin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "签到管理", description = "签到相关接口")
public class CheckInController {

    private final CheckInService checkInService;
    private final UserService userService;

    @PostMapping("/start")
    @Operation(summary = "开始签到", description = "用户开始签到")
    public ResponseEntity<CheckInRecordVO> startCheckIn(Authentication authentication) {
        // 从认证信息中获取当前用户
        User user;
        if (authentication != null) {
            user = (User) authentication.getPrincipal();
        } else {
            // 测试模式：使用默认用户
            user = userService.getUserByUsername("testuser");
        }
        log.info("用户开始签到: {}", user.getUsername());

        // 开始签到
        CheckInRecord checkInRecord = checkInService.startCheckIn(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(checkInService.convertToVO(checkInRecord));
    }

    @PostMapping("/end/{recordId}")
    @Operation(summary = "结束签到", description = "用户结束签到")
    public ResponseEntity<CheckInRecordVO> endCheckIn(
            @PathVariable Long recordId,
            Authentication authentication) {
        // 从认证信息中获取当前用户
        User user;
        if (authentication != null) {
            user = (User) authentication.getPrincipal();
        } else {
            // 测试模式：使用默认用户
            user = userService.getUserByUsername("testuser");
        }
        log.info("用户结束签到: {}, 记录ID: {}", user.getUsername(), recordId);

        // 结束签到
        CheckInRecord checkInRecord = checkInService.endCheckIn(recordId);
        return ResponseEntity.ok(checkInService.convertToVO(checkInRecord));
    }

    @GetMapping("/current")
    @Operation(summary = "获取当前签到记录", description = "获取用户当前正在进行的签到记录")
    public ResponseEntity<CheckInRecordVO> getCurrentCheckInRecord(Authentication authentication) {
        // 从认证信息中获取当前用户
        User user;
        if (authentication != null) {
            user = (User) authentication.getPrincipal();
        } else {
            // 测试模式：使用默认用户
            user = userService.getUserByUsername("testuser");
        }
        log.info("获取用户当前签到记录: {}", user.getUsername());

        // 获取当前签到记录
        CheckInRecord checkInRecord = checkInService.getCurrentCheckInRecord(user);
        if (checkInRecord == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(checkInService.convertToVO(checkInRecord));
    }

    @GetMapping("/user")
    @Operation(summary = "获取用户签到记录", description = "获取用户的所有签到记录")
    public ResponseEntity<List<CheckInRecordVO>> getUserCheckInRecords(Authentication authentication) {
        // 从认证信息中获取当前用户
        User user;
        if (authentication != null) {
            user = (User) authentication.getPrincipal();
        } else {
            // 测试模式：使用默认用户
            user = userService.getUserByUsername("testuser");
        }
        log.info("获取用户签到记录: {}", user.getUsername());

        // 获取用户签到记录
        List<CheckInRecord> checkInRecords = checkInService.getUserCheckInRecords(user);
        List<CheckInRecordVO> checkInRecordVOs = checkInRecords.stream()
                .map(checkInService::convertToVO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(checkInRecordVOs);
    }

    @GetMapping("/user/range")
    @Operation(summary = "获取用户指定时间范围的签到记录", description = "获取用户在指定时间范围内的签到记录")
    public ResponseEntity<List<CheckInRecordVO>> getUserCheckInRecordsByTimeRange(
            @RequestParam("startTime") LocalDateTime startTime,
            @RequestParam("endTime") LocalDateTime endTime,
            Authentication authentication) {
        // 从认证信息中获取当前用户
        User user;
        if (authentication != null) {
            user = (User) authentication.getPrincipal();
        } else {
            // 测试模式：使用默认用户
            user = userService.getUserByUsername("testuser");
        }
        log.info("获取用户时间范围签到记录: {}, 开始时间: {}, 结束时间: {}", user.getUsername(), startTime, endTime);

        // 获取用户指定时间范围的签到记录
        List<CheckInRecord> checkInRecords = checkInService.getUserCheckInRecordsByTimeRange(user, startTime, endTime);
        List<CheckInRecordVO> checkInRecordVOs = checkInRecords.stream()
                .map(checkInService::convertToVO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(checkInRecordVOs);
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有签到记录", description = "获取所有用户的签到记录（仅管理员）")
    public ResponseEntity<List<CheckInRecordVO>> getAllCheckInRecords(Authentication authentication) {
        // 从认证信息中获取当前用户
        User user;
        if (authentication != null) {
            user = (User) authentication.getPrincipal();
        } else {
            // 测试模式：使用默认用户
            user = userService.getUserByUsername("testuser");
        }
        log.info("获取所有签到记录: {}", user.getUsername());

        // 检查用户是否为管理员
        if (user.getRole() != User.UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 获取所有签到记录
        List<CheckInRecord> checkInRecords = checkInService.getAllCheckInRecords();
        List<CheckInRecordVO> checkInRecordVOs = checkInRecords.stream()
                .map(checkInService::convertToVO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(checkInRecordVOs);
    }

    @GetMapping("/stats/user")
    @Operation(summary = "获取用户签到统计", description = "获取用户的签到统计信息")
    public ResponseEntity<?> getUserCheckInStats(Authentication authentication) {
        // 从认证信息中获取当前用户
        User user;
        if (authentication != null) {
            user = (User) authentication.getPrincipal();
        } else {
            // 测试模式：使用默认用户
            user = userService.getUserByUsername("testuser");
        }
        log.info("获取用户签到统计: {}", user.getUsername());

        // 获取用户签到统计信息
        long count = checkInService.countUserCheckInRecords(user);
        int duration = checkInService.sumUserCheckInDuration(user);

        // 构建响应
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("count", count);
        response.put("duration", duration);
        return ResponseEntity.ok().body(response);
    }
}
