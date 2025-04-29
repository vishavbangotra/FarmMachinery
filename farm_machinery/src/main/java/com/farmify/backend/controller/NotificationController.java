// package com.farmify.backend.controller;

// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.farmify.backend.model.User;
// import com.farmify.backend.repository.UserRepository;

// @RestController
// @RequestMapping("/api")
// public class NotificationController {

//     @Autowired
//     private UserRepository userRepository;

//     @PostMapping("/store-token")
//     public ResponseEntity<String> storeToken(@RequestBody Map<String, String> request,
//             @AuthenticationPrincipal UserDetails userDetails) {
//         String pushToken = request.get("pushToken");

//         // Find the user by email or ID from the JWT token
//         User user = userRepository.findByEmail(userDetails.getUsername())
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         // Add the push token to the user's list (avoid duplicates)
//         if (!user.getPushTokens().stream().anyMatch(t -> t.getToken().equals(pushToken))) {
//             user.addPushToken(pushToken);
//             userRepository.save(user);
//         }

//         return ResponseEntity.ok("Token stored successfully");
//     }
// }