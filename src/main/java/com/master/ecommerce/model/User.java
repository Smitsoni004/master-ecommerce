package com.master.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ✅ Ye sahi hai
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String passwordHash;

    private String phone;

    private String role; // e.g. "CUSTOMER", "ADMIN", "SELLER"

    private String address;
}
