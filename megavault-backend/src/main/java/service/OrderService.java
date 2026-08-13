package service;

import dto.OrderRequest;
import entity.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(OrderRequest request);
    List<Order> getAllOrders();
    List<Order> getOrdersByUserEmail(String userEmail);
    List<Order> getOrdersByUserId(Long userId);
    Optional<Order> getOrderById(Long id);
    Order updateOrderStatus(Long orderId, String status);
}
