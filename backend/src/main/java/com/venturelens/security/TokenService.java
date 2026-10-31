package com.venturelens.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Service
public class TokenService {

    @Value("${venturelens.jwt.secret:VentureLensSecureSecretKey2026SuperStrongFintechIntelligencePlatform987654321}")
    private String secret;

    @Value("${venturelens.jwt.expiration-ms:86400000}") // 24 hours
    private long expirationMs;

    public String generateToken(Long userId, String email, String role, String name) {
        long expiry = System.currentTimeMillis() + expirationMs;
        // payload: userId:email:role:name:expiry
        String safeName = (name != null) ? name.replace(":", " ") : "";
        String payload = userId + ":" + email + ":" + role + ":" + safeName + ":" + expiry;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedPayload);
        return encodedPayload + "." + signature;
    }

    public TokenClaims parseToken(String token) {
        if (token == null || !token.contains(".")) {
            return null;
        }
        String[] parts = token.split("\\.");
        if (parts.length != 2) {
            return null;
        }

        String encodedPayload = parts[0];
        String signature = parts[1];

        // verify signature
        String expectedSignature = sign(encodedPayload);
        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8))) {
            return null;
        }

        try {
            byte[] decoded = Base64.getUrlDecoder().decode(encodedPayload);
            String payload = new String(decoded, StandardCharsets.UTF_8);
            String[] fields = payload.split(":", 5);
            if (fields.length < 5) {
                return null;
            }

            Long userId = Long.parseLong(fields[0]);
            String email = fields[1];
            String role = fields[2];
            String name = fields[3];
            long expiry = Long.parseLong(fields[4]);

            if (System.currentTimeMillis() > expiry) {
                return null; // Expired
            }

            return new TokenClaims(userId, email, role, name);
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hmacBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error signing token", e);
        }
    }

    public static class TokenClaims {
        private final Long userId;
        private final String email;
        private final String role;
        private final String name;

        public TokenClaims(Long userId, String email, String role, String name) {
            this.userId = userId;
            this.email = email;
            this.role = role;
            this.name = name;
        }

        public Long getUserId() {
            return userId;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }

        public String getName() {
            return name;
        }
    }
}
