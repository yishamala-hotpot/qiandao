package vo;

import lombok.Data;

@Data
public class LoginResponseVO {

    private String token;
    private UserVO user;

    public LoginResponseVO(String token, UserVO user) {
        this.token = token;
        this.user = user;
    }
}
