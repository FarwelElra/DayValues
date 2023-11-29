package de.nilzbu.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@Configuration
public class Application implements CommandLineRunner {

    @Value("${db_link}")
    private String db_lin;
    @Value("${db_user}")
    private String db_user;
    @Value("${db_auth}")
    private String db_auth;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

    }

}