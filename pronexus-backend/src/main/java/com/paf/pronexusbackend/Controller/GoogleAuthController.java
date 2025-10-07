package com.paf.pronexusbackend.Controller;

import com.paf.pronexusbackend.model.User;
import com.paf.pronexusbackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    private static final Logger logger = Logger.getLogger(GoogleAuthController.class.getName());

    private final UserService userService;
    private final RestTemplate restTemplate;

    @Value("${google.client.id}")
    private String googleClientId;

    @Autowired
    public GoogleAuthController(UserService userService, RestTemplate restTemplate) {
        this.userService = userService;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        
        logger.info("Received Google authentication request");
        
        // Debug if token is present
        if (token == null || token.isEmpty()) {
            logger.warning("Token is missing from the request");
            return ResponseEntity.badRequest().body(Map.of("error", "Token is missing"));
        }
        
        logger.info("Token received (length: " + token.length() + ")");
        
        try {
            // Verify token with Google
            String googleTokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;
            logger.info("Verifying token with Google: " + googleTokenInfoUrl);
            
            Map<String, Object> googleResponse = null;
            try {
                googleResponse = restTemplate.getForObject(googleTokenInfoUrl, Map.class);
                logger.info("Google verification response received");
            } catch (Exception e) {
                logger.severe("Error while verifying token with Google: " + e.getMessage());
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to verify token with Google: " + e.getMessage()));
            }
            
            if (googleResponse == null) {
                logger.warning("Google returned null response");
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid Google token"));
            }
            
            // Extract email from Google response
            String email = (String) googleResponse.get("email");
            String name = (String) googleResponse.get("name");
            String picture = (String) googleResponse.get("picture");
            
            if (email == null) {
                logger.warning("No email found in Google response");
                return ResponseEntity.badRequest().body(Map.of("error", "No email found in Google token"));
            }
            
            logger.info("Email from Google: " + email);
            
            // Check if user exists
            Optional<User> existingUser = userService.getUserByUsername(email);
            
            User user;
            if (existingUser.isPresent()) {
                logger.info("Existing user found with email: " + email);
                user = existingUser.get();
            } else {
                logger.info("Creating new user with email: " + email);
                // Create new user
                user = new User();
                user.setUsername(email);
                user.setPassword("GOOGLE_AUTH"); // Just a placeholder, actual auth is through Google
                
                // Create JSON user data with profile info
                String userData = String.format(
                    "{\"name\":\"%s\",\"email\":\"%s\",\"picture\":\"%s\",\"provider\":\"google\"}",
                    name, email, picture
                );
                user.setUserData(userData);
                
                user = userService.createUser(user);
                logger.info("New user created successfully");
            }
            
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            logger.severe("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }
} 