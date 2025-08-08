# Authentication Microservices

A robust authentication system built with NestJS, featuring separate microservices for authentication and user management.

## Project Overview

This project implements a secure authentication system with role-based access control. It consists of two main microservices:

1. **Auth Service**: Handles user authentication, registration, and token validation
2. **User Service**: Manages user data, profiles, and role management

## Features

- User registration and authentication
- JWT-based authentication
- Role-based access control (USER and ADMIN roles)
- Secure password hashing with bcrypt
- API documentation with Swagger
- PostgreSQL database with Prisma ORM
- Microservices architecture

## Project Structure

```
auth-task/
├── prisma/                  # Prisma schema and migrations
├── services/
│   ├── auth-service/        # Authentication microservice
│   │   └── src/
│   │       ├── auth/        # Auth module with controllers, services, DTOs
│   │       └── prisma/      # Prisma service
│   └── user-service/        # User management microservice
│       └── src/
│           ├── users/       # Users module with controllers, services, DTOs
│           └── prisma/      # Prisma service
└── shared/                  # Shared code between services
    ├── decorators/         # Custom decorators
    ├── guards/             # Auth guards
    ├── types/              # Shared type definitions
    └── utils/              # Utility functions
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Kerolos-George/authentication-microservices.git
   cd auth-task
   ```

2. Install dependencies:
   ```
   npm install

   cd  services/auth-service
   npm install
   cd ../../
   cd services/user-service
   npm install
     
   ```

3. Set up environment variables:
   Create `.env` files in both service directories with the following variables:
   ```
   # For auth-service
   DATABASE_URL="postgresql://username:password@localhost:5432/auth_db"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRATION="24h"
   USER_SERVICE_URL="http://localhost:3002"
   PORT=3001

   # For user-service
   DATABASE_URL="postgresql://username:password@localhost:5432/auth_db"
   JWT_SECRET="your-jwt-secret"
   PORT=3002
   ```

4. Run Prisma migrations:
   ```
   npx prisma generate 
   ```

## Running the Application

You can start both services using the provided npm scripts:

```bash
# Start the auth service (builds and runs)
npm run start:auth

# Start the user service (builds and runs)
npm run start:user
```


## API Documentation

Once the services are running, you can access the Swagger API documentation:

- Auth Service: http://localhost:3001/api/docs
- User Service: http://localhost:3002/api/docs

## Authentication Flow

1. **Registration**: POST `/auth/register` with email, password, and optional role
2. **Login**: POST `/auth/login` with email and password
3. **Token Validation**: GET `/auth/validate` with Bearer token

## User Management

- **Create User**: POST `/users` (internal service call)
- **Get All Users**: GET `/users` (admin only)
- **Get User Profile**: GET `/users/profile` (authenticated user)
- **Get User by ID**: GET `/users/:id` (admin only)
- **Update Profile**: PATCH `/users/profile` (authenticated user)
- **Update User**: PATCH `/users/:id` (admin only)
- **Update User Role**: PATCH `/users/:id/role` (admin only)
- **Delete User**: DELETE `/users/:id` (admin only)

## Default Role Configuration

By default, new users are assigned the ADMIN role if no role is specified during registration. This behavior can be modified in:

- `auth.controller.ts` - Registration endpoint
- `users.controller.ts` - User creation endpoint
- `users.service.ts` - User creation logic

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control is implemented
- Input validation is performed using class-validator

