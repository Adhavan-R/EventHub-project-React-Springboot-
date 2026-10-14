package com.eventhub.service;

import com.eventhub.model.User;
import com.eventhub.service.CategoryService;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserCategoryScoreRepository;
import com.eventhub.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private EventService eventService;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserCategoryScoreRepository userCategoryScoreRepository;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private UserService userService;

    private User user;
    private User savedUser;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setName("John");
        user.setEmail("john@gmail.com");
        user.setPassword("password123");

        savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("John");
        savedUser.setEmail("john@gmail.com");
        savedUser.setPassword("encodedPassword");
    }

    @Test
    void registerUserSuccessfully() {

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode(user.getPassword()))
                .thenReturn("encodedPassword");

        when(userRepository.save(user))
                .thenReturn(savedUser);

        User result = userService.register(user);

        assertEquals("John", result.getName());
        assertEquals("john@gmail.com", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());

        verify(userRepository).findByEmail(user.getEmail());
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(user);
    }

}