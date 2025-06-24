package com.example.crud_app.controller;

import com.example.crud_app.dto.CreateUserDTO;
import com.example.crud_app.dto.LoginDTO;
import com.example.crud_app.dto.UpdateUserDTO;
import com.example.crud_app.dto.UserDTO;
import com.example.crud_app.entity.User;
import com.example.crud_app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.ParameterScriptAssert;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @GetMapping("/username/{username}")
    public Optional<User> getUserByUsername(@PathVariable String username){
        return userService.getUserByUsername(username);
    }

    /*
     * Create User
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createUser(@RequestBody CreateUserDTO createUserDTO){
        return userService.createUser(createUserDTO);
    }

    /*
     * Update User
     * PUT /api/v1/users/1
     */
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id,
                              @RequestBody UpdateUserDTO updateUserDTO){
        return userService.updateUser(id, updateUserDTO);
    }

    /*
     * Delete User
     * DELETE /api/v1/users/1
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }

    /*
     * Loign
     */
    @PostMapping("/login")
    public UserDTO login(@RequestBody LoginDTO loginDTO){
        return userService.login(loginDTO);
    }
}
