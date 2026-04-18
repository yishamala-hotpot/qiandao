package org.example.time.repository;

import org.example.time.entity.CheckInRecord;
import org.example.time.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRecordRepository extends JpaRepository<CheckInRecord, Long> {

    // 查询用户的所有签到记录
    List<CheckInRecord> findByUser(User user);

    // 查询用户指定时间范围内的签到记录
    List<CheckInRecord> findByUserAndCheckInTimeBetween(User user, LocalDateTime startTime, LocalDateTime endTime);

    // 查询用户当前正在进行的签到记录（未签退）
    Optional<CheckInRecord> findByUserAndStatus(User user, CheckInRecord.CheckInStatus status);

    // 查询所有用户的签到记录
    List<CheckInRecord> findAllByOrderByCheckInTimeDesc();

    // 统计用户的签到次数
    long countByUser(User user);

    // 统计用户的总签到时长
    @Query("SELECT COALESCE(SUM(c.duration), 0) FROM CheckInRecord c WHERE c.user = :user AND c.status = :status")
    Integer sumDurationByUserAndStatus(@Param("user") User user, @Param("status") CheckInRecord.CheckInStatus status);
}
