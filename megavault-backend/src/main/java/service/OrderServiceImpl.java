package service;

import dto.OrderRequest;
import entity.Order;
import entity.OrderItem;
import repository.OrderRepository;
import exceptionhandler.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .userEmail(request.getUserEmail())
                .totalAmount(request.getTotalAmount())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD")
                .shippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : "Standard Delivery Address")
                .status("PLACED")
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderRequest.OrderItemDto itemDto : request.getItems()) {
                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .productId(itemDto.getProductId())
                        .productTitle(itemDto.getProductTitle())
                        .price(itemDto.getPrice())
                        .quantity(itemDto.getQuantity() != null ? itemDto.getQuantity() : 1)
                        .build();
                order.getItems().add(orderItem);
            }
        }

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUserEmail(String userEmail) {
        return orderRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
