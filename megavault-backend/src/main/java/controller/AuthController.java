package controller;

import dto.AuthRequest;
import dto.AuthResponse;
import dto.OtpRequest;
import dto.RegisterRequest;
import entity.User;
import service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 0. Get All System Users Present in Database
    @GetMapping("/system-users")
    public ResponseEntity<List<User>> getSystemUsers() {
        return ResponseEntity.ok(authService.getSystemUsers());
    }

    // 1. Register Customer / Admin (Triggers OTP Email)
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        if (response.getUser() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // 2. Verify Email OTP Code
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        if (response.getToken() == null && !response.getMessage().contains("already verified")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // 3. Resend OTP Code
    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@RequestParam String email) {
        AuthResponse response = authService.resendOtp(email);
        return ResponseEntity.ok(response);
    }

    // 4. Login User (Customer or Admin)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        if (response.getToken() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
