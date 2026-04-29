# Stock Manager API

## Project Overview

This project is a Laravel API-based stock management backend for an e-commerce application.

## Current State

Current backend status:
- core inventory schema is implemented
- category CRUD is implemented
- product CRUD is implemented
- stock receiving is implemented
- order creation is implemented
- order listing and detail endpoints are implemented
- stock movement listing and detail endpoints are implemented
- demo seeders are implemented
- core feature tests are implemented and passing

Current application status:
- backend API prototype is working
- demo data can be reset and reloaded
- the project is suitable for backend demonstration and API testing in Insomnia
- there is no frontend application yet
- there is no authentication or authorization layer yet

The system currently supports:
- categories
- products
- stock receiving (`stock_in`)
- order creation
- order items
- stock movement history

Core business rules implemented:
- a product has a current stock quantity
- stock increases when products are received
- stock decreases when an order is placed
- an order cannot be placed if stock is insufficient
- every stock change is recorded in `stock_movements`

What is not implemented yet:
- frontend UI
- authentication
- authorization / roles / permissions
- order cancellation with stock restoration
- update or delete protection rules for business-critical records
- dashboards, reports, or analytics
- advanced search, sorting, and pagination customization
- production deployment configuration

## What We Built Step By Step

We built the backend module by module.

### 1. Database Design

We defined the core tables:
- `categories`
- `products`
- `orders`
- `order_items`
- `stock_movements`

The design choices were:
- `products` belong to `categories`
- `order_items` belong to both `orders` and `products`
- `stock_movements` belong to `products`
- `stock_movements` may also belong to an `order` for `stock_out` traceability

### 2. Migrations

In Laravel, migrations are PHP files that define database schema changes.

If you know SQL, think of migrations as version-controlled `CREATE TABLE` and `ALTER TABLE` scripts written in Laravel syntax.

Example:
- instead of writing raw SQL manually each time
- Laravel migrations let us create and update tables through `php artisan migrate`

In this project, migrations were used to:
- create all stock-related tables
- define foreign keys
- add constraints like unique SKU
- protect numeric stock fields with unsigned integers where appropriate

### 3. Models

In Laravel, a model is the PHP class that represents a database table.

Examples in this project:
- `Category` represents `categories`
- `Product` represents `products`
- `Order` represents `orders`
- `OrderItem` represents `order_items`
- `StockMovement` represents `stock_movements`

The models were used to define:
- `fillable` fields for safe mass assignment
- data type casting
- relationships such as:
  - category has many products
  - product belongs to category
  - product has many stock movements
  - order has many items
  - order has many stock movements

### 4. API Structure

We followed Laravel API best practices:
- clean controllers
- request validation using Form Requests
- business logic in services
- consistent JSON responses through API Resources

This kept responsibilities separate:
- migrations define the database
- models define the data relationships
- requests validate incoming API data
- controllers receive HTTP requests and return responses
- services contain the real stock and order logic
- resources format JSON output cleanly

## Main Modules Implemented

### Category Module

Implemented:
- category migration fields: `name`, `slug`, `description`
- `Category` model
- category CRUD API

Endpoints:
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Product Module

Implemented:
- product migration fields:
  - `name`
  - `sku`
  - `description`
  - `price`
  - `quantity`
  - `min_quantity`
  - `category_id`
- `Product` model with relationships
- product CRUD API
- low-stock flag in the API response

Endpoints:
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Stock Management Module

Implemented:
- `stock_movements` table
- `StockMovement` model
- stock receiving endpoint
- stock movement listing and detail endpoints
- movement filtering by `product_id`, `order_id`, and `type`

Endpoints:
- `POST /api/stock-movements/stock-in`
- `GET /api/stock-movements`
- `GET /api/stock-movements/{id}`

Business logic:
- stock-in increases product quantity
- a stock movement record is created for every stock-in

### Order Module

Implemented:
- `orders` table
- `order_items` table
- `Order` and `OrderItem` models
- order creation endpoint
- order listing and detail endpoints

