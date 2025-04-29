package com.farmify.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a JWT with:
     * - subject = the user’s ID
     * - a custom claim "phoneNumber"
     */
    public String generateToken(Long userId, String phoneNumber) {
        return Jwts.builder()
                .setSubject(userId.toString()) // <-- subject is userId
                .claim("phoneNumber", phoneNumber) // <-- custom claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 30)) // 30 hours
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate the token’s signature and expiration,
     * then return all its claims (including subject and phoneNumber).
     */
    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Helper: extract the userId (from subject) and phoneNumber claim.
     */
    public Long extractUserId(String token) {
        String subject = validateToken(token).getSubject();
        return Long.valueOf(subject);
    }

    public String extractPhoneNumber(String token) {
        return validateToken(token).get("phoneNumber", String.class);
    }
}
