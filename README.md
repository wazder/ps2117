# 🛒 E-Commerce Application (ecom177)

**A modern, full-stack e-commerce application built with Spring Boot and React**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

This full-stack e-commerce application provides a complete online shopping experience with modern UI/UX, secure authentication, and comprehensive admin management capabilities. Built with industry-standard technologies and best practices.

### 🎯 Key Highlights

- **Secure Authentication**: JWT-based authentication with role-based access control
- **Modern UI**: Responsive React frontend with clean, intuitive design
- **Admin Dashboard**: Complete order management and product administration
- **Real-time Features**: Live cart updates and order status tracking
- **Scalable Architecture**: Clean separation of concerns with RESTful API design
- **Production Ready**: Error boundaries, validation, and monitoring capabilities

## ✨ Features

### 🔐 **Authentication & Authorization**
- User registration and login
- JWT token-based authentication
- Role-based access control (USER/ADMIN)
- Secure password encryption with BCrypt
- Automatic token management and refresh

### 🛍️ **Product Management**
- Complete CRUD operations for products
- Image upload with base64 conversion (1MB limit)
- Category-based product organization
- Advanced search and filtering
- Pagination for large product catalogs
- Admin-only product management interface

### 🛒 **Shopping Cart**
- Add/remove products from cart
- Real-time cart updates
- Persistent cart storage
- Cart badge with item count
- Seamless checkout process

### 📦 **Order Management**
- Complete order lifecycle management
- Order status tracking (Pending → Confirmed → Shipped → Delivered)
- Admin order management dashboard
- Order history for customers
- Stock management and restoration
- Comprehensive order analytics

### 👤 **User Experience**
- Responsive design for all devices
- Intuitive navigation and UI
- Real-time notifications and feedback
- Error boundaries for graceful error handling
- Professional loading states and animations

### 🔧 **Admin Features**
- Admin dashboard with order statistics
- Product management (CRUD operations)
- Order status management
- User order tracking
- System analytics and monitoring

## 🛠️ Technology Stack

### **Backend**
- **Java 17** - Modern Java with latest features
- **Spring Boot 3.2.0** - Enterprise-grade framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations and ORM
- **PostgreSQL** - Reliable relational database
- **Liquibase** - Database migration and version control
- **JWT** - Stateless authentication tokens
- **Swagger/OpenAPI** - API documentation
- **Maven** - Dependency management and build tool

### **Frontend**
- **React 19.1.0** - Modern UI library with latest features
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Modern React Hooks** - useState, useEffect, useCallback, useMemo
- **CSS3** - Custom styling with responsive design
- **LocalStorage** - Client-side data persistence

### **Development & Deployment**
- **Node.js 16+** - JavaScript runtime
- **npm** - Package manager
- **Git** - Version control
- **Environment Variables** - Configuration management

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Client  │ ◄─────────────► │  Spring Boot    │
│                 │                 │   Backend       │
│ • Components    │                 │                 │
│ • Hooks         │                 │ • Controllers   │
│ • Axios         │                 │ • Services      │
│ • LocalStorage  │                 │ • Repositories  │
└─────────────────┘                 └─────────────────┘
                                             │
                                             │ JPA/Hibernate
                                             ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │    Database     │
                                    │                 │
                                    │ • Users         │
                                    │ • Products      │
                                    │ • Categories    │
                                    │ • Orders        │
                                    └─────────────────┘
```

### **Design Patterns Used**
- **MVC (Model-View-Controller)** - Clear separation of concerns
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic encapsulation
- **DTO Pattern** - Data transfer optimization
- **Factory Pattern** - Object creation management

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Java 17+** - [Download here](https://adoptium.net/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Maven 3.6+** - [Download here](https://maven.apache.org/download.cgi)
- **Git** - [Download here](https://git-scm.com/downloads)

### **System Requirements**
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux

## 🚀 Installation & Setup

### **1. Clone Repository**
```bash
git clone https://github.com/wazder/ecom177.git
cd ecom177
```

### **2. Database Setup**
```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql@14  # macOS

# Create database
createdb ecom177

# Create user (optional)
psql -c "CREATE USER ecom_user WITH PASSWORD 'your_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE ecom177 TO ecom_user;"
```

### **3. Backend Configuration**
```bash
# Navigate to project root
cd ecom177

# Update database credentials in src/main/resources/application.properties
spring.datasource.username=your_username
spring.datasource.password=your_password

