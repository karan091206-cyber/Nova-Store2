# ⚡ NovaStore - Modern React E-Commerce Website with Add to Cart

A distinctive, modern, and beginner-friendly E-Commerce website built with **React JS**, **JavaScript**, **HTML5**, and pure **CSS3**. Live products are fetched directly from the **FakeStore API**.

---

## 🎨 Fresh Styling & Unique Identity

- **Store Name:** **NovaStore** ⚡
- **Color Theme:** Modern Emerald Teal (`#0d9488` / `#0f766e`), Ice Mint (`#f0fdfa`), Crisp Slate Navy (`#0f172a`), and Coral/Amber accents.
- **API:** FakeStore API (`https://fakestoreapi.com/products`) featuring electronics, jewelry, men's clothing, and women's clothing.
- **Typography:** Plus Jakarta Sans with refined cards, floating shadows, and interactive hover feedback.

---

## 📁 Project Folder Structure

```
Front End Project/
├── index.html                           # Main HTML shell with NovaStore title & favicon
├── package.json                         # Project metadata, dependencies (React 18 & Vite)
├── vite.config.js                       # Vite build configuration
├── .gitignore                           # Ignores node_modules, dist, etc.
├── README.md                            # Complete guide & documentation
└── src/
    ├── main.jsx                         # Application entry point
    ├── App.jsx                          # Main App component managing cart state & navigation
    ├── App.css                          # Pure CSS stylesheet with Emerald Teal styling
    └── components/
        ├── Ecommerce.jsx                # Component 1: Product catalog, search, filter & add to cart
        └── AddToCart.jsx                # Component 2: Shopping cart, quantity controls & checkout summary
```

---

## 🚀 How to Run the Project

Follow these steps in your terminal inside VS Code:

### 1. Install dependencies (if not already installed):
```bash
npm install
```

### 2. Start the development server:
```bash
npm run dev
```

### 3. Open in your browser:
Click the local URL shown in your terminal (typically `http://localhost:5173/`).

### 4. Build for production (optional):
```bash
npm run build
```

---

## 🌐 FakeStore API Integration

- **API Endpoint:** `https://fakestoreapi.com/products`
- When the page loads, `Ecommerce.jsx` calls `fetch('https://fakestoreapi.com/products')` inside a `useEffect` hook.
- Normalizes data into clean product objects:
  - `id`: Unique identifier
  - `title`: Product name
  - `description`: Product overview
  - `price`: Product cost in USD
  - `category`: Category (e.g. electronics, jewelery, men's clothing, women's clothing)
  - `image`: Authentic high-resolution product photography
  - `rating`: Customer rating & reviews count

---

## 🔄 Component Communication via Props

1. **`App.jsx` (Parent):**
   - Holds the master state for `cart` (`useState([])`).
   - Defines handler functions:
     - `handleAddToCart(product)`
     - `handleIncreaseQuantity(productId)`
     - `handleDecreaseQuantity(productId)`
     - `handleRemoveFromCart(productId)`
     - `handleClearCart()`
2. **`Ecommerce.jsx` (Child 1):**
   - Receives `onAddToCart` and `cart` as props.
   - When the user clicks "Add to Cart", it triggers `onAddToCart(product)`, passing the selected product up to `App.jsx`.
3. **`AddToCart.jsx` (Child 2):**
   - Receives `cart`, `onIncreaseQuantity`, `onDecreaseQuantity`, `onRemoveFromCart`, `onClearCart`, and `onContinueShopping` as props.
   - Displays all products in the cart, calculates subtotals and the total price, and triggers the respective functions when buttons are clicked.

---

## 🧠 React Concepts & JavaScript Methods Used

| Concept / Method | Where It's Used | Purpose |
|---|---|---|
| `useState()` | `App.jsx`, `Ecommerce.jsx`, `AddToCart.jsx` | Manages cart items, active view, search query, selected category, loading, error, and coupon states. |
| `useEffect()` | `Ecommerce.jsx` | Automatically triggers the API fetch once on initial component mount using `[]`. |
| `Props` | `Ecommerce.jsx`, `AddToCart.jsx` | Enables clean communication between parent `App` and child components. |
| `fetch()` | `Ecommerce.jsx` | Performs the HTTP GET request to FakeStore API. |
| `map()` | `Ecommerce.jsx`, `AddToCart.jsx` | Renders dynamic lists of product cards, category filters, and cart items. |
| `filter()` | `Ecommerce.jsx`, `App.jsx` | Filters products by search query and category, and removes items from cart. |
| `find()` | `App.jsx`, `Ecommerce.jsx` | Checks whether a product already exists in the cart to increment its quantity instead of creating duplicates. |
| `reduce()` | `AddToCart.jsx`, `App.jsx` | Calculates the total item count and accumulated total price. |
| `onClick()` | All components | Handles user clicks for adding items, incrementing/decrementing quantities, changing views, etc. |
| `onChange()` | `Ecommerce.jsx`, `AddToCart.jsx` | Listens to user keystrokes in the search bar and selection changes in the category dropdown. |
# Nova-Store2
