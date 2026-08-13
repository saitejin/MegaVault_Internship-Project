package dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    private Long userId;
    private String userEmail;
    private Double totalAmount;
    private String paymentMethod;
    private String shippingAddress;
    private List<OrderItemDto> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDto {
        private Long productId;
        private String productTitle;
        private Double price;
        private Integer quantity;
    }
}
