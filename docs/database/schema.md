# Database Schema Documentation

## Overview
Documentation for the database schema (~180 lines) including tables, relations, and indexes.

## Tables

### Students
```typescript
table students {
  id: serial PRIMARY KEY
  userId: text UNIQUE
  fullName: text
  email: text UNIQUE
  phone: text?
  stripeCustomerId: text? UNIQUE
  isActive: boolean DEFAULT true
  createdAt: timestamp DEFAULT now()
  updatedAt: timestamp DEFAULT now()
}
```

### Enrollments
```typescript
table enrollments {
  id: serial PRIMARY KEY
  studentId: integer REFERENCES students(id)
  courseId: text
  status: text DEFAULT 'pending'
  startDate: timestamp?
  endDate: timestamp?
  createdAt: timestamp DEFAULT now()
  updatedAt: timestamp DEFAULT now()
}
```

### Payment Plans
```typescript
table paymentPlans {
  id: serial PRIMARY KEY
  studentId: integer REFERENCES students(id)
  enrollmentId: integer REFERENCES enrollments(id)
  totalAmount: decimal(10,2)
  depositAmount: decimal(10,2)
  monthlyAmount: decimal(10,2)
  depositPaid: boolean DEFAULT false
  remainingPayments: integer
  status: text DEFAULT 'pending'
  createdAt: timestamp DEFAULT now()
  updatedAt: timestamp DEFAULT now()
}
```

### Payments
```typescript
table payments {
  id: serial PRIMARY KEY
  paymentPlanId: integer REFERENCES paymentPlans(id)
  studentId: integer REFERENCES students(id)
  amount: decimal(10,2)
  stripePaymentIntentId: text? UNIQUE
  status: text
  type: text
  paymentDate: timestamp
  createdAt: timestamp DEFAULT now()
}
```

## Relations

### Student Relations
- One-to-Many with Enrollments
- One-to-Many with Payment Plans
- One-to-Many with Payments

### Payment Plan Relations
- Many-to-One with Students
- One-to-One with Enrollments
- One-to-Many with Payments

## Indexes
- students(email)
- students(stripeCustomerId)
- payments(stripePaymentIntentId)
- enrollments(studentId, courseId)

## Data Types
- Monetary values: decimal(10,2)
- Timestamps: timestamp with timezone
- IDs: serial (auto-incrementing)
- Status fields: text with constraints