# Set environment variables (recommended for production)
export JWT_SECRET=your-super-secret-jwt-key-here
export DATABASE_USERNAME=your_username
export DATABASE_PASSWORD=your_password
```

### **4. Backend Setup**
```bash
# Install dependencies and run
mvn clean install
mvn spring-boot:run

# Backend will start on http://localhost:8080
```

### **5. Frontend Setup**
```bash
# Navigate to frontend directory
cd ecom-frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend will start on http://localhost:3000
```

### **6. Verify Installation**
- Backend API: http://localhost:8080/swagger-ui/index.html
- Frontend App: http://localhost:3000
- Health Check: http://localhost:8080/actuator/health

## 📚 API Documentation

### **Interactive Documentation**
Visit `http://localhost:8080/swagger-ui/index.html` for complete interactive API documentation.

### **Key Endpoints**

#### **Authentication**
```http
POST /api/auth/register - User registration
POST /api/auth/login    - User login
```

#### **Products**
```http
GET    /api/products         - List all products
POST   /api/products         - Create product (Admin)
PUT    /api/products/{id}    - Update product (Admin)
DELETE /api/products/{id}    - Delete product (Admin)
GET    /api/products/search  - Search products
```

#### **Orders**
```http
GET    /api/orders/my-orders     - User's orders
POST   /api/orders              - Create order
GET    /api/orders/admin/all    - All orders (Admin)
GET    /api/orders/admin/pending - Pending orders (Admin)
PUT    /api/orders/{id}/status  - Update order status (Admin)
DELETE /api/orders/{id}         - Delete order (Admin)
```

#### **Categories**
```http
GET    /api/categories     - List categories
POST   /api/categories     - Create category (Admin)
PUT    /api/categories/{id} - Update category (Admin)
DELETE /api/categories/{id} - Delete category (Admin)
```

## 📖 Usage Guide

### **Getting Started**

1. **Access the Application**
   - Open http://localhost:3000 in your browser
   - You'll be redirected to the login page

2. **Create Account**
   - Click "Register" to create a new account
   - Fill in your details and submit
   - You'll be automatically logged in

3. **Browse Products**
   - View all available products
   - Use search and filter options
   - Click shopping cart icon to add items

4. **Manage Cart**
   - View cart contents
   - Adjust quantities or remove items
   - Proceed to checkout

5. **Place Order**
   - Enter shipping information
   - Confirm order details
   - Order will be created with PENDING status

### **Admin Features**

1. **Admin Access**
   - Register as a regular user
   - Update user role to 'ADMIN' in database
   - Log in to access admin features

2. **Product Management**
   - Add new products with images
   - Edit existing product details
   - Delete products (stock will be managed)

3. **Order Management**
   - View all orders or filter by status
   - Update order status (Pending → Confirmed → Shipped → Delivered)
   - Delete orders (stock will be restored)
   - View order statistics and analytics

### **Demo Accounts**

For quick testing, you can use these pre-configured accounts:

```
Regular User:
Username: testuser
Password: 123456

Admin User:
Username: admin
Password: admin123
```

## 📁 Project Structure

```
ecom177/
├── src/
│   ├── main/
│   │   ├── java/com/ecom177/
│   │   │   ├── config/          # Security & Configuration
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── entity/         # JPA Entities
│   │   │   ├── exception/      # Exception Handling
│   │   │   ├── repository/     # Data Access Layer
│   │   │   ├── service/        # Business Logic
│   │   │   └── util/           # Utility Classes
│   │   └── resources/
│   │       ├── db/changelog/   # Database Migrations
│   │       └── application.properties
│   └── test/                   # Unit & Integration Tests
├── ecom-frontend/
│   ├── public/                 # Static Assets
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── utils/             # Utility Functions
│   │   ├── App.js             # Main Application
│   │   └── index.js           # Entry Point
│   ├── package.json           # Dependencies
│   └── README.md
├── pom.xml                    # Maven Configuration
└── README.md                  # Project Documentation
```

## 🧪 Testing

### **Running Tests**

```bash
# Backend tests
mvn test

# Frontend tests
cd ecom-frontend
npm test

# Integration tests
mvn verify
```

### **Test Coverage**
- Unit tests for service layer
- Integration tests for API endpoints
- Component tests for React components
- End-to-end testing scenarios

### **Testing Strategy**
- **Unit Tests**: Individual component/method testing
- **Integration Tests**: API endpoint testing with TestContainers
- **Component Tests**: React component behavior testing
- **Manual Testing**: User workflow validation

## 🚀 Deployment

### **Environment Configuration**

