package com.ecom177.config;

import com.ecom177.entity.User;
import com.ecom177.entity.Category;
import com.ecom177.entity.Product;
import com.ecom177.repository.UserRepository;
import com.ecom177.repository.CategoryRepository;
import com.ecom177.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    
    public DataSeeder(UserRepository userRepository, CategoryRepository categoryRepository, 
                      ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Create default categories
        createDefaultCategories();
        
        // Create sample products
        createSampleProducts();
        
        // Create admin user if not exists
        if (!userRepository.findByUsername("admin").isPresent()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user created - Username: admin, Password: admin123");
        }
        
        // Create test user if not exists
        if (!userRepository.findByUsername("user").isPresent()) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFirstName("Test");
            user.setLastName("User");
            user.setRole(User.Role.USER);
            userRepository.save(user);
            System.out.println("Test user created - Username: user, Password: user123");
        }
    }
    
    private void createDefaultCategories() {
        if (categoryRepository.count() == 0) {
            Category books = new Category();
            books.setName("Books");
            books.setDescription("Books and educational materials");
            categoryRepository.save(books);
            
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Electronic devices and gadgets");
            categoryRepository.save(electronics);
            
            Category clothing = new Category();
            clothing.setName("Clothing");
            clothing.setDescription("Fashion and apparel items");
            categoryRepository.save(clothing);
            
            System.out.println("Default categories created");
        }
    }
    
    private void createSampleProducts() {
        if (productRepository.count() == 0) {
            Category books = categoryRepository.findByName("Books").orElse(null);
            Category electronics = categoryRepository.findByName("Electronics").orElse(null);
            Category clothing = categoryRepository.findByName("Clothing").orElse(null);
            
            if (books != null) {
                Product book1 = new Product();
                book1.setName("Java Programming Guide");
                book1.setDescription("Complete guide to Java programming for beginners and experts");
                book1.setPrice(new BigDecimal("29.99"));
                book1.setStockQuantity(50);
                book1.setCategory(books);
                productRepository.save(book1);
                
                Product book2 = new Product();
                book2.setName("Spring Boot in Action");
                book2.setDescription("Learn Spring Boot framework with practical examples");
                book2.setPrice(new BigDecimal("39.99"));
                book2.setStockQuantity(30);
                book2.setCategory(books);
                productRepository.save(book2);
            }
            
            if (electronics != null) {
                Product laptop = new Product();
                laptop.setName("Gaming Laptop");
                laptop.setDescription("High-performance laptop for gaming and development");
                laptop.setPrice(new BigDecimal("1299.99"));
                laptop.setStockQuantity(10);
                laptop.setCategory(electronics);
                productRepository.save(laptop);
                
                Product phone = new Product();
                phone.setName("Smartphone");
                phone.setDescription("Latest smartphone with advanced features");
                phone.setPrice(new BigDecimal("699.99"));
                phone.setStockQuantity(25);
                phone.setCategory(electronics);
                productRepository.save(phone);
            }
            
            if (clothing != null) {
                Product tshirt = new Product();
                tshirt.setName("Cotton T-Shirt");
                tshirt.setDescription("Comfortable 100% cotton t-shirt");
                tshirt.setPrice(new BigDecimal("19.99"));
                tshirt.setStockQuantity(100);
                tshirt.setCategory(clothing);
                productRepository.save(tshirt);
                
                Product jeans = new Product();
                jeans.setName("Denim Jeans");
                jeans.setDescription("Classic blue denim jeans");
                jeans.setPrice(new BigDecimal("49.99"));
                jeans.setStockQuantity(75);
                jeans.setCategory(clothing);
                productRepository.save(jeans);
            }
            
            System.out.println("Sample products created");
        }
    }
}