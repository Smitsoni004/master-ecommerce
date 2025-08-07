package com.master.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // HTML files mapping
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/static/html/");
        
        registry.addResourceHandler("/html/**")
                .addResourceLocations("classpath:/static/html/");
        
        // CSS files mapping
        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");
        
        // JavaScript files mapping
        registry.addResourceHandler("/javaScript/**")
                .addResourceLocations("classpath:/static/javaScript/");
        
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/javaScript/");
        
        // Static resources
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Root URL ko index.html pe redirect kariye
        registry.addViewController("/").setViewName("forward:/html/index.html");
    }
}
