package com.ethara.projectmanager.service;

import com.ethara.projectmanager.dto.JwtResponse;
import com.ethara.projectmanager.dto.LoginRequest;
import com.ethara.projectmanager.dto.MessageResponse;
import com.ethara.projectmanager.dto.RegisterRequest;
import com.ethara.projectmanager.entity.Role;
import com.ethara.projectmanager.entity.User;
import com.ethara.projectmanager.repository.UserRepository;
import com.ethara.projectmanager.security.JwtUtils;
import com.ethara.projectmanager.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getAuthorities().iterator().next().getAuthority());
    }

    public MessageResponse registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        Role role = Role.ROLE_MEMBER;
        if (signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("ADMIN")) {
            role = Role.ROLE_ADMIN;
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }
}
