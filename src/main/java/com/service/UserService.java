package com.service;

import com.model.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getUserByUsername(String username);

    User getUserById(Long id);

    void saveUser(User user);

    void deleteUser(Long id);

}
