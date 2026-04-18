package org.example.time.service;

import org.example.time.entity.CheckInRecord;
import org.example.time.entity.User;
import vo.CheckInRecordVO;

import java.time.LocalDateTime;
import java.util.List;

public interface CheckInService {

    // 开始签到
    CheckInRecord startCheckIn(User user);

    // 结束签到
    CheckInRecord endCheckIn(Long recordId);

    // 根据ID获取签到记录
    CheckInRecord getCheckInRecordById(Long id);

    // 获取用户的所有签到记录
    List<CheckInRecord> getUserCheckInRecords(User user);

    // 获取用户指定时间范围内的签到记录
    List<CheckInRecord> getUserCheckInRecordsByTimeRange(User user, LocalDateTime startTime, LocalDateTime endTime);

    // 获取用户当前正在进行的签到记录
    CheckInRecord getCurrentCheckInRecord(User user);

    // 获取所有用户的签到记录
    List<CheckInRecord> getAllCheckInRecords();

    // 统计用户的签到次数
    long countUserCheckInRecords(User user);

    // 统计用户的总签到时长
    int sumUserCheckInDuration(User user);

    // 转换实体为VO
    CheckInRecordVO convertToVO(CheckInRecord checkInRecord);
}
