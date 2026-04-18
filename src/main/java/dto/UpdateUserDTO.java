package dto;

import org.example.time.entity.User;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserDTO {

    @Email(message = "邮箱格式不正确")
    private String email;

    private String phone;

    private User.UserStatus status;

    private User.UserRole role;
}