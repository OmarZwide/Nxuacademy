# Setup Instructions

## Prerequisites
1. Node.js v20 or later
2. PostgreSQL database
3. Stripe account for payments
4. Email service account

## Initial Setup

1. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   ```

2. **Database Setup**
   - Create a PostgreSQL database
   - Update DATABASE_URL and PG* variables in .env
   - Run database migrations:
   ```bash
   npm run db:push
   ```

3. **Stripe Integration**
   - Create a Stripe account at https://stripe.com
   - Get your API keys from the Stripe Dashboard
   - Update STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env

4. **Email Configuration**
   - Set up your email service credentials
   - Update EMAIL_USER and EMAIL_PASSWORD in .env

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Build the Application**
   ```bash
   npm run build
   ```

7. **Start the Server**
   ```bash
   npm run dev     # Development mode
   npm start       # Production mode
   ```

## API Keys Required

1. **Stripe Keys**
   - STRIPE_SECRET_KEY: Your Stripe secret key
   - STRIPE_WEBHOOK_SECRET: Webhook signing secret for Stripe events

2. **Database Credentials**
   - All PostgreSQL connection details (PGHOST, PGUSER, etc.)
   - Or a complete DATABASE_URL

3. **Email Service**
   - EMAIL_USER: Your email service username/email
   - EMAIL_PASSWORD: Your email service password/token

## Verifying the Setup

1. **Database Connection**
   ```bash
   npm run verify:db
   ```

2. **Stripe Integration**
   ```bash
   npm run verify:stripe
   ```

3. **Email Service**
   ```bash
   npm run verify:email
   ```

## Troubleshooting

1. **Database Issues**
   - Verify PostgreSQL is running
   - Check connection credentials
   - Ensure database exists

2. **Stripe Issues**
   - Verify API keys are correct
   - Check webhook configuration
   - Enable required payment methods

3. **Email Issues**
   - Verify SMTP settings
   - Check credentials
   - Test email connectivity

For additional help, refer to the documentation in the `docs/` directory.
