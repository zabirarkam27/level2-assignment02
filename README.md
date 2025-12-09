# Vehicle Rental System API

A robust, TypeScript-based backend API for managing vehicle rentals, customer accounts, and role-based bookings.

## Live Deployment

## Live Deployment

| Component | URL |
| :--- | :--- | 
| **API Base URL** | [https://assignment-02-kappa-ruby.vercel.app/api/v1](https://assignment-02-kappa-ruby.vercel.app/api/v1) | 
| **Health Check** | [https://assignment-02-kappa-ruby.vercel.app](https://assignment-02-kappa-ruby.vercel.app) | 

---

## Features

This API implements a comprehensive vehicle rental management system adhering to strict separation of concerns and robust access controls.

* **Authentication & Authorization:** Secure user registration, login via JWT, and Role-Based Access Control (RBAC) for Admin and Customer roles. 
* **User Management:** Admins can manage all users. Customers can manage their own profiles. User deletion is restricted if active bookings exist.
* **Vehicle Inventory:** Admins can add, update, and delete vehicles. Public access for viewing vehicle listings and details.
* **Booking Engine:**
    * Creation of bookings by Customers/Admins.
    * Automatic calculation of `total_price` based on daily rent and duration.
    * Automatic toggling of vehicle `availability_status` upon booking creation, cancellation, and return.
* **Data Integrity:** Enforced using PostgreSQL constraints (unique email/registration number, foreign keys, positive prices, and date validation).

---

## Technology Stack

The project is built using a modern, scalable Node.js and TypeScript stack, following a modular architecture.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Asynchronous, event-driven JavaScript runtime. |
| **Language** | TypeScript | Ensures type safety and improves code quality. |
| **Framework** | Express.js | Fast, minimalist web application framework. |
| **Database** | PostgreSQL | Robust and reliable relational database system. |
| **Authentication** | JWT (jsonwebtoken) | Secure, state-less token-based authentication. |
| **Security** | bcryptjs | Used for secure one-way hashing of passwords. |
| **Deployment**| Vercel | Serverless deployment for the Express API. |

---

## Code Structure

The project follows a modular, feature-based structure with clear separation between routing, controllers (handling requests/responses), and services (handling business logic and database interaction).

* src/
    * config/
        * db.ts               # PostgreSQL connection and DB initialization
        * pool.ts             # PostgreSQL client pool
    * middlewares/
        * auth.middleware.ts    # JWT verification and RBAC checks
        * logger.ts           # Simple request logging
    * modules/
        * auth/               # Signup, Signin
        * bookings/           # Create, Read, Update/Cancel/Return Bookings
        * users/              # User profile management (Admin/Own)
        * vehicles/           # Vehicle CRUD (Admin) & Public view
    * types/                  # Custom TypeScript declarations (index.d.ts, booking.types.ts, etc.)
    * app.ts                  # Express application setup and main routing
    * server.ts               # Entry point for local execution (and Vercel export)
