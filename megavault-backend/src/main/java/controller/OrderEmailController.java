package controller;

import utils.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderEmailController {

    private final EmailService emailService;

    @Autowired
    public OrderEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Send Order Confirmation Email
     * Endpoint: POST /api/email/order-confirmation
     */
    @PostMapping("/order-confirmation")
    public ResponseEntity<Map<String, Object>> sendOrderConfirmation(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            String email = (String) data.getOrDefault("email", "customer@megavault.com");
            String name = (String) data.getOrDefault("name", "Valued Customer");
            String orderId = (String) data.getOrDefault("orderId", "ORD-100000");
            Double totalAmount = Double.parseDouble(data.getOrDefault("totalAmount", "0.0").toString());
            String paymentMethod = (String) data.getOrDefault("paymentMethod", "Razorpay UPI");
            String upiId = (String) data.getOrDefault("upiId", "N/A");

            emailService.sendOrderConfirmationEmail(email, name, orderId, totalAmount, paymentMethod, upiId);

            response.put("status", "SUCCESS");
            response.put("message", "Order confirmation email sent successfully to " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Failed to send email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Send Order Cancellation Email
     * Endpoint: POST /api/email/order-cancellation
     */
    @PostMapping("/order-cancellation")
    public ResponseEntity<Map<String, Object>> sendOrderCancellation(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            String email = (String) data.getOrDefault("email", "customer@megavault.com");
            String name = (String) data.getOrDefault("name", "Valued Customer");
            String orderId = (String) data.getOrDefault("orderId", "ORD-100000");
            Double totalAmount = Double.parseDouble(data.getOrDefault("totalAmount", "0.0").toString());
            String upiId = (String) data.getOrDefault("upiId", "N/A");

            emailService.sendOrderCancellationEmail(email, name, orderId, totalAmount, upiId);

            response.put("status", "SUCCESS");
            response.put("message", "Order cancellation email sent successfully to " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Failed to send email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
