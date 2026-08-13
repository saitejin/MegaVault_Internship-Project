package entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private Long id; // Explicit custom Product IDs (e.g. 101, 102, 103 for Category 1, 201, 202, 203 for Category 2)

    @Column(nullable = false)
    private String productCode; // Unique Product Code / SKU (e.g. AUD-101, AUD-102, WRB-201, GAM-301)

    private String categoryId; // Shared Category ID matching Category Number (e.g. "1", "2", "3", "4", "5", "6")

    private String categoryCode; // Category Code Prefix (e.g. AUD, WRB, GAM, ELE, FSH, SMH)

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // Display Category Name (e.g. Audio, Wearables, Gaming, Electronics, Fashion, Smart Home)

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    private Double rating;

    private Integer reviewsCount;

    @Column(length = 1000)
    private String image;

    private Boolean isNew;

    private String badgeText;

    @Column(length = 2000)
    private String description;
}
