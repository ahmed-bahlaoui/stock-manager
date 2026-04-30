# Stock Manager Presentation Outline

## Slide 1. Title

**Stock Management System for E-Commerce**

- Laravel API backend
- React frontend prototype
- Inventory, orders, stock tracking, and authentication

Speaker notes:
- Introduce the project as a working prototype for stock management in an e-commerce context.
- Clarify that the focus is on backend architecture, API workflows, and a frontend interface to operate and demonstrate the system.

## Slide 2. Problem Statement

**What problem are we solving?**

- E-commerce products need accurate stock tracking
- Orders must reduce stock automatically
- Stock changes must be auditable
- Users need a simple interface to test and use the system

Speaker notes:
- Explain that stock inconsistencies can cause overselling, poor customer experience, and weak operational visibility.
- The goal was to design a backend that enforces stock rules and exposes them through a clear API and UI.

## Slide 3. Project Goals

**Main objectives**

- Build an API-first stock management backend
- Follow Laravel best practices
- Track products, categories, orders, and stock movements
- Prevent invalid ordering when stock is insufficient
- Add authentication and role-based access
- Build a simple frontend prototype for demonstration

Speaker notes:
- Mention that the system was built step by step, module by module.
- Emphasize production-oriented structure even though this is still a prototype.

## Slide 4. Technology Stack

**Backend**

- Laravel
- Eloquent ORM
- MySQL
- Laravel Sanctum
- PHPUnit feature tests

**Frontend**

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router

Speaker notes:
- Explain that Laravel was chosen for strong API conventions and clean architecture.
- React + Vite was chosen for speed and simplicity for the prototype.

## Slide 5. Database Design

**Core tables**

- `categories`
- `products`
- `orders`
- `order_items`
- `stock_movements`
- `users`
- `personal_access_tokens`

**Key relationships**

- a product belongs to a category
- an order has many order items
- an order item belongs to a product
- a stock movement belongs to a product
- a stock movement may belong to an order

Speaker notes:
- This is the core data model of the application.
- It is designed around stock traceability and order integrity.

## Slide 6. Migrations

**What are migrations in Laravel?**

- version-controlled database schema definitions
- PHP-based alternative to manually writing SQL files each time
- executed with `php artisan migrate`

**What we created**

- schema for all business tables
- foreign keys and constraints
- numeric stock fields with safe defaults
- unique fields like SKU
- added role support for users

Speaker notes:
- If your audience knows SQL, compare migrations to managed `CREATE TABLE` and `ALTER TABLE` scripts.
- Mention that we also corrected migration naming issues so Laravel would execute them properly.

## Slide 7. Eloquent Models

**What are models in Laravel?**

- PHP classes representing database tables
- define fillable fields
- define casts
- define relationships

**Main models**

- `Category`
- `Product`
- `Order`
- `OrderItem`
- `StockMovement`
- `User`

Speaker notes:
- Explain that models are the bridge between database records and application logic.
- Relationships are important because the frontend and API responses rely on them heavily.

## Slide 8. Backend Architecture

**How the backend is organized**

- Controllers handle HTTP requests
- Form Requests handle validation
- Services handle business logic
- Resources format JSON responses
- Policies handle authorization

**Why this matters**

- cleaner code
- better separation of concerns
- easier testing
- safer and more maintainable backend

Speaker notes:
- This is one of the most important architectural slides.
- Show that the project is not just functional, but also structured correctly.

## Slide 9. Business Logic

**Implemented stock rules**

- stock increases through `stock_in`
- stock decreases when an order is created
- insufficient stock blocks order creation
- every stock change creates a `stock_movements` record
- order creation is transactional

Speaker notes:
- This is the heart of the application.
- Mention that transactions ensure partial failures do not corrupt data.

## Slide 10. API Endpoints

**Authentication**

- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `POST /api/logout`

**Categories**

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

**Products**

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

**Orders and Stock**

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/stock-movements/stock-in`
- `GET /api/stock-movements`
- `GET /api/stock-movements/{id}`

Speaker notes:
- This gives the audience a clear API map.
- Emphasize that the backend is fully API-driven.

## Slide 11. Authentication and Authorization

**Authentication**

- implemented with Laravel Sanctum
- token-based API access
- Bearer token used by the frontend and Insomnia

**Authorization**

- role-based access
- roles:
  - `admin`
  - `warehouse`
  - `sales`

**Examples**

- admin: full access
- warehouse: stock-in and stock visibility
- sales: order creation and product/category visibility

Speaker notes:
- Explain the difference between authentication and authorization.
- Authentication answers “who are you?”
- Authorization answers “what are you allowed to do?”

## Slide 12. API Testing

**How we tested the API**

- Insomnia for manual API testing
- Bearer token authentication
- CRUD and workflow testing
- role-based behavior testing

**Typical flow**

1. login
2. get token
3. call protected endpoints
4. verify backend responses

**Examples we tested**

- create category
- create product
- stock in
- create order
- insufficient stock returns `422`

Speaker notes:
- Mention that Insomnia was used not only for validation, but also for demo preparation.

## Slide 13. Automated Testing

**Feature tests implemented**

- stock-in increases quantity
- order creation decreases stock
- insufficient stock returns `422`
- stock movements are recorded
- register/login works
- guest access is blocked
- role restrictions are enforced

**Why tests matter**

- verify business rules
- protect against regressions
- make the prototype more reliable

Speaker notes:
- This slide shows engineering discipline.
- Mention that both auth and inventory flows were validated through automated tests.

## Slide 14. Frontend Prototype

**Frontend purpose**

- provide a usable interface for the API
- demonstrate login and protected pages
- allow testing of backend workflows through UI
- show results to authenticated users

**Screens built**

- login
- register
- dashboard
- categories
- products
- stock in
- orders
- stock movements
- profile

**Frontend behavior**

- stores auth token
- calls Laravel API with Bearer token
- shows role-aware navigation
- displays backend results in forms, tables, and summary cards

Speaker notes:
- Clarify that the frontend is a prototype interface, not a finished product.
- Its role is to make the backend testable and presentable.

## Slide 15. Current State and Next Steps

**Current state**

- working database schema
- working Laravel API
- authentication and role-based authorization
- tested business logic
- working React frontend prototype

**What is still not implemented**

- production deployment
- advanced reporting
- file/image upload workflows
- order cancellation and stock restore flow
- polished frontend UX

**Next steps**

- improve UI and usability
- add more validations and edge-case handling
- add reporting/dashboard analytics
- prepare production environment

Speaker notes:
- Finish with a balanced conclusion.
- The prototype is functional and demonstrable, but there is still room to harden and extend it.

## Optional Final Slide. Live Demo Flow

If you want a demo slide after the 15-slide core deck, use this:

1. Login as admin
2. Show dashboard totals
3. Open categories and products
4. Perform stock-in
5. Create an order
6. Show stock movement history
7. Switch role and show restricted access

Speaker notes:
- This can be used as a transition from explanation to live demonstration.
