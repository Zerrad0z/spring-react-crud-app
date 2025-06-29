package com.example.crud_app.service;

import com.example.crud_app.dto.CreateUserDTO;
import com.example.crud_app.dto.UpdateUserDTO;
import com.example.crud_app.dto.UserDTO;
import com.example.crud_app.entity.User;
import com.example.crud_app.enums.Role;
import com.example.crud_app.exception.UserAlreadyExistsException;
import com.example.crud_app.exception.UserNotFoundException;
import com.example.crud_app.mapper.UserMapper;
import com.example.crud_app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void getAllUsers_ShouldReturnUserDTOList() {
        // Given
        User user1 = User.builder().id(1L).username("john").role(Role.USER).build();
        User user2 = User.builder().id(2L).username("admin").role(Role.ADMIN).build();
        List<User> users = Arrays.asList(user1, user2);

        UserDTO userDTO1 = new UserDTO(1L, "john", Role.USER);
        UserDTO userDTO2 = new UserDTO(2L, "admin", Role.ADMIN);

        when(userRepository.findAll()).thenReturn(users);
        when(userMapper.toDTO(user1)).thenReturn(userDTO1);
        when(userMapper.toDTO(user2)).thenReturn(userDTO2);

        // When
        List<UserDTO> result = userService.getAllUsers();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(userDTO1, userDTO2);
        verify(userRepository).findAll();
        verify(userMapper, times(2)).toDTO(any(User.class));
    }

    @Test
    void getUserById_ShouldReturnUserDTO_WhenUserExists() {
        // Given
        User user = User.builder().id(1L).username("john").role(Role.USER).build();
        UserDTO userDTO = new UserDTO(1L, "john", Role.USER);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toDTO(user)).thenReturn(userDTO);

        // When
        UserDTO result = userService.getUserById(1L);

        // Then
        assertThat(result).isEqualTo(userDTO);
        verify(userRepository).findById(1L);
        verify(userMapper).toDTO(user);
    }

    @Test
    void getUserById_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.getUserById(999L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User not found with id:999");

        verify(userRepository).findById(999L);
        verify(userMapper, never()).toDTO(any(User.class));
    }

    @Test
    void createUser_ShouldCreateUser_WhenUsernameDoesNotExist() {
        // Given
        CreateUserDTO createDTO = new CreateUserDTO("newuser", "password123", Role.USER);
        User userEntity = User.builder().username("newuser").password("password123").role(Role.USER).build();
        User savedUser = User.builder().id(1L).username("newuser").password("encodedPassword").role(Role.USER).build();
        UserDTO expectedDTO = new UserDTO(1L, "newuser", Role.USER);

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userMapper.toEntity(createDTO)).thenReturn(userEntity);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(userEntity)).thenReturn(savedUser);
        when(userMapper.toDTO(savedUser)).thenReturn(expectedDTO);

        // When
        UserDTO result = userService.createUser(createDTO);

        // Then
        assertThat(result).isEqualTo(expectedDTO);
        verify(userRepository).existsByUsername("newuser");
        verify(userMapper).toEntity(createDTO);
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(userEntity);
        verify(userMapper).toDTO(savedUser);

        // Verify password was encoded and set
        assertThat(userEntity.getPassword()).isEqualTo("encodedPassword");
    }

    @Test
    void createUser_ShouldThrowException_WhenUsernameAlreadyExists() {
        // Given
        CreateUserDTO createDTO = new CreateUserDTO("existinguser", "password123", Role.USER);
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> userService.createUser(createDTO))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("User exists with username: existinguser");

        verify(userRepository).existsByUsername("existinguser");
        verify(userMapper, never()).toEntity(any(CreateUserDTO.class));
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_ShouldUpdateUser_WhenUserExistsAndUsernameNotChanged() {
        // Given
        UpdateUserDTO updateDTO = new UpdateUserDTO("john", Role.ADMIN);
        User existingUser = User.builder().id(1L).username("john").role(Role.USER).build();
        User updatedUser = User.builder().id(1L).username("john").role(Role.ADMIN).build();
        UserDTO expectedDTO = new UserDTO(1L, "john", Role.ADMIN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(existingUser)).thenReturn(updatedUser);
        when(userMapper.toDTO(updatedUser)).thenReturn(expectedDTO);

        // When
        UserDTO result = userService.updateUser(1L, updateDTO);

        // Then
        assertThat(result).isEqualTo(expectedDTO);
        verify(userRepository).findById(1L);
        verify(userMapper).updateUserFromDTO(updateDTO, existingUser);
        verify(userRepository).save(existingUser);
        verify(userMapper).toDTO(updatedUser);
        verify(userRepository, never()).existsByUsername(anyString());
    }

    @Test
    void updateUser_ShouldUpdateUser_WhenUsernameChangedAndNewUsernameAvailable() {
        // Given
        UpdateUserDTO updateDTO = new UpdateUserDTO("newusername", Role.ADMIN);
        User existingUser = User.builder().id(1L).username("oldusername").role(Role.USER).build();
        User updatedUser = User.builder().id(1L).username("newusername").role(Role.ADMIN).build();
        UserDTO expectedDTO = new UserDTO(1L, "newusername", Role.ADMIN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByUsername("newusername")).thenReturn(false);
        when(userRepository.save(existingUser)).thenReturn(updatedUser);
        when(userMapper.toDTO(updatedUser)).thenReturn(expectedDTO);

        // When
        UserDTO result = userService.updateUser(1L, updateDTO);

        // Then
        assertThat(result).isEqualTo(expectedDTO);
        verify(userRepository).findById(1L);
        verify(userRepository).existsByUsername("newusername");
        verify(userMapper).updateUserFromDTO(updateDTO, existingUser);
        verify(userRepository).save(existingUser);
        verify(userMapper).toDTO(updatedUser);
    }

    @Test
    void updateUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        UpdateUserDTO updateDTO = new UpdateUserDTO("username", Role.USER);
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.updateUser(999L, updateDTO))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User dont exists with id999");

        verify(userRepository).findById(999L);
        verify(userRepository, never()).existsByUsername(anyString());
        verify(userMapper, never()).updateUserFromDTO(any(), any());
    }

    @Test
    void updateUser_ShouldThrowException_WhenUsernameChangedToExistingUsername() {
        // Given
        UpdateUserDTO updateDTO = new UpdateUserDTO("existinguser", Role.ADMIN);
        User existingUser = User.builder().id(1L).username("currentuser").role(Role.USER).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> userService.updateUser(1L, updateDTO))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("User already exists with user nameexistinguser");

        verify(userRepository).findById(1L);
        verify(userRepository).existsByUsername("existinguser");
        verify(userMapper, never()).updateUserFromDTO(any(), any());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_ShouldDeleteUser_WhenUserExists() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(true);

        // When
        userService.deleteUser(1L);

        // Then
        verify(userRepository).existsById(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.existsById(999L)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> userService.deleteUser(999L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User not found with id999");

        verify(userRepository).existsById(999L);
        verify(userRepository, never()).deleteById(anyLong());
    }

    @Test
    void getUserByUsername_ShouldReturnUser_WhenUserExists() {
        // Given
        User user = User.builder().id(1L).username("john").role(Role.USER).build();
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        // When
        Optional<User> result = userService.getUserByUsername("john");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(user);
        verify(userRepository).findByUsername("john");
    }

    @Test
    void getUserByUsername_ShouldReturnEmpty_WhenUserNotFound() {
        // Given
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUserByUsername("nonexistent");

        // Then
        assertThat(result).isEmpty();
        verify(userRepository).findByUsername("nonexistent");
    }
}