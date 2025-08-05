package com.ecom177.service;

import com.ecom177.dto.OrderRequest;
import com.ecom177.dto.OrderResponse;
import com.ecom177.entity.Order;
import com.ecom177.entity.OrderItem;
import com.ecom177.entity.Product;
import com.ecom177.entity.User;
import com.ecom177.exception.ResourceNotFoundException;
import com.ecom177.repository.OrderRepository;
import com.ecom177.repository.OrderItemRepository;
import com.ecom177.repository.ProductRepository;
import com.ecom177.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                       ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
    
    public OrderResponse createOrder(OrderRequest request) {
        User user = getCurrentUser();
        
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus(Order.OrderStatus.PENDING);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (OrderRequest.OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));
            
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new ResourceNotFoundException("Insufficient stock for product: " + product.getName());
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
            
            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(orderItem.getTotalPrice());
            
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }
        
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        return convertToResponse(savedOrder);
    }
    
    public List<OrderResponse> getUserOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Order> orders = orderRepository.findByUserUsernameOrderByOrderDateDesc(username);
        return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!order.getUser().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Access denied to order: " + orderId);
        }
        
        return convertToResponse(order);
    }
    
    public OrderResponse updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        
        return convertToResponse(updatedOrder);
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();
        return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatusOrderByOrderDateDesc(status);
        return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        
        // Restore product stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
        
        orderRepository.delete(order);
    }
    
    private OrderResponse convertToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> orderItemResponses = order.getOrderItems().stream()
                .map(this::convertOrderItemToResponse)
                .collect(Collectors.toList());
        
        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getOrderDate(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getShippingAddress(),
                orderItemResponses,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
    
    private OrderResponse.OrderItemResponse convertOrderItemToResponse(OrderItem orderItem) {
        return new OrderResponse.OrderItemResponse(
                orderItem.getId(),
                orderItem.getProduct().getId(),
                orderItem.getProduct().getName(),
                orderItem.getProduct().getBase64Image(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getTotalPrice()
        );
    }
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}