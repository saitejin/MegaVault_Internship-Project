package controller;

import entity.Product;
import service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AIController {

    private final ProductService productService;

    @Autowired
    public AIController(ProductService productService) {
        this.productService = productService;
    }

    // 1. AI Chatbot Assistant Endpoint
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithAI(@RequestBody Map<String, String> request) {
        String userQuery = request.getOrDefault("message", "").toLowerCase().trim();

        List<Product> allProducts = productService.getAllProducts();
        List<Map<String, Object>> matchedProducts = new ArrayList<>();

        for (Product product : allProducts) {
            int matchScore = 85;
            String reason = "Top-rated product in catalogue";

            if (userQuery.contains(product.getCategory().toLowerCase())) {
                matchScore += 10;
                reason = "Exact match for your category query: " + product.getCategory();
            }
            if (userQuery.contains("cheap") || userQuery.contains("budget") || userQuery.contains("under")) {
                if (product.getPrice() < 5000) {
                    matchScore += 4;
                    reason = "Budget-friendly value deal";
                }
            }

            Map<String, Object> prodMap = new HashMap<>();
            prodMap.put("id", product.getId());
            prodMap.put("title", product.getTitle());
            prodMap.put("category", product.getCategory());
            prodMap.put("price", product.getPrice());
            prodMap.put("originalPrice", product.getOriginalPrice());
            prodMap.put("rating", product.getRating());
            prodMap.put("image", product.getImage());
            prodMap.put("description", product.getDescription());
            prodMap.put("matchScore", Math.min(matchScore, 99));
            prodMap.put("aiReason", reason);

            matchedProducts.add(prodMap);
        }

        // Sort by highest match score
        List<Map<String, Object>> topRecommendations = matchedProducts.stream()
                .sorted((a, b) -> Integer.compare((Integer) b.get("matchScore"), (Integer) a.get("matchScore")))
                .limit(3)
                .collect(Collectors.toList());

        String aiReply = "Here are the top AI-recommended products matching your request: '" + userQuery + "'";
        if (topRecommendations.isEmpty()) {
            aiReply = "I searched our vault! Try looking for 'headphones', 'smartwatch', 'laptop', or 'gaming'.";
        }

        Map<String, Object> response = new HashMap<>();
        response.put("reply", aiReply);
        response.put("recommendations", topRecommendations);

        return ResponseEntity.ok(response);
    }

    // 2. Get Featured AI Recommendations
    @GetMapping("/recommendations")
    public ResponseEntity<List<Product>> getRecommendations() {
        List<Product> allProducts = productService.getAllProducts();
        return ResponseEntity.ok(allProducts.stream().limit(4).collect(Collectors.toList()));
    }
}
