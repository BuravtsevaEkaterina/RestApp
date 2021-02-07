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
@RequestMapping("/rest/admin")
public class RestAdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public RestAdminController(UserService userService,
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

    @PostMapping("/users")
    public void saveNewUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        Set<Role> roleSet = new HashSet<>();
//        for (Role userRole : user.getRoles()) {
//            roleSet.add(roleService.getRoleByName(userRole.getRolename()));
//        }
//        user.setRoles(roleSet);
        user.setRoles(setRoles(user.getRoles()));

        userService.saveUser(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@RequestBody User user,
                                        @PathVariable Long id) {
        try {
            User updUser = userService.getUserById(id);
            if (user.getPassword() != null && !user.getPassword().equals("")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
                user.setPassword(updUser.getPassword());
            }
//            Set<Role> roleSet = new HashSet<>();
//            for (Role role : user.getRoles()) {
//                roleSet.add(roleService.getRoleByName(role.getRolename()));
//            }

            user.setRoles(setRoles(user.getRoles()));
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

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getOneUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    private Set<Role> setRoles(Set<Role> roles) {
        Set<Role> roleSet = new HashSet<>();
        for (Role role : roles) {
            roleSet.add(roleService.getRoleByName(role.getRolename()));
        }
        return roleSet;
    }
}

