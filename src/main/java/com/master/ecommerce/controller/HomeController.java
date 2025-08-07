package com.master.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "forward:/html/index.html";
    }

    @GetMapping("/index")
    public String index() {
        return "forward:/html/index.html";
    }
    
    // Other page mappings
    @GetMapping("/products")
    public String products() {
        return "forward:/html/products.html";
    }
    
    @GetMapping("/cart")
    public String cart() {
        return "forward:/html/cart.html";
    }
    
    @GetMapping("/account")
    public String account() {
        return "forward:/html/account.html";
    }
}
