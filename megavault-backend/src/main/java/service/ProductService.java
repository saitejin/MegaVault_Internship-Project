package service;

import entity.Product;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    List<Product> getProductsByCategory(String category);
    List<Product> searchProducts(String query);
    Product saveProduct(Product product);
    Product updateProduct(Long id, Product productDetails);
    Product deleteProduct(Long id);
    List<Product> restoreAllProducts();
}
