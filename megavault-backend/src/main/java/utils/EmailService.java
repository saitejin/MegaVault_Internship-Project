package utils;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otpCode);
    void sendOrderConfirmationEmail(String toEmail, String name, String orderId, Double totalAmount, String paymentMethod, String upiId);
    void sendOrderCancellationEmail(String toEmail, String name, String orderId, Double totalAmount, String upiId);
}
