package com.example.crud_app.service;

import com.example.crud_app.dto.CreateUserDTO;
import com.example.crud_app.dto.LoginDTO;
import com.example.crud_app.dto.UpdateUserDTO;
import com.example.crud_app.dto.UserDTO;
import com.example.crud_app.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long id);

    /*
     * Create User
     */
    UserDTO createUser(CreateUserDTO createUserDTO);

    /*
     * Update an existing User
     */
    UserDTO updateUser(Long id, UpdateUserDTO updateUserDTO);

    /*
     * Delete User
     */
    void deleteUser(Long id);

    /*
     * Loign
     */
    UserDTO login(LoginDTO loginDTO);

    Optional<User> getUserByUsername(String username);
}
