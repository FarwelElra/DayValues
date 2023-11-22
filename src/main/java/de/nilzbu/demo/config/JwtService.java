package de.nilzbu.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.Nonnull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = "496634580de9e9dedf34e22eb78d59f80971f3a78d1e65ac5b2ac8277badec92";

    public String extractUserName(@Nonnull String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Claims extraxtAllClaims(@Nonnull String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String generateToken(@Nonnull UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(@Nonnull Map<String, Object> extraClaims, @Nonnull UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(@Nonnull String token, @Nonnull UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(@Nonnull String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(@Nonnull String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(@Nonnull String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extraxtAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
