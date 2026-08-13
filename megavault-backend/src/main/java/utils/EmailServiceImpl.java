package utils;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    private static final String SENDER_EMAIL = "tejs59885@gmail.com";
    private static final String SENDER_NAME = "MegaVault Store";

    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        System.out.println("\n=================================================");
        System.out.println("📧 [MEGAVAULT EMAIL SERVICE] REGISTRATION OTP");
        System.out.println("-------------------------------------------------");
        System.out.println("📩 Recipient Email : " + toEmail);
        System.out.println("🔑 6-Digit OTP Code: " + otpCode);
        System.out.println("⏰ Expiry          : Valid for 10 Minutes");
        System.out.println("=================================================\n");

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(SENDER_EMAIL, SENDER_NAME);
                helper.setTo(toEmail);
                helper.setSubject("Your MegaVault Verification OTP: " + otpCode);
                helper.setText("<h2>Welcome to MegaVault!</h2><p>Your 6-digit verification code is: <strong>" + otpCode + "</strong></p>", true);
                mailSender.send(message);
                System.out.println("✅ Real SMTP Email sent successfully to " + toEmail);
            } catch (Exception e) {
                System.err.println("⚠️ SMTP Email error: " + e.getMessage());
            }
        }
    }

    @Override
    public void sendOrderConfirmationEmail(String toEmail, String name, String orderId, Double totalAmount, String paymentMethod, String upiId) {
        System.out.println("\n=================================================");
        System.out.println("🎉 [MEGAVAULT EMAIL SERVICE] ORDER CONFIRMATION SENT!");
        System.out.println("-------------------------------------------------");
        System.out.println("📩 Recipient Email : " + toEmail);
        System.out.println("👤 Customer Name   : " + name);
        System.out.println("📦 Order ID        : #" + orderId);
        System.out.println("💰 Total Amount    : ₹" + totalAmount);
        System.out.println("💳 Payment Method  : " + paymentMethod + " (" + upiId + ")");
        System.out.println("🚚 Shipping Status : CONFIRMED • Preparing for Dispatch");
        System.out.println("📄 Subject         : Order #" + orderId + " Confirmed - MegaVault Store");
        System.out.println("=================================================\n");

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(SENDER_EMAIL, SENDER_NAME);
                helper.setTo(toEmail);
                helper.setSubject("Order #" + orderId + " Confirmed! - MegaVault Store");
                String htmlBody = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                        + "<h2 style='color: #F97316;'>🎉 Thank You for Your Order, " + name + "!</h2>"
                        + "<p>Your order <strong>#" + orderId + "</strong> has been confirmed and is being processed.</p>"
                        + "<div style='background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;'>"
                        + "<p><strong>Order ID:</strong> #" + orderId + "</p>"
                        + "<p><strong>Total Amount:</strong> ₹" + totalAmount + "</p>"
                        + "<p><strong>Payment Method:</strong> " + paymentMethod + " (" + upiId + ")</p>"
                        + "<p><strong>Status:</strong> CONFIRMED 🟢</p>"
                        + "</div>"
                        + "<p>We will notify you once your shipment is out for delivery.</p>"
                        + "<hr><small>MegaVault Store • Secure Shopping Platform</small></div>";
                helper.setText(htmlBody, true);
                mailSender.send(message);
                System.out.println("✅ Real SMTP Email sent successfully to " + toEmail);
            } catch (Exception e) {
                System.err.println("⚠️ SMTP Email error: " + e.getMessage());
            }
        }
    }

    @Override
    public void sendOrderCancellationEmail(String toEmail, String name, String orderId, Double totalAmount, String upiId) {
        System.out.println("\n=================================================");
        System.out.println("🛑 [MEGAVAULT EMAIL SERVICE] ORDER CANCELLATION SENT!");
        System.out.println("-------------------------------------------------");
        System.out.println("📩 Recipient Email : " + toEmail);
        System.out.println("👤 Customer Name   : " + name);
        System.out.println("📦 Order ID        : #" + orderId);
        System.out.println("💰 Refund Amount   : ₹" + totalAmount);
        System.out.println("🏦 Refund Destination: " + (upiId != null && !upiId.equals("N/A") ? upiId : "Original Payment Method"));
        System.out.println("📄 Subject         : Order #" + orderId + " Cancelled - Refund Initiated");
        System.out.println("=================================================\n");

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(SENDER_EMAIL, SENDER_NAME);
                helper.setTo(toEmail);
                helper.setSubject("Order #" + orderId + " Cancelled - Refund Initiated");
                String htmlBody = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                        + "<h2 style='color: #EF4444;'>🛑 Order #" + orderId + " Cancelled</h2>"
                        + "<p>Dear " + name + ", your order has been cancelled per your request.</p>"
                        + "<div style='background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fee2e2;'>"
                        + "<p><strong>Refund Amount:</strong> ₹" + totalAmount + "</p>"
                        + "<p><strong>Refund Account:</strong> " + (upiId != null && !upiId.equals("N/A") ? upiId : "Original Payment Method") + "</p>"
                        + "<p><strong>Status:</strong> REFUND INITIATED (24-48 Hours)</p>"
                        + "</div>"
                        + "<hr><small>MegaVault Store • Secure Shopping Platform</small></div>";
                helper.setText(htmlBody, true);
                mailSender.send(message);
                System.out.println("✅ Real SMTP Cancellation Email sent successfully to " + toEmail);
            } catch (Exception e) {
                System.err.println("⚠️ SMTP Email error: " + e.getMessage());
            }
        }
    }
}
