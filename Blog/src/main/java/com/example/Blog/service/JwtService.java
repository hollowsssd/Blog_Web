package com.example.Blog.service;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${PRIVATE_KEY}")
    private String privateKey;

    public JwtService() {
        try {
            KeyGenerator key = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = key.generateKey();
            privateKey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public String generateToken(Integer id, String email, String name, boolean admin, String createdAt) {
        
        Map<String, Object> claim = new HashMap<>();
        claim.put("id", id);
        claim.put("name", name);
        claim.put("admin", admin);
        claim.put("createdAt", createdAt);
        return Jwts.builder()
                .claims()
                .subject(email)
                .add(claim)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .and()
                .signWith(getKey())
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyByte = Decoders.BASE64.decode(privateKey);
        return Keys.hmacShaKeyFor(keyByte);
    }

    public String extract(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    public Integer extractId(String token) {
        Claims claims = extractAllClaims(token);
        return (Integer) claims.get("id");
    }

    public Boolean extractAdmin(String token) {

        return extractClaim(token, Claims -> (Boolean) Claims.get("admin"));

    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extract(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

}
