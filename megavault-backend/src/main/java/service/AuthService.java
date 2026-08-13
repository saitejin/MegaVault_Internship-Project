package service;

import dto.AuthRequest;
import dto.AuthResponse;
import dto.OtpRequest;
import dto.RegisterRequest;
import entity.User;
import java.util.List;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse verifyOtp(OtpRequest request);
    AuthResponse resendOtp(String email);
    AuthResponse login(AuthRequest request);
    List<User> getSystemUsers();
}
