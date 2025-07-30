package com.example.Blog.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


public class UserPrincipal implements UserDetails {

    private final Users user;

    public UserPrincipal(Users user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Nếu admin = true thì ROLE_ADMIN, ngược lại ROLE_USER
        String role = user.getAdmin() ? "ROLE_ADMIN" : "ROLE_USER";
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // Dùng email làm username
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // không dùng tính năng này nên luôn true
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.getBanned(); // nếu banned = true thì không cho login
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // không dùng tính năng này nên luôn true
    }

    @Override
    public boolean isEnabled() {
        return !user.getBanned(); // nếu bị banned thì disable
    }

    public Users getUser() {
        return user;
    }
}
