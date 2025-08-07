package com.master.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.master.ecommerce.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}