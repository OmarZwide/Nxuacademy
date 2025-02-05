# API Routes Documentation

## Overview
Documentation for all API endpoints (~450 lines) in the application.

## Authentication Routes
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/session
```

## Payment Routes
```typescript
POST /api/payments/create-intent
POST /api/payments/confirm
POST /api/payments/webhook
GET /api/payments/history
```

## Course Management
```typescript
GET /api/courses
GET /api/courses/:id
POST /api/courses/enroll
GET /api/courses/enrolled
```

## Student Management
```typescript
GET /api/students
GET /api/students/:id
PATCH /api/students/:id
GET /api/students/progress
```

## Request/Response Examples

### Create Payment Intent
```typescript
// Request
POST /api/payments/create-intent
{
  "amount": 1000,
  "currency": "gbp",
  "description": "Course enrollment"
}

// Response
{
  "clientSecret": "pi_...",
  "amount": 1000,
  "status": "requires_payment_method"
}
```

### Error Handling
All endpoints follow this error format:
```typescript
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional additional information
  }
}
```

## Security
- All routes are protected with CSRF tokens
- Authentication required for protected endpoints
- Rate limiting implemented
- Input validation using Zod
