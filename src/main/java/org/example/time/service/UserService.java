package org.example.time.service;

import org.example.time.entity.User;
import dto.CreateUserDTO;
import dto.UpdateUserDTO;
import vo.UserVO;

import java.util.List;

public interface UserService {

    // 创建用户
    User createUser(CreateUserDTO userDTO);

    // 根据ID获取用户
    User getUserById(Long id);

    // 获取所有用户
    List<User> getAllUsers();

    // 更新用户
    User updateUser(Long id, UpdateUserDTO userDTO);

    // 删除用户
    void deleteUser(Long id);

    // 根据用户名查询用户
    User getUserByUsername(String username);

    // 分页查询
    List<User> getUsersByPage(int page, int size);

    // 转换实体为VO
    UserVO convertToVO(User user);
}