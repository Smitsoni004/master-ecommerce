package com.master.ecommerce.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Static resources - Correct patterns
                .requestMatchers(
                    "/", 
                    "/index.html", 
                    "/products.html", 
                    "/product-detail.html", 
                    "/cart.html", 
                    "/categories.html", 
                    "/login.html", 
                    "/checkout.html",
                    "/account.html",
                    "/main.css", 
                    "/app.js",
                    "/static/**",
                    "/css/**",
                    "/js/**",
                    "/images/**"
                ).permitAll()
                
                // Account page ko protect kariye (optional)
                // .requestMatchers("/account.html").authenticated()
                
                // Development ke liye sab allow kariye
                .anyRequest().permitAll()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
