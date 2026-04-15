package vo;

import org.example.time.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserVO {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private User.UserStatus status;
    private LocalDateTime createTime;
}