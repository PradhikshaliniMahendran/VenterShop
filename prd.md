# Product Requirements Document (PRD): VENTERSHOP

## 1. Executive Summary
**Company Name:** VENTERSHOP  
**Tagline:** *Your Trusted Online Store for Quality Products*  
**Business Model:** Premium multi-category, multi-customer (B2C & B2B) e-commerce platform serving Canada.  
**Key Value Propositions:**
* Free Delivery on Orders over $75 (configurable by Admin).
* Fast & Reliable Shipping Across Canada.
* Tailored purchasing experiences for three specific customer segments: Normal, Community, and Wholesale.

---

## 2. Customer Segment Architecture
The platform separates users into three distinct segments:

| Customer Type | Access Control | Pricing / Offers | Special Features |
|---|---|---|---|
| **NORMAL** | Self-register & verification via OTP | Standard retail prices; public offers | Basic cart, checkout, profile, address book |
| **COMMUNITY** | Assigned dynamically by Admin | Community-specific prices, offers & vouchers | "My Community Benefits" dashboard tab |
| **WHOLESALE** | Registration form → Admin approval | Wholesale/bulk prices, tier discounts | Bulk order interface, minimum order quantities |

---

## 3. Core Feature Requirements

### 3.1. User & Authentication System
* **Primary Auth:** Passwordless Login using Email OTP.
  * 6-digit OTP code sent via Nodemailer.
  * Rate-limited requests with expiration (e.g., 5-10 minutes expiration, 60s resend cooldown).
  * Validated and invalidated server-side.
* **Customer Dashboard:**
  * Overview: Order stats, active vouchers, savings tracker.
  * My Profile: Name, email, phone, language preference.
  * Address Book: Multiple shipping addresses (Home, Work, etc.), setting a default address.
  * Order History: Track status, review receipt details, re-order.
  * Wallet / Vouchers: View available/expired vouchers, direct "Use Now" CTA.
  * Wishlist: Save items to purchase later.
  * Notifications Panel: Messages for orders, vouchers, or account status updates.

### 3.2. Product & Inventory Management
* **Catalog:** Categorized browsing (Home, Groceries, Animal Feed, Books, Electronics, Daily Needs, etc.).
* **Advanced Pricing:**
  * Dynamic prices: Retail Price, Community Price, and Wholesale Price per product.
  * Tier/Bulk discounts for Wholesale (e.g., "Buy 20+ — Save 12%").
* **Stock & Inventory Engine:**
  * Track current stock and low-stock threshold.
  * Auto-decrement on purchase. Prevent ordering past stock availability.
* **Images:** Maintained on Cloudinary. Supports primary image selection, reordering, and uploads/deletions.

### 3.3. Offers & Vouchers Engine
* **Offer Rule Engine:** Admin defines discounts (percentage or fixed amount) based on:
  * Customer Type, Specific Community, Category, Products, Date Range, Usage Limit, Min Purchase.
* **Voucher System:** Admin generates coupon codes targeting specific segments (e.g., community-only category-specific discount).
* **Deduction Rules:** Server-side calculation. Subtotal → Applied Offer → Applied Voucher → Delivery Fee (Free over threshold) → Final Total.

### 3.4. Checkout & Orders
* **Order Generation:** Multi-step premium checkout (Info → Address → Summary/Voucher → Confirmation).
* **Payment Architecture:** Decoupled states:
  * *Payment Status:* `PENDING`, `PAID`, `FAILED`, `REFUNDED`
  * *Fulfillment Status:* `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`
* **Order ID:** Unique, readable ID format: `VS-2026-[Sequential/Unique]`.

### 3.5. Multi-Language (Localization)
* **Languages:** English (Default) and Tamil (Selected user-facing sections).
* **Tamil Implementation:** Apply localization selectively (Navigation, Account/Login, Checkout, Voucher terms, Customer Support). Fallback gracefully to English if Tamil translation keys are unavailable.

---

## 4. Admin Dashboard
The administration portal `/admin` requires strict role-based protection (Admin / Super Admin roles) and offers:
1. **Analytics Dashboard:** Revenue trends, sales comparison by customer segment (Normal vs. Community vs. Wholesale), popular products.
2. **Order Management:** Filter by fulfillment and payment status, update progress tracking, trigger email notifications automatically.
3. **Customer Management:** Review wholesale applications, approve/reject community requests, suspend/activate accounts.
4. **Community & Wholesale Configuration:** Create/disable communities, view membership rosters.
5. **Product & Category Editor:** Full CRUD operations, Cloudinary image upload, inventory management.
6. **Voucher & Offer Creator:** Set targeting rules, start/end times, and codes.
7. **System Settings:** Maintain store contact info, default currency (CAD), free delivery threshold.
8. **Audit Logs:** Secure tracking of administrative actions (logins, updates, deletions).

---

## 5. Non-Functional & Technical Rules
* **Tech Stack:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, MongoDB, Mongoose.
* **Image Hosting:** Cloudinary.
* **Email Provider:** Nodemailer (SMTP).
* **Server-Side Validation:** All prices, stock checks, and voucher deductions must be verified server-side.
* **Security:** Rate limiting, JWT/Secure cookies session management, MongoDB injection prevention, and strict API route protection.
