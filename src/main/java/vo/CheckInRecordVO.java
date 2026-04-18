package vo;

import org.example.time.entity.CheckInRecord;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CheckInRecordVO {

    private Long id;
    private Long userId;
    private String username;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Integer duration;
    private CheckInRecord.CheckInStatus status;
    private LocalDateTime createTime;

    public CheckInRecordVO(
            Long id,
            Long userId,
            String username,
            LocalDateTime checkInTime,
            LocalDateTime checkOutTime,
            Integer duration,
            CheckInRecord.CheckInStatus status,
            LocalDateTime createTime
    ) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.duration = duration;
        this.status = status;
        this.createTime = createTime;
    }
}
