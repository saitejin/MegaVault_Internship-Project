# MegaVault AI Powered E-Commerce Shopping Platform

**Submitted By:**
* N. Sai Teja
* B. Harsha Vardhan Babu
* J. Bhargava Aditya
* CH. Tejas Kumar

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Scope of the Internship Project](#4-scope-of-the-internship-project)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Functional Modules](#7-functional-modules)
8. [AI Powered Product Discovery](#8-ai-powered-product-discovery)
9. [REST API Design](#9-rest-api-design)
10. [Database Design](#10-database-design)
11. [Security and Role-Based Access Control](#11-security-and-role-based-access-control)
12. [User Interface Design](#12-user-interface-design)
13. [Testing and Validation](#13-testing-and-validation)
14. [Deployment and Execution](#14-deployment-and-execution)
15. [Internship Learning Outcomes](#15-internship-learning-outcomes)
16. [Achievements](#16-achievements)
17. [Future Scope](#17-future-scope)
18. [Conclusion](#18-conclusion)
19. [References](#19-references)

---

## 1. Introduction
MegaVault is a full-stack AI powered e-commerce shopping platform developed during a company internship. The project focuses on building a secure, responsive, scalable, and user-friendly online shopping system.

The application allows customers to browse products, search using keywords, apply price-based filters, view product categories, add items to cart, maintain wishlist items, and authenticate using Google login. It also provides an admin dashboard for secure catalog management.

From a technical perspective, MegaVault follows a layered architecture. The frontend is developed using React.js, while backend services are implemented using Spring Boot. The backend communicates with a MySQL database through Spring Data JPA and Hibernate. Security is implemented using Spring Security, BCrypt password hashing, Google authentication, and role-based access control.

---

## 2. Problem Statement
E-commerce platforms require quick product discovery, secure user access, structured product management, and smooth shopping workflows. Customers may face difficulty finding suitable products when catalogs contain multiple categories and large product lists. Manual filtering can become time-consuming and less efficient.

Administrators also require secure access to manage product details, categories, SKU information, and catalog operations. Without role-based control, unauthorized access may lead to incorrect product updates, accidental deletion, or catalog inconsistency.

MegaVault addresses these challenges by providing AI-assisted product discovery, category-based browsing, INR price filtering, cart and wishlist features, Google authentication, admin dashboard access, and audit-friendly product deletion responses.

---

## 3. Objectives
The main objectives of the internship project are:
* To develop a responsive e-commerce frontend using React.js.
* To build RESTful backend services using Spring Boot.
* To implement AI-assisted product discovery.
* To support product search using keywords, categories, and price limits.
* To organize products into structured departments.
* To implement shopping cart and wishlist workflows.
* To integrate Google authentication for secure sign-in.
* To implement Spring Security and BCrypt password hashing.
* To apply role-based access control for customer and admin operations.
* To connect the backend with MySQL using Spring Data JPA/Hibernate.
* To provide audit-friendly product deletion responses.
* To create a scalable foundation for future e-commerce enhancements.

---

## 4. Scope of the Internship Project
The scope of MegaVault includes customer-facing shopping features, backend API development, database persistence, authentication, authorization, admin catalog operations, and AI-assisted product search.

### Included Features
* Customer home page
* Product catalog display
* Category-based product browsing
* AI-powered search assistance
* Product search by keyword
* Product filtering by price
* Cart management
* Wishlist management
* Google authentication
* Admin dashboard
* Product and category management
* Role-based access control
* REST API integration
* MySQL database storage
* Product deletion audit response

---

## 5. Technology Stack

| Layer / Component | Technology Used |
| :--- | :--- |
| **Frontend** | React.js / React 18 |
| **Backend** | Spring Boot 3.2.3 |
| **Programming Language** | Java 17 LTS |
| **Database** | MySQL 8.0 |
| **ORM Framework** | Spring Data JPA / Hibernate |
| **Security Framework** | Spring Security |
| **Password Hashing** | BCrypt |
| **Authentication** | Google Authentication |
| **API Communication** | REST API with HTTP/JSON |
| **UI Styling** | Glassmorphism CSS |
| **Currency Format** | Indian Rupee ₹ |

---

## 6. System Architecture
MegaVault follows a layered client-server architecture. The frontend sends HTTP requests to backend REST controllers. The backend processes business logic through service classes, applies security rules, interacts with repositories, and stores or retrieves data from MySQL.

---

## 7. Functional Modules
Includes Customer Home, Product Catalog, Search & Filtering, Department Category Management, Shopping Cart, Wishlist, Google OAuth, and Admin Dashboard.

---

## 8. AI Powered Product Discovery
MegaVault includes AI-assisted product discovery to improve search efficiency, interpreting natural shopping queries, category intent, and price constraints.

---

## 9. REST API Design
MegaVault uses REST APIs returning JSON formatted responses, including enhanced `DELETE /api/products/{id}` audit payloads.

---

## 10. Database Design
MySQL 8.0 database (`megavault_db`) storing `USERS`, `PRODUCTS`, `CATEGORIES`, and `ORDERS`.

---

## 11. Security and Role-Based Access Control
Spring Security, BCrypt hashing, and user roles (`ROLE_CUSTOMER`, `ROLE_CATEGORY_ADMIN`, `ROLE_SUPER_ADMIN`).

---

## 12. User Interface Design
Responsive glassmorphism UI styled with dark theme (`#0B0F17`) and light theme (`#F8FAFC`).

---

## 13. Testing and Validation
Comprehensive test suites across catalog retrieval, category filtering, search processing, cart/wishlist actions, and admin operations.

---

## 14. Deployment and Execution
Local execution steps using Java 17+, MySQL 8.0, Spring Boot 3.2.3, and React.js.

---

## 15. Internship Learning Outcomes
Hands-on experience in full-stack web development, Spring Boot REST APIs, React design, Spring Security, JPA/Hibernate, and MySQL database management.

---

## 16. Achievements
Complete full-stack implementation with AI product discovery, Google authentication, RBAC, admin dashboard, and responsive glassmorphism UI.

---

## 17. Future Scope
Payment gateway integration, order tracking, analytics dashboard, cloud deployment, and automated CI/CD pipeline.

---

## 18. Conclusion
MegaVault is a company internship project delivering a secure, scalable, and responsive full-stack e-commerce shopping platform.

---

## 19. References
Spring Boot 3.2.3, React.js, MySQL 8.0, Spring Security, Hibernate, Java 17 LTS, and Gemini AI References.
