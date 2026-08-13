package service;

import entity.Product;
import repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.equalsIgnoreCase("all")) {
            return productRepository.findAll();
        }
        return productRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();

            if (productDetails.getTitle() != null) existingProduct.setTitle(productDetails.getTitle());
            if (productDetails.getCategory() != null) existingProduct.setCategory(productDetails.getCategory());
            if (productDetails.getCategoryId() != null) existingProduct.setCategoryId(productDetails.getCategoryId());
            if (productDetails.getCategoryCode() != null) existingProduct.setCategoryCode(productDetails.getCategoryCode());
            if (productDetails.getProductCode() != null) existingProduct.setProductCode(productDetails.getProductCode());
            if (productDetails.getPrice() != null) existingProduct.setPrice(productDetails.getPrice());
            if (productDetails.getOriginalPrice() != null) existingProduct.setOriginalPrice(productDetails.getOriginalPrice());
            if (productDetails.getRating() != null) existingProduct.setRating(productDetails.getRating());
            if (productDetails.getReviewsCount() != null) existingProduct.setReviewsCount(productDetails.getReviewsCount());
            if (productDetails.getImage() != null) existingProduct.setImage(productDetails.getImage());
            if (productDetails.getDescription() != null) existingProduct.setDescription(productDetails.getDescription());
            if (productDetails.getIsNew() != null) existingProduct.setIsNew(productDetails.getIsNew());
            if (productDetails.getBadgeText() != null) existingProduct.setBadgeText(productDetails.getBadgeText());

            Product updated = productRepository.save(existingProduct);

            System.out.println("\n=================================================");
            System.out.println("📝 [MEGA-VAULT AUDIT] PRODUCT UPDATED SUCCESSFULLY!");
            System.out.println("-------------------------------------------------");
            System.out.println("📌 Product ID     : " + updated.getId());
            System.out.println("📦 Updated Title  : " + updated.getTitle());
            System.out.println("💰 Updated Price  : ₹" + updated.getPrice());
            System.out.println("=================================================\n");

            return updated;
        } else {
            productDetails.setId(id);
            return productRepository.save(productDetails);
        }
    }

    @Override
    public Product deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product deletedProduct = optionalProduct.get();
            productRepository.deleteById(id);

            System.out.println("\n=================================================");
            System.out.println("🗑️ [MEGA-VAULT AUDIT] PRODUCT DELETED SUCCESSFULLY!");
            System.out.println("-------------------------------------------------");
            System.out.println("📌 Product ID     : " + deletedProduct.getId());
            System.out.println("🔖 Product Code   : " + deletedProduct.getProductCode());
            System.out.println("📦 Product Title  : " + deletedProduct.getTitle());
            System.out.println("🏷️ Category       : " + deletedProduct.getCategory() + " (Category ID: " + deletedProduct.getCategoryId() + ")");
            System.out.println("💰 Selling Price  : ₹" + deletedProduct.getPrice());
            System.out.println("=================================================\n");

            return deletedProduct;
        }
        return null;
    }

    @Override
    public List<Product> restoreAllProducts() {
        productRepository.deleteAll();

        List<Product> products = Arrays.asList(
            // --- CATEGORY 1: AUDIO & SOUND (categoryId: "1", Product IDs: 101..105) ---
            Product.builder().id(101L).productCode("AUD-101").categoryId("1").categoryCode("AUD").title("Wireless Bluetooth Headphones").category("Audio").price(4999.0).originalPrice(6999.0).rating(4.8).reviewsCount(142).image("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80").isNew(true).badgeText("Bestseller").description("Studio-grade spatial audio with active noise cancellation and 40-hour battery life.").build(),
            Product.builder().id(102L).productCode("AUD-102").categoryId("1").categoryCode("AUD").title("Wireless Earbuds").category("Audio").price(1999.0).originalPrice(2999.0).rating(4.5).reviewsCount(210).image("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80").description("Lightweight true wireless earbuds with quad mic ENC and IPX5 sweat protection.").build(),
            Product.builder().id(103L).productCode("AUD-103").categoryId("1").categoryCode("AUD").title("Bluetooth Party Speaker").category("Audio").price(7999.0).originalPrice(10999.0).rating(4.7).reviewsCount(95).image("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80").description("60W RMS portable bluetooth party speaker with RGB lights and IPX7 body.").build(),
            Product.builder().id(104L).productCode("AUD-104").categoryId("1").categoryCode("AUD").title("Soundbar Speaker").category("Audio").price(9999.0).originalPrice(14999.0).rating(4.8).reviewsCount(78).image("https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80").description("120W Dolby Digital soundbar with wireless subwoofer and HDMI ARC.").build(),
            Product.builder().id(105L).productCode("AUD-105").categoryId("1").categoryCode("AUD").title("Studio Condenser Microphone").category("Audio").price(3999.0).originalPrice(5999.0).rating(4.6).reviewsCount(64).image("https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80").description("Professional XLR studio condenser microphone for podcasting and vocal recording.").build(),

            // --- CATEGORY 2: SMART WEARABLES (categoryId: "2", Product IDs: 201..205) ---
            Product.builder().id(201L).productCode("WRB-201").categoryId("2").categoryCode("WRB").title("Smart Watch").category("Wearables").price(14999.0).originalPrice(18999.0).rating(4.9).reviewsCount(98).image("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80").isNew(true).badgeText("Top Pick").description("Next-gen health tracker with ECG monitoring, AMOLED display, and 50m water resistance.").build(),
            Product.builder().id(202L).productCode("WRB-202").categoryId("2").categoryCode("WRB").title("Fitness Band").category("Wearables").price(2499.0).originalPrice(3499.0).rating(4.4).reviewsCount(310).image("https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80").description("Ultra-light fitness band with 120+ sports modes, SpO2 monitoring, and 14-day battery.").build(),
            Product.builder().id(203L).productCode("WRB-203").categoryId("2").categoryCode("WRB").title("Sports Titanium Watch").category("Wearables").price(19999.0).originalPrice(24999.0).rating(4.9).reviewsCount(42).image("https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80").description("Military-grade titanium rugged smartwatch with dual-band GPS.").build(),
            Product.builder().id(204L).productCode("WRB-204").categoryId("2").categoryCode("WRB").title("Smart Health Ring").category("Wearables").price(8999.0).originalPrice(11999.0).rating(4.7).reviewsCount(53).image("https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80").description("Sleek smart ring tracking sleep stages, HRV, body temperature, and daily recovery.").build(),
            Product.builder().id(205L).productCode("WRB-205").categoryId("2").categoryCode("WRB").title("Bluetooth Calling Watch").category("Wearables").price(3499.0).originalPrice(4999.0).rating(4.5).reviewsCount(180).image("https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=600&q=80").description("HD touchscreen smartwatch with Bluetooth calling, dial pad, and 100+ cloud faces.").build(),

            // --- CATEGORY 3: GAMING & GEAR (categoryId: "3", Product IDs: 301..305) ---
            Product.builder().id(301L).productCode("GAM-301").categoryId("3").categoryCode("GAM").title("Mechanical Keyboard").category("Gaming").price(3499.0).originalPrice(4499.0).rating(4.7).reviewsCount(64).image("https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80").description("Hot-swappable mechanical switches with per-key RGB backlighting.").build(),
            Product.builder().id(302L).productCode("GAM-302").categoryId("3").categoryCode("GAM").title("Wireless Gaming Mouse").category("Gaming").price(1899.0).originalPrice(2499.0).rating(4.9).reviewsCount(310).image("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80").description("Ultralight 58g ergonomic gaming mouse with 26K DPI optical sensor.").build(),
            Product.builder().id(303L).productCode("GAM-303").categoryId("3").categoryCode("GAM").title("7.1 Surround Gaming Headset").category("Gaming").price(2999.0).originalPrice(3999.0).rating(4.6).reviewsCount(88).image("https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80").description("7.1 virtual surround sound gaming headset with noise-canceling detachable mic.").build(),
            Product.builder().id(304L).productCode("GAM-304").categoryId("3").categoryCode("GAM").title("Hall Effect Gaming Controller").category("Gaming").price(2799.0).originalPrice(3799.0).rating(4.7).reviewsCount(112).image("https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80").description("Hall effect anti-drift joysticks with customizable rear paddles.").build(),
            Product.builder().id(305L).productCode("GAM-305").categoryId("3").categoryCode("GAM").title("Curved Gaming Monitor").category("Gaming").price(34999.0).originalPrice(42999.0).rating(4.9).reviewsCount(36).image("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80").isNew(true).description("Immersive 1500R curved 34-inch WQHD gaming monitor with 165Hz refresh rate.").build(),

            // --- CATEGORY 4: ELECTRONICS & TECH (categoryId: "4", Product IDs: 401..405) ---
            Product.builder().id(401L).productCode("ELE-401").categoryId("4").categoryCode("ELE").title("4K Smart Monitor").category("Electronics").price(28999.0).originalPrice(34999.0).rating(4.6).reviewsCount(52).image("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80").description("Ultra-crisp 4K IPS display with 99% DCI-P3 color gamut and USB-C 65W PD.").build(),
            Product.builder().id(402L).productCode("ELE-402").categoryId("4").categoryCode("ELE").title("Pro Laptop M3").category("Electronics").price(89999.0).originalPrice(99999.0).rating(4.9).reviewsCount(45).image("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80").isNew(true).badgeText("Top Spec").description("Ultra-fast developer laptop featuring M3 chip, Liquid Retina display, and 18h battery.").build(),
            Product.builder().id(403L).productCode("ELE-403").categoryId("4").categoryCode("ELE").title("11-inch Tablet").category("Electronics").price(24999.0).originalPrice(29999.0).rating(4.7).reviewsCount(89).image("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80").description("Ultra-thin 120Hz AMOLED tablet with stylus support and quad speakers.").build(),
            Product.builder().id(404L).productCode("ELE-404").categoryId("4").categoryCode("ELE").title("Fast Charging Power Bank").category("Electronics").price(2999.0).originalPrice(4499.0).rating(4.8).reviewsCount(230).image("https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80").description("Heavy duty 65W Power Delivery power bank capable of charging laptops and phones.").build(),
            Product.builder().id(405L).productCode("ELE-405").categoryId("4").categoryCode("ELE").title("Smart Mini Projector").category("Electronics").price(11999.0).originalPrice(16999.0).rating(4.5).reviewsCount(67).image("https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80").description("Compact 500 ANSI lumens portable projector with built-in Android OS.").build(),

            // --- CATEGORY 5: FASHION & WEAR (categoryId: "5", Product IDs: 501..505) ---
            Product.builder().id(501L).productCode("FSH-501").categoryId("5").categoryCode("FSH").title("Waterproof Backpack").category("Fashion").price(1799.0).originalPrice(2499.0).rating(4.8).reviewsCount(175).image("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80").description("Weather-resistant laptop backpack with hidden anti-theft pockets and USB port.").build(),
            Product.builder().id(502L).productCode("FSH-502").categoryId("5").categoryCode("FSH").title("Polarized Sunglasses").category("Fashion").price(1299.0).originalPrice(1999.0).rating(4.6).reviewsCount(120).image("https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80").description("Polarized aviator sunglasses with anti-glare TAC lenses and titanium frame.").build(),
            Product.builder().id(503L).productCode("FSH-503").categoryId("5").categoryCode("FSH").title("Leather Wallet").category("Fashion").price(999.0).originalPrice(1499.0).rating(4.7).reviewsCount(205).image("https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80").description("Handcrafted top-grain leather bi-fold wallet with RFID blocking technology.").build(),
            Product.builder().id(504L).productCode("FSH-504").categoryId("5").categoryCode("FSH").title("Running Shoes").category("Fashion").price(2499.0).originalPrice(3999.0).rating(4.6).reviewsCount(140).image("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80").description("Ultra-cushioned responsive running shoes with breathable knit mesh upper.").build(),
            Product.builder().id(505L).productCode("FSH-505").categoryId("5").categoryCode("FSH").title("Winter Jacket").category("Fashion").price(4999.0).originalPrice(6999.0).rating(4.8).reviewsCount(52).image("https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80").description("USB-powered heated jacket with 3 temperature control zones and windproof shell.").build(),

            // --- CATEGORY 6: SMART HOME (categoryId: "6", Product IDs: 601..605) ---
            Product.builder().id(601L).productCode("SMH-601").categoryId("6").categoryCode("SMH").title("Smart RGB Light Bar").category("Smart Home").price(1499.0).originalPrice(1999.0).rating(4.6).reviewsCount(89).image("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80").description("App-controlled dynamic light bar with music rhythm sync and Alexa / Google support.").build(),
            Product.builder().id(602L).productCode("SMH-602").categoryId("6").categoryCode("SMH").title("Air Purifier").category("Smart Home").price(6999.0).originalPrice(9999.0).rating(4.8).reviewsCount(160).image("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80").description("True HEPA H13 filtration removing 99.97% of airborne allergens.").build(),
            Product.builder().id(603L).productCode("SMH-603").categoryId("6").categoryCode("SMH").title("Robot Vacuum Cleaner").category("Smart Home").price(21999.0).originalPrice(28999.0).rating(4.9).reviewsCount(84).image("https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=600&q=80").isNew(true).description("LiDAR navigation robot vacuum with 4000Pa suction power and automatic mopping.").build(),
            Product.builder().id(604L).productCode("SMH-604").categoryId("6").categoryCode("SMH").title("Smart Door Lock").category("Smart Home").price(8999.0).originalPrice(12999.0).rating(4.7).reviewsCount(96).image("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80").description("5-in-1 keyless entry door lock with fingerprint scanner, PIN passcode, and app.").build(),
            Product.builder().id(605L).productCode("SMH-605").categoryId("6").categoryCode("SMH").title("Smart WiFi Plug").category("Smart Home").price(999.0).originalPrice(1499.0).rating(4.6).reviewsCount(310).image("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80").description("16A smart plug for heavy appliances with timer scheduling and energy tracking.").build()
        );

        List<Product> savedProducts = productRepository.saveAll(products);
        System.out.println("✅ [ProductServiceImpl] Restored all 30 Products to MySQL database successfully!");
        return savedProducts;
    }
}
