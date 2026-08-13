package dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "ROLE_CUSTOMER", "ROLE_CATEGORY_ADMIN", or "ROLE_SUPER_ADMIN"
    private String managedCategory; // "Audio", "Wearables", "Gaming", "Electronics", "Fashion", "Smart Home", or "ALL"
}
