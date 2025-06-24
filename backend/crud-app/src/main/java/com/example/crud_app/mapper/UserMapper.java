package com.example.crud_app.mapper;

import com.example.crud_app.dto.CreateUserDTO;
import com.example.crud_app.dto.UpdateUserDTO;
import com.example.crud_app.dto.UserDTO;
import com.example.crud_app.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDTO(User user);

    @Mapping(target = "id", ignore = true)
    User toEntity(CreateUserDTO createUserDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateUserFromDTO(UpdateUserDTO updateUserDTO, @MappingTarget User user);
}
