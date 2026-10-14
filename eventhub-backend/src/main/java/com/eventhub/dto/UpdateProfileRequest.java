package com.eventhub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50,
            message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 6, max = 50,
            message = "Password must be between 6 and 50 characters")
    private String password;

    // getters and setters


    public @NotBlank(message = "Name is required") @Size(min = 2, max = 50,
            message = "Name must be between 2 and 50 characters") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "Name is required") @Size(min = 2, max = 50,
            message = "Name must be between 2 and 50 characters") String name) {
        this.name = name;
    }

    public @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {
        this.email = email;
    }

    public @Size(min = 6, max = 50,
            message = "Password must be between 6 and 50 characters") String getPassword() {
        return password;
    }

    public void setPassword(@Size(min = 6, max = 50,
            message = "Password must be between 6 and 50 characters") String password) {
        this.password = password;
    }
}