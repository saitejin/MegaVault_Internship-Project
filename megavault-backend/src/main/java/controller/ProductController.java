package controller;

import entity.Product;
import service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Explicit exact path mappings MUST come BEFORE /{id} path variable mapping!
    @RequestMapping(value = {"/restore-all", "/restore"}, method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> restoreAllProducts() {
        List<Product> restoredList = productService.restoreAllProducts();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "All 30 products have been successfully restored to MySQL database!");
        response.put("restoredCount", restoredList.size());
        response.put("products", restoredList);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(name = "q", required = false) String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Product ID " + id + " has been successfully updated!");
        response.put("updatedProduct", updatedProduct);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        Product deletedProduct = productService.deleteProduct(id);
        Map<String, Object> response = new LinkedHashMap<>();

        if (deletedProduct != null) {
            response.put("status", "SUCCESS");
            response.put("message", "Product ID " + id + " (" + deletedProduct.getTitle() + ") has been successfully deleted!");
            response.put("deletedProduct", deletedProduct);

            System.out.println("✅ [ProductController] Returned HTTP 200 OK with full deleted Product JSON payload for ID: " + id);
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "NOT_FOUND");
            response.put("message", "Product ID " + id + " was not found in MySQL database (it may have already been deleted).");
            response.put("deletedProduct", null);

            System.out.println("❌ [ProductController] Product ID " + id + " not found!");
            return ResponseEntity.status(404).body(response);
        }
    }
}
