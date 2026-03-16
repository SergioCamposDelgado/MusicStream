package com.musicstream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MusicStreamApplication {  

    public static void main(String[] args) {
        SpringApplication.run(MusicStreamApplication.class, args);
    }
}