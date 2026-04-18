package org.example.time.service.impl;

import org.example.time.entity.CheckInRecord;
import org.example.time.entity.User;
import org.example.time.repository.CheckInRecordRepository;
import org.example.time.service.CheckInService;
import vo.CheckInRecordVO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CheckInServiceImpl implements CheckInService {

    private final CheckInRecordRepository checkInRecordRepository;

    @Override
    @Transactional
    public CheckInRecord startCheckIn(User user) {
        // 检查用户是否已经有未签退的签到记录
        CheckInRecord existingRecord = getCurrentCheckInRecord(user);
        if (existingRecord != null) {
            throw new RuntimeException("用户已有未签退的签到记录");
        }

        // 创建新的签到记录
        CheckInRecord checkInRecord = new CheckInRecord();
        checkInRecord.setUser(user);
        checkInRecord.setCheckInTime(LocalDateTime.now());
        checkInRecord.setStatus(CheckInRecord.CheckInStatus.CHECKED_IN);

        return checkInRecordRepository.save(checkInRecord);
    }

    @Override
    @Transactional
    public CheckInRecord endCheckIn(Long recordId) {
        // 根据ID获取签到记录
        CheckInRecord checkInRecord = getCheckInRecordById(recordId);

        // 检查签到记录是否已经签退
        if (checkInRecord.getStatus() == CheckInRecord.CheckInStatus.CHECKED_OUT) {
            throw new RuntimeException("签到记录已经签退");
        }

        // 设置签退时间
        LocalDateTime checkOutTime = LocalDateTime.now();
        checkInRecord.setCheckOutTime(checkOutTime);

        // 计算签到时长（分钟）
        long durationMinutes = ChronoUnit.MINUTES.between(checkInRecord.getCheckInTime(), checkOutTime);
        checkInRecord.setDuration((int) durationMinutes);

        // 更新状态
        checkInRecord.setStatus(CheckInRecord.CheckInStatus.CHECKED_OUT);

        return checkInRecordRepository.save(checkInRecord);
    }

    @Override
    public CheckInRecord getCheckInRecordById(Long id) {
        return checkInRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("签到记录不存在，ID: " + id));
    }

    @Override
    public List<CheckInRecord> getUserCheckInRecords(User user) {
        return checkInRecordRepository.findByUser(user);
    }

    @Override
    public List<CheckInRecord> getUserCheckInRecordsByTimeRange(User user, LocalDateTime startTime, LocalDateTime endTime) {
        return checkInRecordRepository.findByUserAndCheckInTimeBetween(user, startTime, endTime);
    }

    @Override
    public CheckInRecord getCurrentCheckInRecord(User user) {
        return checkInRecordRepository.findByUserAndStatus(user, CheckInRecord.CheckInStatus.CHECKED_IN)
                .orElse(null);
    }

    @Override
    public List<CheckInRecord> getAllCheckInRecords() {
        return checkInRecordRepository.findAllByOrderByCheckInTimeDesc();
    }

    @Override
    public long countUserCheckInRecords(User user) {
        return checkInRecordRepository.countByUser(user);
    }

    @Override
    public int sumUserCheckInDuration(User user) {
        Integer duration = checkInRecordRepository.sumDurationByUserAndStatus(user, CheckInRecord.CheckInStatus.CHECKED_OUT);
        return duration != null ? duration : 0;
    }

    @Override
    public CheckInRecordVO convertToVO(CheckInRecord checkInRecord) {
        return new CheckInRecordVO(
                checkInRecord.getId(),
                checkInRecord.getUser().getId(),
                checkInRecord.getUser().getUsername(),
                checkInRecord.getCheckInTime(),
                checkInRecord.getCheckOutTime(),
                checkInRecord.getDuration(),
                checkInRecord.getStatus(),
                checkInRecord.getCreateTime()
        );
    }
}