Endpoints:
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`

Business logic:
- order creation happens inside a database transaction
- order items are created from the requested products
- stock is deducted per product
- `stock_out` movements are recorded
- insufficient stock returns `422 Unprocessable Entity`
- failed orders are rolled back

## Services We Added

### `StockService`

Used for:
- stock-in
- stock-out
- stock validation

Responsibilities:
- lock product rows during stock changes
- prevent negative stock
- create `stock_movements`

### `OrderService`

Used for:
- creating orders
- creating order items
- calculating totals
- calling stock deduction logic

This separation is important because stock rules should not be buried directly in controllers.

## Validation Layer

We added Laravel Form Requests to validate incoming API data before the controller logic runs.

Examples:
- `StoreCategoryRequest`
- `UpdateCategoryRequest`
- `StoreProductRequest`
- `UpdateProductRequest`
- `StockInRequest`
- `StoreOrderRequest`

Benefits:
- cleaner controllers
- reusable validation rules
- safer API inputs

## API Response Layer

We added API Resources for consistent JSON output:
- `CategoryResource`
- `ProductResource`
- `OrderResource`
- `StockMovementResource`

This made the API easier to test in Insomnia and easier to present tomorrow.

## Demo Data Seeder

We created a demo seeder:
- `InventoryDemoSeeder`

It seeds:
- 3 categories
- 5 products
- 5 initial stock-in movements

This allows a full reset to demo-ready data with:

```bash
php artisan migrate:fresh --seed
```

## Feature Tests Implemented

We added end-to-end feature tests for the core inventory flows.

Covered scenarios:
- stock-in increases product quantity
- order creation decreases stock
- insufficient stock returns `422`
- stock movements are recorded for stock-in and stock-out

Run the tests with:

```bash
php artisan test --filter=InventoryApiTest
```

## How To Run The Project

Install dependencies if needed:

```bash
composer install
```

Run migrations and demo seeders:

```bash
php artisan migrate:fresh --seed
```

Start the local server:

```bash
php artisan serve
```

Base API URL:

```text
http://127.0.0.1:8000/api
```

## How To Test With Insomnia

For every request, use these headers:

```text
Accept: application/json
Content-Type: application/json
```

Recommended demo/testing order:

1. `GET /api/categories`
2. `GET /api/products`
3. `POST /api/categories`
4. `POST /api/products`
5. `POST /api/stock-movements/stock-in`
6. `POST /api/orders`
7. `GET /api/orders`
8. `GET /api/orders/{id}`
9. `GET /api/stock-movements`
10. `POST /api/orders` with too-large quantity to show the stock validation error

## Example Demo Payloads

### Create Category

```json
{
  "name": "Gaming",
  "slug": "gaming",
  "description": "Gaming devices and accessories"
}
```

### Create Product

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

### Stock In

```json
{
  "product_id": 6,
  "quantity": 10,
  "note": "Supplier restock before sale"
}
```

### Create Order

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

### Failure Demo

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

Expected result:
- HTTP `422`
- stock remains unchanged

## Full Endpoint Summary

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Products

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Stock

- `POST /api/stock-movements/stock-in`
- `GET /api/stock-movements`
- `GET /api/stock-movements/{id}`

Optional list filters:
- `?product_id=2`
- `?order_id=1`
- `?type=stock_in`
- `?type=stock_out`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`

## Verified State

These checks were run against the current codebase:
- `php artisan route:list`
- `php artisan test --filter=InventoryApiTest`

Verified result:
- 20 routes are currently registered
- the 4 core inventory feature tests pass

## Presentation Summary

If you need a short presentation version, use this:

1. We designed a stock management backend in Laravel using migrations, models, controllers, services, requests, and resources.
2. We created the core tables for categories, products, orders, order items, and stock movements.
3. We implemented business rules so stock increases on receiving goods and decreases on order creation.
4. We prevented orders when stock is insufficient and recorded every stock change for auditability.
5. We exposed the system through clean REST API endpoints.
6. We seeded demo data and added automated feature tests to make the prototype stable and demo-ready.

## Demo Guide

For the exact walkthrough used in the demo, see:

[DEMO_API_GUIDE.md](./DEMO_API_GUIDE.md)
