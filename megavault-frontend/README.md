# 🛡️ MegaVault - React eCommerce Web Application

MegaVault is a modern, responsive eCommerce web application built using **React**, **React Router v6**, **Bootstrap 5**, and **CSS Glassmorphism**. This project was created as a student/entry-level React application showcasing clean component architecture, state management with React Context API, and AI-assisted shopping features.

---

## 🚀 Features

- **🏠 Home Page**: Hero banner spotlight, interactive category cards, value proposition badges, featured products, and trending items.
- **📦 Product Catalog**: Full product listing with category filtering, search keyword query, and rating displays.
- **🔍 Global Search Bar**: Instant product search with single-line aligned search input and AI Assistant trigger.
- **🛒 Shopping Cart & Persistence**: Add/remove items, quantity adjustments, coupon discount code support (`MEGAVAULT10`), and `localStorage` state persistence.
- **👤 Dynamic User Auth & Profile**: Sign in / Sign out state (`AuthContext`), automatic Gmail display name formatting (e.g. `sai9840tej@gmail.com` ➔ **Sai Tej**), and live profile editing.
- **📞 Help & Support Modal**: Instant access to helpline number, support email, and operating hours.
- **🤖 MegaVault AI Assistant**: Floating AI shopping companion widget allowing users to ask questions and discover products.
- **🌓 Dark & Light Mode**: Theme context toggle with crisp border highlights across all icon buttons.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Core**: React 18 (Functional Components & Hooks)
- **Routing**: React Router DOM (`BrowserRouter`, `Routes`, `Route`, `Outlet`)
- **State Management**: React Context API (`AuthContext`, `ThemeContext`)
- **Styling**: Bootstrap 5 + Vanilla CSS Glassmorphism + Bootstrap Icons
- **Notifications**: React Hot Toast
- **Localization**: Indian Rupee (INR / ₹) with GST calculation & UPI payment options

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/         # Navbar, Footer, ProductCard, AIAssistantModal, Rating
│   └── home/           # HeroSection, CategorySection, FeaturedProducts, etc.
├── context/            # AuthContext.jsx, ThemeContext.jsx
├── layouts/            # MainLayout.jsx
├── pages/              # HomePage, ProductsPage, CartPage, ProfilePage, etc.
├── routes/             # AppRouter.jsx
├── styles/             # global.css, variables.css
└── utils/              # mockData.js
```

---

## 💻 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/megavault-frontend.git
   cd megavault-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📝 Author
Created as an entry-level React eCommerce project portfolio deliverable.
