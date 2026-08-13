package service;

import dto.AuthRequest;
import dto.AuthResponse;
import dto.OtpRequest;
import dto.RegisterRequest;
import entity.User;
import repository.UserRepository;
import utils.EmailService;
import utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    private String generateRandom6DigitOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    @Override
    public List<User> getSystemUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .message("Error: Email address is already registered!")
                    .build();
        }

        String assignedRole = "ROLE_CUSTOMER";
        if (request.getRole() != null) {
            if (request.getRole().equalsIgnoreCase("ROLE_SUPER_ADMIN")) {
                assignedRole = "ROLE_SUPER_ADMIN";
            } else if (request.getRole().equalsIgnoreCase("ROLE_CATEGORY_ADMIN") || request.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
                assignedRole = "ROLE_CATEGORY_ADMIN";
            }
        }

        String managedCategory = request.getManagedCategory() != null ? request.getManagedCategory() : "NONE";
        if (assignedRole.equals("ROLE_SUPER_ADMIN")) {
            managedCategory = "ALL";
        }

        String otp = generateRandom6DigitOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .managedCategory(managedCategory)
                .isVerified(false)
                .otpCode(otp)
                .otpExpiry(expiry)
                .build();

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);

        // Send OTP via Email / Console logger
        emailService.sendOtpEmail(savedUser.getEmail(), otp);

        return AuthResponse.builder()
                .user(savedUser)
                .message("Registration successful! A 6-digit OTP code has been sent to " + savedUser.getEmail() + ". Please verify to activate your account.")
                .build();
    }

    @Override
    public AuthResponse verifyOtp(OtpRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return AuthResponse.builder().message("Error: User account not found!").build();
        }

        User user = optionalUser.get();

        if (user.getIsVerified()) {
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            user.setPassword(null);
            return AuthResponse.builder().token(token).user(user).message("Account is already verified!").build();
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            return AuthResponse.builder().message("Error: Invalid 6-digit OTP code!").build();
        }

        if (user.getOtpExpiry() != null && user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return AuthResponse.builder().message("Error: OTP code has expired! Please click Resend OTP.").build();
        }

        user.setIsVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);

        User verifiedUser = userRepository.save(user);
        verifiedUser.setPassword(null);

        String token = jwtUtil.generateToken(verifiedUser.getEmail(), verifiedUser.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(verifiedUser)
                .message("✅ Email OTP Verified Successfully! Your MegaVault account is now active.")
                .build();
    }

    @Override
    public AuthResponse resendOtp(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return AuthResponse.builder().message("Error: User account not found!").build();
        }

        User user = optionalUser.get();
        String freshOtp = generateRandom6DigitOtp();
        user.setOtpCode(freshOtp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);
        emailService.sendOtpEmail(email, freshOtp);

        return AuthResponse.builder()
                .message("A fresh 6-digit OTP code has been sent to " + email + "!")
                .build();
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return AuthResponse.builder().message("Error: Invalid email address or password!").build();
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder().message("Error: Invalid email address or password!").build();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        user.setPassword(null);

        return AuthResponse.builder()
                .token(token)
                .user(user)
                .message("Logged in successfully as " + user.getRole() + "!")
                .build();
    }
}
