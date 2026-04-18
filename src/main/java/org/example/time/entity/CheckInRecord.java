package org.example.time.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "t_check_in_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckInRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "check_in_time", nullable = false)
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "duration")
    private Integer duration; // 单位：分钟

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CheckInStatus status = CheckInStatus.CHECKED_IN;

    @CreationTimestamp
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;

    public enum CheckInStatus {
        CHECKED_IN, CHECKED_OUT
    }
}
