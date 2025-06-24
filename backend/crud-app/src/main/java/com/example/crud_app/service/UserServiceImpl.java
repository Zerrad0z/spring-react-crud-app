package com.example.crud_app.service;

import com.example.crud_app.dto.CreateUserDTO;
import com.example.crud_app.dto.LoginDTO;
import com.example.crud_app.dto.UpdateUserDTO;
import com.example.crud_app.dto.UserDTO;
import com.example.crud_app.entity.User;
import com.example.crud_app.exception.InvalidCredentialsException;
import com.example.crud_app.exception.UserAlreadyExistsException;
import com.example.crud_app.exception.UserNotFoundException;
import com.example.crud_app.mapper.UserMapper;
import com.example.crud_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    //private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDTO> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .toList();
    }

    @Override
    public UserDTO getUserById(Long id){
        return userRepository.findById(id)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new UserNotFoundException("User not found with id:" + id));
    }

    /*
     * Create User
     */
    @Override
    public UserDTO createUser(CreateUserDTO createUserDTO){
        if (userRepository.existsByUsername(createUserDTO.username())){
            throw  new UserAlreadyExistsException("User exists with username" + createUserDTO.username());
        }
        User user = userMapper.toEntity(createUserDTO);
        User saveUser = userRepository.save(user);
        return userMapper.toDTO(saveUser);
    }

    /*
     * Update an existing User
     */
    @Override
    public UserDTO updateUser(Long id, UpdateUserDTO updateUserDTO){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User dont exists with id"+ id));

        //checks if username is being changed and if it already exists
        if (!user.getUsername().equals(updateUserDTO.username()) &&
        userRepository.existsByUsername(updateUserDTO.username())){
            throw new UserAlreadyExistsException("User already exists with user name"+ updateUserDTO.username());
        }

        userMapper.updateUserFromDTO(updateUserDTO, user);
        User saveUser = userRepository.save(user);
        return userMapper.toDTO(saveUser);
    }

    /*
     * Delete User
     */
    @Override
    public void deleteUser(Long id){
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException("User not found with id"+ id);
        }
        userRepository.deleteById(id);
    }

    /*
     * Loign
     */
    @Override
    public UserDTO login(LoginDTO loginDTO){
        return userRepository.findByUsername(loginDTO.username())
                .filter(user -> user.getPassword().equals(loginDTO.password()))
                .map(userMapper::toDTO)
                .orElseThrow(() -> new InvalidCredentialsException("invalid credentials"));
    }

    @Override
    public Optional<User> getUserByUsername(String username){
        return userRepository.findByUsername(username);
    }

}
