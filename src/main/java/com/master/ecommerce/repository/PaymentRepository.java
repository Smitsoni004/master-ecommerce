package com.master.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.master.ecommerce.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}