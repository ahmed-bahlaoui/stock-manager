# Stock Manager Demo API Guide

## Start The Project

Run the API locally:

```bash
php artisan serve
```

Base URL:

```text
http://127.0.0.1:8000/api
```

Reset demo data anytime:

```bash
php artisan migrate:fresh --seed
```

## Insomnia Setup

Public auth requests use these headers:

```text
Accept: application/json
Content-Type: application/json
```

After login, protected requests must also include:

```text
Authorization: Bearer YOUR_TOKEN
```

## Seeded Demo Users

Use one of these demo accounts after `php artisan migrate:fresh --seed`:

- `admin@example.com` / `password`
- `warehouse@example.com` / `password`
- `sales@example.com` / `password`

Role behavior:
- `admin`: full access
- `warehouse`: can do `stock_in` and view inventory/order data
- `sales`: can create orders and view categories/products/orders

## Demo Flow

Use this order during the demo.

### 1. Login

```http
POST /api/login
```

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

What to verify:
- response status is `200`
- response includes `token`
- response includes user role

Copy the token and add:

```text
Authorization: Bearer YOUR_TOKEN
```

### 2. Show Logged-In User

```http
GET /api/me
```

What to verify:
- current authenticated user is returned
- role is `admin`

### 3. List Seeded Categories

```http
GET /api/categories
```

What to verify:
- categories exist
- each category shows `products_count`

### 4. List Seeded Products

```http
GET /api/products
```

What to verify:
- products exist
- each product includes `quantity`
- each product includes `is_low_stock`
- category info is embedded

### 5. Create A New Category

```http
POST /api/categories
```

```json
{
  "name": "Gaming",
  "slug": "gaming",
  "description": "Gaming devices and accessories"
}
```

What to verify:
- response status is `201`
- returned category contains `id`, `name`, `slug`

### 6. Create A New Product

```http
POST /api/products
```

```json
{
  "name": "Gaming Headset",
  "sku": "GHS-001",
  "description": "Stereo gaming headset with microphone",
  "price": 599.99,
  "quantity": 15,
  "min_quantity": 4,
  "category_id": 4
}
```

Replace `category_id` with the real category ID from the previous step if needed.

What to verify:
- response status is `201`
- product appears in `GET /api/products`

### 7. Receive Stock

```http
POST /api/stock-movements/stock-in
```

```json
{
  "product_id": 6,
  "quantity": 10,
  "note": "Supplier restock before sale"
}
```

Replace `product_id` with the real product ID from the previous step if needed.

What to verify:
- response status is `201`
- movement type is `stock_in`
- product quantity increases

### 8. Place An Order

```http
POST /api/orders
```

```json
{
  "notes": "Customer order demo",
  "items": [
    {
      "product_id": 6,
      "quantity": 3
    }
  ]
}
```

What to verify:
- response status is `201`
- order status is `completed`
- order contains `items`
- order contains `stock_movements`
- product quantity decreases

### 9. Show All Orders

```http
GET /api/orders
```

What to verify:
- created order is visible
- item details show product name and SKU

### 10. Show One Order

```http
GET /api/orders/1
```

Use the real order ID from the create-order response.

What to verify:
- order details load correctly
- related `stock_movements` are present

### 11. Show Stock History

```http
GET /api/stock-movements
```

What to verify:
- `stock_in` and `stock_out` records are visible
- product and order references are present

Useful filters:

```http
GET /api/stock-movements?product_id=6
GET /api/stock-movements?order_id=1
GET /api/stock-movements?type=stock_out
```

## Role Demo

Use this to demonstrate authorization.

### Warehouse Login

```http
POST /api/login
```

```json
{
  "email": "warehouse@example.com",
  "password": "password"
}
```

What to verify:
- warehouse can call `POST /api/stock-movements/stock-in`
- warehouse gets `403` on `POST /api/orders`

### Sales Login

```http
POST /api/login
```

```json
{
  "email": "sales@example.com",
  "password": "password"
}
```

What to verify:
- sales can call `POST /api/orders`
- sales gets `403` on `POST /api/categories`
- sales gets `403` on `POST /api/stock-movements/stock-in`

## Failure Demo

Use this to prove insufficient stock is blocked.

```http
POST /api/orders
```

```json
{
  "notes": "Too large order",
  "items": [
    {
      "product_id": 2,
      "quantity": 999
    }
  ]
}
```

What to verify:
- response status is `422`
- validation error says stock is insufficient
- product quantity stays unchanged

## Demo Endpoints Summary

```text
POST   /api/register
POST   /api/login
GET    /api/me
POST   /api/logout

GET    /api/categories
POST   /api/categories
GET    /api/categories/{id}
PUT    /api/categories/{id}
DELETE /api/categories/{id}

GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}

POST   /api/stock-movements/stock-in
GET    /api/stock-movements
GET    /api/stock-movements/{id}

POST   /api/orders
GET    /api/orders
GET    /api/orders/{id}
```

## Quick Demo Script

Use this simple story:

1. Log in as admin and explain token authentication.
2. Show the current authenticated user with `/api/me`.
3. Show seeded categories and products.
4. Create a new category.
5. Create a new product in that category.
6. Add stock to the product.
7. Place an order for that product.
8. Open the order details.
9. Open stock movements to prove the audit trail.
10. Try an invalid large order to show stock protection.
11. Log in as warehouse or sales to show role restrictions.
