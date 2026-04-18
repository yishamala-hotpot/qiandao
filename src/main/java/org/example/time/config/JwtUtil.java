package org.example.time.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.example.time.entity.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor("your-secret-key-for-jwt-token-generation-must-be-long-enough".getBytes(StandardCharsets.UTF_8));

    private final long EXPIRATION_TIME = 86400000;

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 从JWT令牌中获取用户名
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // 从JWT令牌中获取用户ID
    public Long extractUserId(String token) {
        return extractClaims(token).get("id", Long.class);
    }

    // 从JWT令牌中获取用户角色
    public User.UserRole extractUserRole(String token) {
        return User.UserRole.valueOf(extractClaims(token).get("role", String.class));
    }

    // 验证JWT令牌是否过期
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // 验证JWT令牌是否有效
    public boolean validateToken(String token, User user) {
        String username = extractUsername(token);
        return username.equals(user.getUsername()) && !isTokenExpired(token);
    }
}
