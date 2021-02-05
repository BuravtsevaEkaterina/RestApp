package com.controller;

import com.model.Role;
import com.model.User;
import com.service.RoleService;
import com.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@RestController
public class RestUserController {

    private UserService userService;
    private RoleService roleService;
    private PasswordEncoder passwordEncoder;

    public RestUserController(UserService userService,
                               RoleService roleService,
                               PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getOneUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/users")
    public void saveNewUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roleSet = new HashSet<>();
        for (Role userRole : user.getRoles()) {
            roleSet.add(roleService.getRoleByName(userRole.getRolename()));
        }
        user.setRoles(roleSet);
        userService.saveUser(user);
    }

    @PutMapping("/edit")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        try {
            User updUser = userService.getUserById(user.getId());
            if (user.getPassword() != null && !user.getPassword().equals("")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
                user.setPassword(updUser.getPassword());
            }
            Set<Role> roleSet = new HashSet<>();
            for (Role role : user.getRoles()) {
                roleSet.add(roleService.getRoleByName(role.getRolename()));
            }
            user.setRoles(roleSet);
            userService.saveUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

}
