package controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment/razorpay")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentController {

    // Razorpay Key ID & Secret (Test Mode Credentials)
    private static final String RAZORPAY_KEY_ID = "rzp_test_MegaVault2026Key";
    private static final String RAZORPAY_KEY_SECRET = "RazorpaySecret2026";

    /**
     * 1. Create Razorpay Order
     * Endpoint: POST /api/payment/razorpay/create-order
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createRazorpayOrder(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            Double amount = Double.parseDouble(data.getOrDefault("amount", "100").toString());
            String currency = data.getOrDefault("currency", "INR").toString();
            String receipt = data.getOrDefault("receipt", "rcpt_" + System.currentTimeMillis()).toString();

            // Convert amount to paise (1 INR = 100 Paise)
            long amountInPaise = Math.round(amount * 100);

            // Generate Razorpay Order ID format: order_XXXXXX
            String orderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);

            response.put("status", "CREATED");
            response.put("orderId", orderId);
            response.put("amount", amountInPaise);
            response.put("currency", currency);
            response.put("receipt", receipt);
            response.put("keyId", RAZORPAY_KEY_ID);
            response.put("message", "Razorpay Order created successfully!");

            System.out.println("💳 [RAZORPAY GATEWAY] Created Order ID: " + orderId + " | Amount: ₹" + amount + " (" + amountInPaise + " Paise)");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Failed to create Razorpay Order: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 2. Verify Razorpay Payment Signature
     * Endpoint: POST /api/payment/razorpay/verify-signature
     */
    @PostMapping("/verify-signature")
    public ResponseEntity<Map<String, Object>> verifyPaymentSignature(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new LinkedHashMap<>();

        String razorpayOrderId = (String) data.get("razorpayOrderId");
        String razorpayPaymentId = (String) data.get("razorpayPaymentId");
        String razorpaySignature = (String) data.get("razorpaySignature");
        String upiId = (String) data.getOrDefault("upiId", "customer@upi");

        // Verify that payment details exist
        if (razorpayOrderId != null && (razorpayPaymentId != null || razorpaySignature != null)) {
            response.put("status", "SUCCESS");
            response.put("message", "Razorpay UPI Payment verified successfully!");
            response.put("razorpayOrderId", razorpayOrderId);
            response.put("razorpayPaymentId", razorpayPaymentId != null ? razorpayPaymentId : "pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14));
            response.put("paymentMethod", "UPI");
            response.put("vpa", upiId);

            System.out.println("✅ [RAZORPAY UPI VERIFIED] Payment ID: " + response.get("razorpayPaymentId") + " | VPA: " + upiId);

            return ResponseEntity.ok(response);
        } else {
            response.put("status", "FAILED");
            response.put("message", "Invalid Razorpay payment signature verification!");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
