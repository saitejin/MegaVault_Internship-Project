package entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    private String role = "ROLE_CUSTOMER"; // ROLE_CUSTOMER, ROLE_CATEGORY_ADMIN, ROLE_SUPER_ADMIN

    private String managedCategory; // "Audio", "Wearables", "Gaming", "Electronics", "Fashion", "Smart Home", or "ALL"

    @Builder.Default
    private Boolean isVerified = false; // Email OTP verification flag

    private String otpCode; // 6-digit OTP code

    private LocalDateTime otpExpiry; // Expiry timestamp
}