#### **Development**
```properties
# application.properties
spring.profiles.active=development
spring.jpa.show-sql=true
logging.level.com.ecom177=DEBUG
```

#### **Production**
```properties
# application-prod.properties
spring.profiles.active=production
spring.jpa.show-sql=false
server.port=${PORT:8080}
```

### **Build for Production**

#### **Backend**
```bash
# Create production JAR
mvn clean package -DskipTests

# Run production JAR
java -jar target/ecom-app-1.0.0.jar
```

#### **Frontend**
```bash
cd ecom-frontend

# Build for production
npm run build

# Serve static files
npm install -g serve
serve -s build -l 3000
```

### **Docker Deployment**

```dockerfile
# Dockerfile (Backend)
FROM openjdk:17-jdk-slim
COPY target/ecom-app-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```dockerfile
# Dockerfile (Frontend)
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Docker Compose**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: ecom177
      POSTGRES_USER: ecom_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
  
  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/ecom177
  
  frontend:
    build: ./ecom-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### **Cloud Deployment Options**
- **Heroku**: Easy deployment with buildpacks
- **AWS**: EC2, RDS, S3 for scalable infrastructure
- **Google Cloud**: App Engine, Cloud SQL
- **Azure**: App Service, Azure Database
- **DigitalOcean**: Droplets and managed databases

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/wazder/ecom177.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow coding standards
   - Add tests for new features
   - Update documentation

4. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Describe your changes
   - Reference any related issues
   - Ensure all tests pass

### **Development Guidelines**
- **Code Style**: Follow existing patterns and conventions
- **Testing**: Add tests for new functionality
- **Documentation**: Update README and code comments
- **Security**: Follow security best practices
- **Performance**: Consider performance implications

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Encryption**: BCrypt hashing for secure password storage
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: JPA/Hibernate ORM usage
- **Role-Based Access**: Admin and user role separation
- **Error Boundaries**: Graceful error handling in React

## 🚨 Known Issues & Limitations

- **Image Storage**: Currently using base64 encoding (consider file storage for production)
- **Real-time Updates**: No WebSocket implementation for live updates
- **Payment Integration**: Payment processing not implemented
- **Email Notifications**: Email service not configured
- **Mobile App**: No native mobile application
- **Caching**: No Redis caching implementation

## 🔧 Troubleshooting

### **Common Issues**

#### **Backend Won't Start**
```bash
# Check Java version
java -version

# Check PostgreSQL connection
psql -h localhost -U your_username -d ecom177

# Check port availability
lsof -i:8080
```

#### **Frontend Build Errors**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json
npm install
```

#### **Database Connection Issues**
```bash
# Verify PostgreSQL is running
sudo service postgresql status

# Check database exists
psql -l | grep ecom177

# Reset database
dropdb ecom177
createdb ecom177
```

## 📈 Performance Optimization

### **Backend Optimizations**
- Database connection pooling
- JPA query optimization
- Caching strategy implementation
- API response compression

### **Frontend Optimizations**
- Code splitting and lazy loading
- Image optimization and lazy loading
- Bundle size optimization
- Component memoization

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Payment integration (Stripe, PayPal)
- [ ] Email notification system
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with Elasticsearch
- [ ] Real-time chat support
- [ ] Mobile application (React Native)
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Social media integration

### **Technical Improvements**
- [ ] Redis caching implementation
- [ ] WebSocket for real-time updates
- [ ] Microservices architecture
- [ ] Container orchestration (Kubernetes)
- [ ] CI/CD pipeline setup
- [ ] Performance monitoring
- [ ] Security auditing
- [ ] API rate limiting

## 📞 Support & Contact

**Developer**: Hasan Tatar (@wazder)  
**Email**: tatarhasan09@gmail.com  
**GitHub**: [@wazder](https://github.com/wazder)  
**LinkedIn**: [Hasan Tatar](https://linkedin.com/in/hasantatar)

### **Getting Help**
- **Issues**: [GitHub Issues](https://github.com/wazder/ecom177/issues)
- **Discussions**: [GitHub Discussions](https://github.com/wazder/ecom177/discussions)
- **Wiki**: [Project Wiki](https://github.com/wazder/ecom177/wiki)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Hasan Tatar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎉 Acknowledgments

- **Spring Boot Team** - For the excellent framework
- **React Team** - For the powerful UI library
- **PostgreSQL Community** - For the reliable database
- **Open Source Community** - For inspiration and resources

---

**⭐ If you found this project helpful, please give it a star!**

**🚀 Ready to revolutionize e-commerce? Let's build something amazing together!**